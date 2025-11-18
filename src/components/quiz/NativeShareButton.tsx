'use client';

import { useState, useEffect } from 'react';
import { trackEvent } from '@/lib/analytics-events';

interface NativeShareButtonProps {
  characterName: string;
  characterId: string;
  shareUrl: string;
  imageDataUrl?: string | null;
  onFallback?: () => void;
  className?: string;
}

/**
 * Native Share Button Component
 * 
 * Uses the Web Share API for native mobile sharing experience.
 * Includes the generated image file when supported.
 * Falls back to custom share buttons on unsupported browsers.
 * 
 * Progressive enhancement approach:
 * 1. Try native share with image (best experience)
 * 2. Try native share without image (good experience)
 * 3. Fall back to custom buttons (universal support)
 */
export function NativeShareButton({
  characterName,
  characterId,
  shareUrl,
  imageDataUrl,
  onFallback,
  className = '',
}: NativeShareButtonProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Check if Web Share API is supported
  useEffect(() => {
    setIsSupported(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

  const shareText = `I'm a ${characterName}! Which anime character are you? 🎭✨`;

  /**
   * Handle native share with progressive enhancement
   */
  const handleNativeShare = async () => {
    if (!navigator.share) {
      // Fallback to custom buttons
      if (onFallback) {
        onFallback();
      }
      return;
    }

    setIsSharing(true);

    try {
      // Try to share with image if available
      if (imageDataUrl) {
        const file = await convertDataUrlToFile(imageDataUrl);
        
        // Check if file sharing is supported
        if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `I'm a ${characterName}!`,
            text: shareText,
            url: shareUrl,
            files: [file],
          });

          trackEvent('result_card_shared', {
            platform: 'native',
            characterId,
            characterName,
            includesImage: true,
            timestamp: Date.now(),
          });

          setIsSharing(false);
          return;
        }
      }

      // Fallback: Share without image
      await navigator.share({
        title: `I'm a ${characterName}!`,
        text: shareText,
        url: shareUrl,
      });

      trackEvent('result_card_shared', {
        platform: 'native',
        characterId,
        characterName,
        includesImage: false,
        timestamp: Date.now(),
      });
    } catch (error: any) {
      // User cancelled - don't track as error
      if (error.name === 'AbortError') {
        console.log('User cancelled share');
        setIsSharing(false);
        return;
      }

      // Other errors - fall back to custom buttons
      console.error('Native share failed:', error);
      
      if (onFallback) {
        onFallback();
      }
    } finally {
      setIsSharing(false);
    }
  };

  /**
   * Convert data URL to File object for sharing
   */
  const convertDataUrlToFile = async (dataUrl: string): Promise<File | null> => {
    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'my-anime-character.png', {
        type: 'image/png',
      });
      return file;
    } catch (error) {
      console.error('Failed to convert data URL to file:', error);
      return null;
    }
  };

  // Don't render if not supported
  if (!isSupported) {
    return null;
  }

  return (
    <button
      onClick={handleNativeShare}
      disabled={isSharing}
      className={`flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{
        backgroundColor: '#FF6B9D',
        color: '#FFFFFF',
        minHeight: '56px',
      }}
      aria-label="Share your result"
    >
      {isSharing ? (
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
          <span>Sharing...</span>
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
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          <span>📱 Share Your Result</span>
        </>
      )}
    </button>
  );
}
