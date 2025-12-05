import { NextRequest, NextResponse } from 'next/server';
import { fetchVideoMetadata } from '@/lib/youtube';
import { withApiHandler, createErrorResponse } from '@/lib/api-utils';

export const GET = withApiHandler(
  async (request, videoId) => {
    const metadata = await fetchVideoMetadata(videoId);
    if (!metadata) {
      return createErrorResponse('Video not found', 404);
    }
    return metadata;
  },
  {
    cacheHeaders: { sMaxAge: 3600, staleWhileRevalidate: 86400 },
    errorContext: 'video-metadata API',
  }
);
