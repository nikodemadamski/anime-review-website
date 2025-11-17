'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
  toggleWatchlist as toggleWatchlistUtil,
  getWatchlistCount,
} from '@/lib/watchlist';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [count, setCount] = useState(0);

  // Load watchlist on mount
  useEffect(() => {
    const loadWatchlist = () => {
      const items = getWatchlist();
      setWatchlist(items);
      setCount(items.length);
    };

    loadWatchlist();

    // Listen for storage events (cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'anime-watchlist') {
        loadWatchlist();
      }
    };

    // Listen for custom watchlist events (same-tab updates)
    const handleWatchlistUpdate = () => {
      loadWatchlist();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('watchlistUpdated', handleWatchlistUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('watchlistUpdated', handleWatchlistUpdate);
    };
  }, []);

  const addAnime = useCallback((animeId: string) => {
    addToWatchlist(animeId);
  }, []);

  const removeAnime = useCallback((animeId: string) => {
    removeFromWatchlist(animeId);
  }, []);

  const toggleAnime = useCallback((animeId: string) => {
    return toggleWatchlistUtil(animeId);
  }, []);

  const checkInWatchlist = useCallback((animeId: string) => {
    return isInWatchlist(animeId);
  }, []);

  return {
    watchlist,
    count,
    addAnime,
    removeAnime,
    toggleAnime,
    isInWatchlist: checkInWatchlist,
  };
}
