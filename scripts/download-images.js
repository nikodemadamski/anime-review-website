// Automated Character Image Downloader
// This script helps download character images from reliable sources

const https = require('https');
const fs = require('fs');
const path = require('path');

// Character image URLs from reliable CDNs
const characterImages = {
  'goku.jpg': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png', // Placeholder
  'naruto.jpg': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png', // Placeholder
  'luffy.jpg': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png', // Placeholder
  // Add more as you find real URLs
};

const outputDir = path.join(__dirname, '..', 'public', 'characters');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🎭 Character Image Downloader');
console.log('============================\n');

// Download function
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(outputDir, filename);
    const file = fs.createWriteStream(filepath);

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

// Main execution
async function main() {
  console.log(`📁 Output directory: ${outputDir}\n`);
  console.log('⚠️  NOTE: This script uses placeholder URLs.');
  console.log('   You need to replace them with actual anime character image URLs.\n');

  let downloaded = 0;
  let failed = 0;

  for (const [filename, url] of Object.entries(characterImages)) {
    try {
      await downloadImage(url, filename);
      downloaded++;
    } catch (error) {
      console.error(`❌ Failed: ${filename} - ${error.message}`);
      failed++;
    }
  }

  console.log('\n============================');
  console.log(`✅ Downloaded: ${downloaded}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📝 Total: ${Object.keys(characterImages).length}`);
  console.log('\n💡 Next steps:');
  console.log('   1. Find real anime character images');
  console.log('   2. Update the characterImages object in this script');
  console.log('   3. Run: node scripts/download-images.js');
}

main().catch(console.error);
