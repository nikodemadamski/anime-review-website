'use client';

import { useMemo, useState } from 'react';
import { useCategoryFilter } from '@/hooks/useCategoryFilter';
import { TopRatedGrid } from './TopRatedGrid';
import { FeaturedAnimeCard } from './FeaturedAnimeCard';
import { SortTabs, type SortType } from './SortTabs';
import type { Anime } from '@/types';

interface FilteredContentProps {
  allAnime: Anime[];
}

export function FilteredContent({ allAnime }: FilteredContentProps) {
  const { activeCategory } = useCategoryFilter();
  const [sortBy, setSortBy] = useState<SortType>('overall');

  // Filter and sort anime based on active category or sort selection
  const { featuredAnime, gridAnime } = useMemo(() => {
    let sorted = [...allAnime];

    // Priority: activeCategory from filter pills, then sortBy from tabs
    const sortKey = activeCategory || (sortBy === 'overall' ? 'site' : sortBy);

    if (sortKey === 'site') {
      sorted = sorted.sort((a, b) => b.ratings.site - a.ratings.site);
    } else {
      sorted = sorted.sort((a, b) => b.ratings[sortKey] - a.ratings[sortKey]);
    }

    return {
      featuredAnime: sorted[0],
      gridAnime: sorted.slice(1, 7), // Next 6 anime
    };
  }, [allAnime, activeCategory, sortBy]);

  return (
    <>
      {/* Sort Tabs - Only show if no category filter active */}
      {!activeCategory && (
        <div className="mb-6">
          <SortTabs activeSort={sortBy} onSortChange={setSortBy} />
        </div>
      )}

      {/* Featured #1 Anime */}
      <div className="mb-6">
        <FeaturedAnimeCard anime={featuredAnime} rank={1} />
        {(activeCategory || sortBy !== 'overall') && (
          <div className="mt-3 text-center">
            <span 
              className="inline-block px-4 py-2 rounded-full text-sm font-bold animate-fade-in"
              style={{ 
                backgroundColor: getCategoryColor(activeCategory || sortBy),
                color: '#FFFFFF'
              }}
            >
              🏆 Highest {(activeCategory || sortBy).charAt(0).toUpperCase() + (activeCategory || sortBy).slice(1)} Rating
            </span>
          </div>
        )}
      </div>

      {/* Remaining Top Anime Grid */}
      <TopRatedGrid anime={gridAnime} />
    </>
  );
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    visual: '#FF6B9D',
    music: '#9D4EDD',
    story: '#06B6D4',
    character: '#F59E0B',
    overall: '#C8A34E',
  };
  return colors[category] || '#8B6F47';
}
