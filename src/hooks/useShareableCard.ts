'use client';

import { useState, useCallback } from 'react';
import { generateResultCardImage, downloadImage, dataUrlToFile } from '@/lib/image-generator';

interface UseShareableCardOptions {
  elementId: string;
  filename?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface UseShareableCardReturn {
  generateCard: () => Promise<void>;
  downloadCard: () => Promise<void>;
  getShareFile: () => Promise<File | null>;
  imageDataUrl: string | null;
  isGenerating: boolean;
  error: Error | null;
  clearError: () => void;
}

/**
 * Custom hook for managing shareable result card generation and sharing
 * 
 * Handles:
 * - Image generation from DOM element
 * - Download functionality
 * - File conversion for native sharing
 * - Loading and error states
 * 
 * @param options - Configuration options
 * @returns Object with card generation methods and state
 */
export function useShareableCard({
  elementId,
  filename = 'my-anime-character.png',
  onSuccess,
  onError,
}: UseShareableCardOptions): UseShareableCardReturn {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Generate the shareable card image from DOM element
   */
  const generateCard = useCallback(async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const dataUrl = await generateResultCardImage(elementId);
      setImageDataUrl(dataUrl);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      
      if (onError) {
        onError(error);
      }
    } finally {
      setIsGenerating(false);
    }
  }, [elementId, onSuccess, onError]);

  /**
   * Download the generated card image
   */
  const downloadCard = useCallback(async () => {
    if (!imageDataUrl) {
      const error = new Error('No image generated yet. Please generate the card first.');
      setError(error);
      
      if (onError) {
        onError(error);
      }
      return;
    }

    try {
      await downloadImage(imageDataUrl, filename);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Download failed');
      setError(error);
      
      if (onError) {
        onError(error);
      }
    }
  }, [imageDataUrl, filename, onSuccess, onError]);

  /**
   * Get a File object for native sharing (Web Share API)
   */
  const getShareFile = useCallback(async (): Promise<File | null> => {
    if (!imageDataUrl) {
      const error = new Error('No image generated yet. Please generate the card first.');
      setError(error);
      
      if (onError) {
        onError(error);
      }
      return null;
    }

    try {
      const file = await dataUrlToFile(imageDataUrl, filename);
      return file;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('File conversion failed');
      setError(error);
      
      if (onError) {
        onError(error);
      }
      return null;
    }
  }, [imageDataUrl, filename, onError]);

  /**
   * Clear any error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    generateCard,
    downloadCard,
    getShareFile,
    imageDataUrl,
    isGenerating,
    error,
    clearError,
  };
}
