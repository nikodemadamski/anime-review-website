import fs from 'fs/promises';
import path from 'path';

const ENRICHED_DATA_PATH = path.join(process.cwd(), 'src', 'data', 'anime-enriched.json');

async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchDeepAnimeData(title: string) {
    console.log(`🔍 Searching for: ${title}`);
    try {
        // 1. Search for ID
        const searchRes = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}&limit=1`);
        if (searchRes.status === 429) {
            console.log('⏳ Rate limited (search), waiting...');
            await delay(2000);
            return fetchDeepAnimeData(title);
        }
        const searchData = await searchRes.json();

        if (!searchData.data || searchData.data.length === 0) {
            console.log(`❌ No data found for: ${title}`);
            return null;
        }

        const animeId = searchData.data[0].mal_id;
        await delay(1000); // Wait before next call

        // 2. Fetch Full Details
        console.log(`📥 Fetching full details for ID: ${animeId}`);
        const fullRes = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/full`);
        if (fullRes.status === 429) {
            console.log('⏳ Rate limited (full), waiting...');
            await delay(2000);
            return fetchDeepAnimeData(title);
        }
        const fullData = await fullRes.json();
        const anime = fullData.data;

        return {
            mal_id: anime.mal_id,
            url: anime.url,
            images: anime.images,
            trailer: anime.trailer,
            title: anime.title,
            title_english: anime.title_english,
            title_japanese: anime.title_japanese,
            type: anime.type,
            source: anime.source,
            episodes: anime.episodes,
            status: anime.status,
            airing: anime.airing,
            aired: anime.aired,
            duration: anime.duration,
            rating: anime.rating,
            score: anime.score,
            scored_by: anime.scored_by,
            rank: anime.rank,
            popularity: anime.popularity,
            members: anime.members,
            favorites: anime.favorites,
            synopsis: anime.synopsis,
            background: anime.background,
            season: anime.season,
            year: anime.year,
            broadcast: anime.broadcast,
            producers: anime.producers,
            licensors: anime.licensors,
            studios: anime.studios,
            genres: anime.genres,
            explicit_genres: anime.explicit_genres,
            themes: anime.themes,
            demographics: anime.demographics,
            relations: anime.relations,
            theme: anime.theme,
            external: anime.external,
            streaming: anime.streaming
        };

    } catch (error) {
        console.error(`💥 Error fetching data for ${title}:`, error);
        return null;
    }
}

async function main() {
    try {
        console.log('📦 Loading existing data...');
        const data = await fs.readFile(ENRICHED_DATA_PATH, 'utf-8');
        const animeList = JSON.parse(data);
        const updatedList = [];

        console.log(`🚀 Starting deep scrape for ${animeList.length} anime...`);

        for (const anime of animeList) {
            await delay(1500); // Respectful rate limiting

            const deepData = await fetchDeepAnimeData(anime.title);

            if (deepData) {
                updatedList.push({
                    ...anime,
                    // Merge deep data
                    malId: deepData.mal_id,
                    rank: deepData.rank,
                    popularity: deepData.popularity,
                    members: deepData.members,
                    favorites: deepData.favorites,
                    source: deepData.source,
                    duration: deepData.duration,
                    rating: deepData.rating,
                    season: deepData.season,
                    year: deepData.year,
                    studios: deepData.studios,
                    producers: deepData.producers,
                    licensors: deepData.licensors,
                    background: deepData.background,
                    title_english: deepData.title_english,
                    title_japanese: deepData.title_japanese,
                    // Ensure high-res images
                    coverImage: deepData.images?.jpg?.large_image_url || anime.coverImage,
                    // Ensure accurate stats
                    episodes: deepData.episodes || anime.episodes,
                    status: deepData.status || anime.status,
                    ratings: {
                        ...anime.ratings,
                        site: deepData.score || anime.ratings.site
                    }
                });
                console.log(`✅ Deep updated: ${anime.title} (Rank: #${deepData.rank})`);
            } else {
                updatedList.push(anime);
                console.log(`⚠️ Skipped deep update for ${anime.title}`);
            }
        }

        console.log('💾 Saving enriched data...');
        await fs.writeFile(ENRICHED_DATA_PATH, JSON.stringify(updatedList, null, 2));
        console.log('🎉 Deep scrape complete!');

    } catch (error) {
        console.error('Script failed:', error);
    }
}

main();
