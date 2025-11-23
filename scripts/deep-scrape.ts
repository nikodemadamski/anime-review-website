import fs from 'fs/promises';
import path from 'path';

const ENRICHED_DATA_PATH = path.join(process.cwd(), 'src', 'data', 'anime-enriched.json');

async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchDeepAnimeData(title: string, currentEpisodes?: number) {
    console.log(`🔍 Searching for: ${title}`);
    try {
        // 1. Search for ID - Prioritize TV series
        const searchRes = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}&type=tv&limit=5`);
        if (searchRes.status === 429) {
            console.log('⏳ Rate limited (search), waiting...');
            await delay(2000);
            return fetchDeepAnimeData(title, currentEpisodes);
        }
        const searchData = await searchRes.json();

        if (!searchData.data || searchData.data.length === 0) {
            console.log(`❌ No data found for: ${title}`);
            return null;
        }

        // Find best match (exact title match preferred)
        const bestMatch = searchData.data.find((a: any) =>
            a.title.toLowerCase() === title.toLowerCase() ||
            a.title_english?.toLowerCase() === title.toLowerCase()
        ) || searchData.data[0];

        const animeId = bestMatch.mal_id;
        await delay(1000); // Wait before next call

        // 2. Fetch Full Details
        console.log(`📥 Fetching full details for ID: ${animeId} (${bestMatch.title})`);
        const fullRes = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/full`);
        if (fullRes.status === 429) {
            console.log('⏳ Rate limited (full), waiting...');
            await delay(2000);
            return fetchDeepAnimeData(title, currentEpisodes);
        }
        const fullData = await fullRes.json();
        const anime = fullData.data;

        // 3. Fetch Latest Episode for Ongoing Series
        let latestEpisodes = anime.episodes;
        if (anime.status === 'Currently Airing' || !anime.episodes) {
            console.log(`📺 Fetching latest episode count for ongoing series...`);
            await delay(1000);
            const episodesRes = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/episodes`);
            if (episodesRes.ok) {
                const episodesData = await episodesRes.json();
                const lastPage = episodesData.pagination?.last_visible_page || 1;
                if (lastPage > 1) {
                    // Fetch last page to get the latest episode
                    await delay(1000);
                    const lastPageRes = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/episodes?page=${lastPage}`);
                    if (lastPageRes.ok) {
                        const lastPageData = await lastPageRes.json();
                        if (lastPageData.data && lastPageData.data.length > 0) {
                            latestEpisodes = lastPageData.data[0].mal_id; // Usually mal_id is the episode number for episodes
                        }
                    }
                } else if (episodesData.data && episodesData.data.length > 0) {
                    latestEpisodes = episodesData.data[0].mal_id;
                }
            }
        }

        // 4. Fetch Characters (with URLs)
        console.log(`👥 Fetching characters...`);
        await delay(1000);
        const charsRes = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/characters`);
        let characters = [];
        if (charsRes.ok) {
            const charsData = await charsRes.json();
            characters = charsData.data.slice(0, 20).map((c: any) => ({
                name: c.character.name,
                role: c.role,
                image: c.character.images?.jpg?.image_url,
                url: c.character.url,
                voiceActor: c.voice_actors?.find((v: any) => v.language === 'Japanese') ? {
                    name: c.voice_actors.find((v: any) => v.language === 'Japanese').person.name,
                    image: c.voice_actors.find((v: any) => v.language === 'Japanese').person.images?.jpg?.image_url,
                    language: 'Japanese',
                    url: c.voice_actors.find((v: any) => v.language === 'Japanese').person.url
                } : null
            }));
        }

        // 5. Fetch Recommendations
        console.log(`👍 Fetching recommendations...`);
        await delay(1000);
        const recsRes = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/recommendations`);
        let recommendations = [];
        if (recsRes.ok) {
            const recsData = await recsRes.json();
            recommendations = recsData.data.slice(0, 6).map((r: any) => ({
                id: r.entry.mal_id,
                title: r.entry.title,
                coverImage: r.entry.images?.jpg?.large_image_url || r.entry.images?.jpg?.image_url,
                url: r.entry.url
            }));
        }

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
            episodes: latestEpisodes || anime.episodes, // Use fetched latest episodes
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
            streaming: anime.streaming,
            characters: characters,
            recommendations: recommendations
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

        console.log(`🚀 Starting intelligent deep scrape for ${animeList.length} anime...`);

        for (const anime of animeList) {
            await delay(1500); // Respectful rate limiting

            const deepData = await fetchDeepAnimeData(anime.title, anime.episodes);

            if (deepData) {
                // Protect manual rating
                const protectedSiteRating = (anime.ratings.site && anime.ratings.site > 0)
                    ? anime.ratings.site
                    : (deepData.score || 0);

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
                    // New fields
                    characters: deepData.characters,
                    recommendations: deepData.recommendations,
                    malScore: deepData.score, // Store MAL score separately
                    ratings: {
                        ...anime.ratings,
                        site: protectedSiteRating // Use protected rating
                    }
                });
                console.log(`✅ Deep updated: ${anime.title} (Rank: #${deepData.rank}, Rating Protected)`);
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
