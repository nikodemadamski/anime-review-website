'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if viewport is mobile size
 * Breakpoint at 768px matches Tailwind's md breakpoint
 * @returns boolean indicating if viewport is mobile
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);

    // Cleanup on unmount
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}
