'use client';

import { useState } from 'react';
import { ViewMode, loadViewMode, saveViewMode } from '@/lib/view-mode-storage';

/**
 * Custom hook for managing view mode state with localStorage persistence
 * @returns Tuple of [viewMode, updateViewMode]
 */
export function useViewMode(): [ViewMode, (mode: ViewMode) => void] {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    // Only access localStorage on client side
    if (typeof window === 'undefined') return 'large';
    return loadViewMode();
  });

  const updateViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    try {
      saveViewMode(mode);
    } catch (error) {
      console.error('Failed to persist view mode:', error);
      // Continue without persistence - state is still updated
    }
  };

  return [viewMode, updateViewMode];
}
