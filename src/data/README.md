# Anime Data Management

This directory contains the anime data files for the website.

## Files

- **anime-2025.csv** - Main anime data with ratings and cover images
- **jikan_reviews.csv** - Detailed anime information and user reviews from MyAnimeList

## Updating Anime Data

### Quick Update (Replace Files)

1. Replace `anime-2025.csv` with your new file
2. Replace `jikan_reviews.csv` with your new file  
3. Clear the Next.js cache: `rm -rf .next`
4. Restart the dev server: `npm run dev`

### CSV Format Requirements

#### anime-2025.csv
Required columns:
- `franchise_root_title` - Anime title (must match jikan_reviews.csv)
- `music_score` - Music rating (0-5 scale, will be converted to 0-10)
- `visual_score` - Visual rating (0-5 scale, will be converted to 0-10)
- `story_score` - Story rating (0-5 scale, will be converted to 0-10)
- `character_score` - Character rating (0-5 scale, will be converted to 0-10)
- `site_score` - Overall site rating (0-10 scale)
- **`cover_image_url`** - Direct URL to anime cover image (AniList format recommended)
- `cover_image_color` - Hex color code for theming (optional)
- `anilist_title_match` - Matching title from AniList (optional)
- `anilist_page` - AniList page URL (optional)

#### jikan_reviews.csv
Required columns:
- `franchise_root_title` - Anime title (must match anime-2025.csv)
- `mal_id` - MyAnimeList ID
- `title` - Full anime title
- `synopsis` - Anime description
- `genres` - Comma-separated genres
- `themes` - Comma-separated themes
- `demographics` - Target demographic
- `year` - Release year
- `status` - Airing status
- `duration` - Episode duration
- `episodes` - Number of episodes
- `season` - Release season
- `studios` - Production studios
- `source` - Source material
- `rank` - MAL rank
- `popularity` - MAL popularity rank
- `members` - Number of MAL members
- `review_username` - Reviewer username
- `review_score` - Review score (0-10)
- `review_content` - Review text
- `review_date` - Review date
- `is_spoiler` - True/False
- `is_preliminary` - True/False

## Automated Scripts

### Fetch Trending Anime
```bash
npm run fetch-trending
```
Fetches currently trending anime from Jikan API and saves to `trending-now.csv`.

## How Data is Loaded

1. **anime-2025.csv** provides the core ratings and cover images
2. **jikan_reviews.csv** provides detailed metadata and reviews
3. Data is matched by `franchise_root_title`
4. Cover images are loaded directly from the URLs in anime-2025.csv
5. Reviews are grouped by anime title

## Troubleshooting

### Images not showing
- Check that `cover_image_url` column exists in anime-2025.csv
- Verify URLs are accessible (AniList CDN recommended)
- Clear Next.js cache: `rm -rf .next`

### Reviews not matching
- Ensure `franchise_root_title` matches exactly between both CSVs
- Check for extra spaces or special characters

### Data not updating
- Clear the cache: `rm -rf .next`
- Restart the dev server
- Check console for parsing errors

## Data Sources

- **Ratings**: Custom categorical ratings (music, visual, story, character)
- **Cover Images**: AniList CDN (https://s4.anilist.co/...)
- **Reviews**: MyAnimeList via Jikan API
- **Metadata**: MyAnimeList via Jikan API
- **Trending**: Jikan API (updated via script)
