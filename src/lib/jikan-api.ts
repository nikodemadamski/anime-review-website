// Jikan API Integration - Free MyAnimeList API
// Documentation: https://docs.api.jikan.moe/

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';

// Rate limiting: Max 3 requests per second, 60 per minute
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface JikanAnime {
  mal_id: number;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  synopsis: string | null;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  favorites: number | null;
  episodes: number | null;
  status: string;
  airing: boolean;
  aired: {
    from: string | null;
    to: string | null;
    string: string;
  };
  duration: string;
  rating: string;
  season: string | null;
  year: number | null;
  studios: Array<{ mal_id: number; name: string }>;
  genres: Array<{ mal_id: number; name: string }>;
  themes: Array<{ mal_id: number; name: string }>;
  demographics: Array<{ mal_id: number; name: string }>;
}

export interface JikanResponse<T> {
  data: T;
  pagination?: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

// Get top anime
export async function getTopAnime(page: number = 1, limit: number = 25) {
  try {
    await delay(350); // Rate limiting
    const response = await fetch(
      `${JIKAN_BASE_URL}/top/anime?page=${page}&limit=${limit}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    
    if (!response.ok) {
      throw new Error(`Jikan API error: ${response.status}`);
    }
    
    const data: JikanResponse<JikanAnime[]> = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching top anime:', error);
    throw error;
  }
}

// Get anime by ID
export async function getAnimeById(id: number) {
  try {
    await delay(350);
    const response = await fetch(
      `${JIKAN_BASE_URL}/anime/${id}`,
      { next: { revalidate: 3600 } }
    );
    
    if (!response.ok) {
      throw new Error(`Jikan API error: ${response.status}`);
    }
    
    const data: JikanResponse<JikanAnime> = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching anime ${id}:`, error);
    throw error;
  }
}

// Search anime
export async function searchAnime(query: string, page: number = 1) {
  try {
    await delay(350);
    const response = await fetch(
      `${JIKAN_BASE_URL}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=25`,
      { next: { revalidate: 3600 } }
    );
    
    if (!response.ok) {
      throw new Error(`Jikan API error: ${response.status}`);
    }
    
    const data: JikanResponse<JikanAnime[]> = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching anime:', error);
    throw error;
  }
}

// Get anime by genre
export async function getAnimeByGenre(genreId: number, page: number = 1) {
  try {
    await delay(350);
    const response = await fetch(
      `${JIKAN_BASE_URL}/anime?genres=${genreId}&page=${page}&limit=25`,
      { next: { revalidate: 3600 } }
    );
    
    if (!response.ok) {
      throw new Error(`Jikan API error: ${response.status}`);
    }
    
    const data: JikanResponse<JikanAnime[]> = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching anime by genre ${genreId}:`, error);
    throw error;
  }
}

// Get seasonal anime
export async function getSeasonalAnime(year: number, season: 'winter' | 'spring' | 'summer' | 'fall') {
  try {
    await delay(350);
    const response = await fetch(
      `${JIKAN_BASE_URL}/seasons/${year}/${season}`,
      { next: { revalidate: 3600 } }
    );
    
    if (!response.ok) {
      throw new Error(`Jikan API error: ${response.status}`);
    }
    
    const data: JikanResponse<JikanAnime[]> = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${season} ${year} anime:`, error);
    throw error;
  }
}

// Get current season anime
export async function getCurrentSeasonAnime() {
  try {
    await delay(350);
    const response = await fetch(
      `${JIKAN_BASE_URL}/seasons/now`,
      { next: { revalidate: 3600 } }
    );
    
    if (!response.ok) {
      throw new Error(`Jikan API error: ${response.status}`);
    }
    
    const data: JikanResponse<JikanAnime[]> = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching current season anime:', error);
    throw error;
  }
}

// Get anime recommendations
export async function getAnimeRecommendations(id: number) {
  try {
    await delay(350);
    const response = await fetch(
      `${JIKAN_BASE_URL}/anime/${id}/recommendations`,
      { next: { revalidate: 3600 } }
    );
    
    if (!response.ok) {
      throw new Error(`Jikan API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching recommendations for anime ${id}:`, error);
    throw error;
  }
}

// Convert Jikan anime to our internal format
export function convertJikanToAnime(jikanAnime: JikanAnime) {
  return {
    id: jikanAnime.mal_id.toString(),
    title: jikanAnime.title,
    englishTitle: jikanAnime.title_english || jikanAnime.title,
    japaneseTitle: jikanAnime.title_japanese || jikanAnime.title,
    image: jikanAnime.images.jpg.large_image_url,
    synopsis: jikanAnime.synopsis || 'No synopsis available.',
    score: jikanAnime.score || 0,
    scoredBy: jikanAnime.scored_by || 0,
    rank: jikanAnime.rank || 0,
    popularity: jikanAnime.popularity || 0,
    members: jikanAnime.members || 0,
    favorites: jikanAnime.favorites || 0,
    episodes: jikanAnime.episodes || 0,
    status: jikanAnime.status,
    airing: jikanAnime.airing,
    aired: jikanAnime.aired.string,
    duration: jikanAnime.duration,
    rating: jikanAnime.rating,
    season: jikanAnime.season,
    year: jikanAnime.year,
    studios: jikanAnime.studios.map(s => s.name),
    genres: jikanAnime.genres.map(g => g.name),
    themes: jikanAnime.themes.map(t => t.name),
    demographics: jikanAnime.demographics.map(d => d.name),
  };
}

// Genre IDs for filtering
export const GENRE_IDS = {
  ACTION: 1,
  ADVENTURE: 2,
  COMEDY: 4,
  DRAMA: 8,
  FANTASY: 10,
  HORROR: 14,
  MYSTERY: 7,
  ROMANCE: 22,
  SCI_FI: 24,
  SLICE_OF_LIFE: 36,
  SPORTS: 30,
  SUPERNATURAL: 37,
  THRILLER: 41,
};
