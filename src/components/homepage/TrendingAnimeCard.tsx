'use client';

import { memo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Anime } from '@/types/anime';
import { Badge } from '@/components/ui/Badge';

interface TrendingAnimeCardProps {
  anime: Anime;
  index?: number;
}

export const TrendingAnimeCard = memo(function TrendingAnimeCard({ anime, index = 0 }: TrendingAnimeCardProps) {
  const [imageError, setImageError] = useState(false);
  
  return (
    <Link
      href={`/anime/${anime.id}`}
      className="group relative flex-shrink-0 w-[280px] sm:w-[320px] block overflow-hidden rounded-xl bg-card shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
    >
      {/* 16:9 aspect ratio image */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <Image
          src={imageError ? '/characters/placeholder.svg' : anime.coverImage}
          alt={anime.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 640px) 280px, 320px"
          loading={index < 4 ? 'eager' : 'lazy'}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2YwZjBmMCIvPjwvc3ZnPg=="
          onError={() => setImageError(true)}
        />
        
        {/* Trending badge overlay */}
        <div className="absolute top-2 left-2">
          <Badge variant="error" className="bg-red-500/90 backdrop-blur-sm">
            🔥 Trending
          </Badge>
        </div>

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Title overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-lg line-clamp-2 drop-shadow-lg">
            {anime.title}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 text-yellow-400">
              <span className="text-sm">⭐</span>
              <span className="text-white text-sm font-semibold">
                {anime.ratings.site.toFixed(1)}
              </span>
            </div>
            
            {/* Genres */}
            {anime.genres && anime.genres.length > 0 && (
              <span className="text-white/80 text-xs">
                • {anime.genres.slice(0, 2).join(', ')}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
});
