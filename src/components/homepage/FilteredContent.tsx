'use client';

import { useMemo, useEffect, useState } from 'react';
import { useCategoryFilter } from '@/hooks/useCategoryFilter';
import { TopRatedGrid } from './TopRatedGrid';
import { FeaturedAnimeCard } from './FeaturedAnimeCard';
import type { Anime } from '@/types';

interface FilteredContentProps {
  allAnime: Anime[];
}

export function FilteredContent({ allAnime }: FilteredContentProps) {
  const { activeCategory } = useCategoryFilter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter and sort anime based on active category (default to overall/site rating)
  const { featuredAnime, gridAnime } = useMemo(() => {
    let sorted = [...allAnime];

    const sortKey = activeCategory || 'site';

    if (sortKey === 'site') {
      sorted = sorted.sort((a, b) => b.ratings.site - a.ratings.site);
    } else {
      sorted = sorted.sort((a, b) => b.ratings[sortKey] - a.ratings[sortKey]);
    }

    return {
      featuredAnime: sorted[0],
      gridAnime: sorted.slice(1, 7), // Next 6 anime
    };
  }, [allAnime, activeCategory]);

  // Prevent hydration mismatch
  if (!mounted) {
    const sorted = [...allAnime].sort((a, b) => b.ratings.site - a.ratings.site);
    return (
      <>
        <div className="mb-6">
          <FeaturedAnimeCard anime={sorted[0]} rank={1} />
        </div>
        <TopRatedGrid anime={sorted.slice(1, 7)} />
      </>
    );
  }

  return (
    <>
      {/* Featured #1 Anime */}
      <div className="mb-6">
        <FeaturedAnimeCard anime={featuredAnime} rank={1} />
        {activeCategory && (
          <div className="mt-3 text-center">
            <span 
              className="inline-block px-4 py-2 rounded-full text-sm font-bold animate-fade-in"
              style={{ 
                backgroundColor: getCategoryColor(activeCategory),
                color: '#FFFFFF'
              }}
            >
              🏆 Highest {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Rating
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
