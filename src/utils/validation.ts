import { 
  AnimeSchema, 
  ReviewSchema, 
  StreamingLinkSchema,
  type Anime,
  type Review,
  type StreamingLink 
} from '@/types';

// Validation helper functions
export const validateAnime = (data: unknown): Anime => {
  return AnimeSchema.parse(data);
};

export const validateReview = (data: unknown): Review => {
  return ReviewSchema.parse(data);
};

export const validateStreamingLink = (data: unknown): StreamingLink => {
  return StreamingLinkSchema.parse(data);
};

// Safe validation functions that return results instead of throwing
export const safeValidateAnime = (data: unknown) => {
  return AnimeSchema.safeParse(data);
};

export const safeValidateReview = (data: unknown) => {
  return ReviewSchema.safeParse(data);
};

export const safeValidateStreamingLink = (data: unknown) => {
  return StreamingLinkSchema.safeParse(data);
};

// Utility function to check if a URL is valid
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Utility function to generate UUID (for client-side use)
export const generateId = (): string => {
  return crypto.randomUUID();
};