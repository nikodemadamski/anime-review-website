/**
 * Fetch Currently Trending Anime from Jikan API
 * 
 * This script fetches the current top airing anime from MyAnimeList via Jikan API
 * and saves them to a CSV file for use in the browse page.
 */

import * as fs from 'fs';
import * as path from 'path';

interface JikanAnime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
  score: number;
  scored_by: number;
  synopsis: string;
  year: number;
  genres: Array<{ name: string }>;
  themes: Array<{ name: string }>;
  demographics: Array<{ name: string }>;
  status: string;
  episodes: number;
  duration: string;
  season: string;
  studios: Array<{ name: string }>;
  source: string;
  rank: number;
  popularity: number;
  members: number;
}

async function fetchTrendingAnime() {
  console.log('🔥 Fetching currently trending anime from Jikan API...\n');

  try {
    // Fetch top airing anime (currently trending)
    const response = await fetch('https://api.jikan.moe/v4/top/anime?filter=airing&limit=25');
    
    if (!response.ok) {
      throw new Error(`Jikan API error: ${response.status}`);
    }

    const data = await response.json();
    const animeList: JikanAnime[] = data.data;

    console.log(`✅ Fetched ${animeList.length} trending anime\n`);

    // Convert to CSV format
    const csvRows = [
      // Header
      'id,title,coverImage,site,visual,music,story,character,description,releaseYear,genres,themes,demographics,status,duration,episodes,season,studios,source,rank,popularity,members'
    ];

    for (const anime of animeList) {
      // Generate ratings (we'll use the MAL score as a base and add some variance)
      const baseScore = anime.score || 7.0;
      const site = baseScore;
      const visual = Math.min(10, baseScore + (Math.random() * 1 - 0.5));
      const music = Math.min(10, baseScore + (Math.random() * 1 - 0.5));
      const story = Math.min(10, baseScore + (Math.random() * 1 - 0.5));
      const character = Math.min(10, baseScore + (Math.random() * 1 - 0.5));

      const row = [
        anime.mal_id,
        `"${anime.title.replace(/"/g, '""')}"`, // Escape quotes
        anime.images.jpg.large_image_url,
        site.toFixed(2),
        visual.toFixed(2),
        music.toFixed(2),
        story.toFixed(2),
        character.toFixed(2),
        `"${(anime.synopsis || 'No description available.').replace(/"/g, '""')}"`,
        anime.year || new Date().getFullYear(),
        `"${anime.genres.map(g => g.name).join(', ')}"`,
        `"${anime.themes.map(t => t.name).join(', ')}"`,
        `"${anime.demographics.map(d => d.name).join(', ')}"`,
        anime.status || 'Currently Airing',
        `"${anime.duration || 'Unknown'}"`,
        anime.episodes || 0,
        anime.season || 'Unknown',
        `"${anime.studios.map(s => s.name).join(', ')}"`,
        anime.source || 'Unknown',
        anime.rank || 0,
        anime.popularity || 0,
        anime.members || 0,
      ].join(',');

      csvRows.push(row);
    }

    // Write to CSV file
    const csvContent = csvRows.join('\n');
    const outputPath = path.join(process.cwd(), 'src', 'data', 'trending-now.csv');
    
    fs.writeFileSync(outputPath, csvContent, 'utf-8');

    console.log(`✅ Saved trending anime to: ${outputPath}`);
    console.log(`📊 Total anime: ${animeList.length}\n`);

    // Show sample
    console.log('Sample trending anime:');
    animeList.slice(0, 5).forEach((anime, i) => {
      console.log(`${i + 1}. ${anime.title} (Score: ${anime.score})`);
    });

  } catch (error) {
    console.error('❌ Error fetching trending anime:', error);
    process.exit(1);
  }
}

// Run the script
fetchTrendingAnime();
