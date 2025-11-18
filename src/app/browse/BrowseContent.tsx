'use client';

import { useState, useEffect, useMemo } from 'react';
import { Container, Card, CardContent, Badge } from '@/components/ui';
import { useDebounce } from '@/hooks/useDebounce';
import { useWatchlist } from '@/hooks/useWatchlist';
import { SkeletonGrid } from '@/components/loading/SkeletonGrid';
import { getWatchingCount, isTrending } from '@/lib/trending';
import { EmptyState } from '@/components/browse/EmptyState';
import { WatchNowButton } from '@/components/anime/WatchNowButton';
import { NewsletterPrompt } from '@/components/browse/NewsletterPrompt';
import { TrendingAnimeSection } from '@/components/homepage/TrendingAnimeSection';
import { FilterModal } from '@/components/browse/FilterModal';
import { AnimeCardLarge } from '@/components/browse/AnimeCardLarge';
import { AnimeCardList } from '@/components/browse/AnimeCardList';
import ViewModeToggle from '@/components/browse/ViewModeToggle';
import { useViewMode } from '@/hooks/useViewMode';
import { useIsMobile } from '@/hooks/useIsMobile';
import { 
  trackFilterUsage, 
  trackSearch, 
  trackSortChange, 
  trackWatchlistAction,
  trackWatchNowClick,
  trackNewsletterSignup,
  trackPageView 
} from '@/lib/analytics-events';
import Image from 'next/image';
import Link from 'next/link';

type SortOption = 'site' | 'visual' | 'music' | 'story' | 'character';

const ITEMS_PER_PAGE = 24;

const sortOptions = [
  { value: 'site' as SortOption, label: 'Most Popular', icon: '⭐', color: '#C8A34E' },
  { value: 'visual' as SortOption, label: 'Best Visuals', icon: '🎨', color: '#FF6B9D' },
  { value: 'music' as SortOption, label: 'Best Music', icon: '🎵', color: '#9D4EDD' },
  { value: 'story' as SortOption, label: 'Best Story', icon: '📖', color: '#06B6D4' },
  { value: 'character' as SortOption, label: 'Best Characters', icon: '👥', color: '#F59E0B' },
];

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

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'site' | 'visual' | 'music' | 'story' | 'character';

// Helper function to map sort type to badge variant
function getBadgeVariant(sortBy: SortOption): BadgeVariant {
  const variantMap: Record<SortOption, BadgeVariant> = {
    site: 'site',
    visual: 'visual',
    music: 'music',
    story: 'story',
    character: 'character',
  };
  return variantMap[sortBy];
}

export function BrowseContent() {
  const [allAnime, setAllAnime] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('site');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusOption>('all');
  const [showMoreGenres, setShowMoreGenres] = useState(false);
  const [isSearchSticky, setIsSearchSticky] = useState(false);
  const [page, setPage] = useState(1);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [watchlistAddCount, setWatchlistAddCount] = useState(0);
  const [showNewsletterPrompt, setShowNewsletterPrompt] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { addAnime, removeAnime, isInWatchlist: checkWatchlist } = useWatchlist();
  const [viewMode, updateViewMode] = useViewMode();
  const isMobile = useIsMobile();
  const [savedScrollPosition, setSavedScrollPosition] = useState(0);
  const [previousViewMode, setPreviousViewMode] = useState<'large' | 'grid' | 'list'>(viewMode);

  // Handle scroll position maintenance when view mode changes
  useEffect(() => {
    // Only run if view mode actually changed
    if (previousViewMode === viewMode) {
      return;
    }
    
    // Determine scroll behavior based on view mode transition
    const fromLarge = previousViewMode === 'large';
    const toLarge = viewMode === 'large';
    const gridListTransition = 
      (previousViewMode === 'grid' && viewMode === 'list') ||
      (previousViewMode === 'list' && viewMode === 'grid');
    
    if (toLarge || fromLarge) {
      // Reset scroll to top when switching to/from large view
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setSavedScrollPosition(0);
    } else if (gridListTransition && savedScrollPosition > 0) {
      // Restore scroll position for grid ↔ list transitions
      window.scrollTo({ top: savedScrollPosition, behavior: 'smooth' });
    }
    
    // Update previous view mode for next comparison
    setPreviousViewMode(viewMode);
  }, [viewMode, previousViewMode, savedScrollPosition]);

  // Save scroll position before view mode changes (for grid/list views only)
  useEffect(() => {
    const handleScroll = () => {
      if (viewMode === 'grid' || viewMode === 'list') {
        setSavedScrollPosition(window.scrollY);
      }
    };
    
    // Throttle scroll events to avoid excessive updates
    let timeoutId: NodeJS.Timeout;
    const throttledHandleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 100);
    };
    
    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      clearTimeout(timeoutId);
    };
  }, [viewMode]);

  // Read URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('search')) setSearchQuery(params.get('search')!);
    if (params.get('genres')) setSelectedGenres(params.get('genres')!.split(','));
    if (params.get('sort')) setSortBy(params.get('sort') as SortOption);
    if (params.get('status')) setStatusFilter(params.get('status') as StatusOption);
    if (params.get('page')) setPage(parseInt(params.get('page')!));
    
    // Track page view
    trackPageView('browse', {
      search: params.get('search'),
      genres: params.get('genres'),
      sort: params.get('sort'),
      status: params.get('status'),
    });
  }, []);

  // Sync filters to URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedGenres.length) params.set('genres', selectedGenres.join(','));
    if (sortBy !== 'site') params.set('sort', sortBy);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (page > 1) params.set('page', page.toString());
    
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [searchQuery, selectedGenres, sortBy, statusFilter, page]);

  useEffect(() => {
    async function loadAnime() {
      try {
        const response = await fetch('/api/anime');
        if (!response.ok) {
          // Provide more specific error messages based on status code
          if (response.status === 404) {
            throw new Error('Anime data not found. Please try again later.');
          } else if (response.status === 500) {
            throw new Error('Server error. Our team has been notified.');
          } else if (response.status >= 400 && response.status < 500) {
            throw new Error('Unable to load anime. Please check your connection.');
          } else {
            throw new Error('Network error. Please check your internet connection.');
          }
        }
        const result = await response.json();
        // Handle both array response and object with data property
        const data = result.data || result;
        setAllAnime(Array.isArray(data) ? data : []);
        setError(null); // Clear any previous errors
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unable to load anime. Please try again.';
        setError(errorMessage);
        setAllAnime([]);
        console.error('Failed to load anime:', err);
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
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setAnnouncement('Connection restored');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setAnnouncement('Connection lost. Some features may not work.');
    };
    
    // Set initial state
    setIsOnline(navigator.onLine);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
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

  // Paginated anime
  const paginatedAnime = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredAndSortedAnime.slice(start, end);
  }, [filteredAndSortedAnime, page]);

  const totalPages = Math.ceil(filteredAndSortedAnime.length / ITEMS_PER_PAGE);

  // Generate suggestions for empty state
  const suggestions = useMemo(() => {
    if (filteredAndSortedAnime.length > 0 || !Array.isArray(allAnime)) return [];
    
    // If user has selected genres, show popular anime from those genres
    if (selectedGenres.length > 0) {
      const genreMatches = allAnime
        .filter(anime => 
          anime.genres.some((g: string) => 
            selectedGenres.some(selected => 
              g.toLowerCase().includes(selected.toLowerCase())
            )
          )
        )
        .sort((a, b) => b.ratings.site - a.ratings.site)
        .slice(0, 3);
      
      if (genreMatches.length > 0) return genreMatches;
    }
    
    // Otherwise, show overall most popular anime
    return [...allAnime]
      .sort((a, b) => b.ratings.site - a.ratings.site)
      .slice(0, 3);
  }, [filteredAndSortedAnime, allAnime, selectedGenres]);

  const toggleGenre = (genreId: string) => {
    const isAdding = !selectedGenres.includes(genreId);
    const genreName = [...topGenres, ...moreGenres].find(g => g.id === genreId)?.label || genreId;
    
    setSelectedGenres((prev) =>
      prev.includes(genreId) ? prev.filter((g) => g !== genreId) : [...prev, genreId]
    );
    setPage(1); // Reset to first page when filters change
    
    // Announce filter change
    setAnnouncement(isAdding ? `${genreName} filter added` : `${genreName} filter removed`);
    
    // Track filter usage
    trackFilterUsage('genre', genreId);
  };

  const toggleWatchlist = (animeId: string) => {
    if (checkWatchlist(animeId)) {
      removeAnime(animeId);
      trackWatchlistAction(animeId, 'remove');
    } else {
      addAnime(animeId);
      trackWatchlistAction(animeId, 'add');
      
      // Increment watchlist add count
      const newCount = watchlistAddCount + 1;
      setWatchlistAddCount(newCount);
      
      // Show newsletter prompt after 3 additions
      if (newCount === 3) {
        setShowNewsletterPrompt(true);
      }
    }
  };

  const handleWatchNowClick = (animeId: string, animeTitle: string) => {
    trackWatchNowClick(animeId, animeTitle);
  };

  const handleNewsletterSignup = async (email: string) => {
    try {
      // Call the newsletter API
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }

      // Track successful signup
      trackNewsletterSignup(email, 'browse_prompt');
      
      // Reset watchlist add count
      setWatchlistAddCount(0);
    } catch (error) {
      console.error('Newsletter signup error:', error);
      throw error;
    }
  };

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sortBy, statusFilter]);

  // Track search queries
  useEffect(() => {
    if (debouncedSearch) {
      trackSearch(debouncedSearch, filteredAndSortedAnime.length);
    }
  }, [debouncedSearch, filteredAndSortedAnime.length]);

  // Track sort changes and announce
  useEffect(() => {
    if (sortBy !== 'site') {
      const sortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || sortBy;
      setAnnouncement(`Sorted by ${sortLabel}`);
      trackSortChange(sortBy);
    }
  }, [sortBy]);

  // Track status filter changes and announce
  useEffect(() => {
    if (statusFilter !== 'all') {
      const statusLabel = statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1);
      setAnnouncement(`Filtered by ${statusLabel} status`);
      trackFilterUsage('status', statusFilter);
    }
  }, [statusFilter]);
  
  // Announce result count changes
  useEffect(() => {
    if (!loading && filteredAndSortedAnime.length >= 0) {
      const count = filteredAndSortedAnime.length;
      if (count === 0) {
        setAnnouncement('No anime found matching your filters');
      } else {
        setAnnouncement(`${count} anime ${count === 1 ? 'result' : 'results'} found`);
      }
    }
  }, [filteredAndSortedAnime.length, loading]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedGenres([]);
    setStatusFilter('all');
    setSortBy('site');
    setPage(1);
    
    // Announce filter clear
    setAnnouncement('All filters cleared');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    scrollToTop();
  };

  const hasActiveFilters = Boolean(searchQuery) || selectedGenres.length > 0 || statusFilter !== 'all' || sortBy !== 'site';

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
        <Container size="xl" className="py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-black mb-2" style={{ color: 'var(--foreground)' }}>
              Browse Anime
            </h1>
            <p 
              style={{ color: 'var(--secondary)' }}
              role="status"
              aria-live="polite"
            >
              Loading anime collection...
            </p>
          </div>
          <SkeletonGrid count={12} columns={4} />
        </Container>
      </div>
    );
  }

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    
    // Reload the page to retry fetching data
    window.location.reload();
  };

  if (error) {
    return (
      <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
        <Container size="xl" className="py-12">
          <div 
            className="text-center max-w-md mx-auto p-8 rounded-xl"
            style={{
              backgroundColor: 'var(--card-background)',
              borderWidth: '2px',
              borderColor: 'var(--error)',
            }}
            role="alert"
            aria-live="assertive"
          >
            <div className="text-6xl mb-4" aria-hidden="true">⚠️</div>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>
              Oops! Something went wrong
            </h2>
            <p className="mb-6" style={{ color: 'var(--secondary)' }}>
              {error}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRetry}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleRetry();
                  }
                }}
                aria-label="Retry loading anime"
                className="px-6 py-3 rounded-lg font-medium transition-all"
                style={{
                  backgroundColor: 'var(--btn-primary)',
                  color: '#FFFFFF',
                }}
              >
                🔄 Retry
              </button>
              <a
                href="/"
                className="px-6 py-3 rounded-lg font-medium transition-all"
                style={{
                  backgroundColor: 'var(--card-background)',
                  color: 'var(--foreground)',
                  borderWidth: '2px',
                  borderColor: 'var(--border)',
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                Go Home
              </a>
            </div>
            
            {/* Connection status indicator */}
            <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
              <p 
                className="text-sm" 
                style={{ color: 'var(--muted)' }}
                role="status"
                aria-live="polite"
              >
                Connection status: {isOnline ? '🟢 Online' : '🔴 Offline'}
              </p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      <Container size="lg" className="py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-black mb-2" style={{ color: 'var(--foreground)' }}>
                Browse Anime
              </h1>
              <p style={{ color: 'var(--secondary)' }}>
                Discover and explore our collection of {allAnime.length} anime titles
              </p>
            </div>
            
            {/* Connection status indicator - only show when offline */}
            {!isOnline && (
              <div 
                className="px-3 py-2 rounded-lg flex items-center gap-2"
                style={{
                  backgroundColor: 'var(--error)',
                  color: '#FFFFFF',
                }}
                role="status"
                aria-live="polite"
              >
                <span aria-hidden="true">🔴</span>
                <span className="text-sm font-medium">Offline</span>
              </div>
            )}
          </div>
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
        <Container size="lg">
          <div className="relative">
            <label htmlFor="anime-search" className="sr-only">
              Search anime by title, description, or genre
            </label>
            <input
              id="anime-search"
              type="text"
              placeholder="Search anime by title, description, or genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search anime by title, description, or genre"
              aria-describedby="search-results-count"
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

      {/* Trending Section */}
      <TrendingAnimeSection allAnime={allAnime} />

      {/* Sort and Filter Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <span className="font-semibold" style={{ color: 'var(--foreground)' }} id="sort-label">
            Sort by:
          </span>
          
          {/* Filter Button */}
          <button
            onClick={() => setShowFilterModal(true)}
            className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
            style={{
              backgroundColor: 'var(--card-background)',
              color: 'var(--foreground)',
              borderWidth: '2px',
              borderColor: 'var(--border)',
            }}
            aria-label={`Open filters${(selectedGenres.length + (statusFilter !== 'all' ? 1 : 0)) > 0 ? ` (${selectedGenres.length + (statusFilter !== 'all' ? 1 : 0)} active)` : ''}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filters</span>
            {(selectedGenres.length + (statusFilter !== 'all' ? 1 : 0)) > 0 && (
              <span 
                className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: '#FFFFFF',
                }}
              >
                {selectedGenres.length + (statusFilter !== 'all' ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Sort Options */}
        <div>
          <div className="flex flex-wrap gap-3" role="group" aria-label="Sort options">
            {sortOptions.map((option) => {
              const isActive = sortBy === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSortBy(option.value);
                    }
                  }}
                  aria-label={`Sort by ${option.label}`}
                  aria-pressed={isActive}
                  aria-describedby="sort-label"
                  className={`px-4 py-3 rounded-lg font-medium transition-all min-h-[44px] min-w-[80px] flex items-center gap-2 active:scale-95 ${
                    isActive ? 'ring-2 ring-offset-2' : ''
                  }`}
                  style={{
                    backgroundColor: isActive ? option.color : 'var(--card-background)',
                    color: isActive ? '#FFFFFF' : 'var(--foreground)',
                    borderWidth: '2px',
                    borderColor: isActive ? option.color : 'var(--border)',
                    boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.15)' : 'none',
                    ['--tw-ring-color' as any]: isActive ? option.color : 'transparent',
                  }}
                >
                  <span aria-hidden="true">{option.icon}</span>
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Genre Filters - with border */}
        <div className="pb-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <span className="font-semibold mb-3 block" style={{ color: 'var(--foreground)' }} id="genre-label">
            Genres:
          </span>
          <div className="flex flex-wrap gap-3" role="group" aria-label="Genre filters">
            {topGenres.map((genre) => {
              const isActive = selectedGenres.includes(genre.id);
              return (
                <button
                  key={genre.id}
                  onClick={() => toggleGenre(genre.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleGenre(genre.id);
                    }
                  }}
                  aria-label={`Filter by ${genre.label} genre`}
                  aria-pressed={isActive}
                  aria-describedby="genre-label"
                  className={`px-4 py-3 rounded-full text-sm font-medium transition-all min-h-[44px] flex items-center gap-1 active:scale-95 ${
                    isActive ? 'shadow-lg scale-105' : 'hover:scale-102'
                  }`}
                  style={{
                    backgroundColor: isActive ? 'var(--accent)' : 'var(--card-background)',
                    color: isActive ? '#FFFFFF' : 'var(--foreground)',
                    borderWidth: '2px',
                    borderColor: isActive ? 'var(--accent)' : 'var(--border)',
                  }}
                >
                  {isActive && <span className="text-white" aria-hidden="true">✓</span>}
                  <span aria-hidden="true">{genre.icon}</span> {genre.label}
                </button>
              );
            })}
            
            {/* More Genres Button */}
            <button
              onClick={() => setShowMoreGenres(!showMoreGenres)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setShowMoreGenres(!showMoreGenres);
                } else if (e.key === 'Escape' && showMoreGenres) {
                  e.preventDefault();
                  setShowMoreGenres(false);
                }
              }}
              aria-label={showMoreGenres ? 'Hide additional genres' : 'Show more genres'}
              aria-expanded={showMoreGenres}
              aria-controls="more-genres-panel"
              className="px-4 py-3 rounded-full text-sm font-medium transition-all min-h-[44px] flex items-center gap-1 active:scale-95"
              style={{
                backgroundColor: 'var(--card-background)',
                color: 'var(--foreground)',
                borderWidth: '2px',
                borderColor: 'var(--border)',
              }}
            >
              More Genres <span aria-hidden="true">{showMoreGenres ? '▲' : '▼'}</span>
            </button>
          </div>
          
          {/* More Genres Dropdown/Bottom Sheet */}
          {showMoreGenres && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setShowMoreGenres(false)}
                aria-hidden="true"
              />
              
              {/* Mobile Bottom Sheet */}
              <div 
                id="more-genres-panel"
                role="dialog"
                aria-label="Additional genre filters"
                className="fixed bottom-0 left-0 right-0 z-50 md:hidden animate-slide-up"
              >
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
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          e.preventDefault();
                          setShowMoreGenres(false);
                        }
                      }}
                      aria-label="Close genre panel"
                      className="text-2xl w-8 h-8 flex items-center justify-center"
                      style={{ color: 'var(--secondary)' }}
                    >
                      <span aria-hidden="true">✕</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3" role="group" aria-label="Additional genres">
                    {moreGenres.map((genre) => {
                      const isActive = selectedGenres.includes(genre.id);
                      return (
                        <button
                          key={genre.id}
                          onClick={() => toggleGenre(genre.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              toggleGenre(genre.id);
                            }
                          }}
                          aria-label={`Filter by ${genre.label} genre`}
                          aria-pressed={isActive}
                          className={`px-4 py-3 rounded-full text-sm font-medium transition-all min-h-[44px] flex items-center gap-1 active:scale-95 ${
                            isActive ? 'shadow-lg scale-105' : ''
                          }`}
                          style={{
                            backgroundColor: isActive ? 'var(--accent)' : 'var(--text-block)',
                            color: isActive ? '#FFFFFF' : 'var(--foreground)',
                            borderWidth: '2px',
                            borderColor: isActive ? 'var(--accent)' : 'transparent',
                          }}
                        >
                          {isActive && <span className="text-white" aria-hidden="true">✓</span>}
                          <span aria-hidden="true">{genre.icon}</span> {genre.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Desktop Dropdown */}
              <div 
                id="more-genres-panel"
                role="region"
                aria-label="Additional genre filters"
                className="hidden md:block mt-2 p-4 rounded-xl" 
                style={{
                  backgroundColor: 'var(--card-background)',
                  borderWidth: '2px',
                  borderColor: 'var(--border)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div className="flex flex-wrap gap-3" role="group" aria-label="Additional genres">
                  {moreGenres.map((genre) => {
                    const isActive = selectedGenres.includes(genre.id);
                    return (
                      <button
                        key={genre.id}
                        onClick={() => toggleGenre(genre.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleGenre(genre.id);
                          } else if (e.key === 'Escape') {
                            e.preventDefault();
                            setShowMoreGenres(false);
                          }
                        }}
                        aria-label={`Filter by ${genre.label} genre`}
                        aria-pressed={isActive}
                        className={`px-4 py-3 rounded-full text-sm font-medium transition-all min-h-[44px] flex items-center gap-1 active:scale-95 ${
                          isActive ? 'shadow-lg scale-105' : ''
                        }`}
                        style={{
                          backgroundColor: isActive ? 'var(--accent)' : 'var(--text-block)',
                          color: isActive ? '#FFFFFF' : 'var(--foreground)',
                          borderWidth: '2px',
                          borderColor: isActive ? 'var(--accent)' : 'transparent',
                        }}
                      >
                        {isActive && <span className="text-white" aria-hidden="true">✓</span>}
                        <span aria-hidden="true">{genre.icon}</span> {genre.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Status Filter */}
        <div>
          <span className="font-semibold mb-3 block" style={{ color: 'var(--foreground)' }} id="status-label">
            Status:
          </span>
          <div className="flex flex-wrap gap-3" role="group" aria-label="Status filters">
            {(['all', 'airing', 'finished', 'upcoming'] as StatusOption[]).map((status) => {
              const isActive = statusFilter === status;
              const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setStatusFilter(status);
                    }
                  }}
                  aria-label={`Filter by ${statusLabel} status`}
                  aria-pressed={isActive}
                  aria-describedby="status-label"
                  className="px-4 py-3 rounded-lg font-medium transition-all min-h-[44px] min-w-[80px] active:scale-95"
                  style={{
                    backgroundColor: isActive ? 'var(--btn-primary)' : 'var(--card-background)',
                    color: isActive ? 'var(--btn-primary-text)' : 'var(--foreground)',
                    borderWidth: '2px',
                    borderColor: isActive ? 'var(--btn-primary)' : 'var(--border)',
                    boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.15)' : 'none',
                  }}
                >
                  {statusLabel}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Count and Clear Filters */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        {/* Results count */}
        <p 
          id="search-results-count"
          className="text-lg font-semibold" 
          role="status" 
          aria-live="polite" 
          aria-atomic="true"
          style={{ color: 'var(--foreground)' }}
        >
          Showing {filteredAndSortedAnime.length} of {allAnime.length} anime
        </p>
        
        {/* Clear filters button - only show if filters active */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                clearAllFilters();
              }
            }}
            aria-label="Clear all active filters and reset search"
            className="px-4 py-2 rounded-lg font-medium transition-all"
            style={{
              backgroundColor: 'var(--text-block)',
              color: 'var(--accent)',
            }}
          >
            ✕ Clear all filters
          </button>
        )}
      </div>

      {/* View Mode Toggle - Mobile Only */}
      {isMobile && (
        <ViewModeToggle 
          currentMode={viewMode} 
          onChange={updateViewMode}
        />
      )}

      {/* Anime Display - Large View, List View, or Grid */}
      {viewMode === 'large' ? (
        <div 
          className="flex flex-col gap-6 transition-opacity transition-transform duration-200 ease-in-out animate-fade-in"
          style={{ willChange: 'opacity, transform' }}
          role="list"
          aria-label="Anime results"
        >
          {paginatedAnime.map((anime, index) => (
            <AnimeCardLarge
              key={anime.id}
              anime={anime}
              onWatchlistToggle={toggleWatchlist}
              onWatchNowClick={handleWatchNowClick}
              isInWatchlist={checkWatchlist(anime.id)}
              imageError={imageErrors[anime.id]}
              onImageError={() => setImageErrors(prev => ({ ...prev, [anime.id]: true }))}
            />
          ))}
        </div>
      ) : viewMode === 'list' ? (
        <div 
          className="flex flex-col gap-2 transition-opacity transition-transform duration-200 ease-in-out animate-fade-in"
          style={{ willChange: 'opacity, transform' }}
          role="list"
          aria-label="Anime results"
        >
          {paginatedAnime.map((anime, index) => {
            const rank = (page - 1) * ITEMS_PER_PAGE + index + 1;
            return (
              <AnimeCardList
                key={anime.id}
                anime={anime}
                rank={rank}
                imageError={imageErrors[anime.id]}
                onImageError={() => setImageErrors(prev => ({ ...prev, [anime.id]: true }))}
              />
            );
          })}
        </div>
      ) : (
        <div 
          className={`grid ${viewMode === 'grid' && isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'} transition-opacity transition-transform duration-200 ease-in-out animate-fade-in`}
          style={{ willChange: 'opacity, transform' }}
          role="list"
          aria-label="Anime results"
        >
          {paginatedAnime.map((anime, index) => {
            const isGridView = viewMode === 'grid' && isMobile;
            
            return (
              <Card 
                key={anime.id}
                role="listitem"
                className="group transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.05] active:scale-[1.02]"
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
                <Link href={`/anime/${anime.id}`} className="block">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-t-xl">
                    <Image
                      src={imageErrors[anime.id] ? '/characters/placeholder.svg' : anime.coverImage}
                      alt={anime.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      loading={index < 4 ? 'eager' : 'lazy'}
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2YwZjBmMCIvPjwvc3ZnPg=="
                      onError={() => setImageErrors(prev => ({ ...prev, [anime.id]: true }))}
                    />
                    
                    {/* Social Proof Badge - Top Left */}
                    {(() => {
                      const watchingCount = getWatchingCount(anime.id);
                      const trending = isTrending(anime.id);
                      
                      if (watchingCount > 0 || trending) {
                        return (
                          <div className="absolute top-2 left-2">
                            <div 
                              className="px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm flex items-center gap-1"
                              style={{
                                backgroundColor: trending ? 'rgba(239, 68, 68, 0.9)' : 'rgba(0, 0, 0, 0.7)',
                                color: '#FFFFFF',
                              }}
                            >
                              {trending && <span>🔥</span>}
                              {watchingCount > 0 && (
                                <span>{watchingCount} watching</span>
                              )}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}
                    
                    {/* Rating Badge - Top Right */}
                    <div className="absolute top-2 right-2">
                      <Badge variant={getBadgeVariant(sortBy)}>{anime.ratings[sortBy].toFixed(1)}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <h3 className={`font-bold text-base mb-2 ${isGridView ? 'line-clamp-1' : 'line-clamp-2'} group-hover:underline`} style={{ color: 'var(--foreground)' }}>
                      {anime.title}
                    </h3>
                    {/* Hide genre tags in grid view mode */}
                    {!isGridView && (
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
                    )}
                  </CardContent>
                </Link>
                {/* Hide action buttons in grid view mode */}
                {!isGridView && (
                  <CardContent className="p-3 pt-0">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWatchlist(anime.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleWatchlist(anime.id);
                        }
                      }}
                      aria-label={checkWatchlist(anime.id) ? `Remove ${anime.title} from watchlist` : `Add ${anime.title} to watchlist`}
                      aria-pressed={checkWatchlist(anime.id)}
                      className="w-full py-2 rounded-lg font-medium transition-all mb-2 min-h-[40px] text-sm active:scale-95"
                      style={{
                        backgroundColor: checkWatchlist(anime.id) ? 'var(--accent)' : 'var(--btn-primary)',
                        color: '#FFFFFF',
                      }}
                    >
                      <span aria-hidden="true">{checkWatchlist(anime.id) ? '✓' : '+'}</span> {checkWatchlist(anime.id) ? 'In Watchlist' : 'Add to Watchlist'}
                    </button>
                    <WatchNowButton 
                      animeId={anime.id}
                      animeTitle={anime.title}
                      onWatchNowClick={(id) => handleWatchNowClick(id, anime.title)}
                    />
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {filteredAndSortedAnime.length === 0 && (
        <EmptyState 
          onClearFilters={clearAllFilters}
          suggestions={suggestions}
          hasActiveFilters={hasActiveFilters}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Pagination navigation" className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(page - 1)}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && page > 1) {
                e.preventDefault();
                handlePageChange(page - 1);
              }
            }}
            disabled={page === 1}
            aria-label="Go to previous page"
            aria-disabled={page === 1}
            className="px-4 py-2 rounded-lg font-medium transition-all min-h-[44px] min-w-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: page === 1 ? 'var(--card-background)' : 'var(--btn-primary)',
              color: page === 1 ? 'var(--secondary)' : '#FFFFFF',
              borderWidth: '2px',
              borderColor: 'var(--border)',
            }}
          >
            <span aria-hidden="true">←</span> Previous
          </button>

          {/* Page Numbers */}
          <div className="flex gap-2 flex-wrap justify-center">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handlePageChange(pageNum);
                    }
                  }}
                  aria-label={`Go to page ${pageNum}`}
                  aria-current={page === pageNum ? 'page' : undefined}
                  className="px-4 py-2 rounded-lg font-medium transition-all min-h-[44px] min-w-[44px]"
                  style={{
                    backgroundColor: page === pageNum ? 'var(--accent)' : 'var(--card-background)',
                    color: page === pageNum ? '#FFFFFF' : 'var(--foreground)',
                    borderWidth: '2px',
                    borderColor: page === pageNum ? 'var(--accent)' : 'var(--border)',
                    boxShadow: page === pageNum ? '0 2px 8px rgba(0, 0, 0, 0.15)' : 'none',
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(page + 1)}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && page < totalPages) {
                e.preventDefault();
                handlePageChange(page + 1);
              }
            }}
            disabled={page === totalPages}
            aria-label="Go to next page"
            aria-disabled={page === totalPages}
            className="px-4 py-2 rounded-lg font-medium transition-all min-h-[44px] min-w-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: page === totalPages ? 'var(--card-background)' : 'var(--btn-primary)',
              color: page === totalPages ? 'var(--secondary)' : '#FFFFFF',
              borderWidth: '2px',
              borderColor: 'var(--border)',
            }}
          >
            Next <span aria-hidden="true">→</span>
          </button>
        </nav>
      )}
      </Container>

      {/* Newsletter Prompt */}
      {showNewsletterPrompt && (
        <NewsletterPrompt
          onClose={() => setShowNewsletterPrompt(false)}
          onSignup={handleNewsletterSignup}
        />
      )}
      
      {/* Filter Modal */}
      <FilterModal isOpen={showFilterModal} onClose={() => setShowFilterModal(false)}>
        <div className="space-y-6">
          {/* Genre Filters */}
          <div>
            <span className="font-semibold mb-3 block" style={{ color: 'var(--foreground)' }} id="modal-genre-label">
              Genres:
            </span>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Genre filters">
              {[...topGenres, ...moreGenres].map((genre) => {
                const isActive = selectedGenres.includes(genre.id);
                return (
                  <button
                    key={genre.id}
                    onClick={() => toggleGenre(genre.id)}
                    aria-label={`Filter by ${genre.label} genre`}
                    aria-pressed={isActive}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                      isActive ? 'shadow-lg scale-105' : ''
                    }`}
                    style={{
                      backgroundColor: isActive ? 'var(--accent)' : 'var(--card-background)',
                      color: isActive ? '#FFFFFF' : 'var(--foreground)',
                      borderWidth: '2px',
                      borderColor: isActive ? 'var(--accent)' : 'var(--border)',
                    }}
                  >
                    {isActive && <span className="text-white" aria-hidden="true">✓</span>}
                    <span aria-hidden="true">{genre.icon}</span> {genre.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <span className="font-semibold mb-3 block" style={{ color: 'var(--foreground)' }} id="modal-status-label">
              Status:
            </span>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Status filters">
              {(['all', 'airing', 'finished', 'upcoming'] as StatusOption[]).map((status) => {
                const isActive = statusFilter === status;
                const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    aria-label={`Filter by ${statusLabel} status`}
                    aria-pressed={isActive}
                    className="px-4 py-2 rounded-lg font-medium transition-all"
                    style={{
                      backgroundColor: isActive ? 'var(--btn-primary)' : 'var(--card-background)',
                      color: isActive ? 'var(--btn-primary-text)' : 'var(--foreground)',
                      borderWidth: '2px',
                      borderColor: isActive ? 'var(--btn-primary)' : 'var(--border)',
                    }}
                  >
                    {statusLabel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Apply Button */}
          <button
            onClick={() => setShowFilterModal(false)}
            className="w-full py-3 rounded-lg font-medium transition-all"
            style={{
              backgroundColor: 'var(--btn-primary)',
              color: '#FFFFFF',
            }}
          >
            Apply Filters
          </button>
        </div>
      </FilterModal>
      
      {/* Screen Reader Announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
    </div>
  );
}
