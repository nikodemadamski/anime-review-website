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

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const [allAnime, setAllAnime] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>((searchParams.get('sort') as SortOption) || 'site');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    searchParams.get('genres')?.split(',').filter(Boolean) || []
  );
  const [selectedStatus, setSelectedStatus] = useState<StatusOption>(
    (searchParams.get('status') as StatusOption) || 'all'
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    searchParams.get('year') || 'all'
  );
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { toggleAnime, isInWatchlist } = useWatchlist();

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (sortBy !== 'site') params.set('sort', sortBy);
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (selectedGenres.length) params.set('genres', selectedGenres.join(','));
    if (selectedStatus !== 'all') params.set('status', selectedStatus);
    if (selectedYear !== 'all') params.set('year', selectedYear);
    
    const newUrl = params.toString() ? `/browse?${params.toString()}` : '/browse';
    window.history.replaceState({}, '', newUrl);
  }, [sortBy, debouncedSearch, selectedGenres, selectedStatus, selectedYear]);

  // Fetch all anime once
  useEffect(() => {
    async function fetchAnime() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/anime?sortBy=${sortBy}`);
        const data = await response.json();
        if (data.success) {
          setAllAnime(data.data);
        } else {
          setError('Failed to load anime');
        }
      } catch (err) {
        console.error('Error fetching anime:', err);
        setError('Unable to load anime. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchAnime();
  }, [sortBy]);

  // Get available years from anime data
  const availableYears = useMemo(() => {
    const years = new Set(allAnime.map(a => a.releaseYear).filter(Boolean));
    return Array.from(years).sort((a, b) => b - a);
  }, [allAnime]);

  // Calculate genre counts
  const genreCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    genres.forEach(genre => {
      counts[genre.id] = allAnime.filter(a => 
        a.genres && a.genres.some((g: string) => 
          g.toLowerCase().includes(genre.id.replace('-', ' '))
        )
      ).length;
    });
    return counts;
  }, [allAnime]);

  // Filter anime client-side
  const filteredAnime = useMemo(() => {
    let filtered = [...allAnime];

    // Search filter
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(query)
      );
    }

    // Genre filter
    if (selectedGenres.length > 0) {
      filtered = filtered.filter(a => 
        a.genres && selectedGenres.some((genre: string) => 
          a.genres.some((g: string) => g.toLowerCase().includes(genre.replace('-', ' ')))
        )
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(a => 
        a.status && a.status.toLowerCase() === selectedStatus
      );
    }

    // Year filter
    if (selectedYear !== 'all') {
      filtered = filtered.filter(a => 
        a.releaseYear && a.releaseYear.toString() === selectedYear
      );
    }

    return filtered;
  }, [allAnime, debouncedSearch, selectedGenres, selectedStatus, selectedYear]);

  const toggleGenre = (genreId: string) => {
    setSelectedGenres(prev => 
      prev.includes(genreId)
        ? prev.filter(g => g !== genreId)
        : [...prev, genreId]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenres([]);
    setSelectedStatus('all');
    setSelectedYear('all');
  };

  const categoryInfo = {
    site: { 
      label: 'Overall Rating', 
      icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
    },
    visual: { 
      label: 'Visual', 
      icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
    },
    music: { 
      label: 'Music', 
      icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3'
    },
    story: { 
      label: 'Story', 
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
    },
    character: { 
      label: 'Character', 
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
    },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Welcoming & Clear */}
      <div 
        className="py-12 md:py-16"
        style={{
          background: 'linear-gradient(135deg, var(--text-block) 0%, var(--background) 100%)'
        }}
      >
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            {/* Welcome Message */}
            <div 
              className="inline-block px-4 py-2 rounded-full mb-4"
              style={{ 
                backgroundColor: 'var(--card-background)',
                color: 'var(--accent)'
              }}
            >
              <span className="text-sm font-semibold">✨ {allAnime.length} Anime Series Available</span>
            </div>

            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight"
              style={{ color: 'var(--foreground)' }}
            >
              Browse All Anime
            </h1>
            <p 
              className="text-lg md:text-xl mb-6 max-w-2xl mx-auto"
              style={{ color: 'var(--secondary)' }}
            >
              Find your next favorite anime! Sort by what matters most to you.
            </p>

            {/* Search Bar - Always Visible */}
            <div className="max-w-2xl mx-auto mb-6">
              <div className="relative">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search anime by title..."
                  className="w-full px-6 py-4 pl-14 rounded-2xl text-base border-2 transition-all duration-300 focus:outline-none focus:scale-105"
                  style={{
                    backgroundColor: 'var(--card-background)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)',
                  }}
                />
                <svg
                  className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: 'var(--muted)' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors"
                    style={{ color: 'var(--muted)' }}
                    aria-label="Clear search"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Active Filter Chips */}
            {(selectedGenres.length > 0 || selectedStatus !== 'all' || selectedYear !== 'all' || debouncedSearch) && (
              <div className="max-w-4xl mx-auto mb-6">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>
                    Active:
                  </span>
                  {debouncedSearch && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-3 py-1.5 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105 flex items-center gap-2"
                      style={{
                        backgroundColor: 'var(--accent)',
                        color: '#FFFFFF',
                      }}
                    >
                      🔍 "{debouncedSearch}"
                      <span>✕</span>
                    </button>
                  )}
                  {selectedGenres.map((genreId) => {
                    const genre = genres.find(g => g.id === genreId);
                    return (
                      <button
                        key={genreId}
                        onClick={() => toggleGenre(genreId)}
                        className="px-3 py-1.5 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105 flex items-center gap-2"
                        style={{
                          backgroundColor: 'var(--accent)',
                          color: '#FFFFFF',
                        }}
                      >
                        {genre?.icon} {genre?.label}
                        <span>✕</span>
                      </button>
                    );
                  })}
                  {selectedStatus !== 'all' && (
                    <button
                      onClick={() => setSelectedStatus('all')}
                      className="px-3 py-1.5 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105 flex items-center gap-2"
                      style={{
                        backgroundColor: 'var(--accent)',
                        color: '#FFFFFF',
                      }}
                    >
                      {selectedStatus === 'airing' ? '📡' : selectedStatus === 'finished' ? '✅' : '🔜'} {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
                      <span>✕</span>
                    </button>
                  )}
                  {selectedYear !== 'all' && (
                    <button
                      onClick={() => setSelectedYear('all')}
                      className="px-3 py-1.5 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105 flex items-center gap-2"
                      style={{
                        backgroundColor: 'var(--accent)',
                        color: '#FFFFFF',
                      }}
                    >
                      📅 {selectedYear}
                      <span>✕</span>
                    </button>
                  )}
                  <button
                    onClick={clearFilters}
                    className="px-3 py-1.5 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: 'var(--error)',
                      color: '#FFFFFF',
                    }}
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}

            {/* Advanced Filters Toggle */}
            <div className="mb-6">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105 shadow-md flex items-center gap-2 mx-auto"
                style={{
                  backgroundColor: 'var(--card-background)',
                  borderWidth: '2px',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
                {(selectedGenres.length > 0 || selectedStatus !== 'all' || selectedYear !== 'all') && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-black" style={{ backgroundColor: 'var(--accent)', color: '#FFFFFF' }}>
                    {selectedGenres.length + (selectedStatus !== 'all' ? 1 : 0) + (selectedYear !== 'all' ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>

            {/* Advanced Filters - Collapsible */}
            {showAdvancedFilters && (
              <div className="max-w-4xl mx-auto mb-6 p-6 rounded-2xl border-2" style={{
                backgroundColor: 'var(--card-background)',
                borderColor: 'var(--border)',
              }}>
                {/* Status Filter */}
                <div className="mb-6">
                  <p className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
                    📡 Status
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'all', label: 'All', icon: '📺' },
                      { value: 'airing', label: 'Airing', icon: '📡' },
                      { value: 'finished', label: 'Finished', icon: '✅' },
                      { value: 'upcoming', label: 'Upcoming', icon: '🔜' },
                    ].map((status) => (
                      <button
                        key={status.value}
                        onClick={() => setSelectedStatus(status.value as StatusOption)}
                        className="px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 border-2"
                        style={
                          selectedStatus === status.value
                            ? {
                                backgroundColor: 'var(--accent)',
                                borderColor: 'var(--accent)',
                                color: '#FFFFFF',
                              }
                            : {
                                backgroundColor: 'var(--background)',
                                borderColor: 'var(--border)',
                                color: 'var(--foreground)',
                              }
                        }
                      >
                        <span className="mr-1">{status.icon}</span>
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Year Filter */}
                <div className="mb-6">
                  <p className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
                    📅 Year
                  </p>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="px-4 py-2 rounded-xl font-semibold text-sm border-2 w-full md:w-auto"
                    style={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                    }}
                  >
                    <option value="all">All Years</option>
                    {availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Genre Filters */}
                <div>
                  <p className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
                    🎭 Genres
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => {
                      const count = genreCounts[genre.id] || 0;
                      const isDisabled = count === 0;
                      return (
                        <button
                          key={genre.id}
                          onClick={() => !isDisabled && toggleGenre(genre.id)}
                          disabled={isDisabled}
                          className="px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 border-2 disabled:opacity-30 disabled:cursor-not-allowed"
                          style={
                            selectedGenres.includes(genre.id)
                              ? {
                                  backgroundColor: 'var(--accent)',
                                  borderColor: 'var(--accent)',
                                  color: '#FFFFFF',
                                }
                              : {
                                  backgroundColor: 'var(--background)',
                                  borderColor: 'var(--border)',
                                  color: 'var(--foreground)',
                                }
                          }
                        >
                          <span className="mr-1">{genre.icon}</span>
                          {genre.label}
                          <span className="ml-1 opacity-75">({count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Filter Section - With Icons */}
            <div className="mb-4">
              <p 
                className="text-sm font-semibold mb-4 uppercase tracking-wide"
                style={{ color: 'var(--muted)' }}
              >
                Sort By Category
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {(['site', 'visual', 'music', 'story', 'character'] as SortOption[]).map((option) => {
                  const colors = categoryColors[option];
                  const isActive = sortBy === option;
                  return (
                    <button
                      key={option}
                      onClick={() => setSortBy(option)}
                      className="group relative px-5 py-3 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-xl flex items-center gap-2"
                      style={
                        isActive
                          ? { 
                              backgroundColor: colors.color, 
                              color: '#FFFFFF',
                            }
                          : { 
                              backgroundColor: 'var(--card-background)', 
                              color: 'var(--foreground)',
                              borderWidth: '2px',
                              borderColor: 'var(--border)'
                            }
                      }
                    >
                      <svg 
                        className="w-5 h-5" 
                        fill="none"
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          d={categoryInfo[option].icon} 
                        />
                      </svg>
                      <span className="text-sm md:text-base">{categoryInfo[option].label}</span>
                      {isActive && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white shadow-lg" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Helper Text */}
            <p 
              className="text-xs mt-4"
              style={{ color: 'var(--muted)' }}
            >
              💡 Tip: Click any anime to see detailed ratings and reviews
            </p>
          </div>
        </Container>
      </div>

      {/* Main Content Area */}
      <div style={{ backgroundColor: 'var(--background)' }} className="pb-16">
        <Container>
          {/* Results Header */}
          {!loading && !error && (
            <div className="mb-8">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                <div>
                  <h2 
                    className="text-2xl font-bold"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {sortBy === 'site' ? 'Top Rated Anime' : `Best ${categoryInfo[sortBy].label}`}
                  </h2>
                  <p 
                    className="text-sm mt-1"
                    style={{ color: 'var(--muted)' }}
                  >
                    Showing {filteredAnime.length} of {allAnime.length} anime
                    {(selectedGenres.length > 0 || selectedStatus !== 'all' || selectedYear !== 'all' || debouncedSearch) && (
                      <span className="ml-2 font-semibold" style={{ color: 'var(--accent)' }}>
                        ({[
                          debouncedSearch && 'search',
                          selectedGenres.length > 0 && `${selectedGenres.length} genre${selectedGenres.length > 1 ? 's' : ''}`,
                          selectedStatus !== 'all' && 'status',
                          selectedYear !== 'all' && 'year'
                        ].filter(Boolean).join(', ')} active)
                      </span>
                    )}
                  </p>
                </div>
                <div 
                  className="px-4 py-2 rounded-xl"
                style={{ 
                  backgroundColor: 'var(--card-background)',
                  borderWidth: '2px',
                  borderColor: 'var(--border)'
                }}
              >
                <p className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>
                  Currently Viewing
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <svg 
                    className="w-4 h-4" 
                    fill="none"
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    style={{ color: categoryColors[sortBy].color }}
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d={categoryInfo[sortBy].icon} 
                    />
                  </svg>
                  <span 
                    className="font-bold"
                    style={{ color: categoryColors[sortBy].color }}
                  >
                    {categoryInfo[sortBy].label}
                  </span>
                </div>
              </div>
            </div>
            </div>
          )}

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
                Loading amazing anime...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                Oops! Something went wrong
              </h3>
              <p className="text-lg mb-6" style={{ color: 'var(--secondary)' }}>
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg"
                style={{
                  backgroundColor: 'var(--btn-primary)',
                  color: 'var(--btn-primary-text)',
                }}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredAnime.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                No anime found
              </h3>
              <p className="text-lg mb-6" style={{ color: 'var(--secondary)' }}>
                Try adjusting your search or filters
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg"
                style={{
                  backgroundColor: 'var(--btn-primary)',
                  color: 'var(--btn-primary-text)',
                }}
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Results Grid */}
          {!loading && !error && filteredAnime.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {filteredAnime.map((item, index) => {
                const colors = categoryColors[sortBy];
                const inWatchlist = isInWatchlist(item.id);
                
                return (
                  <div key={item.id} className="group relative">
                    <Link href={`/anime/${item.id}`}>
                      <div 
                        className="relative overflow-hidden rounded-3xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                        style={{ 
                          backgroundColor: 'var(--card-background)',
                        }}
                      >
                        {/* Image Container with Overlay */}
                        <div className="aspect-[2/3] relative overflow-hidden">
                          <Image
                            src={item.coverImage}
                            alt={item.title}
                            fill
                            className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                          />
                          
                          {/* Gradient Overlay - Always visible */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          
                          {/* Rank Badge - Floating */}
                          <div 
                            className="absolute top-3 left-3 w-10 h-10 rounded-full shadow-2xl font-black flex items-center justify-center text-sm"
                            style={{ 
                              backgroundColor: 'var(--btn-primary)',
                              color: 'var(--btn-primary-text)'
                            }}
                          >
                            #{index + 1}
                          </div>
                          
                          {/* Rating Badge - Large & Prominent */}
                          <div 
                            className="absolute top-3 right-3 px-4 py-2 rounded-2xl font-black text-white shadow-2xl backdrop-blur-sm"
                            style={{ backgroundColor: colors.color }}
                          >
                            <div className="text-center">
                              <div className="text-2xl leading-none">{item.ratings[sortBy].toFixed(1)}</div>
                              <div className="text-[10px] opacity-90 font-medium">/{10}</div>
                            </div>
                          </div>

                        {/* Title Overlay - Bottom */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="font-bold text-white text-sm md:text-base line-clamp-2 drop-shadow-lg">
                            {item.title}
                          </h3>
                          
                          {/* Category Badge with Icon */}
                          <div 
                            className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg"
                            style={{ 
                              backgroundColor: colors.color,
                              color: '#FFFFFF'
                            }}
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d={categoryInfo[sortBy].icon} />
                            </svg>
                            <span>{categoryInfo[sortBy].label}</span>
                          </div>
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

                  {/* Watchlist Button - Floating */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleAnime(item.id);
                    }}
                    className="absolute bottom-16 right-3 w-10 h-10 rounded-full shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-110 z-10 flex items-center justify-center"
                    style={{
                      backgroundColor: inWatchlist ? '#FF6B9D' : 'rgba(255, 255, 255, 0.9)',
                      color: inWatchlist ? '#FFFFFF' : '#FF6B9D',
                    }}
                    aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                  >
                    <svg 
                      className="w-5 h-5" 
                      fill={inWatchlist ? 'currentColor' : 'none'} 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                );
              })}
            </div>
          )}
        </Container>
      </div>

      {/* Support Section - Redesigned */}
      <div 
        className="py-16"
        style={{ 
          background: 'linear-gradient(135deg, var(--text-block) 0%, var(--background) 100%)'
        }}
      >
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-4">☕</div>
            <h3 
              className="text-3xl font-black mb-4"
              style={{ color: 'var(--foreground)' }}
            >
              Love What You See?
            </h3>
            <p 
              className="text-lg mb-8"
              style={{ color: 'var(--secondary)' }}
            >
              Support us to keep bringing you the best anime reviews and ratings!
            </p>
            <a
              href="https://revolut.me/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 font-bold text-lg rounded-2xl transition-all duration-300 hover:scale-110 shadow-2xl"
              style={{
                backgroundColor: 'var(--rating-overall)',
                color: '#FFFFFF'
              }}
            >
              <span className="text-2xl">☕</span>
              <span>Buy Me a Coffee</span>
            </a>
            <p 
              className="text-sm mt-6"
              style={{ color: 'var(--muted)' }}
            >
              Secure donations via Revolut • Every contribution helps!
            </p>
          </div>
        </Container>
      </div>
    </div>
  );
}
