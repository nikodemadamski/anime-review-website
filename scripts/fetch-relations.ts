import fs from 'fs/promises';
import path from 'path';

const ENRICHED_DATA_PATH = path.join(process.cwd(), 'src', 'data', 'anime-enriched.json');

async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchRelations(animeId: string, title: string) {
    console.log(`Fetching relations for: ${title}`);
    try {
        // Search for the anime to get the MAL ID
        const searchRes = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}&limit=1`);
        const searchData = await searchRes.json();

        if (!searchData.data || searchData.data.length === 0) {
            console.log(`No MAL data found for: ${title}`);
            return [];
        }

        const malId = searchData.data[0].mal_id;
        await delay(1000); // Rate limiting

        // Fetch relations
        const relationsRes = await fetch(`https://api.jikan.moe/v4/anime/${malId}/relations`);
        const relationsData = await relationsRes.json();

        if (!relationsData.data) return [];

        const seasons: any[] = [];

        for (const relation of relationsData.data) {
            for (const entry of relation.entry) {
                if (entry.type === 'anime') {
                    // Fetch details for this related anime to get the image and year
                    await delay(1000); // Rate limiting
                    const detailsRes = await fetch(`https://api.jikan.moe/v4/anime/${entry.mal_id}`);
                    const details = await detailsRes.json();

                    if (details.data) {
                        seasons.push({
                            id: String(entry.mal_id), // Use MAL ID as ID for now
                            title: entry.name,
                            coverImage: details.data.images?.jpg?.image_url,
                            year: details.data.year || details.data.aired?.prop?.from?.year,
                            relationType: relation.relation
                        });
                    }
                }
            }
        }

        return seasons;

    } catch (error) {
        console.error(`Error fetching relations for ${title}:`, error);
        return [];
    }
}

async function main() {
    try {
        const data = await fs.readFile(ENRICHED_DATA_PATH, 'utf-8');
        const animeList = JSON.parse(data);
        const updatedList = [];

        for (const anime of animeList) {
            const seasons = await fetchRelations(anime.id, anime.title);
            updatedList.push({
                ...anime,
                seasons: seasons
            });
            await delay(1000); // Rate limiting between anime
        }

        await fs.writeFile(ENRICHED_DATA_PATH, JSON.stringify(updatedList, null, 2));
        console.log('Successfully updated anime data with relations!');

    } catch (error) {
        console.error('Script failed:', error);
    }
}

main();
