import { type Anime, type Review, type SearchFilters } from '@/types';

// Pagination helper
export interface PaginationOptions {
  page: number;
  limit: number;
}

export function paginateArray<T>(
  array: T[],
  options: PaginationOptions
): {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
} {
  const { page, limit } = options;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    data: array.slice(startIndex, endIndex),
    pagination: {
      page,
      limit,
      total: array.length,
      totalPages: Math.ceil(array.length / limit),
    },
  };
}

// Search and filter anime
export function filterAnime(anime: Anime[], filters: SearchFilters): Anime[] {
  let filtered = [...anime];

  // Text search
  if (filters.query) {
    const query = filters.query.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.genres.some((genre) => genre.toLowerCase().includes(query))
    );
  }

  // Genre filter
  if (filters.genres && filters.genres.length > 0) {
    filtered = filtered.filter((item) =>
      filters.genres!.some((genre) =>
        item.genres.some((itemGenre) =>
          itemGenre.toLowerCase().includes(genre.toLowerCase())
        )
      )
    );
  }

  // Status filter
  if (filters.status) {
    filtered = filtered.filter((item) => item.status === filters.status);
  }

  // Sorting
  if (filters.sortBy) {
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (filters.sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'releaseYear':
          aValue = a.releaseYear;
          bValue = b.releaseYear;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return filters.sortOrder === 'desc' ? 1 : -1;
      if (aValue > bValue) return filters.sortOrder === 'desc' ? -1 : 1;
      return 0;
    });
  }

  return filtered;
}

// Get unique genres from anime list
export function getUniqueGenres(anime: Anime[]): string[] {
  const allGenres = anime.flatMap((item) => item.genres);
  return [...new Set(allGenres)].sort();
}

// Calculate average rating from reviews
export function calculateAverageRating(reviews: Review[]): {
  visual: number;
  music: number;
  cute: number;
  overall: number;
} {
  if (reviews.length === 0) {
    return { visual: 0, music: 0, cute: 0, overall: 0 };
  }

  const totals = reviews.reduce(
    (acc, review) => ({
      visual: acc.visual + review.ratings.visual,
      music: acc.music + review.ratings.music,
      cute: acc.cute + review.ratings.cute,
    }),
    { visual: 0, music: 0, cute: 0 }
  );

  const visual = Math.round((totals.visual / reviews.length) * 10) / 10;
  const music = Math.round((totals.music / reviews.length) * 10) / 10;
  const cute = Math.round((totals.cute / reviews.length) * 10) / 10;
  const overall = Math.round(((visual + music + cute) / 3) * 10) / 10;

  return { visual, music, cute, overall };
}

// Format date for display
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}