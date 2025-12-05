import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('videoId');

  if (!videoId) {
    return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
  }

  if (!process.env.YOUTUBE_API_KEY) {
    return NextResponse.json(
      { error: 'YouTube API key not configured' },
      { status: 500 }
    );
  }

  // Initialize YouTube client with validated API key
  const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY,
  });

  try {
    // --- STEP 1: Analyze Video (Get tags & channelId) ---
    const videoResponse = await youtube.videos.list({
      part: ['snippet'],
      id: [videoId],
    });

    if (!videoResponse.data.items || videoResponse.data.items.length === 0) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    const videoSnippet = videoResponse.data.items[0].snippet;
    if (!videoSnippet) {
      return NextResponse.json({ error: 'Video snippet not found' }, { status: 404 });
    }

    const originalChannelId = videoSnippet.channelId;
    const tags = videoSnippet.tags || [];

    // Strategy: Use first 3 tags, or channel title if no tags
    const searchQuery = tags.length > 0 ? tags.slice(0, 3).join(' ') : (videoSnippet.channelTitle || '');

    console.log(`[RelatedChannels] Video: ${videoId}, Channel: ${videoSnippet.channelTitle}`);
    console.log(`[RelatedChannels] Searching with query: ${searchQuery}`);

    // --- STEP 2: Search Related Channels ---
    const searchResponse = await youtube.search.list({
      part: ['id'],
      q: searchQuery,
      type: 'channel' as any, // YouTube API expects string, but TypeScript types expect array
      maxResults: 5,
      relevanceLanguage: 'vi', // As per user request/code sample
    });

    const searchItems = searchResponse.data.items || [];
    const channelIds = searchItems
      .map(item => item.id?.channelId)
      .filter((id): id is string => !!id);

    // Add original channel if not present
    if (originalChannelId && !channelIds.includes(originalChannelId)) {
      channelIds.unshift(originalChannelId);
    }

    if (channelIds.length === 0) {
      return NextResponse.json([]);
    }

    // --- STEP 3: Enrich with Channel Metadata ---
    const channelsResponse = await youtube.channels.list({
      part: ['snippet', 'statistics', 'brandingSettings'],
      id: channelIds,
    });

    const channels = channelsResponse.data.items
      ?.filter(channel => channel.id) // Filter out channels without ID
      ?.map(channel => ({
        id: channel.id!,
        title: channel.snippet?.title || 'Unknown Channel',
        customUrl: channel.snippet?.customUrl || 'N/A',
        description: channel.snippet?.description || '',
        thumbnail: channel.snippet?.thumbnails?.default?.url || channel.snippet?.thumbnails?.medium?.url || '',
        subscriberCount: channel.statistics?.subscriberCount || '0',
        videoCount: channel.statistics?.videoCount || '0',
        viewCount: channel.statistics?.viewCount,
      })) || [];

    return NextResponse.json(channels);
  } catch (error) {
    console.error('Error fetching related channels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch related channels' },
      { status: 500 }
    );
  }
}
