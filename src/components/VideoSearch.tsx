'use client';

import { useState } from 'react';
import { extractVideoId } from '@/lib/utils';

interface VideoSearchProps {
  onSearch: (videoId: string) => void;
  isLoading: boolean;
}

export default function VideoSearch({ onSearch, isLoading }: VideoSearchProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!input.trim()) {
      setError('Vui lòng nhập Video ID hoặc URL');
      return;
    }

    const videoId = extractVideoId(input.trim());

    if (!videoId) {
      setError('Video ID hoặc URL không hợp lệ');
      return;
    }

    onSearch(videoId);
  };

  return (
    <div className="w-full max-w-3xl mx-auto fade-in">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError('');
            }}
            placeholder="Nhập Video ID hoặc YouTube URL..."
            disabled={isLoading}
            className="flex-1 px-6 py-4 rounded-2xl glass text-lg
                     placeholder:text-[var(--color-text-muted)]
                     transition-all duration-300
                     focus:ring-2 focus:ring-[var(--color-accent-primary)]
                     disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-4 rounded-2xl font-semibold text-white
                     bg-gradient-to-r from-[var(--color-accent-primary)] via-[var(--color-accent-secondary)] to-[var(--color-accent-tertiary)]
                     hover:shadow-lg hover:shadow-[var(--color-accent-primary)]/50
                     transition-all duration-300 transform hover:scale-105
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                     whitespace-nowrap"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Đang tìm...
              </span>
            ) : (
              'Tìm Video Liên Quan'
            )}
          </button>
        </div>

        {error && (
          <div className="mt-3 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}
      </form>

      <div className="mt-6 text-center text-[var(--color-text-secondary)] text-sm">
        <p>Ví dụ: <code className="px-2 py-1 rounded bg-[var(--color-bg-secondary)] text-[var(--color-accent-primary)]">dQw4w9WgXcQ</code> hoặc <code className="px-2 py-1 rounded bg-[var(--color-bg-secondary)] text-[var(--color-accent-primary)]">https://youtu.be/dQw4w9WgXcQ</code></p>
      </div>
    </div>
  );
}
