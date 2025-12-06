import { NextRequest } from 'next/server';
import { searchRelatedVideos } from '@/lib/youtube';
import { withApiHandler } from '@/lib/api-utils';

export const GET = withApiHandler(
  async (request, videoId) => {
    const maxResults = parseInt(request.nextUrl.searchParams.get('maxResults') || '10', 10);
    return await searchRelatedVideos(videoId, maxResults);
  },
  {
    cacheHeaders: { sMaxAge: 1800, staleWhileRevalidate: 3600 },
    errorContext: 'related-videos API',
  }
);
