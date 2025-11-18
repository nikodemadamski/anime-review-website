'use client';

import { Anime } from '@/types/anime';
import { Card, CardContent, Badge } from '@/components/ui';
import Image from 'next/image';
import Link from 'next/link';

interface EmptyStateProps {
  onClearFilters: () => void;
  suggestions: Anime[];
  hasActiveFilters: boolean;
}

export function EmptyState({ onClearFilters, suggestions, hasActiveFilters }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      {/* Empty State Icon and Message */}
      <div className="mb-8">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
          No anime found
        </h3>
        <p className="text-lg mb-6" style={{ color: 'var(--secondary)' }}>
          {hasActiveFilters 
            ? "Try adjusting your filters or search terms" 
            : "We couldn't find any anime matching your criteria"}
        </p>
        
        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="px-6 py-3 rounded-lg font-semibold transition-all inline-flex items-center gap-2"
            style={{
              backgroundColor: 'var(--btn-primary)',
              color: 'var(--btn-primary-text)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            }}
          >
            <span>✕</span>
            <span>Clear All Filters</span>
          </button>
        )}
      </div>

      {/* Suggestions Section */}
      {suggestions.length > 0 && (
        <div className="mt-12">
          <h4 className="text-xl font-semibold mb-6" style={{ color: 'var(--foreground)' }}>
            You might like these:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {suggestions.map((anime) => (
              <Card 
                key={anime.id}
                className="group transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.05]"
                style={{
                  boxShadow: 'var(--card-shadow)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--card-shadow)';
                }}
              >
                <Link href={`/anime/${anime.id}`}>
                  <div className="relative aspect-[2/3] overflow-hidden rounded-t-xl">
                    <Image
                      src={anime.coverImage}
                      alt={anime.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iIzIwMjAyMCIvPjwvc3ZnPg=="
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="info">{anime.ratings.site.toFixed(1)}</Badge>
                    </div>
                  </div>
                </Link>
                <CardContent className="p-4">
                  <Link href={`/anime/${anime.id}`}>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:underline" style={{ color: 'var(--foreground)' }}>
                      {anime.title}
                    </h3>
                  </Link>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {anime.genres.slice(0, 3).map((genre: string) => (
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
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
