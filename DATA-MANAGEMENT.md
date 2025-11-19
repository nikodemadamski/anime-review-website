# Data Management Guide

## Current Situation

Your anime database (`src/data/anime-2025.csv`) contains 74 anime entries, but only 14 of them have cover images. The rest show placeholder images because the `cover_image_url` column is empty for those entries.

## Solution: Two New Scripts

We've created two scripts to manage your anime data:

### 1. **Collect Anime Covers** (`npm run collect-covers`)

This script automatically fetches missing cover images from AniList API.

**What it does:**
- Scans your CSV for anime without cover images
- Fetches high-quality covers from AniList
- Updates the CSV with cover URLs and colors
- Creates a backup file for safety
- Saves covers to `src/data/anime-covers.json` for future use

**When to use:**
- Right now! To get covers for your 60 missing anime
- After adding new anime to the CSV
- When covers are broken or outdated

**How to run:**
```bash
npm run collect-covers
```

**Note:** This takes about 2-3 minutes because it respects API rate limits (2 seconds between requests).

---

### 2. **Update Data** (`npm run update-data`)

This script rebuilds your website after data changes.

**What it does:**
- Clears Next.js cache
- Rebuilds the application
- Shows statistics about your data

**When to use:**
- After running `collect-covers`
- After manually updating CSV files
- When the website doesn't show latest changes

**How to run:**
```bash
npm run update-data
```

---

## Complete Workflow

### To Fix Missing Covers Right Now:

1. **Fetch the covers:**
   ```bash
   npm run collect-covers
   ```
   Wait for it to complete (~2-3 minutes)

2. **Rebuild the website:**
   ```bash
   npm run update-data
   ```

3. **Restart your dev server:**
   ```bash
   npm run dev
   ```

4. **Check your browser** - All anime should now have cover images!

---

### For Future Updates:

Whenever you update `anime-2025.csv` or `jikan_reviews.csv`:

1. Run `npm run collect-covers` (if you added new anime)
2. Run `npm run update-data`
3. Restart `npm run dev`

---

## Files Created

### `scripts/collect-anime-covers.ts`
Fetches cover images from AniList API

### `scripts/update-data.ts`
Clears cache and rebuilds the app

### `src/data/anime-covers.json` (created after first run)
Backup of all fetched covers - makes future runs faster

### `scripts/README.md`
Detailed documentation about the scripts

---

## Troubleshooting

### "API error: 429" messages
This means we're hitting rate limits. The script already waits 2 seconds between requests, but if you see many 429 errors, just wait a few minutes and run it again. The script will skip anime that already have covers.

### Covers still not showing
1. Make sure `collect-covers` completed successfully
2. Run `npm run update-data` to clear cache
3. Restart your dev server
4. Hard refresh your browser (Cmd+Shift+R on Mac)

### Some anime couldn't be found
A few anime might not be found on AniList (you'll see "Could not fetch cover"). You can:
- Manually add the cover URL to the CSV
- Update the `anilist_title_match` column with the correct title
- Leave it with the placeholder for now

---

## Current Status

- **Total anime:** 74
- **With covers:** 14
- **Missing covers:** 60
- **Script status:** Running now (check with `npm run collect-covers`)

After the script completes, you'll have covers for most (if not all) of your anime!
