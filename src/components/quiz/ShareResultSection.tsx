'use client';

import { useState } from 'react';
import { NativeShareButton } from './NativeShareButton';
import { SocialShareButtons } from './SocialShareButtons';

interface ShareResultSectionProps {
  characterName: string;
  characterId: string;
  shareUrl: string;
  imageDataUrl?: string | null;
  onDownload?: () => void;
  isGenerating?: boolean;
}

/**
 * Share Result Section Component
 * 
 * Comprehensive sharing interface that combines:
 * - Native share button (mobile-first, progressive enhancement)
 * - Download button (for manual sharing)
 * - Social share buttons (platform-specific)
 * 
 * Implements the Council's directive for frictionless sharing:
 * "Every extra step reduces conversion by 50%"
 */
export function ShareResultSection({
  characterName,
  characterId,
  shareUrl,
  imageDataUrl,
  onDownload,
  isGenerating = false,
}: ShareResultSectionProps) {
  const [showSocialButtons, setShowSocialButtons] = useState(false);

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
          Share Your Result! 🎉
        </h2>
        <p className="text-base" style={{ color: 'var(--muted)' }}>
          Show your friends which character you got
        </p>
      </div>

      {/* Primary Actions */}
      <div className="space-y-3">
        {/* Native Share Button (Mobile-first) */}
        <NativeShareButton
          characterName={characterName}
          characterId={characterId}
          shareUrl={shareUrl}
          imageDataUrl={imageDataUrl}
          onFallback={() => setShowSocialButtons(true)}
          className="w-full"
        />

        {/* Download Button */}
        <button
          onClick={onDownload}
          disabled={isGenerating || !imageDataUrl}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--btn-primary)',
            color: 'var(--btn-primary-text)',
            minHeight: '56px',
          }}
          aria-label="Download result card"
        >
          {isGenerating ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Generating your card...</span>
            </>
          ) : (
            <>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span>⬇️ Download Card</span>
            </>
          )}
        </button>
      </div>

      {/* Social Share Buttons (Always visible or shown on fallback) */}
      <div className={showSocialButtons ? 'block' : 'hidden sm:block'}>
        <div className="text-center mb-3">
          <p className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>
            Or share directly to:
          </p>
        </div>
        <SocialShareButtons
          characterName={characterName}
          characterId={characterId}
          shareUrl={shareUrl}
        />
      </div>

      {/* Show social buttons toggle for mobile (if native share is available) */}
      {!showSocialButtons && typeof navigator !== 'undefined' && !!navigator.share && (
        <div className="text-center sm:hidden">
          <button
            onClick={() => setShowSocialButtons(true)}
            className="text-sm font-semibold underline transition-colors"
            style={{ color: 'var(--muted)' }}
          >
            More sharing options
          </button>
        </div>
      )}
    </div>
  );
}
