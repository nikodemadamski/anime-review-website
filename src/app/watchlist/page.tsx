'use client';

import { useEffect, useState } from 'react';
import { Container } from '@/components/ui';
import { useWatchlist } from '@/hooks/useWatchlist';
import Image from 'next/image';
import Link from 'next/link';

const categoryColors = {
  site: { color: '#C8A34E', bg: '#FEF3C7' },
};

export default function WatchlistPage() {
  const { watchlist, toggleAnime } = useWatchlist();
  const [animeData, setAnimeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWatchlistAnime() {
      if (watchlist.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // Fetch all anime
        const response = await fetch('/api/anime');
        const data = await response.json();
        
        if (data.success) {
          // Filter to only watchlist items
          const watchlistAnime = data.data.filter((anime: any) => 
            watchlist.includes(anime.id)
          );
          setAnimeData(watchlistAnime);
        }
      } catch (error) {
        console.error('Error fetching watchlist anime:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWatchlistAnime();
  }, [watchlist]);

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--background)' }}>
      <Container>
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/browse" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl hover:scale-105 transition-all mb-4 font-semibold text-sm"
            style={{ 
              backgroundColor: 'var(--card-background)',
              color: 'var(--foreground)',
              borderWidth: '2px',
              borderColor: 'var(--border)'
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Browse</span>
          </Link>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 
                className="text-3xl md:text-4xl font-black mb-2"
                style={{ color: 'var(--foreground)' }}
              >
                ❤️ My Watchlist
              </h1>
              <p 
                className="text-lg"
                style={{ color: 'var(--secondary)' }}
              >
                {watchlist.length === 0 
                  ? 'No anime saved yet. Start adding your favorites!' 
                  : `${watchlist.length} anime saved`}
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div 
              className="inline-block animate-spin rounded-full h-16 w-16 border-4"
              style={{ 
                borderColor: 'var(--border)',
                borderTopColor: 'var(--btn-primary)'
              }}
            ></div>
            <p className="mt-4 text-lg font-semibold" style={{ color: 'var(--secondary)' }}>
              Loading your watchlist...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && watchlist.length === 0 && (
          <div 
            className="text-center py-20 rounded-3xl border-2"
            style={{
              backgroundColor: 'var(--card-background)',
              borderColor: 'var(--border)'
            }}
          >
            <div className="text-8xl mb-6">💔</div>
            <h2 
              className="text-2xl font-bold mb-4"
              style={{ color: 'var(--foreground)' }}
            >
              Your watchlist is empty
            </h2>
            <p 
              className="text-lg mb-8 max-w-md mx-auto"
              style={{ color: 'var(--secondary)' }}
            >
              Start adding anime you love by clicking the ❤️ button on any anime card!
            </p>
            <Link
              href="/browse"
              className="inline-block px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg"
              style={{
                backgroundColor: 'var(--btn-primary)',
                color: 'var(--btn-primary-text)',
              }}
            >
              Browse Anime
            </Link>
          </div>
        )}

        {/* Watchlist Grid */}
        {!loading && animeData.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {animeData.map((item) => {
              const colors = categoryColors.site;
              return (
                <div key={item.id} className="group relative">
                  <Link href={`/anime/${item.id}`}>
                    <div 
                      className="relative overflow-hidden rounded-3xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                      style={{ 
                        backgroundColor: 'var(--card-background)',
                      }}
                    >
                      {/* Image Container */}
                      <div className="aspect-[2/3] relative overflow-hidden">
                        <Image
                          src={item.coverImage}
                          alt={item.title}
                          fill
                          className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        
                        {/* Rating Badge */}
                        <div 
                          className="absolute top-3 right-3 px-4 py-2 rounded-2xl font-black text-white shadow-2xl backdrop-blur-sm"
                          style={{ backgroundColor: colors.color }}
                        >
                          <div className="text-center">
                            <div className="text-2xl leading-none">{item.ratings.site.toFixed(1)}</div>
                            <div className="text-[10px] opacity-90 font-medium">/{10}</div>
                          </div>
                        </div>

                        {/* Title Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="font-bold text-white text-sm md:text-base line-clamp-2 drop-shadow-lg">
                            {item.title}
                          </h3>
                        </div>
                      </div>

                      {/* Quick Stats Bar */}
                      <div 
                        className="p-3"
                        style={{ backgroundColor: 'var(--text-block)' }}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span style={{ color: 'var(--muted)' }}>Overall</span>
                          <span 
                            className="font-bold"
                            style={{ color: 'var(--rating-overall)' }}
                          >
                            ⭐ {item.ratings.site.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleAnime(item.id);
                    }}
                    className="absolute bottom-16 right-3 w-10 h-10 rounded-full shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-110 z-10 flex items-center justify-center"
                    style={{
                      backgroundColor: '#FF6B9D',
                      color: '#FFFFFF',
                    }}
                    aria-label="Remove from watchlist"
                  >
                    <svg 
                      className="w-5 h-5" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}
