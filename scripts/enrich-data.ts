/**
 * DATA ENRICHMENT PIPELINE
 * 
 * Team: Data Scrapers + Backend Engineers
 * Purpose: Fetch rich anime data from Anilist API and create a production-ready dataset
 * 
 * Features:
 * - Robust error handling with retry logic
 * - Rate limiting to respect API limits
 * - Progress tracking and resumability
 * - Fallback data for failed requests
 * - Detailed logging
 */

import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

const CSV_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'anime-2025.csv');
const OUTPUT_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'anime-enriched.json');
const PROGRESS_FILE = path.join(process.cwd(), 'src', 'data', '.enrich-progress.json');

// Configuration
const CONFIG = {
  RATE_LIMIT_MS: 1500, // 1.5 seconds between requests (safer than 1s)
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 2000,
  BATCH_SIZE: 10, // Save progress every 10 items
};

const ANILIST_QUERY = `
query ($id: Int) {
  Media(id: $id, type: ANIME) {
    id
    title {
      romaji
      english
      native
    }
    coverImage {
      extraLarge
      large
      color
    }
    bannerImage
    description(asHtml: false)
    season
    seasonYear
    episodes
    duration
    status
    genres
    averageScore
    popularity
    favourites
    studios(isMain: true) {
      nodes {
        name
      }
    }
    characters(sort: ROLE, perPage: 8) {
      edges {
        role
        node {
          name {
            full
          }
          image {
            large
          }
        }
        voiceActors(language: JAPANESE, sort: RELEVANCE) {
          name {
            full
          }
          image {
            large
          }
          language
        }
      }
    }
    trailer {
      id
      site
      thumbnail
    }
    streamingEpisodes {
      title
      thumbnail
    }
    recommendations(sort: RATING_DESC, perPage: 6) {
      nodes {
        mediaRecommendation {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
          }
        }
      }
    }
  }
}
`;

interface ProgressData {
  lastProcessedIndex: number;
  totalItems: number;
  timestamp: string;
}

async function fetchAnilistData(anilistId: number, retries = 0): Promise<any> {
  try {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: ANILIST_QUERY,
        variables: { id: anilistId },
      }),
    });

    if (!response.ok) {
      if (response.status === 429 && retries < CONFIG.MAX_RETRIES) {
        // Rate limited, wait longer and retry
        console.warn(`Rate limited. Waiting ${CONFIG.RETRY_DELAY_MS * (retries + 1)}ms...`);
        await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY_MS * (retries + 1)));
        return fetchAnilistData(anilistId, retries + 1);
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const json: any = await response.json();

    if (json.errors) {
      throw new Error(`GraphQL Error: ${JSON.stringify(json.errors)}`);
    }

    return json.data.Media;
  } catch (error) {
    if (retries < CONFIG.MAX_RETRIES) {
      console.warn(`Retry ${retries + 1}/${CONFIG.MAX_RETRIES} for ID ${anilistId}...`);
      await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY_MS));
      return fetchAnilistData(anilistId, retries + 1);
    }
    throw error;
  }
}

function loadProgress(): ProgressData | null {
  try {
    if (fs.existsSync(PROGRESS_FILE)) {
      return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
    }
  } catch (error) {
    console.warn('Could not load progress file:', error);
  }
  return null;
}

function saveProgress(index: number, total: number) {
  const progress: ProgressData = {
    lastProcessedIndex: index,
    totalItems: total,
    timestamp: new Date().toISOString(),
  };
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function transformAnimeData(row: any, index: number, apiData: any) {
  return {
    id: String(index + 1),
    title: row.franchise_root_title,
    coverImage: apiData.coverImage?.extraLarge || apiData.coverImage?.large || row.cover_image_url,
    bannerImage: apiData.bannerImage,
    description: apiData.description?.replace(/<[^>]*>/g, '') || `${row.franchise_root_title} is an anime series.`,
    releaseYear: apiData.seasonYear || parseInt(row.year) || 2025,
    season: apiData.season?.toLowerCase() || row.season,
    episodes: apiData.episodes || parseInt(row.episodes) || undefined,
    duration: apiData.duration,
    status: apiData.status?.toLowerCase() || 'ongoing',
    genres: apiData.genres || [],
    studios: apiData.studios?.nodes?.map((s: any) => s.name) || [],

    ratings: {
      music: (parseFloat(row.music_score) || 0) * 2,
      visual: (parseFloat(row.visual_score) || 0) * 2,
      story: (parseFloat(row.story_score) || 0) * 2,
      character: (parseFloat(row.character_score) || 0) * 2,
      site: parseFloat(row.site_score) || (apiData.averageScore ? apiData.averageScore / 10 : 0),
    },

    characters: apiData.characters?.edges?.map((edge: any) => ({
      name: edge.node.name.full,
      role: edge.role,
      image: edge.node.image?.large,
      voiceActor: edge.voiceActors?.[0] ? {
        name: edge.voiceActors[0].name.full,
        image: edge.voiceActors[0].image?.large,
        language: edge.voiceActors[0].language || 'Japanese',
      } : undefined,
    })) || [],

    trailer: apiData.trailer ? {
      id: apiData.trailer.id,
      site: apiData.trailer.site,
      thumbnail: apiData.trailer.thumbnail,
    } : undefined,

    recommendations: apiData.recommendations?.nodes
      ?.map((node: any) => ({
        id: node.mediaRecommendation?.id,
        title: node.mediaRecommendation?.title?.english || node.mediaRecommendation?.title?.romaji,
        coverImage: node.mediaRecommendation?.coverImage?.large,
      }))
      .filter((r: any) => r.id) || [],

    gallery: [
      apiData.bannerImage,
      apiData.coverImage?.extraLarge,
      ...(apiData.streamingEpisodes?.slice(0, 4).map((ep: any) => ep.thumbnail) || []),
    ].filter(Boolean),

    music: {
      openings: [],
      endings: [],
    },

    popularity: apiData.popularity,
    favourites: apiData.favourites,
  };
}

function createFallbackData(row: any, index: number) {
  return {
    id: String(index + 1),
    title: row.franchise_root_title,
    coverImage: row.cover_image_url || 'https://via.placeholder.com/400x600',
    description: `${row.franchise_root_title} is an anime series.`,
    releaseYear: 2025,
    genres: [],
    studios: [],
    ratings: {
      music: (parseFloat(row.music_score) || 0) * 2,
      visual: (parseFloat(row.visual_score) || 0) * 2,
      story: (parseFloat(row.story_score) || 0) * 2,
      character: (parseFloat(row.character_score) || 0) * 2,
      site: parseFloat(row.site_score) || 0,
    },
    characters: [],
    recommendations: [],
    gallery: [],
    music: { openings: [], endings: [] },
  };
}

async function main() {
  console.log('🚀 Starting Data Enrichment Pipeline\n');
  console.log('📊 Reading CSV...');

  const csvText = fs.readFileSync(CSV_FILE_PATH, 'utf-8');
  const { data } = Papa.parse(csvText, { header: true, skipEmptyLines: true });

  const progress = loadProgress();
  const startIndex = progress?.lastProcessedIndex ? progress.lastProcessedIndex + 1 : 0;

  let enrichedData: any[] = [];

  // Load existing data if resuming
  if (startIndex > 0 && fs.existsSync(OUTPUT_FILE_PATH)) {
    console.log(`📂 Resuming from index ${startIndex}...`);
    enrichedData = JSON.parse(fs.readFileSync(OUTPUT_FILE_PATH, 'utf-8'));
  }

  console.log(`\n🎯 Processing ${data.length} anime (starting from #${startIndex + 1})\n`);

  for (let index = startIndex; index < data.length; index++) {
    const row: any = data[index];
    const progress = `[${index + 1}/${data.length}]`;

    const anilistUrl = row.anilist_page;
    if (!anilistUrl) {
      console.log(`${progress} ⚠️  Skipping ${row.franchise_root_title}: No Anilist URL`);
      enrichedData.push(createFallbackData(row, index));
      continue;
    }

    const anilistId = parseInt(anilistUrl.split('/').pop() || '0');
    if (isNaN(anilistId) || anilistId === 0) {
      console.log(`${progress} ⚠️  Skipping ${row.franchise_root_title}: Invalid Anilist ID`);
      enrichedData.push(createFallbackData(row, index));
      continue;
    }

    console.log(`${progress} 🔍 Fetching: ${row.franchise_root_title} (ID: ${anilistId})`);

    try {
      // Rate limiting
      if (index > startIndex) {
        await new Promise(resolve => setTimeout(resolve, CONFIG.RATE_LIMIT_MS));
      }

      const apiData = await fetchAnilistData(anilistId);
      const anime = transformAnimeData(row, index, apiData);
      enrichedData.push(anime);

      console.log(`${progress} ✅ Success: ${anime.characters?.length || 0} chars, ${anime.recommendations?.length || 0} recs`);

    } catch (error: any) {
      console.error(`${progress} ❌ Failed: ${error.message}`);
      enrichedData.push(createFallbackData(row, index));
    }

    // Save progress periodically
    if ((index + 1) % CONFIG.BATCH_SIZE === 0) {
      console.log(`\n💾 Saving progress (${index + 1}/${data.length})...\n`);
      fs.writeFileSync(OUTPUT_FILE_PATH, JSON.stringify(enrichedData, null, 2));
      saveProgress(index, data.length);
    }
  }

  console.log(`\n✨ Saving final dataset (${enrichedData.length} anime)...`);
  fs.writeFileSync(OUTPUT_FILE_PATH, JSON.stringify(enrichedData, null, 2));

  // Clean up progress file
  if (fs.existsSync(PROGRESS_FILE)) {
    fs.unlinkSync(PROGRESS_FILE);
  }

  console.log('\n🎉 Data enrichment complete!');
  console.log(`📁 Output: ${OUTPUT_FILE_PATH}`);
}

main().catch(console.error);
