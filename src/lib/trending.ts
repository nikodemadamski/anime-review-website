// Trending calculation system for anime based on watchlist activity

const WATCHLIST_EVENTS_KEY = 'anime-watchlist-events';
const TRENDING_CACHE_KEY = 'anime-trending-cache';
const TRENDING_CACHE_DURATION = 1000 * 60 * 60; // 1 hour cache

export interface WatchlistEvent {
  animeId: string;
  action: 'add' | 'remove';
  timestamp: number;
}

export interface TrendingAnime {
  animeId: string;
  addCount: number;
  lastAdded: number;
}

/**
 * Track a watchlist event (add or remove)
 */
export function trackWatchlistEvent(animeId: string, action: 'add' | 'remove'): void {
  if (typeof window === 'undefined') return;

  try {
    const events = getWatchlistEvents();
    const newEvent: WatchlistEvent = {
      animeId,
      action,
      timestamp: Date.now(),
    };

    events.push(newEvent);

    // Keep only last 30 days of events to prevent storage bloat
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentEvents = events.filter(e => e.timestamp > thirtyDaysAgo);

    localStorage.setItem(WATCHLIST_EVENTS_KEY, JSON.stringify(recentEvents));

    // Invalidate trending cache when new event is added
    invalidateTrendingCache();
  } catch (error) {
    console.error('Error tracking watchlist event:', error);
  }
}

/**
 * Get all watchlist events from localStorage
 */
export function getWatchlistEvents(): WatchlistEvent[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(WATCHLIST_EVENTS_KEY);
    if (!stored) return [];

    return JSON.parse(stored) as WatchlistEvent[];
  } catch (error) {
    console.error('Error reading watchlist events:', error);
    return [];
  }
}

/**
 * Calculate trending anime based on watchlist additions in the last 7 days
 * Returns array of anime IDs sorted by trending score
 */
export function calculateTrending(limit: number = 6): string[] {
  if (typeof window === 'undefined') return [];

  try {
    // Check cache first
    const cached = getTrendingCache();
    if (cached) {
      return cached.slice(0, limit);
    }

    const events = getWatchlistEvents();
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    // Filter to only 'add' events in the last 7 days
    const recentAdds = events.filter(
      e => e.action === 'add' && e.timestamp > sevenDaysAgo
    );

    // Count additions per anime
    const counts: Record<string, { count: number; lastAdded: number }> = {};

    recentAdds.forEach(event => {
      if (!counts[event.animeId]) {
        counts[event.animeId] = { count: 0, lastAdded: 0 };
      }
      counts[event.animeId].count++;
      counts[event.animeId].lastAdded = Math.max(
        counts[event.animeId].lastAdded,
        event.timestamp
      );
    });

    // Sort by count (descending), then by recency
    const trending = Object.entries(counts)
      .map(([animeId, data]) => ({
        animeId,
        addCount: data.count,
        lastAdded: data.lastAdded,
      }))
      .sort((a, b) => {
        // Primary sort: by count
        if (b.addCount !== a.addCount) {
          return b.addCount - a.addCount;
        }
        // Secondary sort: by recency
        return b.lastAdded - a.lastAdded;
      })
      .map(item => item.animeId);

    // Cache the results
    setTrendingCache(trending);

    return trending.slice(0, limit);
  } catch (error) {
    console.error('Error calculating trending:', error);
    return [];
  }
}

/**
 * Get the number of people currently watching an anime
 * (based on watchlist additions in the last 30 days)
 */
export function getWatchingCount(animeId: string): number {
  if (typeof window === 'undefined') return 0;

  try {
    const events = getWatchlistEvents();
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    // Count net additions (adds - removes) in the last 30 days
    let count = 0;
    events
      .filter(e => e.animeId === animeId && e.timestamp > thirtyDaysAgo)
      .forEach(e => {
        if (e.action === 'add') count++;
        else if (e.action === 'remove') count--;
      });

    return Math.max(0, count);
  } catch (error) {
    console.error('Error getting watching count:', error);
    return 0;
  }
}

/**
 * Check if an anime is currently trending
 */
export function isTrending(animeId: string): boolean {
  const trending = calculateTrending(10); // Check top 10
  return trending.includes(animeId);
}

/**
 * Get trending cache from localStorage
 */
function getTrendingCache(): string[] | null {
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem(TRENDING_CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still valid
    if (now - timestamp < TRENDING_CACHE_DURATION) {
      return data;
    }

    return null;
  } catch (error) {
    console.error('Error reading trending cache:', error);
    return null;
  }
}

/**
 * Set trending cache in localStorage
 */
function setTrendingCache(trending: string[]): void {
  if (typeof window === 'undefined') return;

  try {
    const cache = {
      data: trending,
      timestamp: Date.now(),
    };
    localStorage.setItem(TRENDING_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Error setting trending cache:', error);
  }
}

/**
 * Invalidate trending cache
 */
function invalidateTrendingCache(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(TRENDING_CACHE_KEY);
  } catch (error) {
    console.error('Error invalidating trending cache:', error);
  }
}

/**
 * Clear all watchlist events (for testing/debugging)
 */
export function clearWatchlistEvents(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(WATCHLIST_EVENTS_KEY);
    invalidateTrendingCache();
  } catch (error) {
    console.error('Error clearing watchlist events:', error);
  }
}
