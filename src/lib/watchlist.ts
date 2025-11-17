// Watchlist utilities for localStorage management

const WATCHLIST_KEY = 'anime-watchlist';

export interface WatchlistItem {
  id: string;
  addedAt: string;
}

/**
 * Get all watchlist items from localStorage
 */
export function getWatchlist(): string[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(WATCHLIST_KEY);
    if (!stored) return [];
    
    const items: WatchlistItem[] = JSON.parse(stored);
    return items.map(item => item.id);
  } catch (error) {
    console.error('Error reading watchlist:', error);
    return [];
  }
}

/**
 * Add an anime to the watchlist
 */
export function addToWatchlist(animeId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const watchlist = getWatchlist();
    
    // Don't add duplicates
    if (watchlist.includes(animeId)) return;
    
    const items: WatchlistItem[] = watchlist.map(id => ({
      id,
      addedAt: new Date().toISOString(),
    }));
    
    items.push({
      id: animeId,
      addedAt: new Date().toISOString(),
    });
    
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items));
    
    // Dispatch custom event for cross-component updates
    window.dispatchEvent(new CustomEvent('watchlistUpdated', { detail: { animeId, action: 'add' } }));
  } catch (error) {
    console.error('Error adding to watchlist:', error);
  }
}

/**
 * Remove an anime from the watchlist
 */
export function removeFromWatchlist(animeId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const watchlist = getWatchlist();
    const filtered = watchlist.filter(id => id !== animeId);
    
    const items: WatchlistItem[] = filtered.map(id => ({
      id,
      addedAt: new Date().toISOString(),
    }));
    
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items));
    
    // Dispatch custom event for cross-component updates
    window.dispatchEvent(new CustomEvent('watchlistUpdated', { detail: { animeId, action: 'remove' } }));
  } catch (error) {
    console.error('Error removing from watchlist:', error);
  }
}

/**
 * Check if an anime is in the watchlist
 */
export function isInWatchlist(animeId: string): boolean {
  const watchlist = getWatchlist();
  return watchlist.includes(animeId);
}

/**
 * Toggle an anime in the watchlist
 */
export function toggleWatchlist(animeId: string): boolean {
  const inWatchlist = isInWatchlist(animeId);
  
  if (inWatchlist) {
    removeFromWatchlist(animeId);
    return false;
  } else {
    addToWatchlist(animeId);
    return true;
  }
}

/**
 * Get the count of items in the watchlist
 */
export function getWatchlistCount(): number {
  return getWatchlist().length;
}

/**
 * Clear the entire watchlist
 */
export function clearWatchlist(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(WATCHLIST_KEY);
    window.dispatchEvent(new CustomEvent('watchlistUpdated', { detail: { action: 'clear' } }));
  } catch (error) {
    console.error('Error clearing watchlist:', error);
  }
}
