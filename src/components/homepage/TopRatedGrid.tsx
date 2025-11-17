'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CategoryBadges } from '@/components/anime/CategoryBadges';
import { AnimeCardHover } from '@/components/anime/AnimeCardHover';
import type { Anime } from '@/types';

interface TopRatedGridProps {
  anime: Anime[];
}

export function TopRatedGrid({ anime }: TopRatedGridProps) {
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());

  const toggleWatchlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setWatchlist(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('watchlist', JSON.stringify(Array.from(newSet)));
      }
      return newSet;
    });
  };

  // Load watchlist from localStorage on mount
  if (typeof window !== 'undefined' && watchlist.size === 0) {
    try {
      const stored = localStorage.getItem('watchlist');
      if (stored) {
        setWatchlist(new Set(JSON.parse(stored)));
      }
    } catch (e) {
      // Ignore errors
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {anime.map((item, index) => {
        const isInWatchlist = watchlist.has(item.id);
        
        return (
          <Link key={item.id} href={`/anime/${item.id}`} className="group relative">
            <div
              className="relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{ backgroundColor: 'var(--card-background)' }}
            >
              {/* Image */}
              <div className="aspect-[3/4] relative overflow-hidden">
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />

                {/* Hover Overlay with Detailed Ratings */}
                <AnimeCardHover
                  title={item.title}
                  ratings={item.ratings}
                  description={item.description}
                  genres={item.genres}
                />

                {/* Rank Badge */}
                <div
                  className="absolute top-2 left-2 backdrop-blur-sm px-2 py-1 rounded-lg z-10"
                  style={{ backgroundColor: 'var(--card-background)' }}
                >
                  <span
                    className="text-xs font-bold"
                    style={{ color: 'var(--foreground)' }}
                  >
                    #{index + 2}
                  </span>
                </div>

                {/* Watchlist Heart Button */}
                <button
                  onClick={(e) => toggleWatchlist(item.id, e)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 backdrop-blur-sm"
                  style={{
                    backgroundColor: isInWatchlist ? '#FF6B9D' : 'rgba(0,0,0,0.5)',
                  }}
                  title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                >
                  <svg 
                    className="w-5 h-5" 
                    fill={isInWatchlist ? 'white' : 'none'} 
                    stroke="white" 
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

                {/* Overall Rating Badge */}
                <div
                  className="absolute bottom-2 right-2 px-3 py-1.5 rounded-lg shadow-lg z-10"
                  style={{ backgroundColor: 'var(--rating-overall)' }}
                >
                  <span className="text-sm font-bold text-white">
                    {item.ratings.site.toFixed(1)}
                  </span>
                </div>

                {/* Category Badges - Bottom Left */}
                <div className="absolute bottom-2 left-2 z-10">
                  <CategoryBadges ratings={item.ratings} size="mini" />
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
