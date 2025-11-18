/**
 * Local storage helper functions for browse page view mode persistence
 */

export type ViewMode = 'large' | 'grid' | 'list';

export interface BrowsePreferences {
  viewMode: ViewMode;
  lastUpdated: string;
  version: number;
}

const STORAGE_KEY = 'anime-browse-preferences';
const STORAGE_VERSION = 1;

/**
 * Save view mode preference to local storage
 * @param mode - The view mode to save
 */
export function saveViewMode(mode: ViewMode): void {
  try {
    const preferences: BrowsePreferences = {
      viewMode: mode,
      lastUpdated: new Date().toISOString(),
      version: STORAGE_VERSION,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save view mode preference:', error);
    // Fail silently - localStorage might be unavailable
  }
}

/**
 * Load view mode preference from local storage
 * @returns The saved view mode or 'large' as default
 */
export function loadViewMode(): ViewMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return 'large';

    const preferences: BrowsePreferences = JSON.parse(stored);

    // Validate version
    if (preferences.version !== STORAGE_VERSION) return 'large';

    // Validate view mode value
    if (!['large', 'grid', 'list'].includes(preferences.viewMode)) {
      return 'large';
    }

    return preferences.viewMode;
  } catch (error) {
    console.error('Failed to load view mode preference:', error);
    return 'large'; // Fallback on error
  }
}
