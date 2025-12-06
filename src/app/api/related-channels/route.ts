import { NextRequest, NextResponse } from 'next/server';
import { getYoutubeClient } from '@/lib/youtube';
import { withApiHandler, createErrorResponse } from '@/lib/api-utils';

export const GET = withApiHandler(
  async (request, videoId) => {
    const youtube = getYoutubeClient();

    // Get video metadata to extract tags and channel info
    const videoResponse = await youtube.videos.list({
      part: ['snippet'],
      id: [videoId],
    });

    if (!videoResponse.data.items || videoResponse.data.items.length === 0) {
      return createErrorResponse('Video not found', 404);
    }

    const videoSnippet = videoResponse.data.items[0].snippet;
    if (!videoSnippet) {
      return createErrorResponse('Video snippet not found', 404);
    }

    const originalChannelId = videoSnippet.channelId;
    const tags = videoSnippet.tags || [];
    const searchQuery = tags.length > 0 ? tags.slice(0, 3).join(' ') : (videoSnippet.channelTitle || '');

    // Search for related channels
    const searchResponse = await youtube.search.list({
      part: ['id'],
      q: searchQuery,
      type: 'channel' as any,
      maxResults: 5,
      relevanceLanguage: 'vi',
    });

    const channelIds = (searchResponse.data.items || [])
      .map(item => item.id?.channelId)
      .filter((id): id is string => !!id);

    // Add original channel if not present
    if (originalChannelId && !channelIds.includes(originalChannelId)) {
      channelIds.unshift(originalChannelId);
    }

    if (channelIds.length === 0) {
      return NextResponse.json([]);
    }

    // Fetch channel metadata
    const channelsResponse = await youtube.channels.list({
      part: ['snippet', 'statistics', 'brandingSettings'],
      id: channelIds,
    });

    const channels = (channelsResponse.data.items || [])
      .filter(channel => channel.id)
      .map(channel => ({
        id: channel.id!,
        title: channel.snippet?.title || 'Unknown Channel',
        customUrl: channel.snippet?.customUrl || 'N/A',
        description: channel.snippet?.description || '',
        thumbnail: channel.snippet?.thumbnails?.default?.url || channel.snippet?.thumbnails?.medium?.url || '',
        subscriberCount: channel.statistics?.subscriberCount || '0',
        videoCount: channel.statistics?.videoCount || '0',
        viewCount: channel.statistics?.viewCount,
      }));

    return channels;
  },
  {
    errorContext: 'related-channels API',
  }
);
