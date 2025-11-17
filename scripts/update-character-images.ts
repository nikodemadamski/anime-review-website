/**
 * Update Character Images Script
 * 
 * This script reads the report from fetch-character-images.ts
 * and updates the quiz-data.ts file with the new image URLs.
 * 
 * Usage: npx ts-node scripts/update-character-images.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface ImageReport {
  character: {
    id: string;
    name: string;
    anime: string;
    image: string;
  };
  newImageUrl: string;
  source: 'existing' | 'jikan' | 'fallback';
  valid: boolean;
}

async function updateCharacterImages() {
  console.log('📝 Starting character image update...\n');
  
  // Read the report
  const reportPath = path.join(__dirname, 'character-images-report.json');
  
  if (!fs.existsSync(reportPath)) {
    console.error('❌ Report file not found!');
    console.log('   Run: npx ts-node scripts/fetch-character-images.ts first\n');
    process.exit(1);
  }
  
  const report: ImageReport[] = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
  
  // Read the current quiz-data.ts file
  const quizDataPath = path.join(__dirname, '../src/data/quiz-data.ts');
  let quizDataContent = fs.readFileSync(quizDataPath, 'utf-8');
  
  console.log('🔄 Updating image URLs...\n');
  
  let updatedCount = 0;
  let unchangedCount = 0;
  
  report.forEach((item) => {
    const oldUrl = item.character.image;
    const newUrl = item.newImageUrl;
    
    if (oldUrl !== newUrl) {
      // Escape special regex characters in the old URL
      const escapedOldUrl = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Replace the image URL in the file
      const regex = new RegExp(`image: ["']${escapedOldUrl}["']`, 'g');
      
      if (quizDataContent.match(regex)) {
        quizDataContent = quizDataContent.replace(regex, `image: "${newUrl}"`);
        updatedCount++;
        console.log(`✅ Updated: ${item.character.name}`);
        console.log(`   Source: ${item.source}`);
        console.log(`   Old: ${oldUrl.substring(0, 50)}...`);
        console.log(`   New: ${newUrl.substring(0, 50)}...\n`);
      }
    } else {
      unchangedCount++;
    }
  });
  
  // Write the updated content back
  fs.writeFileSync(quizDataPath, quizDataContent, 'utf-8');
  
  console.log('\n📊 UPDATE SUMMARY\n');
  console.log('='.repeat(50));
  console.log(`✅ Updated: ${updatedCount} characters`);
  console.log(`➖ Unchanged: ${unchangedCount} characters`);
  console.log('='.repeat(50));
  
  if (updatedCount > 0) {
    console.log('\n✨ Character images have been updated!');
    console.log('   File: src/data/quiz-data.ts\n');
  } else {
    console.log('\n✅ All images were already up to date!\n');
  }
}

// Run the script
updateCharacterImages().catch(console.error);
