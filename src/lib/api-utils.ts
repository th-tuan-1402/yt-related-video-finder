import { NextRequest, NextResponse } from 'next/server';

/**
 * Validate videoId parameter from request
 */
export function validateVideoId(searchParams: URLSearchParams): string | null {
  const videoId = searchParams.get('videoId');
  if (!videoId) {
    return null;
  }
  return videoId;
}

/**
 * Validate YouTube API key is configured
 */
export function validateApiKey(): boolean {
  return !!process.env.YOUTUBE_API_KEY;
}

/**
 * Create standardized error response
 */
export function createErrorResponse(
  message: string,
  status: number = 500
): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Create response with cache headers
 */
export function createCachedResponse(
  data: any,
  sMaxAge: number,
  staleWhileRevalidate: number
): NextResponse {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': `public, s-maxage=${sMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
    },
  });
}

/**
 * API handler wrapper with common validation and error handling
 */
export function withApiHandler<T>(
  handler: (request: NextRequest, videoId: string) => Promise<T | NextResponse>,
  options: {
    requireVideoId?: boolean;
    requireApiKey?: boolean;
    cacheHeaders?: { sMaxAge: number; staleWhileRevalidate: number };
    errorContext?: string;
  } = {}
) {
  const {
    requireVideoId = true,
    requireApiKey = true,
    cacheHeaders,
    errorContext = 'API',
  } = options;

  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Validate videoId if required
      if (requireVideoId) {
        const videoId = validateVideoId(request.nextUrl.searchParams);
        if (!videoId) {
          return createErrorResponse('Missing videoId parameter', 400);
        }

        // Validate API key if required
        if (requireApiKey && !validateApiKey()) {
          return createErrorResponse('YouTube API key not configured', 500);
        }

        const result = await handler(request, videoId);

        // If handler returns NextResponse directly, return it
        if (result instanceof NextResponse) {
          return result;
        }

        // Apply cache headers if provided
        if (cacheHeaders) {
          return createCachedResponse(
            result,
            cacheHeaders.sMaxAge,
            cacheHeaders.staleWhileRevalidate
          );
        }

        return NextResponse.json(result);
      } else {
        // For routes that don't require videoId
        if (requireApiKey && !validateApiKey()) {
          return createErrorResponse('YouTube API key not configured', 500);
        }

        const result = await handler(request, '');

        // If handler returns NextResponse directly, return it
        if (result instanceof NextResponse) {
          return result;
        }

        if (cacheHeaders) {
          return createCachedResponse(
            result,
            cacheHeaders.sMaxAge,
            cacheHeaders.staleWhileRevalidate
          );
        }

        return NextResponse.json(result);
      }
    } catch (error) {
      console.error(`Error in ${errorContext}:`, error);
      return createErrorResponse(`Failed to ${errorContext.toLowerCase()}`, 500);
    }
  };
}

