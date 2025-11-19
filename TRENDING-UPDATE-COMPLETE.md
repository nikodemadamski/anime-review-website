# Trending Update Script - Complete ✅

## Overview
Created a new `update-trending.ts` script that fetches the latest trending anime from MyAnimeList and updates the data used on both the homepage and browse page.

## What Was Created

### 1. `scripts/update-trending.ts`
A robust script that:
- Fetches top 50 currently airing anime from Jikan API (MyAnimeList)
- Implements proper rate limiting (1 second between requests)
- Creates automatic backups before updating
- Generates realistic ratings based on MAL scores
- Saves data to `src/data/trending-now.csv`
- Shows detailed progress and top 10 trending anime

### 2. NPM Script Added
Added to `package.json`:
```bash
npm run update-trending
```

### 3. Documentation Updated
Updated `scripts/README.md` with:
- Complete documentation for the new script
- Usage instructions
- Workflow recommendations
- Tips for keeping trending data fresh

## Usage

### Quick Start
```bash
npm run update-trending
```

### Recommended Workflow
1. Run the script daily or weekly to keep trending data fresh
2. After updating, rebuild the site:
   ```bash
   npm run update-data
   ```
3. Verify changes:
   ```bash
   npm run dev
   ```

## Features

✅ **Automatic Backups** - Creates timestamped backups before updating
✅ **Rate Limiting** - Respects Jikan API limits (1 second between requests)
✅ **Multi-Page Fetch** - Gets 50 anime (2 pages) for better coverage
✅ **Rich Metadata** - Includes genres, studios, members, rankings, etc.
✅ **Progress Tracking** - Shows detailed progress and statistics
✅ **Error Handling** - Graceful error handling with helpful messages

## Data Usage

The trending data is used in:
1. **Homepage** - "🔥 Trending This Season" section (top 6 anime)
2. **Browse Page** - Trending section at the top (top 15 anime)

Both sections now share the same data source, ensuring consistency across the site.

## Test Results

Successfully tested the script:
- ✅ Fetched 50 trending anime
- ✅ Created backup file
- ✅ Updated `trending-now.csv`
- ✅ Showed top 10 trending anime with scores and stats

### Sample Output
```
🏆 Top 10 Trending Anime:
────────────────────────────────────────────────────────────
 1. Kingdom 6th Season
    Score: 9.02 | Members: 23K | Rank: #10
 2. Boku no Hero Academia: Final Season
    Score: 8.79 | Members: 187K | Rank: #37
 3. One Piece
    Score: 8.73 | Members: 2599K | Rank: #51
...
```

## Maintenance

### How Often to Run
- **Recommended:** Daily or weekly
- **Minimum:** Before each deployment
- **Best Practice:** Set up a cron job or GitHub Action to run automatically

### Monitoring
The script provides detailed output including:
- Number of anime fetched
- Backup file created
- Top 10 trending anime with stats
- Any errors encountered

## Next Steps

1. Consider setting up automated runs (GitHub Actions, cron job)
2. Monitor trending data freshness
3. Adjust fetch frequency based on your needs
4. Consider adding more pages if you want more trending anime

## Files Modified

- ✅ `scripts/update-trending.ts` (created)
- ✅ `package.json` (added npm script)
- ✅ `scripts/README.md` (updated documentation)
- ✅ `src/data/trending-now.csv` (updated with latest data)

## Success! 🎉

The trending update system is now complete and ready to use. Run `npm run update-trending` anytime you want to refresh the trending anime data on your site!
