/**
 * Character Image Utilities
 * 
 * Handles character image loading with fallback support
 */

// Generate fallback avatar URL
export function generateFallbackUrl(name: string, color?: string): string {
  const bgColor = color?.replace('#', '') || 'FF6B9D';
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=${bgColor}`;
}

// Alternative fallback using UI Avatars (initials)
export function generateInitialsUrl(name: string, color?: string): string {
  const bgColor = color?.replace('#', '') || 'FF6B9D';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=${bgColor}&color=fff&bold=true&font-size=0.4`;
}

// Get character image with fallback
export function getCharacterImage(imageUrl: string, name: string, color?: string): {
  primary: string;
  fallback: string;
} {
  return {
    primary: imageUrl,
    fallback: generateFallbackUrl(name, color)
  };
}

// Validate image URL (client-side)
export async function validateImageUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
    
    // Timeout after 5 seconds
    setTimeout(() => resolve(false), 5000);
  });
}
