# 🎯 Phase 2: Critical Blockers - Action Guide

## Overview
Phase 2 involves two manual tasks that are blocking launch:
1. **Download Character Images** (~30 minutes)
2. **Setup Google Analytics** (~15 minutes)

**Total Time**: ~45 minutes
**Impact**: Unlocks full functionality and analytics

---

## Task 1: Download Character Images (30 min)

### Why This Matters
- Quiz shows emojis instead of actual characters
- Breaks user trust and shareability
- Blocks viral potential

### Quick Method: Manual Download

**Step-by-Step:**

1. **Open the character list**:
   - See `public/characters/README.md` for full list
   - 18 images needed

2. **For each character, search Google Images**:
   ```
   "[Character Name] [Anime Name] official art"
   ```

3. **Download criteria**:
   - High quality (at least 400x400px)
   - Square or portrait orientation
   - Clear character face visible
   - Official art style preferred

4. **Save with exact filename**:
   ```
   public/characters/goku.jpg
   public/characters/naruto.jpg
   public/characters/luffy.jpg
   ... (15 more)
   ```

### Character List with Search Queries

Copy-paste these into Google Images:

1. `goku dragon ball z official art`
2. `naruto uzumaki official art`
3. `monkey d luffy one piece official art`
4. `light yagami death note official art`
5. `saitama one punch man official art`
6. `levi ackerman attack on titan official art`
7. `sailor moon usagi official art`
8. `mikasa ackerman attack on titan official art`
9. `nezuko kamado demon slayer official art`
10. `anya forger spy x family official art`
11. `power chainsaw man official art`
12. `smiling titan attack on titan`
13. `tony tony chopper one piece official art`
14. `mr satan hercule dragon ball z`
15. `pikachu pokemon official art`
16. `death note book`
17. `dragon balls dragon ball z`
18. `one piece treasure`

### Alternative: Use Automated Script

```bash
# Edit the script first with real URLs
node scripts/download-images.js
```

### Verification

After downloading, check:
```bash
ls -la public/characters/
# Should see 18 .jpg files
```

Then visit: `http://localhost:3000/quiz`
- Take the quiz
- Complete it
- Verify character image shows (not emoji)

---

## Task 2: Setup Google Analytics (15 min)

### Why This Matters
- Can't measure success without data
- Need to track quiz completions, shares, conversions
- Required for optimization

### Step-by-Step Setup

#### 1. Create Google Analytics Account

1. Go to [analytics.google.com](https://analytics.google.com)
2. Click "Start measuring"
3. Enter account name: "Anime Review Website"
4. Click "Next"

#### 2. Create Property

1. Property name: "Anime Review Website"
2. Reporting time zone: Your timezone
3. Currency: Your currency
4. Click "Next"

#### 3. Business Information

1. Industry: "Arts & Entertainment"
2. Business size: Select appropriate
3. How you plan to use: "Measure user behavior"
4. Click "Create"

#### 4. Accept Terms

1. Read and accept Terms of Service
2. Accept data processing terms
3. Click "I Accept"

#### 5. Set Up Data Stream

1. Choose platform: "Web"
2. Website URL: `https://yourdomain.com` (or localhost for testing)
3. Stream name: "Anime Review Website"
4. Click "Create stream"

#### 6. Get Measurement ID

1. You'll see your **Measurement ID**: `G-XXXXXXXXXX`
2. **Copy this ID** - you'll need it next

#### 7. Add to Your Project

1. Create `.env.local` file in project root:
   ```bash
   touch .env.local
   ```

2. Add your Measurement ID:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
   (Replace G-XXXXXXXXXX with your actual ID)

3. Restart the development server:
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

#### 8. Verify Installation

1. Open your website: `http://localhost:3000`
2. Open Chrome DevTools (F12)
3. Go to "Network" tab
4. Filter by "gtag"
5. Navigate around the site
6. You should see analytics requests

#### 9. Check Real-Time Reports

1. Go back to Google Analytics
2. Click "Reports" → "Realtime"
3. Navigate your website
4. You should see yourself in real-time!

### What Gets Tracked

Once setup, you'll automatically track:
- ✅ Page views
- ✅ Quiz starts
- ✅ Quiz completions
- ✅ Character results
- ✅ Social shares
- ✅ Email captures
- ✅ Browse activity
- ✅ Watchlist actions

---

## Verification Checklist

### Images
- [ ] All 18 images downloaded
- [ ] Files in `public/characters/` folder
- [ ] Correct filenames (lowercase, .jpg)
- [ ] Quiz shows actual character images
- [ ] Images load on mobile

### Analytics
- [ ] `.env.local` file created
- [ ] Measurement ID added
- [ ] Server restarted
- [ ] DevTools shows gtag requests
- [ ] Real-time reports show activity
- [ ] Quiz events fire correctly

---

## Troubleshooting

### Images Not Showing?
1. Check filename matches exactly (case-sensitive)
2. Verify file is in `public/characters/` folder
3. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
4. Check browser console for errors
5. Verify image file isn't corrupted

### Analytics Not Working?
1. Check `.env.local` exists in project root
2. Verify Measurement ID format: `G-XXXXXXXXXX`
3. Restart development server
4. Check browser console for errors
5. Disable ad blockers for testing
6. Wait 24-48 hours for data processing

### Still Having Issues?
1. Check `ANALYTICS-SETUP.md` for detailed troubleshooting
2. Verify all dependencies installed: `npm install`
3. Clear browser cache
4. Try incognito/private browsing mode

---

## Success Criteria

### Phase 2 Complete When:
- ✅ All 18 character images display in quiz
- ✅ Google Analytics tracking events
- ✅ Real-time reports show activity
- ✅ No console errors
- ✅ Mobile works correctly

---

## Time Estimates

| Task | Time | Difficulty |
|------|------|------------|
| Download images | 30 min | Easy |
| Setup GA4 | 15 min | Easy |
| Verification | 10 min | Easy |
| **Total** | **55 min** | **Easy** |

---

## Next Steps After Phase 2

Once Phase 2 is complete, you can:
1. **Launch publicly** - Everything works!
2. **Move to Phase 3** - Add viral features
3. **Start marketing** - Share on social media
4. **Monitor analytics** - Track growth

---

## Quick Commands

```bash
# Check if images exist
ls -la public/characters/

# Create .env.local
touch .env.local

# Edit .env.local
nano .env.local
# or
code .env.local

# Restart server
npm run dev

# Test quiz
open http://localhost:3000/quiz
```

---

**Status**: Ready to execute
**Blocking**: Yes - required for launch
**Priority**: Critical
**Impact**: 🚀 Unlocks full functionality
