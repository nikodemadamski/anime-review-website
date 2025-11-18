'use client';

import { useState } from 'react';

interface WatchNowButtonProps {
  animeId: string;
  animeTitle: string;
  onWatchNowClick?: (animeId: string) => void;
  className?: string;
}

export function WatchNowButton({ 
  animeId, 
  animeTitle,
  onWatchNowClick,
  className = '' 
}: WatchNowButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    // Track the click event
    if (onWatchNowClick) {
      onWatchNowClick(animeId);
    }
    
    // For MVP, we'll search for the anime on Crunchyroll
    // In production, this would use actual streaming links from the database
    const searchQuery = encodeURIComponent(animeTitle);
    const crunchyrollSearchUrl = `https://www.crunchyroll.com/search?q=${searchQuery}`;
    
    // Open in new tab
    window.open(crunchyrollSearchUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`w-full py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${className}`}
      style={{
        backgroundColor: isHovered ? 'var(--card-background)' : 'transparent',
        color: 'var(--accent)',
        borderWidth: '2px',
        borderColor: 'var(--accent)',
      }}
    >
      <span>▶</span>
      <span>Watch Now</span>
    </button>
  );
}
