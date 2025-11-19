import Papa from 'papaparse';
import { promises as fs } from 'fs';
import path from 'path';
import { type Anime, type AnimeListItem } from '@/types';

// Local CSV file path
const CSV_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'anime-2025.csv');

// Load reviews data
const REVIEWS_CSV_PATH = path.join(process.cwd(), 'src', 'data', 'jikan_reviews.csv');
let reviewsData: Map<string, any> | null = null;

async function loadReviewsData(): Promise<Map<string, any>> {
  if (reviewsData) return reviewsData;
  
  try {
    const csvText = await fs.readFile(REVIEWS_CSV_PATH, 'utf-8');
    return new Promise((resolve) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const map = new Map();
          const reviewsByAnime = new Map<string, any[]>();
          
          results.data.forEach((row: any) => {
            const title = row.franchise_root_title;
            if (!title) return;
            
            // Store anime metadata
            if (!map.has(title)) {
              map.set(title, {
                synopsis: row.synopsis || '',
                genres: row.genres ? row.genres.split(',').map((g: string) => g.trim()).filter(Boolean) : [],
                themes: row.themes ? row.themes.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
                demographics: row.demographics ? row.demographics.split(',').map((d: string) => d.trim()).filter(Boolean) : [],
                year: row.year || '2025',
                status: row.status || 'ongoing',
                duration: row.duration || '',
                episodes: row.episodes ? parseInt(row.episodes) : undefined,
                season: row.season || '',
                studios: row.studios ? row.studios.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
                source: row.source || '',
                rank: row.rank ? parseInt(row.rank) : undefined,
                popularity: row.popularity ? parseInt(row.popularity) : undefined,
                members: row.members ? parseInt(row.members) : undefined,
              });
            }
            
            // Store reviews
            if (row.review_content && row.review_username) {
              if (!reviewsByAnime.has(title)) {
                reviewsByAnime.set(title, []);
              }
              reviewsByAnime.get(title)!.push({
                username: row.review_username,
                score: parseFloat(row.review_score) || 0,
                content: row.review_content,
                date: row.review_date,
                isSpoiler: row.is_spoiler === 'True',
                isPreliminary: row.is_preliminary === 'True',
              });
            }
          });
          
          // Add reviews to metadata
          reviewsByAnime.forEach((reviews, title) => {
            const metadata = map.get(title);
            if (metadata) {
              metadata.reviews = reviews;
            }
          });
          
          reviewsData = map;
          resolve(map);
        },
      });
    });
  } catch (error) {
    console.error('Error loading reviews data:', error);
    return new Map();
  }
}

// Transform CSV row to Anime object
function transformAnimeRow(row: any, index: number, reviewsMap: Map<string, any>): Anime {
  const title = row.franchise_root_title || 'Unknown Title';
  const reviewData = reviewsMap.get(title) || {};
  
  // Individual scores are out of 5, convert to 10 for consistency
  const ratings = {
    music: (parseFloat(row.music_score) || 0) * 2,
    visual: (parseFloat(row.visual_score) || 0) * 2,
    story: (parseFloat(row.story_score) || 0) * 2,
    character: (parseFloat(row.character_score) || 0) * 2,
    site: parseFloat(row.site_score) || 0,
  };
  
  return {
    id: String(index + 1),
    title,
    coverImage: row.cover_image_url || 'https://via.placeholder.com/400x600',
    ratings,
    description: reviewData.synopsis || `${title} is a popular anime series from 2025.`,
    releaseYear: parseInt(reviewData.year) || 2025,
    genres: reviewData.genres || [],
    themes: reviewData.themes || [],
    demographics: reviewData.demographics || [],
    status: reviewData.status?.toLowerCase().includes('airing') ? 'ongoing' : 
            reviewData.status?.toLowerCase().includes('finished') ? 'completed' : 'ongoing',
    duration: reviewData.duration,
    episodes: reviewData.episodes,
    season: reviewData.season,
    studios: reviewData.studios || [],
    source: reviewData.source,
    rank: reviewData.rank,
    popularity: reviewData.popularity,
    members: reviewData.members,
    reviews: reviewData.reviews || [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// Read and parse CSV from local file
async function fetchGitHubCSV(): Promise<Anime[]> {
  try {
    const csvText = await fs.readFile(CSV_FILE_PATH, 'utf-8');
    const reviewsMap = await loadReviewsData();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const animeData = results.data.map((row, index) => transformAnimeRow(row, index, reviewsMap));
            resolve(animeData);
          } catch (error) {
            console.error('Error transforming anime data:', error);
            reject(error);
          }
        },
        error: (error: any) => {
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error('Error fetching GitHub CSV:', error);
    return [];
  }
}

// Data access class for GitHub CSV
export class GitHubDataAccess {
  private static animeCache: Anime[] | null = null;
  private static cacheTimestamp: number = 0;
  private static CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Get all anime
  static async getAllAnime(): Promise<Anime[]> {
    const now = Date.now();
    
    // Return cached data if still valid
    if (this.animeCache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
      return this.animeCache;
    }

    // Fetch fresh data
    this.animeCache = await fetchGitHubCSV();
    this.cacheTimestamp = now;
    return this.animeCache;
  }

  // Get anime by ID
  static async getAnimeById(id: string): Promise<Anime | null> {
    const allAnime = await this.getAllAnime();
    return allAnime.find(anime => anime.id === id) || null;
  }

  // Get anime list items (for homepage)
  static async getAnimeListItems(): Promise<AnimeListItem[]> {
    const allAnime = await this.getAllAnime();
    return allAnime.map(anime => ({
      id: anime.id,
      title: anime.title,
      coverImage: anime.coverImage,
      ratings: anime.ratings,
      status: anime.status,
      genres: anime.genres,
    }));
  }

  // Search anime by title
  static async searchAnime(query: string): Promise<Anime[]> {
    const allAnime = await this.getAllAnime();
    const lowerQuery = query.toLowerCase();
    return allAnime.filter(anime => 
      anime.title.toLowerCase().includes(lowerQuery)
    );
  }

  // Get top rated anime with sorting options
  static async getTopRated(limit: number = 10, sortBy: 'site' | 'visual' | 'music' | 'story' | 'character' = 'site'): Promise<Anime[]> {
    const allAnime = await this.getAllAnime();
    return [...allAnime]
      .sort((a, b) => b.ratings[sortBy] - a.ratings[sortBy])
      .slice(0, limit);
  }

  // Get all anime with sorting
  static async getAllAnimeSorted(sortBy: 'site' | 'visual' | 'music' | 'story' | 'character' = 'site'): Promise<Anime[]> {
    const allAnime = await this.getAllAnime();
    return [...allAnime].sort((a, b) => b.ratings[sortBy] - a.ratings[sortBy]);
  }

  // Clear cache (useful for development)
  static clearCache(): void {
    this.animeCache = null;
    this.cacheTimestamp = 0;
  }
}