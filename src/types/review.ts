import { z } from 'zod';

// Review Categories
export const ReviewCategories = {
  VISUAL: 'visual',
  MUSIC: 'music',
  CUTE: 'cute',
} as const;

export type ReviewCategoryType = (typeof ReviewCategories)[keyof typeof ReviewCategories];

// Rating Schema (1-10 scale)
const RatingSchema = z.number().int().min(1).max(10);

// Review Ratings Schema
export const ReviewRatingsSchema = z.object({
  visual: RatingSchema,
  music: RatingSchema,
  cute: RatingSchema,
});

export type ReviewRatings = z.infer<typeof ReviewRatingsSchema>;

// Review Schema
export const ReviewSchema = z.object({
  id: z.string().uuid(),
  animeId: z.string().uuid(),
  ratings: ReviewRatingsSchema,
  reviewText: z.string().min(10, 'Review text must be at least 10 characters'),
  reviewerName: z.string().min(1, 'Reviewer name is required'),
  createdAt: z.date(),
});

export type Review = z.infer<typeof ReviewSchema>;

// Aggregated Review Data (for displaying average ratings)
export const AggregatedReviewSchema = z.object({
  animeId: z.string().uuid(),
  totalReviews: z.number().int().min(0),
  averageRatings: ReviewRatingsSchema,
  reviews: z.array(ReviewSchema),
});

export type AggregatedReview = z.infer<typeof AggregatedReviewSchema>;