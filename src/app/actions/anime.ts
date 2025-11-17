'use server';

import { getTopAnime, searchAnime, getAnimeById, getCurrentSeasonAnime, convertJikanToAnime } from '@/lib/jikan-api';

export async function fetchTopAnime(page: number = 1) {
  try {
    const response = await getTopAnime(page, 25);
    return {
      success: true,
      data: response.data.map(convertJikanToAnime),
      pagination: response.pagination,
    };
  } catch (error) {
    console.error('Error in fetchTopAnime:', error);
    return {
      success: false,
      error: 'Failed to fetch top anime',
      data: [],
    };
  }
}

export async function fetchAnimeById(id: string) {
  try {
    const anime = await getAnimeById(parseInt(id));
    return {
      success: true,
      data: convertJikanToAnime(anime),
    };
  } catch (error) {
    console.error(`Error in fetchAnimeById(${id}):`, error);
    return {
      success: false,
      error: 'Failed to fetch anime details',
      data: null,
    };
  }
}

export async function fetchSearchResults(query: string, page: number = 1) {
  try {
    const response = await searchAnime(query, page);
    return {
      success: true,
      data: response.data.map(convertJikanToAnime),
      pagination: response.pagination,
    };
  } catch (error) {
    console.error('Error in fetchSearchResults:', error);
    return {
      success: false,
      error: 'Failed to search anime',
      data: [],
    };
  }
}

export async function fetchCurrentSeason() {
  try {
    const response = await getCurrentSeasonAnime();
    return {
      success: true,
      data: response.data.map(convertJikanToAnime),
    };
  } catch (error) {
    console.error('Error in fetchCurrentSeason:', error);
    return {
      success: false,
      error: 'Failed to fetch current season anime',
      data: [],
    };
  }
}
