import React from 'react';
import { ChannelMetadata } from '@/types/youtube';

interface RelatedChannelsProps {
  channels: ChannelMetadata[];
  isLoading: boolean;
}

export default function RelatedChannels({ channels, isLoading }: RelatedChannelsProps) {
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass rounded-xl p-4 flex items-center space-x-4 animate-pulse">
            <div className="w-16 h-16 rounded-full bg-white/10 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-white/10 rounded w-3/4" />
              <div className="h-3 bg-white/10 rounded w-1/2" />
              <div className="h-3 bg-white/10 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (channels.length === 0) {
    return (
      <div className="text-center text-[var(--color-text-secondary)] py-12">
        No related channels found.
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
      {channels.map((channel) => (
        <a
          key={channel.id}
          href={`https://www.youtube.com/channel/${channel.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="glass rounded-xl p-6 flex items-start space-x-4 hover:bg-white/5 transition-all duration-300 group hover:scale-[1.02] hover:shadow-xl border border-transparent hover:border-[var(--color-accent-primary)]/30"
        >
          <div className="relative">
            <img
              src={channel.thumbnail}
              alt={channel.title}
              className="w-16 h-16 rounded-full object-cover border-2 border-[var(--color-border)] group-hover:border-[var(--color-accent-primary)] transition-colors"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] truncate group-hover:text-[var(--color-accent-primary)] transition-colors">
              {channel.title}
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-2">
              {channel.customUrl}
            </p>

            <div className="flex items-center space-x-4 text-xs text-[var(--color-text-muted)] mb-3">
              <div className="flex items-center">
                <span className="font-medium text-[var(--color-text-primary)] mr-1">
                  {parseInt(channel.subscriberCount).toLocaleString()}
                </span>
                subscribers
              </div>
              <div className="flex items-center">
                <span className="font-medium text-[var(--color-text-primary)] mr-1">
                  {parseInt(channel.videoCount).toLocaleString()}
                </span>
                videos
              </div>
            </div>

            <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
              {channel.description || 'No description available.'}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}
