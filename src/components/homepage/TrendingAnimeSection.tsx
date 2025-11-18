'use client';

import { useEffect, useState, useRef } from 'react';
import { Anime } from '@/types/anime';
import { calculateTrending } from '@/lib/trending';
import { TrendingAnimeCard } from './TrendingAnimeCard';
import { Button } from '@/components/ui/Button';

interface TrendingAnimeSectionProps {
  allAnime: Anime[];
}

export function TrendingAnimeSection({ allAnime }: TrendingAnimeSectionProps) {
  const [trendingAnime, setTrendingAnime] = useState<Anime[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Calculate trending anime IDs
    const trendingIds = calculateTrending(6);
    
    // Map IDs to actual anime objects
    const trending = trendingIds
      .map(id => allAnime.find(anime => anime.id === id))
      .filter((anime): anime is Anime => anime !== undefined);
    
    setTrendingAnime(trending);
  }, [allAnime]);

  // Don't render if no trending anime
  if (trendingAnime.length === 0) {
    return null;
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -340,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 340,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="mb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Trending Now
          </h2>
          <span className="text-3xl animate-pulse">🔥</span>
        </div>

        {/* Navigation buttons - hidden on mobile, shown on larger screens */}
        <div className="hidden md:flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            ←
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            →
          </Button>
        </div>
      </div>

      {/* Horizontal scrollable carousel */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {trendingAnime.map(anime => (
            <TrendingAnimeCard key={anime.id} anime={anime} />
          ))}
        </div>

        {/* Fade effect on edges - desktop only */}
        <div className="hidden md:block absolute top-0 left-0 bottom-4 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="hidden md:block absolute top-0 right-0 bottom-4 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      </div>

      {/* Mobile scroll hint */}
      <p className="text-sm text-muted-foreground text-center mt-2 md:hidden">
        Swipe to see more →
      </p>
    </section>
  );
}
