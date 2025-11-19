# Data Management Scripts

This directory contains scripts for managing anime data and cover images.

## Scripts

### 1. `update-trending.ts` ⭐ NEW

Fetches the latest trending anime from MyAnimeList and updates the trending data used on both homepage and browse page.

**When to use:**
- Daily or weekly to keep trending anime fresh
- When you want to update what's currently popular
- Before deploying to show the latest trending shows

**What it does:**
- Fetches top 50 currently airing anime from Jikan API (MyAnimeList)
- Generates ratings based on MAL scores
- Updates `src/data/trending-now.csv`
- Creates automatic backups before updating
- Shows top 10 trending anime

**Usage:**
```bash
npm run update-trending
```

**Features:**
- Rate limiting (1 second between requests)
- Automatic backup creation with timestamps
- Fetches 2 pages (50 anime total)
- Includes all metadata (genres, studios, members, etc.)
- Shows detailed progress and statistics

**Output:**
- Updated `src/data/trending-now.csv`
- Timestamped backup file
- Console output showing top 10 trending anime

**Note:** This data is used by:
- Homepage trending section (top 6 anime)
- Browse page trending section (top 15 anime)

---

### 2. `collect-anime-covers.ts`

Fetches missing cover images for anime from the AniList API and updates the CSV file.

**When to use:**
- When you have anime entries without cover images
- When cover images are outdated or broken
- After adding new anime to the CSV

**What it does:**
- Scans `anime-2025.csv` for entries without cover images
- Fetches cover images from AniList API using anime titles
- Updates the CSV with new cover URLs and colors
- Creates a backup of covers in `src/data/anime-covers.json`
- Creates a timestamped backup of the original CSV

**Usage:**
```bash
npm run collect-covers
```

**Features:**
- Rate limiting (1 second between requests to respect API limits)
- Automatic backup creation
- Progress tracking
- Fallback to cached covers from previous runs

**Output:**
- Updated `src/data/anime-2025.csv` with cover URLs
- `src/data/anime-covers.json` backup file
- Timestamped CSV backup file

---

### 3. `update-data.ts`

Clears cache and rebuilds the application after CSV files are updated.

**When to use:**
- After updating `anime-2025.csv`
- After updating `jikan_reviews.csv`
- After running `collect-covers`
- When the website doesn't reflect latest data changes

**What it does:**
- Validates that CSV files exist
- Shows file statistics (size, modification date)
- Counts anime entries
- Clears Next.js build cache (`.next` directory)
- Rebuilds the application

**Usage:**
```bash
npm run update-data
```

**Output:**
- Fresh Next.js build with updated data
- Statistics about your data files

---

## Typical Workflow

### Updating Trending Anime (Recommended: Daily/Weekly)

1. **Fetch latest trending data**:
   ```bash
   npm run update-trending
   ```

2. **Update the website**:
   ```bash
   npm run update-data
   ```

3. **Verify the changes**:
   ```bash
   npm run dev
   ```
   Check homepage and browse page trending sections.

### Adding New Anime or Updating Data

1. **Update your CSV files** (`anime-2025.csv` or `jikan_reviews.csv`)

2. **Collect missing covers** (if needed):
   ```bash
   npm run collect-covers
   ```

3. **Update the website**:
   ```bash
   npm run update-data
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

### Fixing Missing or Broken Cover Images

1. **Run the cover collection script**:
   ```bash
   npm run collect-covers
   ```
   This will fetch covers for any anime missing them.

2. **Update the website**:
   ```bash
   npm run update-data
   ```

3. **Verify the changes**:
   ```bash
   npm run dev
   ```
   Open your browser and check that covers are displaying correctly.

---

## Data Files

### `src/data/anime-2025.csv`
Main anime database with ratings and metadata.

**Columns:**
- `franchise_root_title` - Anime title
- `music_score` - Music rating (0-5)
- `visual_score` - Visual rating (0-5)
- `story_score` - Story rating (0-5)
- `character_score` - Character rating (0-5)
- `site_score` - Overall site rating (0-10)
- `cover_image_url` - Cover image URL (fetched by `collect-covers`)
- `cover_image_color` - Dominant color (fetched by `collect-covers`)
- `anilist_title_match` - Matched title on AniList
- `anilist_page` - AniList page URL

### `src/data/jikan_reviews.csv`
Detailed anime information and user reviews from MyAnimeList.

### `src/data/anime-covers.json`
Backup of fetched cover images (created by `collect-covers`).

**Purpose:**
- Faster re-runs (uses cached data)
- Fallback if AniList API is unavailable
- Historical record of fetched covers

---

## Troubleshooting

### "No results found" when fetching covers

**Cause:** AniList couldn't find the anime by that title.

**Solutions:**
- Check if the title in CSV matches the AniList title
- Manually update `anilist_title_match` column with correct title
- Add the cover URL manually to `cover_image_url` column

### Website not showing updated data

**Cause:** Next.js cache not cleared.

**Solution:**
```bash
npm run update-data
```

### Rate limiting errors from AniList

**Cause:** Too many requests too quickly.

**Solution:** The script already includes 1-second delays. If you still hit limits, wait a few minutes and try again.

### Build fails after updating data

**Cause:** CSV format error or invalid data.

**Solutions:**
- Check CSV for formatting issues (missing commas, extra quotes)
- Restore from backup: `src/data/anime-2025.backup.[timestamp].csv`
- Validate CSV structure matches expected columns

---

## API Information

### AniList GraphQL API
- **Endpoint:** `https://graphql.anilist.co`
- **Rate Limit:** ~90 requests per minute
- **Documentation:** https://anilist.gitbook.io/anilist-apiv2-docs/

The `collect-covers` script respects rate limits with 1-second delays between requests.

---

## Tips

1. **Always run `collect-covers` before `update-data`** to ensure you have the latest covers before rebuilding.

2. **Keep backups** - The scripts create automatic backups, but consider keeping your own copies of important CSV files.

3. **Check the output** - Both scripts provide detailed progress information. Read it to catch any issues early.

4. **Test locally first** - Run `npm run dev` after updates to verify everything works before deploying.

5. **Commit changes** - After successfully updating data and covers, commit the changes to version control.
