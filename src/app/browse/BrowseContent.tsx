'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container, Card, CardContent, Badge } from '@/components/ui';
import { useDebounce } from '@/hooks/useDebounce';
import { useWatchlist } from '@/hooks/useWatchlist';
import { SkeletonGrid } from '@/components/loading/SkeletonGrid';
import Image from 'next/image';
import Link from 'next/link';

type SortOption = 'site' | 'visual' | 'music' | 'story' | 'character';

const sortOptions = [
  { value: 'site' as SortOption, label: 'Most Popular', icon: '⭐', color: '#C8A34E' },
  { value: 'visual' as SortOption, label: 'Best Visuals', icon: '🎨', color: '#FF6B9D' },
  { value: 'music' as SortOption, label: 'Best Music', icon: '🎵', color: '#9D4EDD' },
  { value: 'story' as SortOption, label: 'Best Story', icon: '📖', color: '#06B6D4' },
  { value: 'character' as SortOption, label: 'Best Characters', icon: '👥', color: '#F59E0B' },
];

const categoryColors = {
  visual: { color: '#FF6B9D', bg: '#FFE4EF' },
  music: { color: '#9D4EDD', bg: '#F3E8FF' },
  story: { color: '#06B6D4', bg: '#CFFAFE' },
  character: { color: '#F59E0B', bg: '#FEF3C7' },
  site: { color: '#C8A34E', bg: '#FEF3C7' },
};

const topGenres = [
  { id: 'action', label: 'Action', icon: '⚔️' },
  { id: 'adventure', label: 'Adventure', icon: '🗺️' },
  { id: 'comedy', label: 'Comedy', icon: '😂' },
  { id: 'drama', label: 'Drama', icon: '🎭' },
  { id: 'fantasy', label: 'Fantasy', icon: '✨' },
  { id: 'romance', label: 'Romance', icon: '💕' },
];

const moreGenres = [
  { id: 'sci-fi', label: 'Sci-Fi', icon: '🚀' },
  { id: 'slice-of-life', label: 'Slice of Life', icon: '🍃' },
  { id: 'horror', label: 'Horror', icon: '👻' },
  { id: 'mystery', label: 'Mystery', icon: '🔍' },
  { id: 'thriller', label: 'Thriller', icon: '😱' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'supernatural', label: 'Supernatural', icon: '🌙' },
  { id: 'mecha', label: 'Mecha', icon: '🤖' },
];

type StatusOption = 'all' | 'airing' | 'finished' | 'upcoming';

export function BrowseContent() {
  const searchParams = useSearchParams();
  const [allAnime, setAllAnime] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>((searchParams.get('sort') as SortOption) || 'site');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusOption>('all');
  const [showMoreGenres, setShowMoreGenres] = useState(false);
  const [isSearchSticky, setIsSearchSticky] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { watchlist, addAnime, removeAnime, isInWatchlist: checkWatchlist } = useWatchlist();

  useEffect(() => {
    async function loadAnime() {
      try {
        const response = await fetch('/api/anime');
        if (!response.ok) throw new Error('Failed to fetch anime');
        const result = await response.json();
        // Handle both array response and object with data property
        const data = result.data || result;
        setAllAnime(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load anime');
        setAllAnime([]);
      } finally {
        setLoading(false);
      }
    }
    loadAnime();
  }, []);

  // Sticky search bar on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsSearchSticky(window.scrollY > 200);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredAndSortedAnime = useMemo(() => {
    if (!Array.isArray(allAnime)) return [];
    let filtered = [...allAnime];

    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (anime) =>
          anime.title.toLowerCase().includes(query) ||
          anime.description?.toLowerCase().includes(query) ||
          anime.genres.some((g: string) => g.toLowerCase().includes(query))
      );
    }

    if (selectedGenres.length > 0) {
      filtered = filtered.filter((anime) =>
        selectedGenres.every((genre) =>
          anime.genres.some((g: string) => g.toLowerCase() === genre.toLowerCase())
        )
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((anime) => {
        if (statusFilter === 'airing') return anime.status === 'ongoing';
        if (statusFilter === 'finished') return anime.status === 'finished';
        if (statusFilter === 'upcoming') return anime.status === 'upcoming';
        return true;
      });
    }

    filtered.sort((a, b) => {
      const aRating = a.ratings[sortBy] || 0;
      const bRating = b.ratings[sortBy] || 0;
      return bRating - aRating;
    });

    return filtered;
  }, [allAnime, debouncedSearch, selectedGenres, statusFilter, sortBy]);

  const toggleGenre = (genreId: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId) ? prev.filter((g) => g !== genreId) : [...prev, genreId]
    );
  };

  const toggleWatchlist = (animeId: string) => {
    if (checkWatchlist(animeId)) {
      removeAnime(animeId);
    } else {
      addAnime(animeId);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedGenres([]);
    setStatusFilter('all');
    setSortBy('site');
  };

  const hasActiveFilters = searchQuery || selectedGenres.length > 0 || statusFilter !== 'all' || sortBy !== 'site';

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
        <Container size="xl" className="py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-black mb-2" style={{ color: 'var(--foreground)' }}>
              Browse Anime
            </h1>
            <p style={{ color: 'var(--secondary)' }}>
              Loading anime collection...
            </p>
          </div>
          <SkeletonGrid count={12} columns={4} />
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <Container size="xl" className="py-12">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </Container>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      <Container size="xl" className="py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2" style={{ color: 'var(--foreground)' }}>
            Browse Anime
          </h1>
          <p style={{ color: 'var(--secondary)' }}>
            Discover and explore our collection of {allAnime.length} anime titles
          </p>
        </div>

      {/* Sticky Search Bar */}
      <div 
        className={`transition-all duration-300 ${isSearchSticky ? 'fixed top-0 left-0 right-0 z-30 py-4' : 'mb-8'}`}
        style={{
          backgroundColor: isSearchSticky ? 'var(--background)' : 'transparent',
          backdropFilter: isSearchSticky ? 'blur(10px)' : 'none',
          boxShadow: isSearchSticky ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none',
        }}
      >
        <Container size="xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search anime by title, description, or genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--card-background)',
                borderColor: 'var(--border)',
                color: 'var(--foreground)',
              }}
            />
            <svg
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: 'var(--secondary)' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {isSearchSticky && (selectedGenres.length > 0 || statusFilter !== 'all' || searchQuery) && (
              <div className="absolute right-16 top-1/2 transform -translate-y-1/2">
                <span 
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: '#FFFFFF',
                  }}
                >
                  {selectedGenres.length + (statusFilter !== 'all' ? 1 : 0) + (searchQuery ? 1 : 0)} active
                </span>
              </div>
            )}
          </div>
        </Container>
      </div>

      {/* Spacer when search is sticky */}
      {isSearchSticky && <div className="h-20" />}

      {/* Filters */}
      <div className="mb-8 space-y-6">
        {/* Clear All Filters Button */}
        {hasActiveFilters && (
          <div className="flex justify-end">
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
              style={{
                backgroundColor: 'var(--error)',
                color: '#FFFFFF',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              }}
            >
              <span>✕</span>
              <span>Clear All Filters</span>
            </button>
          </div>
        )}

        {/* Sort Options */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="font-semibold" style={{ color: 'var(--foreground)' }}>
            Sort by:
          </span>
          {sortOptions.map((option) => {
            const isActive = sortBy === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className="px-4 py-2 rounded-lg font-medium transition-all min-h-[44px] flex items-center gap-2"
                style={{
                  backgroundColor: isActive ? option.color : 'var(--card-background)',
                  color: isActive ? '#FFFFFF' : 'var(--foreground)',
                  borderWidth: '2px',
                  borderColor: isActive ? option.color : 'var(--border)',
                  boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.15)' : 'none',
                }}
              >
                <span>{option.icon}</span>
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>

        {/* Genre Filters */}
        <div>
          <span className="font-semibold mb-2 block" style={{ color: 'var(--foreground)' }}>
            Genres:
          </span>
          <div className="flex flex-wrap gap-2">
            {topGenres.map((genre) => {
              const isActive = selectedGenres.includes(genre.id);
              return (
                <button
                  key={genre.id}
                  onClick={() => toggleGenre(genre.id)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all min-h-[44px] flex items-center gap-1"
                  style={{
                    backgroundColor: isActive ? 'var(--accent)' : 'var(--card-background)',
                    color: isActive ? '#FFFFFF' : 'var(--foreground)',
                    borderWidth: '2px',
                    borderColor: isActive ? 'var(--accent)' : 'var(--border)',
                    boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.15)' : 'none',
                  }}
                >
                  {isActive && <span className="text-white">✓</span>}
                  {genre.icon} {genre.label}
                </button>
              );
            })}
            
            {/* More Genres Button */}
            <button
              onClick={() => setShowMoreGenres(!showMoreGenres)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all min-h-[44px] flex items-center gap-1"
              style={{
                backgroundColor: 'var(--card-background)',
                color: 'var(--foreground)',
                borderWidth: '2px',
                borderColor: 'var(--border)',
              }}
            >
              More Genres {showMoreGenres ? '▲' : '▼'}
            </button>
          </div>
          
          {/* More Genres Dropdown/Bottom Sheet */}
          {showMoreGenres && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setShowMoreGenres(false)}
              />
              
              {/* Mobile Bottom Sheet */}
              <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden animate-slide-up">
                <div 
                  className="rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto"
                  style={{
                    backgroundColor: 'var(--card-background)',
                    boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
                      More Genres
                    </h3>
                    <button
                      onClick={() => setShowMoreGenres(false)}
                      className="text-2xl w-8 h-8 flex items-center justify-center"
                      style={{ color: 'var(--secondary)' }}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {moreGenres.map((genre) => {
                      const isActive = selectedGenres.includes(genre.id);
                      return (
                        <button
                          key={genre.id}
                          onClick={() => toggleGenre(genre.id)}
                          className="px-4 py-2 rounded-full text-sm font-medium transition-all min-h-[44px] flex items-center gap-1"
                          style={{
                            backgroundColor: isActive ? 'var(--accent)' : 'var(--text-block)',
                            color: isActive ? '#FFFFFF' : 'var(--foreground)',
                            borderWidth: '2px',
                            borderColor: isActive ? 'var(--accent)' : 'transparent',
                          }}
                        >
                          {isActive && <span className="text-white">✓</span>}
                          {genre.icon} {genre.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Desktop Dropdown */}
              <div className="hidden md:block mt-2 p-4 rounded-xl" style={{
                backgroundColor: 'var(--card-background)',
                borderWidth: '2px',
                borderColor: 'var(--border)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}>
                <div className="flex flex-wrap gap-2">
                  {moreGenres.map((genre) => {
                    const isActive = selectedGenres.includes(genre.id);
                    return (
                      <button
                        key={genre.id}
                        onClick={() => toggleGenre(genre.id)}
                        className="px-4 py-2 rounded-full text-sm font-medium transition-all min-h-[44px] flex items-center gap-1"
                        style={{
                          backgroundColor: isActive ? 'var(--accent)' : 'var(--text-block)',
                          color: isActive ? '#FFFFFF' : 'var(--foreground)',
                          borderWidth: '2px',
                          borderColor: isActive ? 'var(--accent)' : 'transparent',
                        }}
                      >
                        {isActive && <span className="text-white">✓</span>}
                        {genre.icon} {genre.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="font-semibold" style={{ color: 'var(--foreground)' }}>
            Status:
          </span>
          {(['all', 'airing', 'finished', 'upcoming'] as StatusOption[]).map((status) => {
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className="px-4 py-2 rounded-lg font-medium transition-all min-h-[44px] min-w-[44px]"
                style={{
                  backgroundColor: isActive ? 'var(--btn-primary)' : 'var(--card-background)',
                  color: isActive ? 'var(--btn-primary-text)' : 'var(--foreground)',
                  borderWidth: '2px',
                  borderColor: isActive ? 'var(--btn-primary)' : 'var(--border)',
                  boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.15)' : 'none',
                }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p style={{ color: 'var(--secondary)' }}>
          Showing {filteredAndSortedAnime.length} of {allAnime.length} anime
        </p>
      </div>

      {/* Anime Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedAnime.map((anime) => (
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
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iIzIwMjAyMCIvPjwvc3ZnPg=="
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="info">{anime.ratings[sortBy].toFixed(1)}</Badge>
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
              <button
                onClick={() => toggleWatchlist(anime.id)}
                className="w-full py-2 rounded-lg font-medium transition-all"
                style={{
                  backgroundColor: checkWatchlist(anime.id) ? 'var(--accent)' : 'var(--btn-primary)',
                  color: '#FFFFFF',
                }}
              >
                {checkWatchlist(anime.id) ? '✓ In Watchlist' : '+ Add to Watchlist'}
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAndSortedAnime.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl" style={{ color: 'var(--secondary)' }}>
            No anime found matching your filters
          </p>
        </div>
      )}
      </Container>
    </div>
  );
}
