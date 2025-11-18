'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { WatchNowButton } from '@/components/anime/WatchNowButton';
import { getWatchingCount, isTrending } from '@/lib/trending';

interface AnimeCardLargeProps {
  anime: {
    id: string;
    title: string;
    coverImage: string;
    ratings: {
      visual: number;
      music: number;
      story: number;
      character: number;
      site: number;
    };
    genres: string[];
  };
  onWatchlistToggle: (id: string) => void;
  onWatchNowClick: (id: string, title: string) => void;
  isInWatchlist: boolean;
  imageError?: boolean;
  onImageError?: () => void;
}

export function AnimeCardLarge({
  anime,
  onWatchlistToggle,
  onWatchNowClick,
  isInWatchlist,
  imageError = false,
  onImageError,
}: AnimeCardLargeProps) {
  const watchingCount = getWatchingCount(anime.id);
  const trending = isTrending(anime.id);

  return (
    <div 
      className="bg-card-background rounded-xl overflow-hidden shadow-lg"
      style={{
        backgroundColor: 'var(--card-background)',
        boxShadow: 'var(--card-shadow)',
      }}
    >
      {/* Cover Image */}
      <Link href={`/anime/${anime.id}`}>
        <div className="relative aspect-[2/3] min-h-[400px] max-h-[500px]">
          <Image
            src={imageError ? '/characters/placeholder.svg' : anime.coverImage}
            alt={anime.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            loading="eager"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2YwZjBmMCIvPjwvc3ZnPg=="
            onError={onImageError}
          />
          
          {/* Trending Badge - Top Left */}
          {(watchingCount > 0 || trending) && (
            <div className="absolute top-2 left-2">
              <div 
                className="px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm flex items-center gap-1"
                style={{
                  backgroundColor: trending ? 'rgba(239, 68, 68, 0.9)' : 'rgba(0, 0, 0, 0.7)',
                  color: '#FFFFFF',
                }}
              >
                {trending && <span aria-hidden="true">🔥</span>}
                {watchingCount > 0 && (
                  <span>{watchingCount} watching</span>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>
      
      {/* Content */}
      <div className="p-4 space-y-3">
        <Link href={`/anime/${anime.id}`}>
          <h3 
            className="text-xl font-bold line-clamp-2 hover:underline"
            style={{ color: 'var(--foreground)' }}
          >
            {anime.title}
          </h3>
        </Link>
        
        {/* All 4 ratings */}
        <div className="flex gap-2 flex-wrap">
          <Badge variant="visual">{anime.ratings.visual.toFixed(1)}</Badge>
          <Badge variant="music">{anime.ratings.music.toFixed(1)}</Badge>
          <Badge variant="story">{anime.ratings.story.toFixed(1)}</Badge>
          <Badge variant="character">{anime.ratings.character.toFixed(1)}</Badge>
        </div>
        
        {/* Genres */}
        <div className="flex gap-2 flex-wrap">
          {anime.genres.slice(0, 3).map((genre) => (
            <span
              key={genre}
              className="text-xs px-2 py-1 rounded-full"
              style={{
                backgroundColor: 'var(--text-block)',
                color: 'var(--secondary)',
              }}
            >
              {genre}
            </span>
          ))}
        </div>
        
        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={() => onWatchlistToggle(anime.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onWatchlistToggle(anime.id);
              }
            }}
            aria-label={isInWatchlist ? `Remove ${anime.title} from watchlist` : `Add ${anime.title} to watchlist`}
            aria-pressed={isInWatchlist}
            className="w-full py-3 rounded-lg font-medium transition-all min-h-[44px] active:scale-95"
            style={{
              backgroundColor: isInWatchlist ? 'var(--accent)' : 'var(--btn-primary)',
              color: '#FFFFFF',
            }}
          >
            <span aria-hidden="true">{isInWatchlist ? '✓' : '+'}</span>{' '}
            {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
          </button>
          <WatchNowButton 
            animeId={anime.id}
            animeTitle={anime.title}
            onWatchNowClick={() => onWatchNowClick(anime.id, anime.title)}
          />
        </div>
      </div>
    </div>
  );
}
