'use client';

import { useState, useRef } from 'react';
import { ViewMode, loadViewMode, saveViewMode } from '@/lib/view-mode-storage';
import { trackViewModeChange } from '@/lib/analytics-events';

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

  // Track previous mode for analytics
  const previousModeRef = useRef<ViewMode>(viewMode);

  const updateViewMode = (mode: ViewMode) => {
    const fromMode = previousModeRef.current;
    setViewMode(mode);
    
    try {
      saveViewMode(mode);
      
      // Track view mode change
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      trackViewModeChange(mode, isMobile, fromMode);
      
      // Update previous mode reference
      previousModeRef.current = mode;
    } catch (error) {
      console.error('Failed to persist view mode:', error);
      // Continue without persistence - state is still updated
    }
  };

  return [viewMode, updateViewMode];
}
