import { z } from 'zod';

// Anime Status Enum
export const AnimeStatus = {
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  UPCOMING: 'upcoming',
} as const;

export type AnimeStatusType = (typeof AnimeStatus)[keyof typeof AnimeStatus];

// Anime Ratings Schema (matching your dataset)
export const AnimeRatingsSchema = z.object({
  music: z.number().min(0).max(10),
  visual: z.number().min(0).max(10),
  story: z.number().min(0).max(10),
  character: z.number().min(0).max(10),
  site: z.number().min(0).max(10),
});

export type AnimeRatings = z.infer<typeof AnimeRatingsSchema>;

// Anime Interface and Schema
export const AnimeSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  coverImage: z.string().url('Cover image must be a valid URL'),
  ratings: AnimeRatingsSchema,
  description: z.string().optional(),
  releaseYear: z.number().int().default(2025),
  genres: z.array(z.string()).default([]),
  themes: z.array(z.string()).default([]),
  demographics: z.array(z.string()).default([]),
  status: z.enum(['ongoing', 'completed', 'upcoming']).default('ongoing'),
  duration: z.string().optional(),
  episodes: z.number().optional(),
  season: z.string().optional(),
  studios: z.array(z.string()).default([]),
  source: z.string().optional(),
  rank: z.number().optional(),
  popularity: z.number().optional(),
  members: z.number().optional(),
  reviews: z.array(z.any()).optional(),
  seasons: z.array(z.object({
    id: z.string(),
    title: z.string(),
    coverImage: z.string().optional(),
    year: z.number().optional(),
    relationType: z.string().optional(),
  })).optional(),

  // New Enriched Fields
  characters: z.array(z.object({
    name: z.string(),
    role: z.string(),
    image: z.string().optional(),
    voiceActor: z.object({
      name: z.string(),
      image: z.string().optional(),
      language: z.string().optional(),
    }).optional(),
  })).optional(),

  music: z.object({
    openings: z.array(z.string()).optional(),
    endings: z.array(z.string()).optional(),
  }).optional(),

  gallery: z.array(z.string()).optional(),

  recommendations: z.array(z.object({
    id: z.number(),
    title: z.string(),
    coverImage: z.string(),
  })).optional(),

  trailer: z.object({
    id: z.string(),
    site: z.string(),
    thumbnail: z.string().optional(),
  }).optional(),

  // Episode Guide
  episodeGuide: z.array(z.object({
    number: z.number(),
    title: z.string(),
    airDate: z.string().optional(),
    score: z.number().optional(),
    filler: z.boolean().optional(),
  })).optional(),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Anime = z.infer<typeof AnimeSchema>;

// Anime List Item (for list view with minimal data)
export const AnimeListItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  coverImage: z.string().url(),
  ratings: AnimeRatingsSchema,
  status: z.enum(['ongoing', 'completed', 'upcoming']).optional(),
  genres: z.array(z.string()).optional(),
});

export type AnimeListItem = z.infer<typeof AnimeListItemSchema>;