#!/usr/bin/env ts-node

/**
 * Update Data Script
 * 
 * This script should be run whenever anime-2025.csv or jikan_reviews.csv are updated.
 * It clears the Next.js cache and rebuilds the application to ensure the website
 * reflects the latest data.
 * 
 * Usage:
 *   npm run update-data
 *   or
 *   ts-node scripts/update-data.ts
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const ANIME_CSV = path.join(process.cwd(), 'src', 'data', 'anime-2025.csv');
const REVIEWS_CSV = path.join(process.cwd(), 'src', 'data', 'jikan_reviews.csv');
const NEXT_DIR = path.join(process.cwd(), '.next');

console.log('🔄 Data Update Script Starting...\n');

// Check if CSV files exist
console.log('📋 Checking CSV files...');
if (!fs.existsSync(ANIME_CSV)) {
  console.error('❌ Error: anime-2025.csv not found at', ANIME_CSV);
  process.exit(1);
}
if (!fs.existsSync(REVIEWS_CSV)) {
  console.error('❌ Error: jikan_reviews.csv not found at', REVIEWS_CSV);
  process.exit(1);
}

// Get file stats
const animeStats = fs.statSync(ANIME_CSV);
const reviewsStats = fs.statSync(REVIEWS_CSV);

console.log('✅ anime-2025.csv found');
console.log(`   Size: ${(animeStats.size / 1024).toFixed(2)} KB`);
console.log(`   Modified: ${animeStats.mtime.toLocaleString()}`);

console.log('✅ jikan_reviews.csv found');
console.log(`   Size: ${(reviewsStats.size / 1024).toFixed(2)} KB`);
console.log(`   Modified: ${reviewsStats.mtime.toLocaleString()}\n`);

// Count anime entries
const animeContent = fs.readFileSync(ANIME_CSV, 'utf-8');
const animeLines = animeContent.split('\n').filter(line => line.trim()).length - 1; // -1 for header
console.log(`📊 Found ${animeLines} anime entries\n`);

// Clear Next.js cache
console.log('🗑️  Clearing Next.js cache...');
if (fs.existsSync(NEXT_DIR)) {
  try {
    fs.rmSync(NEXT_DIR, { recursive: true, force: true });
    console.log('✅ Cache cleared successfully\n');
  } catch (error) {
    console.error('❌ Error clearing cache:', error);
    process.exit(1);
  }
} else {
  console.log('ℹ️  No cache to clear\n');
}

// Rebuild the application
console.log('🔨 Building application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('\n✅ Build completed successfully\n');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}

console.log('✨ Data update complete!');
console.log('💡 You can now run "npm run dev" or "npm start" to see the updated data\n');
