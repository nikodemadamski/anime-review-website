'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';

interface AnimeCardListProps {
  anime: {
    id: string;
    title: string;
    coverImage: string;
    ratings: {
      visual: number;
      music: number;
      story: number;
      character: number;
    };
    genres: string[];
  };
  rank: number;
  imageError?: boolean;
  onImageError?: () => void;
}

export function AnimeCardList({
  anime,
  rank,
  imageError = false,
  onImageError,
}: AnimeCardListProps) {
  return (
    <Link href={`/anime/${anime.id}`}>
      <div 
        className="flex gap-3 bg-card-background rounded-lg overflow-hidden h-[120px] hover:shadow-lg transition-shadow"
        style={{
          backgroundColor: 'var(--card-background)',
        }}
      >
        {/* Thumbnail */}
        <div className="relative w-[80px] h-[120px] flex-shrink-0">
          <Image
            src={imageError ? '/characters/placeholder.svg' : anime.coverImage}
            alt={anime.title}
            fill
            className="object-cover"
            sizes="80px"
            loading="lazy"
            onError={onImageError}
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 py-2 pr-2 flex flex-col justify-between min-w-0">
          {/* Title row */}
          <div className="flex items-start gap-2">
            <span 
              className="text-xs font-bold flex-shrink-0"
              style={{ color: 'var(--accent)' }}
            >
              #{rank}
            </span>
            <h3 
              className="text-sm font-bold line-clamp-1 flex-1"
              style={{ color: 'var(--foreground)' }}
            >
              {anime.title}
            </h3>
          </div>
          
          {/* Ratings row */}
          <div className="flex gap-1 flex-wrap">
            <Badge variant="visual" size="xs">{anime.ratings.visual.toFixed(1)}</Badge>
            <Badge variant="music" size="xs">{anime.ratings.music.toFixed(1)}</Badge>
            <Badge variant="story" size="xs">{anime.ratings.story.toFixed(1)}</Badge>
            <Badge variant="character" size="xs">{anime.ratings.character.toFixed(1)}</Badge>
          </div>
          
          {/* Genre */}
          {anime.genres.length > 0 && (
            <div>
              <span
                className="text-xs px-2 py-0.5 rounded-full inline-block"
                style={{
                  backgroundColor: 'var(--text-block)',
                  color: 'var(--secondary)',
                }}
              >
                {anime.genres[0]}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
