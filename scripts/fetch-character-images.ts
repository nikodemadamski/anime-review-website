/**
 * Character Image Fetcher
 * 
 * This script fetches character images from the Jikan API (MyAnimeList)
 * and updates the character data with working image URLs.
 * 
 * Usage: npx ts-node scripts/fetch-character-images.ts
 */

import { characterResults, type CharacterResult } from '../src/data/quiz-data';
import * as fs from 'fs';
import * as path from 'path';

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';
const RATE_LIMIT_DELAY = 350; // ms between requests (Jikan limit: 3 req/sec)

// Delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate fallback avatar URL using DiceBear
function generateFallbackUrl(name: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
}

// Search for character on Jikan API
async function searchCharacter(name: string): Promise<string | null> {
  try {
    console.log(`🔍 Searching for: ${name}`);
    
    const response = await fetch(
      `${JIKAN_BASE_URL}/characters?q=${encodeURIComponent(name)}&limit=1`
    );
    
    if (!response.ok) {
      console.log(`   ❌ API error: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      const imageUrl = data.data[0].images?.jpg?.image_url;
      if (imageUrl) {
        console.log(`   ✅ Found image: ${imageUrl.substring(0, 50)}...`);
        return imageUrl;
      }
    }
    
    console.log(`   ⚠️  No image found`);
    return null;
  } catch (error) {
    console.log(`   ❌ Error: ${error}`);
    return null;
  }
}

// Validate that an image URL works
async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (response.status !== 200) return false;
    
    const contentType = response.headers.get('content-type');
    return contentType?.startsWith('image/') || false;
  } catch {
    return false;
  }
}

// Main function
async function fetchAllCharacterImages() {
  console.log('🚀 Starting character image fetcher...\n');
  console.log(`📊 Total characters: ${characterResults.length}\n`);
  
  const results: {
    character: CharacterResult;
    newImageUrl: string;
    source: 'existing' | 'jikan' | 'fallback';
    valid: boolean;
  }[] = [];
  
  for (let i = 0; i < characterResults.length; i++) {
    const char = characterResults[i];
    console.log(`\n[${i + 1}/${characterResults.length}] ${char.name} (${char.anime})`);
    
    let imageUrl = char.image;
    let source: 'existing' | 'jikan' | 'fallback' = 'existing';
    let isValid = false;
    
    // Check if current image is a placeholder
    const isPlaceholder = imageUrl.includes('placeholder') || imageUrl.includes('via.placeholder');
    
    if (isPlaceholder) {
      console.log(`   🔄 Placeholder detected, fetching from API...`);
      
      // Try to fetch from Jikan
      const jikanUrl = await searchCharacter(char.name);
      await delay(RATE_LIMIT_DELAY);
      
      if (jikanUrl) {
        // Validate the Jikan URL
        isValid = await validateImageUrl(jikanUrl);
        if (isValid) {
          imageUrl = jikanUrl;
          source = 'jikan';
        }
      }
      
      // If Jikan failed, use fallback
      if (!isValid) {
        console.log(`   🎨 Using fallback avatar`);
        imageUrl = generateFallbackUrl(char.name);
        source = 'fallback';
        isValid = true; // Fallback is always valid
      }
    } else {
      // Validate existing URL
      console.log(`   ✓ Checking existing URL...`);
      isValid = await validateImageUrl(imageUrl);
      
      if (!isValid) {
        console.log(`   ❌ Existing URL broken, fetching new one...`);
        
        // Try Jikan
        const jikanUrl = await searchCharacter(char.name);
        await delay(RATE_LIMIT_DELAY);
        
        if (jikanUrl) {
          isValid = await validateImageUrl(jikanUrl);
          if (isValid) {
            imageUrl = jikanUrl;
            source = 'jikan';
          }
        }
        
        // Fallback if still invalid
        if (!isValid) {
          console.log(`   🎨 Using fallback avatar`);
          imageUrl = generateFallbackUrl(char.name);
          source = 'fallback';
          isValid = true;
        }
      } else {
        console.log(`   ✅ Existing URL is valid`);
      }
    }
    
    results.push({
      character: char,
      newImageUrl: imageUrl,
      source,
      valid: isValid
    });
  }
  
  // Generate report
  console.log('\n\n📊 SUMMARY REPORT\n');
  console.log('='.repeat(50));
  
  const existing = results.filter(r => r.source === 'existing').length;
  const jikan = results.filter(r => r.source === 'jikan').length;
  const fallback = results.filter(r => r.source === 'fallback').length;
  const invalid = results.filter(r => !r.valid).length;
  
  console.log(`✅ Existing valid URLs: ${existing}`);
  console.log(`🔄 Fetched from Jikan: ${jikan}`);
  console.log(`🎨 Using fallback: ${fallback}`);
  console.log(`❌ Invalid URLs: ${invalid}`);
  console.log('='.repeat(50));
  
  // Save results to JSON for review
  const outputPath = path.join(__dirname, 'character-images-report.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n💾 Full report saved to: ${outputPath}`);
  
  // Ask if user wants to update the file
  console.log('\n⚠️  To update the character data file, run:');
  console.log('   npx ts-node scripts/update-character-images.ts');
}

// Run the script
fetchAllCharacterImages().catch(console.error);
