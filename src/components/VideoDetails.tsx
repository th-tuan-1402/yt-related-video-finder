'use client';

import { VideoMetadata } from '@/types/youtube';
import Image from 'next/image';

interface VideoDetailsProps {
  video: VideoMetadata;
  onViewDetails?: () => void;
}

export default function VideoDetails({ video, onViewDetails }: VideoDetailsProps) {
  return (
    <div className="w-full max-w-5xl mx-auto fade-in">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-tertiary)] bg-clip-text text-transparent">
        Video Gốc
      </h2>

      <div className="glass rounded-3xl overflow-hidden p-6 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--color-accent-primary)]/20 relative">
        {/* View Details Button - Top Right */}
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="absolute top-4 right-4 z-10 p-2 rounded-xl text-white bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] hover:shadow-lg hover:shadow-[var(--color-accent-primary)]/50 transition-all duration-300 transform hover:scale-110"
            aria-label="View Details"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Video Player */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${video.videoId}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>

          {/* Video Info */}
          <div className="flex flex-col justify-center space-y-4">
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] line-clamp-2">
              {video.title}
            </h3>

            <p className="text-sm text-[var(--color-text-secondary)]">
              <span className="text-[var(--color-accent-primary)] font-medium">Kênh:</span> {video.channelTitle}
            </p>

            {video.tags && video.tags.length > 0 && (
              <div>
                <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                  <span className="text-[var(--color-accent-primary)] font-medium">Tags:</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {video.tags.slice(0, 8).map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-xs bg-[var(--color-bg-secondary)] 
                               text-[var(--color-text-secondary)] border border-[var(--color-border)]
                               hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)]
                               transition-all duration-200"
                    >
                      #{tag}
                    </span>
                  ))}
                  {video.tags.length > 8 && (
                    <span className="px-3 py-1 rounded-full text-xs bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]">
                      +{video.tags.length - 8} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {video.description && (
              <p className="text-sm text-[var(--color-text-secondary)] line-clamp-3">
                {video.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
