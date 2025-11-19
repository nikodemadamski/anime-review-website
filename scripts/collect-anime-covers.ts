#!/usr/bin/env ts-node

/**
 * Collect Anime Covers Script
 * 
 * This script fetches missing cover images for anime from AniList API
 * and updates the anime-2025.csv file with the cover URLs.
 * 
 * It also saves a backup of cover images to src/data/anime-covers.json
 * for future reference and fallback.
 * 
 * Usage:
 *   npm run collect-covers
 *   or
 *   ts-node scripts/collect-anime-covers.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import Papa from 'papaparse';

const ANIME_CSV = path.join(process.cwd(), 'src', 'data', 'anime-2025.csv');
const COVERS_JSON = path.join(process.cwd(), 'src', 'data', 'anime-covers.json');
const ANILIST_API = 'https://graphql.anilist.co';

interface AnimeRow {
  franchise_root_title: string;
  music_score: string;
  visual_score: string;
  story_score: string;
  character_score: string;
  site_score: string;
  cover_image_url: string;
  cover_image_color: string;
  anilist_title_match: string;
  anilist_page: string;
}

interface CoverData {
  title: string;
  coverUrl: string;
  coverColor: string;
  anilistUrl: string;
  fetchedAt: string;
}

// Rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// AniList GraphQL query
const ANILIST_QUERY = `
query ($search: String) {
  Media(search: $search, type: ANIME) {
    id
    title {
      romaji
      english
      native
    }
    coverImage {
      extraLarge
      large
      medium
      color
    }
    siteUrl
  }
}
`;

async function fetchCoverFromAniList(title: string): Promise<{ url: string; color: string; siteUrl: string } | null> {
  try {
    const response = await fetch(ANILIST_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: ANILIST_QUERY,
        variables: { search: title }
      })
    });

    if (!response.ok) {
      console.error(`   ❌ API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error(`   ❌ GraphQL errors:`, data.errors);
      return null;
    }

    const media = data.data?.Media;
    if (!media) {
      console.error(`   ❌ No results found`);
      return null;
    }

    return {
      url: media.coverImage.extraLarge || media.coverImage.large || media.coverImage.medium || '',
      color: media.coverImage.color || '',
      siteUrl: media.siteUrl || ''
    };
  } catch (error) {
    console.error(`   ❌ Fetch error:`, error);
    return null;
  }
}

async function main() {
  console.log('🎨 Anime Cover Collection Script Starting...\n');

  // Check if CSV exists
  if (!fs.existsSync(ANIME_CSV)) {
    console.error('❌ Error: anime-2025.csv not found at', ANIME_CSV);
    process.exit(1);
  }

  // Read CSV
  console.log('📋 Reading anime-2025.csv...');
  const csvContent = fs.readFileSync(ANIME_CSV, 'utf-8');
  
  const parseResult = Papa.parse<AnimeRow>(csvContent, {
    header: true,
    skipEmptyLines: true
  });

  const rows = parseResult.data;
  console.log(`✅ Found ${rows.length} anime entries\n`);

  // Find anime without covers
  const missingCovers = rows.filter(row => !row.cover_image_url || row.cover_image_url.trim() === '');
  console.log(`🔍 Found ${missingCovers.length} anime without cover images\n`);

  if (missingCovers.length === 0) {
    console.log('✨ All anime already have cover images!');
    return;
  }

  // Load existing covers backup if it exists
  let coversBackup: Record<string, CoverData> = {};
  if (fs.existsSync(COVERS_JSON)) {
    console.log('📦 Loading existing covers backup...');
    coversBackup = JSON.parse(fs.readFileSync(COVERS_JSON, 'utf-8'));
    console.log(`✅ Loaded ${Object.keys(coversBackup).length} existing covers\n`);
  }

  // Fetch missing covers
  console.log('🌐 Fetching missing covers from AniList...\n');
  let fetchedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < missingCovers.length; i++) {
    const anime = missingCovers[i];
    const title = anime.franchise_root_title;
    
    console.log(`[${i + 1}/${missingCovers.length}] ${title}`);

    // Check if we already have it in backup
    if (coversBackup[title]) {
      console.log(`   ✅ Found in backup`);
      anime.cover_image_url = coversBackup[title].coverUrl;
      anime.cover_image_color = coversBackup[title].coverColor;
      anime.anilist_page = coversBackup[title].anilistUrl;
      fetchedCount++;
      continue;
    }

    // Fetch from AniList
    const coverData = await fetchCoverFromAniList(title);
    
    if (coverData && coverData.url) {
      console.log(`   ✅ Fetched: ${coverData.url.substring(0, 60)}...`);
      anime.cover_image_url = coverData.url;
      anime.cover_image_color = coverData.color;
      anime.anilist_page = coverData.siteUrl;
      
      // Save to backup
      coversBackup[title] = {
        title,
        coverUrl: coverData.url,
        coverColor: coverData.color,
        anilistUrl: coverData.siteUrl,
        fetchedAt: new Date().toISOString()
      };
      
      fetchedCount++;
    } else {
      console.log(`   ⚠️  Could not fetch cover`);
      failedCount++;
    }

    // Rate limiting: wait 2 seconds between requests to avoid 429 errors
    if (i < missingCovers.length - 1) {
      await delay(2000);
    }
  }

  console.log(`\n📊 Results:`);
  console.log(`   ✅ Successfully fetched: ${fetchedCount}`);
  console.log(`   ⚠️  Failed: ${failedCount}\n`);

  // Save covers backup
  console.log('💾 Saving covers backup...');
  fs.writeFileSync(COVERS_JSON, JSON.stringify(coversBackup, null, 2));
  console.log(`✅ Saved to ${COVERS_JSON}\n`);

  // Update CSV
  console.log('📝 Updating anime-2025.csv...');
  
  // Create backup
  const backupPath = ANIME_CSV.replace('.csv', `.backup.${Date.now()}.csv`);
  fs.copyFileSync(ANIME_CSV, backupPath);
  console.log(`✅ Backup created: ${backupPath}`);

  // Write updated CSV
  const updatedCsv = Papa.unparse(rows, {
    header: true,
    columns: [
      'franchise_root_title',
      'music_score',
      'visual_score',
      'story_score',
      'character_score',
      'site_score',
      'cover_image_url',
      'cover_image_color',
      'anilist_title_match',
      'anilist_page'
    ]
  });

  fs.writeFileSync(ANIME_CSV, updatedCsv);
  console.log(`✅ Updated anime-2025.csv\n`);

  console.log('✨ Cover collection complete!');
  console.log('💡 Run "npm run update-data" to rebuild the app with new covers\n');
}

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
