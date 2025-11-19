/**
 * Update Trending Anime Data
 * 
 * This script fetches the latest trending anime from Jikan API (MyAnimeList)
 * and updates the trending-now.csv file used by both homepage and browse page.
 * 
 * Usage: npm run update-trending
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

interface JikanResponse {
    data: JikanAnime[];
    pagination: {
        has_next_page: boolean;
        current_page: number;
    };
}

// Rate limiting helper
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchTrendingAnime() {
    console.log('🔥 Fetching currently trending anime from Jikan API...\n');

    try {
        const allAnime: JikanAnime[] = [];
        let page = 1;
        const maxPages = 2; // Fetch 2 pages (50 anime total)

        // Fetch multiple pages to get more trending anime
        while (page <= maxPages) {
            console.log(`📥 Fetching page ${page}...`);
            
            const response = await fetch(
                `https://api.jikan.moe/v4/top/anime?filter=airing&limit=25&page=${page}`
            );

            if (!response.ok) {
                throw new Error(`Jikan API error: ${response.status} ${response.statusText}`);
            }

            const data: JikanResponse = await response.json();
            allAnime.push(...data.data);

            console.log(`✅ Fetched ${data.data.length} anime from page ${page}`);

            // Check if there are more pages
            if (!data.pagination.has_next_page || page >= maxPages) {
                break;
            }

            page++;

            // Rate limiting: Jikan API allows 3 requests per second, 60 per minute
            // Wait 1 second between requests to be safe
            if (page <= maxPages) {
                console.log('⏳ Waiting 1 second (rate limiting)...');
                await delay(1000);
            }
        }

        console.log(`\n✅ Total fetched: ${allAnime.length} trending anime\n`);

        // Convert to CSV format matching our schema
        const csvRows = [
            // Header matching the format expected by the API
            'id,title,coverImage,site,visual,music,story,character,description,releaseYear,genres,themes,demographics,status,duration,episodes,season,studios,source,rank,popularity,members'
        ];

        for (const anime of allAnime) {
            // Use MAL score as base, generate reasonable variance for other categories
            const baseScore = anime.score || 7.0;
            const site = baseScore;
            
            // Generate ratings with some variance but keep them realistic
            const visual = Math.min(10, Math.max(5, baseScore + (Math.random() * 2 - 1)));
            const music = Math.min(10, Math.max(5, baseScore + (Math.random() * 2 - 1)));
            const story = Math.min(10, Math.max(5, baseScore + (Math.random() * 2 - 1)));
            const character = Math.min(10, Math.max(5, baseScore + (Math.random() * 2 - 1)));

            // Clean and escape data
            const cleanText = (text: string) => `"${text.replace(/"/g, '""').replace(/\n/g, ' ')}"`;
            
            const row = [
                anime.mal_id,
                cleanText(anime.title),
                anime.images.jpg.large_image_url,
                site.toFixed(2),
                visual.toFixed(2),
                music.toFixed(2),
                story.toFixed(2),
                character.toFixed(2),
                cleanText(anime.synopsis || 'No description available.'),
                anime.year || new Date().getFullYear(),
                cleanText(anime.genres.map(g => g.name).join(', ')),
                cleanText(anime.themes.map(t => t.name).join(', ')),
                cleanText(anime.demographics.map(d => d.name).join(', ')),
                cleanText(anime.status || 'Currently Airing'),
                cleanText(anime.duration || 'Unknown'),
                anime.episodes || 0,
                cleanText(anime.season || 'Unknown'),
                cleanText(anime.studios.map(s => s.name).join(', ')),
                cleanText(anime.source || 'Unknown'),
                anime.rank || 0,
                anime.popularity || 0,
                anime.members || 0,
            ].join(',');

            csvRows.push(row);
        }

        // Write to CSV file
        const csvContent = csvRows.join('\n');
        const outputPath = path.join(process.cwd(), 'src', 'data', 'trending-now.csv');

        // Create backup of existing file if it exists
        if (fs.existsSync(outputPath)) {
            const backupPath = path.join(
                process.cwd(), 
                'src', 
                'data', 
                `trending-now.backup.${Date.now()}.csv`
            );
            fs.copyFileSync(outputPath, backupPath);
            console.log(`📦 Created backup: ${path.basename(backupPath)}`);
        }

        fs.writeFileSync(outputPath, csvContent, 'utf-8');

        console.log(`\n✅ Successfully saved trending anime to: ${outputPath}`);
        console.log(`📊 Total anime saved: ${allAnime.length}\n`);

        // Show top 10 trending
        console.log('🏆 Top 10 Trending Anime:');
        console.log('─'.repeat(60));
        allAnime.slice(0, 10).forEach((anime, i) => {
            console.log(`${(i + 1).toString().padStart(2)}. ${anime.title}`);
            console.log(`    Score: ${anime.score} | Members: ${(anime.members / 1000).toFixed(0)}K | Rank: #${anime.rank}`);
        });
        console.log('─'.repeat(60));

        console.log('\n✨ Trending data updated successfully!');
        console.log('💡 The data will be used on both homepage and browse page.');

    } catch (error) {
        console.error('\n❌ Error fetching trending anime:', error);
        if (error instanceof Error) {
            console.error('Error details:', error.message);
        }
        process.exit(1);
    }
}

// Run the script
console.log('╔════════════════════════════════════════════════════════╗');
console.log('║        Anime Review Website - Trending Updater        ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

fetchTrendingAnime();
