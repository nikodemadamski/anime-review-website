'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container, Typography, Card, CardContent, Badge } from '@/components/ui';
import { useDebounce } from '@/hooks/useDebounce';
import { useWatchlist } from '@/hooks/useWatchlist';
import Image from 'next/image';
import Link from 'next/link';

type SortOption = 'site' | 'visual' | 'music' | 'story' | 'character';

const categoryColors = {
  visual: { color: '#FF6B9D', bg: '#FFE4EF' },
  music: { color: '#9D4EDD', bg: '#F3E8FF' },
  story: { color: '#06B6D4', bg: '#CFFAFE' },
  character: { color: '#F59E0B', bg: '#FEF3C7' },
  site: { color: '#C8A34E', bg: '#FEF3C7' },
};

const genres = [
  { id: 'action', label: 'Action', icon: '⚔️' },
  { id: 'adventure', label: 'Adventure', icon: '🗺️' },
  { id: 'comedy', label: 'Comedy', icon: '😂' },
  { id: 'drama', label: 'Drama', icon: '🎭' },
  { id: 'fantasy', label: 'Fantasy', icon: '✨' },
  { id: 'romance', label: 'Romance', icon: '💕' },
  { id: 'sci-fi', label: 'Sci-Fi', icon: '🚀' },
  { id: 'slice-of-life', label: 'Slice of Life', icon: '🍃' },
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

  if (loading) {
    return (
      <Container size="xl" className="py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--accent)' }}></div>
            <p style={{ color: 'var(--secondary)' }}>Loading anime...</p>
          </div>
        </div>
      </Container>
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

      {/* Search and Filters */}
      <div className="mb-8 space-y-6">
        {/* Search Bar */}
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
        </div>

        {/* Sort Options */}
        <div className="flex flex-wrap gap-2">
          <span className="font-semibold mr-2" style={{ color: 'var(--foreground)' }}>
            Sort by:
          </span>
          {(['site', 'visual', 'music', 'story', 'character'] as SortOption[]).map((option) => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className="px-4 py-2 rounded-lg font-medium transition-all"
              style={{
                backgroundColor: sortBy === option ? categoryColors[option]?.color || 'var(--btn-primary)' : 'var(--card-background)',
                color: sortBy === option ? '#FFFFFF' : 'var(--foreground)',
                borderWidth: '2px',
                borderColor: sortBy === option ? 'transparent' : 'var(--border)',
              }}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>

        {/* Genre Filters */}
        <div>
          <span className="font-semibold mb-2 block" style={{ color: 'var(--foreground)' }}>
            Genres:
          </span>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => toggleGenre(genre.id)}
                className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                style={{
                  backgroundColor: selectedGenres.includes(genre.id) ? 'var(--accent)' : 'var(--card-background)',
                  color: selectedGenres.includes(genre.id) ? '#FFFFFF' : 'var(--foreground)',
                  borderWidth: '2px',
                  borderColor: selectedGenres.includes(genre.id) ? 'transparent' : 'var(--border)',
                }}
              >
                {genre.icon} {genre.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          <span className="font-semibold mr-2" style={{ color: 'var(--foreground)' }}>
            Status:
          </span>
          {(['all', 'airing', 'finished', 'upcoming'] as StatusOption[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className="px-4 py-2 rounded-lg font-medium transition-all"
              style={{
                backgroundColor: statusFilter === status ? 'var(--btn-primary)' : 'var(--card-background)',
                color: statusFilter === status ? 'var(--btn-primary-text)' : 'var(--foreground)',
                borderWidth: '2px',
                borderColor: statusFilter === status ? 'transparent' : 'var(--border)',
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
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
          <Card key={anime.id} className="group hover:scale-105 transition-transform duration-300">
            <Link href={`/anime/${anime.id}`}>
              <div className="relative aspect-[2/3] overflow-hidden rounded-t-xl">
                <Image
                  src={anime.coverImage}
                  alt={anime.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
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
