/**
 * Match trending anime from MAL with existing anime in our database
 * 
 * This utility helps link trending anime to existing anime pages,
 * or creates a fallback link to MAL-based pages.
 */

interface TrendingAnime {
  id: string;
  title: string;
  mal_id?: number;
}

interface ExistingAnime {
  id: string;
  title: string;
}

/**
 * Normalize title for comparison
 * Removes special characters, converts to lowercase, removes common words
 */
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove special chars
    .replace(/\b(the|a|an|season|part|cour)\b/g, '') // Remove common words
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}

/**
 * Calculate similarity between two titles (0-1)
 */
function calculateSimilarity(title1: string, title2: string): number {
  const norm1 = normalizeTitle(title1);
  const norm2 = normalizeTitle(title2);
  
  // Exact match
  if (norm1 === norm2) return 1.0;
  
  // Check if one contains the other
  if (norm1.includes(norm2) || norm2.includes(norm1)) return 0.9;
  
  // Calculate word overlap
  const words1 = new Set(norm1.split(' '));
  const words2 = new Set(norm2.split(' '));
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

/**
 * Find the best matching anime from existing database
 */
export function findMatchingAnime(
  trendingAnime: TrendingAnime,
  existingAnime: ExistingAnime[]
): ExistingAnime | null {
  let bestMatch: ExistingAnime | null = null;
  let bestScore = 0;
  
  for (const anime of existingAnime) {
    const score = calculateSimilarity(trendingAnime.title, anime.title);
    
    // Require at least 70% similarity
    if (score > bestScore && score >= 0.7) {
      bestScore = score;
      bestMatch = anime;
    }
  }
  
  return bestMatch;
}

/**
 * Get the appropriate link for a trending anime
 * Returns existing anime link if found, otherwise MAL-based link
 */
export function getTrendingAnimeLink(
  trendingAnime: TrendingAnime,
  existingAnime: ExistingAnime[]
): string {
  const match = findMatchingAnime(trendingAnime, existingAnime);
  
  if (match) {
    return `/anime/${match.id}`;
  }
  
  // Fallback to MAL-based page if we have MAL ID
  if (trendingAnime.mal_id) {
    return `/anime/mal/${trendingAnime.mal_id}`;
  }
  
  // Last resort: use the trending anime's own ID
  return `/anime/${trendingAnime.id}`;
}
