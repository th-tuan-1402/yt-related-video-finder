'use client';

import { RelatedVideo } from '@/types/youtube';
import Image from 'next/image';

interface RelatedVideosProps {
  videos: RelatedVideo[];
  isLoading?: boolean;
}

export default function RelatedVideos({ videos, isLoading }: RelatedVideosProps) {
  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto fade-in">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-tertiary)] bg-clip-text text-transparent">
          Video Liên Quan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden p-4">
              <div className="aspect-video bg-[var(--color-bg-secondary)] rounded-xl shimmer mb-4" />
              <div className="h-4 bg-[var(--color-bg-secondary)] rounded shimmer mb-2" />
              <div className="h-4 bg-[var(--color-bg-secondary)] rounded shimmer w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto text-center fade-in">
        <p className="text-[var(--color-text-secondary)]">Không tìm thấy video liên quan</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto fade-in">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-tertiary)] bg-clip-text text-transparent">
        Video Liên Quan ({videos.length})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, index) => (
          <a
            key={video.videoId}
            href={`https://www.youtube.com/watch?v=${video.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="glass rounded-2xl overflow-hidden group transition-all duration-300 
                     hover:shadow-xl hover:shadow-[var(--color-accent-primary)]/20 
                     hover:scale-105 hover:-translate-y-1"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="relative aspect-video overflow-hidden bg-black">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-[var(--color-text-primary)] line-clamp-2 mb-2 group-hover:text-[var(--color-accent-primary)] transition-colors">
                {video.title}
              </h3>

              {video.description && (
                <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
                  {video.description}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
