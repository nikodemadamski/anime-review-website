// Streaming links utilities
import { StreamingLink } from '@/types/streaming';

/**
 * Get streaming links for a specific anime
 */
export function getStreamingLinks(animeId: string): StreamingLink[] {
  // This would typically fetch from an API or database
  // For now, we'll return mock data that matches the CSV structure
  // In production, this should be loaded from the streaming-links.csv
  return [];
}

/**
 * Get the primary streaming link for an anime (first available)
 */
export function getPrimaryStreamingLink(animeId: string): StreamingLink | null {
  const links = getStreamingLinks(animeId);
  return links.length > 0 ? links[0] : null;
}

/**
 * Check if an anime has streaming links available
 */
export function hasStreamingLinks(animeId: string): boolean {
  return getStreamingLinks(animeId).length > 0;
}
