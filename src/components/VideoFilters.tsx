'use client';

import { FilterOptions } from '@/types/youtube';

interface VideoFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  activeTab: 'videos' | 'channels';
  filters: FilterOptions;
}

export default function VideoFilters({ onFilterChange, activeTab, filters }: VideoFiltersProps) {
  const viewOptions = ['Tất cả', '< 1K', '1K-10K', '10K-100K', '100K-1M', '> 1M'];
  const subscriberOptions = ['Tất cả', '< 1K', '1K-10K', '10K-100K', '100K-1M', '> 1M'];
  
  const sortOptions = activeTab === 'videos' 
    ? [
        { value: 'relevance', label: 'Độ liên quan' },
        { value: 'views', label: 'Lượt xem (cao→thấp)' },
        { value: 'views-asc', label: 'Lượt xem (thấp→cao)' },
        { value: 'subscribers', label: 'Subscriber (cao→thấp)' },
        { value: 'subscribers-asc', label: 'Subscriber (thấp→cao)' },
      ]
    : [
        { value: 'relevance', label: 'Độ liên quan' },
        { value: 'subscribers', label: 'Subscriber (cao→thấp)' },
        { value: 'subscribers-asc', label: 'Subscriber (thấp→cao)' },
      ];

  const handleViewChange = (value: string) => {
    onFilterChange({
      ...filters,
      minViews: value === 'Tất cả' ? undefined : value,
    });
  };

  const handleSubscriberChange = (value: string) => {
    onFilterChange({
      ...filters,
      minSubscribers: value === 'Tất cả' ? undefined : value,
    });
  };

  const handleSortChange = (value: string) => {
    onFilterChange({
      ...filters,
      sortBy: value as FilterOptions['sortBy'],
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto mb-6 fade-in">
      <div className="glass rounded-2xl p-4 flex flex-wrap gap-4 items-end">
        {/* Views Filter - Only show for videos tab */}
        {activeTab === 'videos' && (
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              Lượt xem
            </label>
            <select
              value={filters.minViews || 'Tất cả'}
              onChange={(e) => handleViewChange(e.target.value)}
              className="w-full px-4 py-2 rounded-xl glass border border-[var(--color-border)] 
                       text-[var(--color-text-primary)] 
                       bg-[var(--color-bg-secondary)]/50
                       focus:ring-2 focus:ring-[var(--color-accent-primary)] 
                       focus:outline-none transition-all duration-300
                       hover:bg-[var(--color-bg-secondary)]/70"
            >
              {viewOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Subscribers Filter - Show for both tabs */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            {activeTab === 'videos' ? 'Subscriber (kênh)' : 'Subscriber'}
          </label>
          <select
            value={filters.minSubscribers || 'Tất cả'}
            onChange={(e) => handleSubscriberChange(e.target.value)}
            className="w-full px-4 py-2 rounded-xl glass border border-[var(--color-border)] 
                     text-[var(--color-text-primary)] 
                     bg-[var(--color-bg-secondary)]/50
                     focus:ring-2 focus:ring-[var(--color-accent-primary)] 
                     focus:outline-none transition-all duration-300
                     hover:bg-[var(--color-bg-secondary)]/70"
          >
            {subscriberOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By Filter */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            Sắp xếp theo
          </label>
          <select
            value={filters.sortBy || 'relevance'}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full px-4 py-2 rounded-xl glass border border-[var(--color-border)] 
                     text-[var(--color-text-primary)] 
                     bg-[var(--color-bg-secondary)]/50
                     focus:ring-2 focus:ring-[var(--color-accent-primary)] 
                     focus:outline-none transition-all duration-300
                     hover:bg-[var(--color-bg-secondary)]/70"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
