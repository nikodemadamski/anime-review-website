/**
 * MUSIC ENRICHMENT SCRIPT
 * 
 * Team: Data Scrapers
 * Purpose: Fetch opening/ending themes from MyAnimeList via Jikan API
 * 
 * Features:
 * - Fetches OP/ED themes from Jikan API v4
 * - Merges with existing enriched data
 * - Rate limiting (3 req/sec for Jikan)
 * - Retry logic for failed requests
 * - Progress tracking
 */

import fs from 'fs';
import path from 'path';

const ENRICHED_JSON_PATH = path.join(process.cwd(), 'src', 'data', 'anime-enriched.json');
const OUTPUT_PATH = ENRICHED_JSON_PATH; // Update in place

// Jikan API v4 rate limit: 3 requests/second, 60 requests/minute
const CONFIG = {
    RATE_LIMIT_MS: 400, // ~2.5 requests/second (safe margin)
    MAX_RETRIES: 3,
    RETRY_DELAY_MS: 2000,
};

interface MusicData {
    openings: string[];
    endings: string[];
}

async function searchMALByTitle(title: string): Promise<number | null> {
    try {
        const searchUrl = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}&limit=1`;
        const response = await fetch(searchUrl);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data: any = await response.json();

        if (data.data && data.data.length > 0) {
            return data.data[0].mal_id;
        }

        return null;
    } catch (error) {
        console.error(`Failed to search MAL for "${title}":`, error);
        return null;
    }
}

async function fetchMusicFromMAL(malId: number, retries = 0): Promise<MusicData> {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${malId}/themes`);

        if (!response.ok) {
            if (response.status === 429 && retries < CONFIG.MAX_RETRIES) {
                console.warn(`Rate limited. Waiting ${CONFIG.RETRY_DELAY_MS * (retries + 1)}ms...`);
                await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY_MS * (retries + 1)));
                return fetchMusicFromMAL(malId, retries + 1);
            }
            throw new Error(`HTTP ${response.status}`);
        }

        const json: any = await response.json();

        return {
            openings: json.data?.openings || [],
            endings: json.data?.endings || [],
        };
    } catch (error) {
        if (retries < CONFIG.MAX_RETRIES) {
            console.warn(`Retry ${retries + 1}/${CONFIG.MAX_RETRIES} for MAL ID ${malId}...`);
            await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY_MS));
            return fetchMusicFromMAL(malId, retries + 1);
        }

        console.error(`Failed to fetch music for MAL ID ${malId}:`, error);
        return { openings: [], endings: [] };
    }
}

async function main() {
    console.log('🎵 Starting Music Enrichment\n');

    // Load existing enriched data
    if (!fs.existsSync(ENRICHED_JSON_PATH)) {
        console.error('❌ anime-enriched.json not found! Run enrich-data.ts first.');
        process.exit(1);
    }

    console.log('📂 Loading enriched data...');
    const enrichedData = JSON.parse(fs.readFileSync(ENRICHED_JSON_PATH, 'utf-8'));

    console.log(`\n🎯 Processing ${enrichedData.length} anime\n`);

    let updated = 0;
    let skipped = 0;
    let failed = 0;

    for (let i = 0; i < enrichedData.length; i++) {
        const anime = enrichedData[i];
        const progress = `[${i + 1}/${enrichedData.length}]`;

        // Skip if already has music data
        if (anime.music?.openings?.length > 0 || anime.music?.endings?.length > 0) {
            console.log(`${progress} ⏭️  Skipping ${anime.title}: Already has music`);
            skipped++;
            continue;
        }

        console.log(`${progress} 🔍 Fetching music for: ${anime.title}`);

        try {
            // Rate limiting
            if (i > 0) {
                await new Promise(resolve => setTimeout(resolve, CONFIG.RATE_LIMIT_MS));
            }

            // Try to find MAL ID by searching
            const malId = await searchMALByTitle(anime.title);

            if (!malId) {
                console.log(`${progress} ⚠️  No MAL ID found for ${anime.title}`);
                failed++;
                continue;
            }

            // Wait for rate limit
            await new Promise(resolve => setTimeout(resolve, CONFIG.RATE_LIMIT_MS));

            // Fetch music data
            const musicData = await fetchMusicFromMAL(malId);

            // Update anime object
            anime.music = musicData;

            const opCount = musicData.openings.length;
            const edCount = musicData.endings.length;

            if (opCount > 0 || edCount > 0) {
                console.log(`${progress} ✅ Success: ${opCount} OP, ${edCount} ED`);
                updated++;
            } else {
                console.log(`${progress} ⚠️  No themes found`);
                failed++;
            }

        } catch (error: any) {
            console.error(`${progress} ❌ Error: ${error.message}`);
            failed++;
        }

        // Save progress every 10 items
        if ((i + 1) % 10 === 0) {
            console.log(`\n💾 Saving progress (${i + 1}/${enrichedData.length})...\n`);
            fs.writeFileSync(OUTPUT_PATH, JSON.stringify(enrichedData, null, 2));
        }
    }

    // Final save
    console.log(`\n✨ Saving final data...`);
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(enrichedData, null, 2));

    console.log('\n🎉 Music enrichment complete!\n');
    console.log(`📊 Results:`);
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`\n📁 Output: ${OUTPUT_PATH}`);
}

main().catch(console.error);
