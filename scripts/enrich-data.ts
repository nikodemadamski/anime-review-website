import fs from 'fs/promises';
import path from 'path';

const ENRICHED_DATA_PATH = path.join(process.cwd(), 'src', 'data', 'anime-enriched.json');

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchJikanData(title: string) {
  console.log(`Fetching Jikan data for: ${title}`);
  try {
    // Search for the anime
    const searchRes = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}&limit=1`);

    if (searchRes.status === 429) {
      console.log('Rate limited, waiting longer...');
      await delay(2000);
      return fetchJikanData(title); // Retry
    }

    const searchData = await searchRes.json();

    if (!searchData.data || searchData.data.length === 0) {
      console.log(`No MAL data found for: ${title}`);
      return null;
    }

    const anime = searchData.data[0];
    return {
      mal_id: anime.mal_id,
      episodes: anime.episodes,
      rank: anime.rank,
      score: anime.score,
      status: anime.status,
      large_image_url: anime.images?.jpg?.large_image_url,
      synopsis: anime.synopsis
    };

  } catch (error) {
    console.error(`Error fetching data for ${title}:`, error);
    return null;
  }
}

async function main() {
  try {
    console.log('📦 Loading existing data...');
    const data = await fs.readFile(ENRICHED_DATA_PATH, 'utf-8');
    const animeList = JSON.parse(data);
    const updatedList = [];

    console.log(`Found ${animeList.length} anime to process.`);

    for (const anime of animeList) {
      await delay(1000); // Rate limiting

      const jikanData = await fetchJikanData(anime.title);

      if (jikanData) {
        updatedList.push({
          ...anime,
          episodes: jikanData.episodes || anime.episodes,
          rank: jikanData.rank || anime.rank,
          // Update cover image to high res if available
          coverImage: jikanData.large_image_url || anime.coverImage,
          // Ensure description is populated if missing
          description: (!anime.description || anime.description.length < 50) ? jikanData.synopsis : anime.description,
          // Fill in missing ratings if needed (simple mapping)
          ratings: {
            ...anime.ratings,
            site: anime.ratings.site || jikanData.score || 0
          }
        });
        console.log(`✅ Updated ${anime.title}`);
      } else {
        updatedList.push(anime);
        console.log(`⚠️ Skipped ${anime.title} (no data)`);
      }
    }

    console.log('💾 Saving updated data...');
    await fs.writeFile(ENRICHED_DATA_PATH, JSON.stringify(updatedList, null, 2));
    console.log('🎉 Successfully enriched anime data!');

  } catch (error) {
    console.error('Script failed:', error);
  }
}

main();
