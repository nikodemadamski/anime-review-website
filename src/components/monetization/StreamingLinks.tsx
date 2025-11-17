'use client';

import { useEffect } from 'react';
import { getEnabledPlatforms } from '@/lib/affiliate/config';
import { generateAffiliateLink, trackAffiliateClick, trackAffiliateImpression } from '@/lib/affiliate/link-generator';

interface StreamingLinksProps {
  animeId?: string;
  animeTitle: string;
}

export function StreamingLinks({ animeId, animeTitle }: StreamingLinksProps) {
  const platforms = getEnabledPlatforms();

  useEffect(() => {
    // Track impressions when component mounts
    platforms.forEach(platform => {
      trackAffiliateImpression(platform.platform, animeId);
    });
  }, [animeId, platforms]);

  if (platforms.length === 0) {
    return (
      <div 
        className="rounded-2xl p-6 border-2 text-center"
        style={{
          backgroundColor: 'var(--card-background)',
          borderColor: 'var(--border)'
        }}
      >
        <div className="text-4xl mb-3">📺</div>
        <h3 className="font-bold text-xl mb-2" style={{ color: 'var(--foreground)' }}>
          Where to Watch
        </h3>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Streaming links coming soon! We're working on partnerships with major platforms.
        </p>
      </div>
    );
  }

  return (
    <div 
      className="rounded-2xl p-6 border-2"
      style={{
        backgroundColor: 'var(--card-background)',
        borderColor: 'var(--accent)'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-xl flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
          <span>📺</span>
          <span>Where to Watch</span>
        </h3>
        {platforms.length > 0 && (
          <span 
            className="text-sm font-semibold px-3 py-1 rounded-full"
            style={{ 
              backgroundColor: 'var(--accent)',
              color: '#FFFFFF'
            }}
          >
            Available on {platforms.length} platform{platforms.length > 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {platforms.map((platform) => {
          const affiliateLink = generateAffiliateLink(platform.platform);
          
          return (
            <a
              key={platform.platform}
              href={affiliateLink}
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={() => trackAffiliateClick(platform.platform, animeId, 'detail-page')}
              className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg border-2"
              style={{
                backgroundColor: 'var(--background)',
                borderColor: 'var(--border)'
              }}
            >
              {/* Platform Icon Placeholder */}
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                📺
              </div>
              
              <span className="text-sm font-semibold text-center" style={{ color: 'var(--foreground)' }}>
                {platform.platform}
              </span>
              
              <span className="text-xs" style={{ color: 'var(--accent)' }}>
                Watch Now →
              </span>
            </a>
          );
        })}
      </div>

      {/* Affiliate Disclosure */}
      <p className="text-xs mt-4 text-center" style={{ color: 'var(--muted)' }}>
        We may earn a commission from these links at no extra cost to you.
      </p>
    </div>
  );
}
