import { RelatedVideo, ChannelMetadata, FilterOptions } from '@/types/youtube';

/**
 * Format number to readable string (1K, 1M, etc.)
 */
export function formatNumber(num: string | undefined): string {
  if (!num || num === 'Hidden') {
    return 'N/A';
  }

  const numValue = parseInt(num, 10);
  if (isNaN(numValue)) {
    return num;
  }

  if (numValue >= 1000000) {
    return `${(numValue / 1000000).toFixed(1)}M`;
  }
  if (numValue >= 1000) {
    return `${(numValue / 1000).toFixed(1)}K`;
  }
  return numValue.toString();
}

/**
 * Parse filter range from dropdown option
 * Returns { min, max } where max can be Infinity
 */
export function parseFilterRange(range: string | undefined): { min: number; max: number } {
  if (!range || range === 'Tất cả') {
    return { min: 0, max: Infinity };
  }
  
  switch (range) {
    case '< 1K':
      return { min: 0, max: 999 };
    case '1K-10K':
      return { min: 1000, max: 9999 };
    case '10K-100K':
      return { min: 10000, max: 99999 };
    case '100K-1M':
      return { min: 100000, max: 999999 };
    case '> 1M':
      return { min: 1000000, max: Infinity };
    default:
      return { min: 0, max: Infinity };
  }
}

/**
 * Convert string number to number, handling "Hidden" and undefined
 */
function parseCount(count: string | undefined): number {
  if (!count || count === 'Hidden') {
    return 0;
  }
  // Use Number() instead of parseInt() to handle large numbers correctly
  // parseInt() can lose precision for very large numbers
  const parsed = Number(count);
  if (isNaN(parsed)) {
    console.warn('[Filter Utils] Failed to parse count:', count);
    return 0;
  }
  return parsed;
}

/**
 * Filter videos based on filter options
 */
export function filterVideos(videos: RelatedVideo[], filters: FilterOptions): RelatedVideo[] {
  let filtered = [...videos];

  // Filter by view count
  if (filters.minViews && filters.minViews !== 'Tất cả' && filters.minViews !== undefined) {
    const viewRange = parseFilterRange(filters.minViews);
    console.log('[Filter Debug] View filter:', {
      filterOption: filters.minViews,
      range: viewRange,
      totalVideos: videos.length,
    });
    
    filtered = filtered.filter((video) => {
      const views = parseCount(video.viewCount);
      // Handle Infinity comparison properly
      const passesMin = views >= viewRange.min;
      const passesMax = viewRange.max === Infinity ? true : views <= viewRange.max;
      const passes = passesMin && passesMax;
      
      // Debug log for ALL videos to see what's happening
      console.log('[Filter Debug] Video:', {
        videoId: video.videoId,
        title: video.title.substring(0, 50),
        rawViewCount: video.viewCount,
        viewCountType: typeof video.viewCount,
        parsedViews: views,
        range: viewRange,
        passesMin,
        passesMax,
        passes,
      });
      
      return passes;
    });
    
    console.log('[Filter Debug] After view filter:', {
      filteredCount: filtered.length,
    });
  }

  // Filter by channel subscriber count
  if (filters.minSubscribers && filters.minSubscribers !== 'Tất cả' && filters.minSubscribers !== undefined) {
    const subRange = parseFilterRange(filters.minSubscribers);
    filtered = filtered.filter((video) => {
      const subs = parseCount(video.channelSubscriberCount);
      const passesMin = subs >= subRange.min;
      const passesMax = subRange.max === Infinity ? true : subs <= subRange.max;
      return passesMin && passesMax;
    });
  }

  return filtered;
}

/**
 * Filter channels based on filter options
 */
export function filterChannels(channels: ChannelMetadata[], filters: FilterOptions): ChannelMetadata[] {
  let filtered = [...channels];

  // Filter by subscriber count
  if (filters.minSubscribers && filters.minSubscribers !== 'Tất cả' && filters.minSubscribers !== undefined) {
    const subRange = parseFilterRange(filters.minSubscribers);
    filtered = filtered.filter((channel) => {
      const subs = parseCount(channel.subscriberCount);
      const passesMin = subs >= subRange.min;
      const passesMax = subRange.max === Infinity ? true : subs <= subRange.max;
      return passesMin && passesMax;
    });
  }

  return filtered;
}

/**
 * Sort videos based on sort option
 */
export function sortVideos(videos: RelatedVideo[], sortBy: string): RelatedVideo[] {
  const sorted = [...videos];

  switch (sortBy) {
    case 'views':
      return sorted.sort((a, b) => {
        const viewsA = parseCount(a.viewCount);
        const viewsB = parseCount(b.viewCount);
        return viewsB - viewsA; // Descending
      });
    
    case 'views-asc':
      return sorted.sort((a, b) => {
        const viewsA = parseCount(a.viewCount);
        const viewsB = parseCount(b.viewCount);
        return viewsA - viewsB; // Ascending
      });
    
    case 'subscribers':
      return sorted.sort((a, b) => {
        const subsA = parseCount(a.channelSubscriberCount);
        const subsB = parseCount(b.channelSubscriberCount);
        return subsB - subsA; // Descending
      });
    
    case 'subscribers-asc':
      return sorted.sort((a, b) => {
        const subsA = parseCount(a.channelSubscriberCount);
        const subsB = parseCount(b.channelSubscriberCount);
        return subsA - subsB; // Ascending
      });
    
    case 'relevance':
    default:
      // Keep original order (relevance order from API)
      return sorted;
  }
}

/**
 * Sort channels based on sort option
 */
export function sortChannels(channels: ChannelMetadata[], sortBy: string): ChannelMetadata[] {
  const sorted = [...channels];

  switch (sortBy) {
    case 'subscribers':
      return sorted.sort((a, b) => {
        const subsA = parseCount(a.subscriberCount);
        const subsB = parseCount(b.subscriberCount);
        return subsB - subsA; // Descending
      });
    
    case 'subscribers-asc':
      return sorted.sort((a, b) => {
        const subsA = parseCount(a.subscriberCount);
        const subsB = parseCount(b.subscriberCount);
        return subsA - subsB; // Ascending
      });
    
    case 'relevance':
    default:
      // Keep original order
      return sorted;
  }
}

