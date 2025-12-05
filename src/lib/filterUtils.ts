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
  const parsed = Number(count);
  if (isNaN(parsed)) {
    console.warn('[Filter Utils] Failed to parse count:', count);
    return 0;
  }
  return parsed;
}

/**
 * Check if a value is within the specified range
 */
function checkRange(value: number, range: { min: number; max: number }): boolean {
  const passesMin = value >= range.min;
  const passesMax = range.max === Infinity ? true : value <= range.max;
  return passesMin && passesMax;
}

/**
 * Generic function to filter items by range based on a count getter
 */
function filterByRange<T>(
  items: T[],
  range: { min: number; max: number },
  getCount: (item: T) => string | undefined
): T[] {
  return items.filter((item) => {
    const count = parseCount(getCount(item));
    return checkRange(count, range);
  });
}

/**
 * Generic function to sort items by count
 */
function sortByCount<T>(
  items: T[],
  getCount: (item: T) => string | undefined,
  ascending: boolean = false
): T[] {
  const sorted = [...items];
  return sorted.sort((a, b) => {
    const countA = parseCount(getCount(a));
    const countB = parseCount(getCount(b));
    return ascending ? countA - countB : countB - countA;
  });
}

/**
 * Filter videos based on filter options
 */
export function filterVideos(videos: RelatedVideo[], filters: FilterOptions): RelatedVideo[] {
  let filtered = [...videos];

  // Filter by view count
  if (filters.minViews && filters.minViews !== 'Tất cả') {
    const viewRange = parseFilterRange(filters.minViews);
    filtered = filterByRange(filtered, viewRange, (video) => video.viewCount);
  }

  // Filter by channel subscriber count
  if (filters.minSubscribers && filters.minSubscribers !== 'Tất cả') {
    const subRange = parseFilterRange(filters.minSubscribers);
    filtered = filterByRange(filtered, subRange, (video) => video.channelSubscriberCount);
  }

  return filtered;
}

/**
 * Filter channels based on filter options
 */
export function filterChannels(channels: ChannelMetadata[], filters: FilterOptions): ChannelMetadata[] {
  let filtered = [...channels];

  // Filter by subscriber count
  if (filters.minSubscribers && filters.minSubscribers !== 'Tất cả') {
    const subRange = parseFilterRange(filters.minSubscribers);
    filtered = filterByRange(filtered, subRange, (channel) => channel.subscriberCount);
  }

  return filtered;
}

/**
 * Sort videos based on sort option
 */
export function sortVideos(videos: RelatedVideo[], sortBy: string): RelatedVideo[] {
  switch (sortBy) {
    case 'views':
      return sortByCount(videos, (video) => video.viewCount, false);
    case 'views-asc':
      return sortByCount(videos, (video) => video.viewCount, true);
    case 'subscribers':
      return sortByCount(videos, (video) => video.channelSubscriberCount, false);
    case 'subscribers-asc':
      return sortByCount(videos, (video) => video.channelSubscriberCount, true);
    case 'relevance':
    default:
      return [...videos];
  }
}

/**
 * Sort channels based on sort option
 */
export function sortChannels(channels: ChannelMetadata[], sortBy: string): ChannelMetadata[] {
  switch (sortBy) {
    case 'subscribers':
      return sortByCount(channels, (channel) => channel.subscriberCount, false);
    case 'subscribers-asc':
      return sortByCount(channels, (channel) => channel.subscriberCount, true);
    case 'relevance':
    default:
      return [...channels];
  }
}
