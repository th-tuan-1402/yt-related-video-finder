import { google } from 'googleapis';
import { VideoMetadata, RelatedVideo } from '@/types/youtube';

/**
 * Get YouTube API client instance
 */
export function getYoutubeClient() {
  return google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY,
  });
}

const youtube = getYoutubeClient();

/**
 * Fetch metadata for a specific video
 */
export async function fetchVideoMetadata(videoId: string): Promise<VideoMetadata | null> {
  try {
    const response = await youtube.videos.list({
      part: ['snippet'],
      id: [videoId],
    });

    if (!response.data.items || response.data.items.length === 0) {
      return null;
    }

    const video = response.data.items[0];
    const snippet = video.snippet!;

    return {
      videoId,
      title: snippet.title || '',
      description: snippet.description || '',
      thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || '',
      channelTitle: snippet.channelTitle || '',
      tags: snippet.tags || [],
      categoryId: snippet.categoryId || '',
    };
  } catch (error) {
    console.error('Error fetching video metadata:', error);
    throw error;
  }
}

/**
 * Search for related videos based on video metadata
 */
export async function searchRelatedVideos(
  videoId: string,
  maxResults: number = 10
): Promise<RelatedVideo[]> {
  try {
    // First, get the original video's metadata
    const metadata = await fetchVideoMetadata(videoId);

    if (!metadata) {
      throw new Error('Video not found');
    }

    // Build search query from tags or title
    let searchQuery: string;
    if (metadata.tags && metadata.tags.length > 0) {
      // Use first 5 tags for more accurate results
      searchQuery = metadata.tags.slice(0, 5).join(' ');
    } else {
      // Fallback to title if no tags
      searchQuery = metadata.title;
    }

    // Search for related videos
    const searchResponse = await youtube.search.list({
      part: ['snippet'],
      q: searchQuery,
      type: 'video' as any, // YouTube API expects string, but TypeScript types expect array
      maxResults: maxResults + 5, // Get extra to filter out the original
      order: 'relevance',
      relevanceLanguage: 'vi', // Prioritize Vietnamese content
    });

    if (!searchResponse.data.items) {
      return [];
    }

    // Filter out the original video and get video IDs
    const videoIds = searchResponse.data.items
      .filter((item) => item.id?.videoId && item.id.videoId !== videoId)
      .slice(0, maxResults)
      .map((item) => item.id!.videoId!);

    if (videoIds.length === 0) {
      return [];
    }

    // Fetch video statistics and channel IDs
    const videosResponse = await youtube.videos.list({
      part: ['statistics', 'snippet'],
      id: videoIds,
    });

    if (!videosResponse.data.items) {
      return [];
    }

    // Extract unique channel IDs
    const channelIds = Array.from(
      new Set(
        videosResponse.data.items
          .map((item) => item.snippet?.channelId)
          .filter((id): id is string => !!id)
      )
    );

    // Fetch channel statistics for subscriber counts
    let channelStatsMap: Map<string, string> = new Map();
    if (channelIds.length > 0) {
      const channelsResponse = await youtube.channels.list({
        part: ['statistics'],
        id: channelIds,
      });

      if (channelsResponse.data.items) {
        channelsResponse.data.items.forEach((channel) => {
          if (channel.id && channel.statistics?.subscriberCount) {
            channelStatsMap.set(channel.id, channel.statistics.subscriberCount);
          }
        });
      }
    }

    // Map results with statistics
    const relatedVideos: RelatedVideo[] = videosResponse.data.items.map((item) => {
      const channelId = item.snippet?.channelId;
      const rawViewCount = item.statistics?.viewCount;
      const videoData = {
        videoId: item.id!,
        title: item.snippet?.title || '',
        thumbnail: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || '',
        description: item.snippet?.description || '',
        viewCount: rawViewCount || undefined,
        channelId: channelId || undefined,
        channelSubscriberCount: channelId ? channelStatsMap.get(channelId) : undefined,
      };
      
      // Debug log for ALL videos to see what we're getting
      console.log('[YouTube API Debug] Video data:', {
        videoId: videoData.videoId,
        title: videoData.title.substring(0, 40),
        rawViewCount: rawViewCount,
        hasStatistics: !!item.statistics,
        statisticsKeys: item.statistics ? Object.keys(item.statistics) : [],
        viewCount: videoData.viewCount,
        channelSubscriberCount: videoData.channelSubscriberCount,
      });
      
      return videoData;
    });

    console.log('[YouTube API Debug] Total videos fetched:', relatedVideos.length);
    console.log('[YouTube API Debug] Videos with viewCount:', relatedVideos.filter(v => v.viewCount).length);

    return relatedVideos;
  } catch (error) {
    console.error('Error searching related videos:', error);
    throw error;
  }
}
