# Character Image System

## Overview

This system automatically validates and updates character images for the quiz feature. It ensures all character images are working and provides fallback mechanisms when images fail to load.

## Components

### 1. Image Utilities (`src/lib/character-images.ts`)
- `generateFallbackUrl()` - Creates DiceBear avatar fallbacks
- `generateInitialsUrl()` - Creates UI Avatars with initials
- `getCharacterImage()` - Returns primary and fallback URLs
- `validateImageUrl()` - Client-side image validation

### 2. Validator Script (`scripts/validate-character-images.ts`)
**Purpose:** Quickly check which character images are broken

**Usage:**
```bash
npm run validate-images
```

**Features:**
- Checks all character image URLs with HEAD requests
- Reports broken URLs, valid URLs, and placeholders
- Fast batch processing (10 images at a time)
- No modifications to data files

### 3. Fetcher Script (`scripts/fetch-character-images.ts`)
**Purpose:** Fetch new images from Jikan API (MyAnimeList)

**Usage:**
```bash
npm run fetch-images
```

**Features:**
- Searches Jikan API for each character
- Validates fetched URLs before using them
- Generates fallback avatars if API fails
- Respects Jikan rate limits (3 req/sec)
- Saves report to `scripts/character-images-report.json`

### 4. Update Script (`scripts/update-character-images.ts`)
**Purpose:** Apply fetched images to the data file

**Usage:**
```bash
npm run update-images
```

**Features:**
- Reads report from fetcher
- Updates `src/data/quiz-data.ts` with new URLs
- Shows summary of changes
- Safe - only updates broken URLs

### 5. Quiz Result Page (`src/app/quiz/result/[character]/page.tsx`)
**Features:**
- Automatic fallback on image load error
- Uses `onError` handler to switch to fallback
- Logs errors for monitoring
- Seamless user experience

## Workflow

### Initial Setup (One-time)
```bash
# 1. Check current status
npm run validate-images

# 2. Fetch new images if needed
npm run fetch-images

# 3. Apply the updates
npm run update-images

# 4. Verify everything works
npm run validate-images
```

### Regular Maintenance
```bash
# Weekly check (can be automated in CI/CD)
npm run validate-images
```

### When Images Break
```bash
# 1. Validate to see what's broken
npm run validate-images

# 2. Fetch replacements
npm run fetch-images

# 3. Apply updates
npm run update-images
```

## CI/CD Integration (Future)

Create `.github/workflows/validate-images.yml`:

```yaml
name: Validate Character Images

on:
  schedule:
    - cron: '0 0 * * 0' # Weekly on Sunday
  workflow_dispatch: # Manual trigger

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Validate images
        run: npm run validate-images
        
      - name: Fetch new images if needed
        if: failure()
        run: npm run fetch-images
        
      - name: Update images
        if: failure()
        run: npm run update-images
        
      - name: Create PR
        if: failure()
        uses: peter-evans/create-pull-request@v5
        with:
          commit-message: 'fix: update broken character images'
          title: 'Update Broken Character Images'
          body: 'Automated update of broken character images'
          branch: 'fix/character-images'
```

## Fallback Strategy

The system uses a multi-tier fallback approach:

1. **Primary:** Original image URL from data file
2. **Secondary:** Fetched from Jikan API (MyAnimeList)
3. **Tertiary:** DiceBear avatar (always works)

The quiz result page implements client-side fallback:
- If primary image fails to load, automatically switches to fallback
- Fallback uses character name and color for consistency
- No broken images shown to users

## Data Structure

Each character in `quiz-data.ts` has:
```typescript
{
  id: string;
  name: string;
  anime: string;
  image: string;  // Primary image URL
  color: string;  // Used for fallback generation
  // ... other fields
}
```

## Benefits

✅ **Automated:** Scripts handle the heavy lifting
✅ **Safe:** Validates before updating
✅ **Fast:** Batch processing and rate limiting
✅ **Reliable:** Multi-tier fallback system
✅ **User-friendly:** No broken images ever shown
✅ **Maintainable:** Clear workflow and documentation

## Troubleshooting

### Script fails with TypeScript errors
```bash
# Make sure ts-node is installed
npm install --save-dev ts-node
```

### Rate limit errors from Jikan
- The fetcher already includes 350ms delays
- If you still hit limits, increase `RATE_LIMIT_DELAY` in the script

### Images still broken after update
- Check the report file: `scripts/character-images-report.json`
- Verify the URLs manually
- Consider using fallback URLs for problematic characters

## Future Enhancements

- [ ] Add GitHub Actions workflow for automated checks
- [ ] Support for local image caching
- [ ] Bulk download of images to `/public/characters/`
- [ ] Image optimization and resizing
- [ ] Alternative API sources (AniList, Kitsu)
