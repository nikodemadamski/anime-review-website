/**
 * EPISODE ENRICHMENT SCRIPT
 * 
 * Team: Data Scrapers
 * Purpose: Fetch episode guides from MyAnimeList via Jikan API
 * 
 * Features:
 * - Fetches episode titles, air dates, and scores
 * - Merges with existing enriched data
 * - Rate limiting (3 req/sec for Jikan)
 * - Handles pagination for long series
 * - Progress tracking
 */

import fs from 'fs';
import path from 'path';

const ENRICHED_JSON_PATH = path.join(process.cwd(), 'src', 'data', 'anime-enriched.json');
const OUTPUT_PATH = ENRICHED_JSON_PATH;

const CONFIG = {
    RATE_LIMIT_MS: 400,
    MAX_RETRIES: 3,
    RETRY_DELAY_MS: 2000,
    MAX_EPISODES_PER_ANIME: 50, // Limit to avoid huge payloads
};

interface Episode {
    number: number;
    title: string;
    airDate?: string;
    score?: number;
    filler?: boolean;
}

async function searchMALByTitle(title: string): Promise<number | null> {
    try {
        const searchUrl = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}&limit=1`;
        const response = await fetch(searchUrl);

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data: any = await response.json();
        return data.data?.[0]?.mal_id || null;
    } catch (error) {
        console.error(`Failed to search MAL for "${title}":`, error);
        return null;
    }
}

async function fetchEpisodesFromMAL(malId: number, retries = 0): Promise<Episode[]> {
    try {
        // Jikan v4 episodes endpoint
        const response = await fetch(`https://api.jikan.moe/v4/anime/${malId}/episodes`);

        if (!response.ok) {
            if (response.status === 429 && retries < CONFIG.MAX_RETRIES) {
                console.warn(`Rate limited. Waiting ${CONFIG.RETRY_DELAY_MS * (retries + 1)}ms...`);
                await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY_MS * (retries + 1)));
                return fetchEpisodesFromMAL(malId, retries + 1);
            }
            throw new Error(`HTTP ${response.status}`);
        }

        const json: any = await response.json();
        const episodes: Episode[] = [];

        if (json.data && Array.isArray(json.data)) {
            for (const ep of json.data.slice(0, CONFIG.MAX_EPISODES_PER_ANIME)) {
                episodes.push({
                    number: ep.mal_id,
                    title: ep.title || `Episode ${ep.mal_id}`,
                    airDate: ep.aired || undefined,
                    score: ep.score || undefined,
                    filler: ep.filler || false,
                });
            }
        }

        return episodes;
    } catch (error) {
        if (retries < CONFIG.MAX_RETRIES) {
            console.warn(`Retry ${retries + 1}/${CONFIG.MAX_RETRIES} for MAL ID ${malId}...`);
            await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY_MS));
            return fetchEpisodesFromMAL(malId, retries + 1);
        }

        console.error(`Failed to fetch episodes for MAL ID ${malId}:`, error);
        return [];
    }
}

async function main() {
    console.log('📺 Starting Episode Enrichment\n');

    if (!fs.existsSync(ENRICHED_JSON_PATH)) {
        console.error('❌ anime-enriched.json not found!');
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

        // Skip if already has episodes or is a movie
        if (anime.episodeGuide?.length > 0) {
            console.log(`${progress} ⏭️  Skipping ${anime.title}: Already has episodes`);
            skipped++;
            continue;
        }

        if (anime.episodes === 1) {
            console.log(`${progress} ⏭️  Skipping ${anime.title}: Movie (1 episode)`);
            skipped++;
            continue;
        }

        console.log(`${progress} 🔍 Fetching episodes for: ${anime.title}`);

        try {
            // Rate limiting
            if (i > 0) {
                await new Promise(resolve => setTimeout(resolve, CONFIG.RATE_LIMIT_MS));
            }

            // Search for MAL ID
            const malId = await searchMALByTitle(anime.title);

            if (!malId) {
                console.log(`${progress} ⚠️  No MAL ID found`);
                failed++;
                continue;
            }

            // Wait for rate limit
            await new Promise(resolve => setTimeout(resolve, CONFIG.RATE_LIMIT_MS));

            // Fetch episodes
            const episodes = await fetchEpisodesFromMAL(malId);

            if (episodes.length > 0) {
                anime.episodeGuide = episodes;
                console.log(`${progress} ✅ Success: ${episodes.length} episodes`);
                updated++;
            } else {
                console.log(`${progress} ⚠️  No episodes found`);
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

    console.log('\n🎉 Episode enrichment complete!\n');
    console.log(`📊 Results:`);
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`\n📁 Output: ${OUTPUT_PATH}`);
}

main().catch(console.error);
