import { VideoMetadata, RelatedVideo } from '@/types/youtube';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

const CACHE_PREFIX = 'youtube_finder_';
const DEFAULT_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

// Cache keys
export const CACHE_KEYS = {
  VIDEO_METADATA: (videoId: string) => `${CACHE_PREFIX}metadata_${videoId}`,
  RELATED_VIDEOS: (videoId: string) => `${CACHE_PREFIX}related_${videoId}`,
};

/**
 * Get data from cache
 */
export function getCacheItem<T>(key: string): T | null {
  if (typeof window === 'undefined') {
    return null; // SSR guard
  }

  try {
    const item = localStorage.getItem(key);
    if (!item) {
      return null;
    }

    const cacheEntry: CacheEntry<T> = JSON.parse(item);
    const now = Date.now();

    // Check if cache has expired
    if (now - cacheEntry.timestamp > cacheEntry.ttl) {
      localStorage.removeItem(key);
      return null;
    }

    return cacheEntry.data;
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
}

/**
 * Set data in cache
 */
export function setCacheItem<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
  if (typeof window === 'undefined') {
    return; // SSR guard
  }

  try {
    const cacheEntry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    localStorage.setItem(key, JSON.stringify(cacheEntry));
  } catch (error) {
    console.error('Error writing to cache:', error);
    // Handle quota exceeded or other localStorage errors gracefully
  }
}

/**
 * Clear specific cache entry
 */
export function clearCacheItem(key: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

/**
 * Clear all app caches
 */
export function clearAllCache(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing all cache:', error);
  }
}

/**
 * Get cached video metadata
 */
export function getCachedMetadata(videoId: string): VideoMetadata | null {
  return getCacheItem<VideoMetadata>(CACHE_KEYS.VIDEO_METADATA(videoId));
}

/**
 * Cache video metadata
 */
export function cacheMetadata(videoId: string, metadata: VideoMetadata): void {
  setCacheItem(CACHE_KEYS.VIDEO_METADATA(videoId), metadata);
}

/**
 * Get cached related videos
 */
export function getCachedRelatedVideos(videoId: string): RelatedVideo[] | null {
  return getCacheItem<RelatedVideo[]>(CACHE_KEYS.RELATED_VIDEOS(videoId));
}

/**
 * Cache related videos
 */
export function cacheRelatedVideos(videoId: string, videos: RelatedVideo[]): void {
  setCacheItem(CACHE_KEYS.RELATED_VIDEOS(videoId), videos);
}
