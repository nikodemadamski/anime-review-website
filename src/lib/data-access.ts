import Papa from 'papaparse';
import { promises as fs } from 'fs';
import path from 'path';
import { 
  type Anime, 
  type Review, 
  type StreamingLink,
  type AggregatedReview
} from '@/types';
import { 
  validateAnime,
  validateReview,
  validateStreamingLink 
} from '@/utils/validation';

// CSV file paths
const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const ANIME_CSV = path.join(DATA_DIR, 'anime.csv');
const REVIEWS_CSV = path.join(DATA_DIR, 'reviews.csv');
const STREAMING_CSV = path.join(DATA_DIR, 'streaming-links.csv');

// Helper function to read and parse CSV files
async function readCSV<T>(filePath: string, transformer: (row: any) => T): Promise<T[]> {
  try {
    const csvContent = await fs.readFile(filePath, 'utf-8');
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const transformedData = results.data.map(transformer);
            resolve(transformedData);
          } catch (error) {
            reject(error);
          }
        },
        error: (error: any) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error(`Error reading CSV file ${filePath}:`, error);
    return [];
  }
}

// Transform CSV row to Anime object
function transformAnimeRow(row: any): Anime {
  return validateAnime({
    id: row.id,
    title: row.title,
    description: row.description,
    coverImage: row.coverImage,
    releaseYear: parseInt(row.releaseYear),
    genres: row.genres.split(',').map((g: string) => g.trim()),
    status: row.status,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

// Transform CSV row to Review object
function transformReviewRow(row: any): Review {
  return validateReview({
    id: row.id,
    animeId: row.animeId,
    ratings: {
      visual: parseInt(row.visualRating),
      music: parseInt(row.musicRating),
      cute: parseInt(row.cuteRating),
    },
    reviewText: row.reviewText,
    reviewerName: row.reviewerName,
    createdAt: new Date(row.createdAt),
  });
}

// Transform CSV row to StreamingLink object
function transformStreamingRow(row: any): StreamingLink {
  return validateStreamingLink({
    id: row.id,
    animeId: row.animeId,
    platform: row.platform,
    url: row.url,
    regions: row.regions.split(',').map((r: string) => r.trim()),
    subscriptionRequired: row.subscriptionRequired === 'true',
    logoUrl: row.logoUrl,
    isActive: row.isActive === 'true',
    createdAt: new Date(),
  });
}

// Data access functions
export class DataAccess {
  private static animeCache: Anime[] | null = null;
  private static reviewsCache: Review[] | null = null;
  private static streamingCache: StreamingLink[] | null = null;

  // Get all anime
  static async getAllAnime(): Promise<Anime[]> {
    if (!this.animeCache) {
      this.animeCache = await readCSV(ANIME_CSV, transformAnimeRow);
    }
    return this.animeCache;
  }

  // Get anime by ID
  static async getAnimeById(id: string): Promise<Anime | null> {
    const allAnime = await this.getAllAnime();
    return allAnime.find(anime => anime.id === id) || null;
  }

  // Get all reviews
  static async getAllReviews(): Promise<Review[]> {
    if (!this.reviewsCache) {
      this.reviewsCache = await readCSV(REVIEWS_CSV, transformReviewRow);
    }
    return this.reviewsCache;
  }

  // Get reviews by anime ID
  static async getReviewsByAnimeId(animeId: string): Promise<Review[]> {
    const allReviews = await this.getAllReviews();
    return allReviews.filter(review => review.animeId === animeId);
  }

  // Get aggregated reviews for an anime
  static async getAggregatedReviews(animeId: string): Promise<AggregatedReview | null> {
    const reviews = await this.getReviewsByAnimeId(animeId);
    
    if (reviews.length === 0) {
      return null;
    }

    // Calculate average ratings
    const totalVisual = reviews.reduce((sum, review) => sum + review.ratings.visual, 0);
    const totalMusic = reviews.reduce((sum, review) => sum + review.ratings.music, 0);
    const totalCute = reviews.reduce((sum, review) => sum + review.ratings.cute, 0);

    const averageRatings = {
      visual: Math.round((totalVisual / reviews.length) * 10) / 10,
      music: Math.round((totalMusic / reviews.length) * 10) / 10,
      cute: Math.round((totalCute / reviews.length) * 10) / 10,
    };

    return {
      animeId,
      totalReviews: reviews.length,
      averageRatings,
      reviews,
    };
  }

  // Get all streaming links
  static async getAllStreamingLinks(): Promise<StreamingLink[]> {
    if (!this.streamingCache) {
      this.streamingCache = await readCSV(STREAMING_CSV, transformStreamingRow);
    }
    return this.streamingCache;
  }

  // Get streaming links by anime ID
  static async getStreamingLinksByAnimeId(animeId: string): Promise<StreamingLink[]> {
    const allLinks = await this.getAllStreamingLinks();
    return allLinks.filter(link => link.animeId === animeId && link.isActive);
  }

  // Clear cache (useful for development)
  static clearCache(): void {
    this.animeCache = null;
    this.reviewsCache = null;
    this.streamingCache = null;
  }
}