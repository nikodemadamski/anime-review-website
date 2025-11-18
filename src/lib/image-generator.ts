import { toPng } from 'html-to-image';

/**
 * Generate a PNG image from a DOM element
 * 
 * @param elementId - The ID of the DOM element to convert
 * @param options - Optional configuration for image generation
 * @returns Promise resolving to a data URL of the generated image
 */
export async function generateResultCardImage(
  elementId: string,
  options?: {
    quality?: number;
    pixelRatio?: number;
    width?: number;
    height?: number;
  }
): Promise<string> {
  const element = document.getElementById(elementId);
  
  if (!element) {
    throw new Error(`Element with ID "${elementId}" not found`);
  }

  const defaultOptions = {
    quality: 1.0,
    pixelRatio: 2, // Retina quality for high-resolution displays
    width: 1080,
    height: 1920, // Instagram Story dimensions (9:16 ratio)
  };

  const finalOptions = { ...defaultOptions, ...options };

  try {
    // Generate high-quality PNG from DOM element
    const dataUrl = await toPng(element, {
      quality: finalOptions.quality,
      pixelRatio: finalOptions.pixelRatio,
      width: finalOptions.width,
      height: finalOptions.height,
      cacheBust: true, // Prevent caching issues
    });

    return dataUrl;
  } catch (error) {
    console.error('Failed to generate image:', error);
    throw new Error('Image generation failed. Please try again.');
  }
}

/**
 * Download an image from a data URL
 * 
 * @param dataUrl - The data URL of the image to download
 * @param filename - The filename for the downloaded image
 */
export async function downloadImage(
  dataUrl: string,
  filename: string
): Promise<void> {
  try {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Failed to download image:', error);
    throw new Error('Image download failed. Please try again.');
  }
}

/**
 * Convert a data URL to a File object for native sharing
 * 
 * @param dataUrl - The data URL to convert
 * @param filename - The filename for the file
 * @returns Promise resolving to a File object
 */
export async function dataUrlToFile(
  dataUrl: string,
  filename: string
): Promise<File> {
  try {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    return new File([blob], filename, { type: 'image/png' });
  } catch (error) {
    console.error('Failed to convert data URL to file:', error);
    throw new Error('File conversion failed. Please try again.');
  }
}
