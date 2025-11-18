'use client';

import { useState } from 'react';
import { ShareableResultCard } from './ShareableResultCard';
import { useShareableCard } from '@/hooks/useShareableCard';
import { CharacterResult } from '@/data/quiz-data';

interface ShareableCardDemoProps {
  character: CharacterResult;
}

/**
 * Demo component showing how to integrate ShareableResultCard
 * with image generation and download functionality
 * 
 * This component demonstrates:
 * - Rendering the shareable card
 * - Generating a downloadable image
 * - Handling loading and error states
 * - Download functionality
 */
export function ShareableCardDemo({ character }: ShareableCardDemoProps) {
  const [showDownloadVersion, setShowDownloadVersion] = useState(false);

  const {
    generateCard,
    downloadCard,
    imageDataUrl,
    isGenerating,
    error,
    clearError,
  } = useShareableCard({
    elementId: 'shareable-card',
    filename: `my-anime-character-${character.id}.png`,
    onSuccess: () => {
      console.log('Card generated successfully!');
    },
    onError: (err) => {
      console.error('Card generation failed:', err);
    },
  });

  const handleDownload = async () => {
    // If image not generated yet, generate it first
    if (!imageDataUrl) {
      setShowDownloadVersion(true);
      // Wait for DOM to update with download version
      setTimeout(async () => {
        await generateCard();
        // After generation, download immediately
        setTimeout(async () => {
          await downloadCard();
          setShowDownloadVersion(false);
        }, 100);
      }, 100);
    } else {
      // Image already generated, just download
      await downloadCard();
    }
  };

  return (
    <div className="space-y-6">
      {/* Card Preview */}
      <div className="flex justify-center">
        <div className="max-w-md w-full">
          <ShareableResultCard 
            character={character} 
            showForDownload={showDownloadVersion}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 max-w-md mx-auto">
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className="w-full px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{
            backgroundColor: character.color,
            color: '#FFFFFF',
          }}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating your card...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Result Card
            </>
          )}
        </button>

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-800">Error</p>
                <p className="text-sm text-red-700">{error.message}</p>
                <button
                  onClick={clearError}
                  className="mt-2 text-sm font-semibold text-red-600 hover:text-red-800"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {imageDataUrl && !error && (
          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-semibold text-green-800">Success!</p>
                <p className="text-sm text-green-700">Your card is ready to download</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="max-w-md mx-auto p-4 rounded-lg bg-blue-50 border border-blue-200">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">How it works:</h3>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Click "Download Result Card" to generate your shareable image</li>
          <li>The card will be saved to your device as a PNG file</li>
          <li>Share it on Instagram, Twitter, TikTok, or anywhere you like!</li>
        </ol>
      </div>
    </div>
  );
}
