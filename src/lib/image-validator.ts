// Image validation utility with fallback system

const FALLBACK_IMAGES = [
  'https://s4.anilist.co/file/anilistcdn/character/large/default.jpg',
  'https://cdn.myanimelist.net/images/questionmark_23.gif',
  'https://via.placeholder.com/230x345/FF6B9D/FFFFFF?text=Anime+Character'
];

/**
 * Validates if an image URL is accessible
 * @param url - Image URL to validate
 * @param timeout - Timeout in milliseconds (default: 5000)
 * @returns Promise<boolean> - true if image loads successfully
 */
export async function validateImageUrl(url: string, timeout: number = 5000): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    const timer = setTimeout(() => {
      img.src = ''; // Cancel loading
      resolve(false);
    }, timeout);

    img.onload = () => {
      clearTimeout(timer);
      resolve(true);
    };

    img.onerror = () => {
      clearTimeout(timer);
      resolve(false);
    };

    img.src = url;
  });
}

/**
 * Gets a valid image URL with fallback system
 * Tries original URL, then up to 3 fallback URLs
 * @param originalUrl - Original image URL to try
 * @returns Promise<string> - Valid image URL
 */
export async function getValidImageUrl(originalUrl: string): Promise<string> {
  // Try original URL first
  const isValid = await validateImageUrl(originalUrl);
  if (isValid) {
    return originalUrl;
  }

  console.warn(`Image failed to load: ${originalUrl}, trying fallbacks...`);

  // Try fallback images
  for (let i = 0; i < Math.min(3, FALLBACK_IMAGES.length); i++) {
    const fallbackUrl = FALLBACK_IMAGES[i];
    const isFallbackValid = await validateImageUrl(fallbackUrl);
    
    if (isFallbackValid) {
      console.log(`Using fallback image ${i + 1}: ${fallbackUrl}`);
      return fallbackUrl;
    }
  }

  // If all fail, return the last fallback (placeholder)
  console.error('All image URLs failed, using final fallback');
  return FALLBACK_IMAGES[FALLBACK_IMAGES.length - 1];
}

/**
 * Preload and validate an image
 * @param url - Image URL to preload
 * @returns Promise<string> - Valid image URL after validation
 */
export async function preloadImage(url: string): Promise<string> {
  return getValidImageUrl(url);
}
