// Anime Types
export * from './anime';

// Review Types  
export * from './review';

// Streaming Types
export * from './streaming';

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Component Props Types
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface SearchFilters {
  query?: string;
  genres?: string[];
  status?: string;
  sortBy?: 'title' | 'releaseYear' | 'rating';
  sortOrder?: 'asc' | 'desc';
}