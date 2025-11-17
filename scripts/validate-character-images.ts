/**
 * Character Image Validator
 * 
 * This script validates all character image URLs to ensure they work.
 * It's faster than the fetcher and just reports broken URLs.
 * 
 * Usage: npx ts-node scripts/validate-character-images.ts
 */

import { characterResults } from '../src/data/quiz-data';

const BATCH_SIZE = 10; // Check 10 images at a time
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Validate that an image URL works
async function validateImageUrl(url: string): Promise<{ valid: boolean; status?: number; error?: string }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(url, { 
      method: 'HEAD',
      signal: controller.signal
    });
    
    clearTimeout(timeout);
    
    if (response.status !== 200) {
      return { valid: false, status: response.status };
    }
    
    const contentType = response.headers.get('content-type');
    const isImage = contentType?.startsWith('image/') || false;
    
    return { valid: isImage, status: response.status };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
}

// Main validation function
async function validateAllCharacters() {
  console.log('🔍 Starting character image validation...\n');
  console.log(`📊 Total characters: ${characterResults.length}\n`);
  
  const results: {
    name: string;
    anime: string;
    url: string;
    valid: boolean;
    status?: number;
    error?: string;
    isPlaceholder: boolean;
  }[] = [];
  
  // Process in batches
  for (let i = 0; i < characterResults.length; i += BATCH_SIZE) {
    const batch = characterResults.slice(i, i + BATCH_SIZE);
    
    console.log(`Checking batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(characterResults.length / BATCH_SIZE)}...`);
    
    const batchResults = await Promise.all(
      batch.map(async (char) => {
        const isPlaceholder = char.image.includes('placeholder') || char.image.includes('via.placeholder');
        const validation = await validateImageUrl(char.image);
        
        return {
          name: char.name,
          anime: char.anime,
          url: char.image,
          valid: validation.valid,
          status: validation.status,
          error: validation.error,
          isPlaceholder
        };
      })
    );
    
    results.push(...batchResults);
    
    // Small delay between batches
    if (i + BATCH_SIZE < characterResults.length) {
      await delay(100);
    }
  }
  
  // Generate report
  console.log('\n\n📊 VALIDATION REPORT\n');
  console.log('='.repeat(70));
  
  const valid = results.filter(r => r.valid && !r.isPlaceholder);
  const invalid = results.filter(r => !r.valid && !r.isPlaceholder);
  const placeholders = results.filter(r => r.isPlaceholder);
  
  console.log(`✅ Valid URLs: ${valid.length}`);
  console.log(`❌ Broken URLs: ${invalid.length}`);
  console.log(`🔄 Placeholders: ${placeholders.length}`);
  console.log('='.repeat(70));
  
  // Show broken URLs
  if (invalid.length > 0) {
    console.log('\n❌ BROKEN URLS:\n');
    invalid.forEach((r, i) => {
      console.log(`${i + 1}. ${r.name} (${r.anime})`);
      console.log(`   URL: ${r.url.substring(0, 60)}...`);
      console.log(`   Status: ${r.status || 'N/A'} | Error: ${r.error || 'N/A'}\n`);
    });
  }
  
  // Show placeholders
  if (placeholders.length > 0) {
    console.log('\n🔄 PLACEHOLDERS (need real images):\n');
    placeholders.forEach((r, i) => {
      console.log(`${i + 1}. ${r.name} (${r.anime})`);
    });
  }
  
  // Summary
  console.log('\n\n💡 NEXT STEPS:\n');
  if (invalid.length > 0 || placeholders.length > 0) {
    console.log('Run the fetcher to get new images:');
    console.log('   npx ts-node scripts/fetch-character-images.ts\n');
  } else {
    console.log('✅ All character images are valid! No action needed.\n');
  }
}

// Run the script
validateAllCharacters().catch(console.error);
