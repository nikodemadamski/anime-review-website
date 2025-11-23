/**
 * CHARACTER FIX SCRIPT
 * 
 * Team: Data Quality Engineers
 * Purpose: Re-fetch characters with better sorting to ensure protagonists appear first
 * 
 * Issue: Some anime (like One Piece) are missing their main character (Luffy)
 * Solution: Fetch more characters and prioritize MAIN role characters
 */

import fs from 'fs';
import path from 'path';

const ENRICHED_JSON_PATH = path.join(process.cwd(), 'src', 'data', 'anime-enriched.json');

const ANILIST_QUERY = `
query ($id: Int) {
  Media(id: $id, type: ANIME) {
    id
    title {
      romaji
      english
    }
    characters(sort: [ROLE, RELEVANCE, FAVOURITES_DESC], perPage: 25) {
      edges {
        role
        node {
          id
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
  }
}
`;

const CONFIG = {
    RATE_LIMIT_MS: 1500,
    MAX_RETRIES: 3,
    RETRY_DELAY_MS: 2000,
};

async function fetchCharacters(anilistId: number, retries = 0): Promise<any> {
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
                console.warn(`Rate limited. Waiting ${CONFIG.RETRY_DELAY_MS * (retries + 1)}ms...`);
                await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY_MS * (retries + 1)));
                return fetchCharacters(anilistId, retries + 1);
            }
            throw new Error(`HTTP ${response.status}`);
        }

        const json: any = await response.json();

        if (json.errors) {
            throw new Error(`GraphQL Error: ${JSON.stringify(json.errors)}`);
        }

        return json.data.Media;
    } catch (error) {
        if (retries < CONFIG.MAX_RETRIES) {
            console.warn(`Retry ${retries + 1}/${CONFIG.MAX_RETRIES}...`);
            await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY_MS));
            return fetchCharacters(anilistId, retries + 1);
        }
        throw error;
    }
}

async function main() {
    console.log('🔧 Starting Character Fix\n');

    if (!fs.existsSync(ENRICHED_JSON_PATH)) {
        console.error('❌ anime-enriched.json not found!');
        process.exit(1);
    }

    console.log('📂 Loading enriched data...');
    const enrichedData = JSON.parse(fs.readFileSync(ENRICHED_JSON_PATH, 'utf-8'));

    // Find anime that need character fixes (missing main characters or have < 5 characters)
    const needsFix = enrichedData.filter((anime: any) => {
        const charCount = anime.characters?.length || 0;
        return charCount < 5 || !anime.characters?.some((c: any) => c.role === 'MAIN');
    });

    console.log(`\n🎯 Found ${needsFix.length} anime needing character fixes\n`);

    let fixed = 0;
    let failed = 0;

    for (let i = 0; i < needsFix.length; i++) {
        const anime = needsFix[i];
        const progress = `[${i + 1}/${needsFix.length}]`;

        // Extract Anilist ID from banner or cover image URL
        const anilistId = anime.bannerImage?.match(/\/(\d+)-/)?.[1] ||
            anime.coverImage?.match(/\/bx?(\d+)-/)?.[1];

        if (!anilistId) {
            console.log(`${progress} ⚠️  No Anilist ID for ${anime.title}`);
            failed++;
            continue;
        }

        console.log(`${progress} 🔍 Fixing characters for: ${anime.title}`);

        try {
            // Rate limiting
            if (i > 0) {
                await new Promise(resolve => setTimeout(resolve, CONFIG.RATE_LIMIT_MS));
            }

            const apiData = await fetchCharacters(parseInt(anilistId));

            // Transform and prioritize MAIN characters
            const mainChars = apiData.characters.edges
                .filter((edge: any) => edge.role === 'MAIN')
                .map((edge: any) => ({
                    name: edge.node.name.full,
                    role: edge.role,
                    image: edge.node.image?.large,
                    voiceActor: edge.voiceActors?.[0] ? {
                        name: edge.voiceActors[0].name.full,
                        image: edge.voiceActors[0].image?.large,
                        language: edge.voiceActors[0].language || 'Japanese',
                    } : undefined,
                }));

            const supportChars = apiData.characters.edges
                .filter((edge: any) => edge.role !== 'MAIN')
                .slice(0, 8 - mainChars.length)
                .map((edge: any) => ({
                    name: edge.node.name.full,
                    role: edge.role,
                    image: edge.node.image?.large,
                    voiceActor: edge.voiceActors?.[0] ? {
                        name: edge.voiceActors[0].name.full,
                        image: edge.voiceActors[0].image?.large,
                        language: edge.voiceActors[0].language || 'Japanese',
                    } : undefined,
                }));

            // Update with MAIN characters first
            anime.characters = [...mainChars, ...supportChars];

            console.log(`${progress} ✅ Fixed: ${mainChars.length} MAIN + ${supportChars.length} support`);
            fixed++;

        } catch (error: any) {
            console.error(`${progress} ❌ Error: ${error.message}`);
            failed++;
        }

        // Save progress every 10 items
        if ((i + 1) % 10 === 0) {
            console.log(`\n💾 Saving progress (${i + 1}/${needsFix.length})...\n`);
            fs.writeFileSync(ENRICHED_JSON_PATH, JSON.stringify(enrichedData, null, 2));
        }
    }

    // Final save
    console.log(`\n✨ Saving final data...`);
    fs.writeFileSync(ENRICHED_JSON_PATH, JSON.stringify(enrichedData, null, 2));

    console.log('\n🎉 Character fix complete!\n');
    console.log(`📊 Results:`);
    console.log(`   ✅ Fixed: ${fixed}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`\n📁 Output: ${ENRICHED_JSON_PATH}`);
}

main().catch(console.error);
