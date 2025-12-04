'use client';

import { useEffect } from 'react';
import { VideoMetadata } from '@/types/youtube';

interface MetadataModalProps {
  video: VideoMetadata;
  isOpen: boolean;
  onClose: () => void;
}

export default function MetadataModal({ video, isOpen, onClose }: MetadataModalProps) {
  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl glass p-8 shadow-2xl transform transition-all scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] bg-clip-text text-transparent">
            Video Metadata
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[var(--color-bg-secondary)] transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Video ID */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Video ID</h3>
            <div className="px-4 py-3 rounded-xl bg-[var(--color-bg-secondary)] font-mono text-[var(--color-accent-primary)]">
              {video.videoId}
            </div>
          </div>

          {/* Title */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Title</h3>
            <p className="text-lg text-[var(--color-text-primary)]">{video.title}</p>
          </div>

          {/* Channel */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Channel</h3>
            <p className="text-[var(--color-text-primary)]">{video.channelTitle}</p>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Description</h3>
            <div className="px-4 py-3 rounded-xl bg-[var(--color-bg-secondary)] max-h-48 overflow-y-auto">
              <p className="text-[var(--color-text-primary)] whitespace-pre-wrap">
                {video.description || 'No description available'}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2">
              Tags ({video.tags.length})
            </h3>
            {video.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {video.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-gradient-to-r from-[var(--color-accent-primary)]/20 to-[var(--color-accent-secondary)]/20 text-[var(--color-accent-primary)] text-sm border border-[var(--color-accent-primary)]/30"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[var(--color-text-muted)] italic">No tags available</p>
            )}
          </div>

          {/* Category ID */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Category ID</h3>
            <div className="px-4 py-3 rounded-xl bg-[var(--color-bg-secondary)] font-mono text-[var(--color-accent-primary)]">
              {video.categoryId || 'N/A'}
            </div>
          </div>

          {/* Thumbnail */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Thumbnail</h3>
            <div className="rounded-xl overflow-hidden border border-[var(--color-border)]">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] hover:shadow-lg hover:shadow-[var(--color-accent-primary)]/50 transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
