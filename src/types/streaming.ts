import { z } from 'zod';

// Streaming Platform Names
export const StreamingPlatforms = {
  CRUNCHYROLL: 'Crunchyroll',
  FUNIMATION: 'Funimation',
  NETFLIX: 'Netflix',
  HULU: 'Hulu',
  AMAZON_PRIME: 'Amazon Prime Video',
  DISNEY_PLUS: 'Disney+',
  HIDIVE: 'HIDIVE',
  VRV: 'VRV',
  YOUTUBE: 'YouTube',
  OTHER: 'Other',
} as const;

export type StreamingPlatformType = (typeof StreamingPlatforms)[keyof typeof StreamingPlatforms];

// Region Codes
export const Regions = {
  US: 'US',
  CA: 'CA',
  UK: 'UK',
  JP: 'JP',
  AU: 'AU',
  DE: 'DE',
  FR: 'FR',
  GLOBAL: 'GLOBAL',
} as const;

export type RegionType = (typeof Regions)[keyof typeof Regions];

// Streaming Link Schema
export const StreamingLinkSchema = z.object({
  id: z.string().uuid(),
  animeId: z.string().uuid(),
  platform: z.string().min(1, 'Platform name is required'),
  url: z.string().url('Platform URL must be valid'),
  regions: z.array(z.string()).min(1, 'At least one region is required'),
  subscriptionRequired: z.boolean(),
  logoUrl: z.string().url('Logo URL must be valid').optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
});

export type StreamingLink = z.infer<typeof StreamingLinkSchema>;

// Streaming Availability (grouped by anime)
export const StreamingAvailabilitySchema = z.object({
  animeId: z.string().uuid(),
  links: z.array(StreamingLinkSchema),
  lastUpdated: z.date(),
});

export type StreamingAvailability = z.infer<typeof StreamingAvailabilitySchema>;