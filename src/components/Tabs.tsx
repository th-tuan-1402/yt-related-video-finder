import React from 'react';

interface TabsProps {
  activeTab: 'videos' | 'channels';
  onTabChange: (tab: 'videos' | 'channels') => void;
}

export default function Tabs({ activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="glass rounded-full p-1 flex space-x-1">
        <button
          onClick={() => onTabChange('videos')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === 'videos'
              ? 'bg-[var(--color-accent-primary)] text-white shadow-lg'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/5'
            }`}
        >
          Video Liên Quan
        </button>
        <button
          onClick={() => onTabChange('channels')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === 'channels'
              ? 'bg-[var(--color-accent-primary)] text-white shadow-lg'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/5'
            }`}
        >
          Kênh Liên Quan
        </button>
      </div>
    </div>
  );
}
