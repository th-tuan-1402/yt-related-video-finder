'use client';

import { useState } from 'react';
import VideoSearch from '@/components/VideoSearch';
import VideoDetails from '@/components/VideoDetails';
import RelatedVideos from '@/components/RelatedVideos';
import RelatedChannels from '@/components/RelatedChannels';
import Tabs from '@/components/Tabs';
import MetadataModal from '@/components/MetadataModal';
import { VideoMetadata, RelatedVideo, ChannelMetadata, FilterOptions } from '@/types/youtube';
import { getCachedMetadata, cacheMetadata, getCachedRelatedVideos, cacheRelatedVideos, clearCacheItem, CACHE_KEYS } from '@/lib/cache';
import VideoFilters from '@/components/VideoFilters';
import { filterVideos, filterChannels, sortVideos, sortChannels } from '@/lib/filterUtils';

export default function Home() {
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<RelatedVideo[]>([]);
  const [relatedChannels, setRelatedChannels] = useState<ChannelMetadata[]>([]);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);
  const [isLoadingChannels, setIsLoadingChannels] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'videos' | 'channels'>('videos');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    sortBy: 'relevance',
  });

  const handleSearch = async (videoId: string) => {
    setError('');
    setVideoMetadata(null);
    setRelatedVideos([]);
    setRelatedChannels([]);
    setIsLoadingMetadata(true);
    setIsLoadingRelated(true);
    setIsLoadingChannels(true);

    try {
      // Check cache for metadata
      const cachedMetadata = getCachedMetadata(videoId);
      if (cachedMetadata) {
        console.log('📦 Using cached metadata for:', videoId);
        setVideoMetadata(cachedMetadata);
        setIsLoadingMetadata(false);
      } else {
        // Fetch video metadata from API
        const metadataResponse = await fetch(`/api/video-metadata?videoId=${videoId}`);

        if (!metadataResponse.ok) {
          const errorData = await metadataResponse.json();
          throw new Error(errorData.error || 'Failed to fetch video metadata');
        }

        const metadata: VideoMetadata = await metadataResponse.json();
        setVideoMetadata(metadata);
        cacheMetadata(videoId, metadata); // Cache the result
        console.log('💾 Cached metadata for:', videoId);
        setIsLoadingMetadata(false);
      }

      // Check cache for related videos
      const cachedRelated = getCachedRelatedVideos(videoId);
      // Check if cached data has viewCount (new format) - verify that all or most videos have it
      // Require at least 80% of videos to have viewCount, or all if there are 5 or fewer videos
      const hasViewCountInCache = cachedRelated && cachedRelated.length > 0 && (() => {
        const videosWithViewCount = cachedRelated.filter(v => v.viewCount !== undefined).length;
        const threshold = cachedRelated.length <= 5 
          ? cachedRelated.length // All videos must have viewCount if 5 or fewer
          : Math.ceil(cachedRelated.length * 0.8); // At least 80% must have viewCount
        return videosWithViewCount >= threshold;
      })();
      
      if (cachedRelated && hasViewCountInCache) {
        console.log('📦 Using cached related videos for:', videoId);
        console.log('📦 Cached videos sample:', cachedRelated.slice(0, 2).map(v => ({
          videoId: v.videoId,
          viewCount: v.viewCount,
          hasViewCount: !!v.viewCount,
        })));
        setRelatedVideos(cachedRelated);
        setIsLoadingRelated(false);
      } else {
        // Clear old cache if it doesn't have viewCount
        if (cachedRelated && !hasViewCountInCache) {
          console.log('🔄 Invalidating old cache (no viewCount)');
          clearCacheItem(CACHE_KEYS.RELATED_VIDEOS(videoId));
        }
        // Fetch related videos from API
        const relatedResponse = await fetch(`/api/related-videos?videoId=${videoId}`);

        if (!relatedResponse.ok) {
          const errorData = await relatedResponse.json();
          throw new Error(errorData.error || 'Failed to fetch related videos');
        }

        const related: RelatedVideo[] = await relatedResponse.json();
        console.log('📊 Fetched related videos:', related.map(v => ({
          videoId: v.videoId,
          title: v.title.substring(0, 40),
          viewCount: v.viewCount,
          channelSubscriberCount: v.channelSubscriberCount,
        })));
        setRelatedVideos(related);
        cacheRelatedVideos(videoId, related); // Cache the result
        console.log('💾 Cached related videos for:', videoId);
        setIsLoadingRelated(false);
      }

      // Fetch related channels from API
      const channelsResponse = await fetch(`/api/related-channels?videoId=${videoId}`);

      if (!channelsResponse.ok) {
        const errorData = await channelsResponse.json();
        throw new Error(errorData.error || 'Failed to fetch related channels');
      }

      const channels: ChannelMetadata[] = await channelsResponse.json();
      setRelatedChannels(channels);
      console.log('✅ Fetched related channels for:', videoId);
      setIsLoadingChannels(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoadingMetadata(false);
      setIsLoadingRelated(false);
      setIsLoadingChannels(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient mesh */}
      <div className="fixed inset-0 z-0" style={{ background: 'var(--gradient-mesh)' }} />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="pt-16 pb-12 px-6 flex justify-center">
          <div className="max-w-7xl flex flex-col items-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[var(--color-accent-primary)] via-[var(--color-accent-secondary)] to-[var(--color-accent-tertiary)] bg-clip-text text-transparent">
              YouTube Related Videos Finder
            </h1>
            <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
              Tìm kiếm video liên quan thông minh dựa trên metadata và tags
            </p>
          </div>
        </header>

        {/* Search Section */}
        <section className="px-6 pb-12 flex justify-center">
          <VideoSearch onSearch={handleSearch} isLoading={isLoadingMetadata || isLoadingRelated || isLoadingChannels} />
        </section>

        {/* Error Message */}
        {error && (
          <section className="px-6 pb-12 flex justify-center">
            <div className="w-full max-w-3xl px-6 py-4 rounded-2xl glass border-l-4 border-red-500">
              <p className="text-red-400">
                <span className="font-semibold">Lỗi:</span> {error}
              </p>
            </div>
          </section>
        )}

        {/* Video Details Section */}
        {videoMetadata && (
          <section className="px-6 pb-12 flex justify-center">
            <VideoDetails
              video={videoMetadata}
              onViewDetails={() => setIsModalOpen(true)}
            />
          </section>
        )}

        {/* Tabs Section */}
        {videoMetadata && (
          <section className="px-6 pb-8 flex justify-center">
            <Tabs activeTab={activeTab} onTabChange={setActiveTab} channelsCount={relatedChannels.length} />
          </section>
        )}

        {/* Filters Section */}
        {videoMetadata && (
          <section className="px-6 pb-6 flex justify-center">
            <VideoFilters
              onFilterChange={setFilterOptions}
              activeTab={activeTab}
              filters={filterOptions}
            />
          </section>
        )}

        {/* Related Content Section (Videos or Channels based on active tab) */}
        {videoMetadata && (
          <section className="px-6 pb-12 flex justify-center">
            {activeTab === 'videos' ? (
              <RelatedVideos
                videos={(() => {
                  const filtered = filterVideos(relatedVideos, filterOptions);
                  const sorted = sortVideos(filtered, filterOptions.sortBy || 'relevance');
                  console.log('[Page Debug] Filtering videos:', {
                    originalCount: relatedVideos.length,
                    filteredCount: filtered.length,
                    sortedCount: sorted.length,
                    filterOptions,
                  });
                  return sorted;
                })()}
                isLoading={isLoadingRelated}
              />
            ) : (
              <RelatedChannels
                channels={
                  sortChannels(
                    filterChannels(relatedChannels, filterOptions),
                    filterOptions.sortBy || 'relevance'
                  )
                }
                isLoading={isLoadingChannels}
              />
            )}
          </section>
        )}

        {/* Footer */}
        <footer className="py-12 px-6 text-center text-[var(--color-text-muted)] text-sm border-t border-[var(--color-border)] mt-20">
          <p>
            Built with Next.js 14 & YouTube Data API v3
          </p>
          <p className="mt-2">
            Uses metadata-based search as a workaround for deprecated relatedToVideoId parameter
          </p>
        </footer>
      </div>

      {/* Metadata Modal */}
      {videoMetadata && (
        <MetadataModal
          video={videoMetadata}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
