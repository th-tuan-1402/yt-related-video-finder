import { NextRequest, NextResponse } from 'next/server';
import { searchRelatedVideos } from '@/lib/youtube';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const videoId = searchParams.get('videoId');
    const maxResults = parseInt(searchParams.get('maxResults') || '10', 10);

    if (!videoId) {
      return NextResponse.json(
        { error: 'Missing videoId parameter' },
        { status: 400 }
      );
    }

    if (!process.env.YOUTUBE_API_KEY) {
      return NextResponse.json(
        { error: 'YouTube API key not configured' },
        { status: 500 }
      );
    }

    const relatedVideos = await searchRelatedVideos(videoId, maxResults);

    // Add cache headers to reduce API quota usage
    return NextResponse.json(relatedVideos, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('Error in related-videos API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch related videos' },
      { status: 500 }
    );
  }
}
