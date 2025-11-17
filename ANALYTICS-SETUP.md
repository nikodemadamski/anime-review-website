# Analytics Setup Guide

## ✅ What's Been Implemented

### Analytics Infrastructure
- ✅ Google Analytics 4 integration
- ✅ Custom event tracking system
- ✅ Quiz-specific analytics
- ✅ Page view tracking
- ✅ Error tracking
- ✅ Performance monitoring

### Tracked Events

#### Quiz Events
- `quiz_started` - When user enters name and starts quiz
- `quiz_question_answered` - Each question answered with traits
- `quiz_completed` - Quiz finished with character result
- `quiz_result_shared` - Result shared on social media
- `email_captured` - Email submitted from quiz
- `quiz_retaken` - User retakes the quiz

#### Browse Events
- `filter_applied` - Filters used on browse page
- `anime_clicked` - Anime detail page visited
- `search_performed` - Search query submitted

#### Watchlist Events
- `watchlist_added` - Anime added to watchlist
- `watchlist_removed` - Anime removed from watchlist
- `watchlist_viewed` - Watchlist page viewed

#### Newsletter Events
- `newsletter_subscribed` - Email signup successful
- `newsletter_failed` - Email signup failed

## 🚀 Setup Instructions

### Step 1: Create Google Analytics 4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Admin" (gear icon)
3. Click "Create Property"
4. Enter property name: "Anime Review Website"
5. Select timezone and currency
6. Click "Next"
7. Fill in business information
8. Click "Create"
9. Accept Terms of Service

### Step 2: Get Measurement ID

1. In your new property, click "Data Streams"
2. Click "Add stream" → "Web"
3. Enter your website URL: `https://yourdomain.com`
4. Enter stream name: "Anime Review Website"
5. Click "Create stream"
6. Copy the **Measurement ID** (format: G-XXXXXXXXXX)

### Step 3: Add to Environment Variables

1. Create `.env.local` file in the project root:
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

2. Replace `G-XXXXXXXXXX` with your actual Measurement ID

3. Restart the development server:
```bash
npm run dev
```

### Step 4: Verify Installation

1. Open your website in a browser
2. Open Chrome DevTools (F12)
3. Go to Network tab
4. Filter by "gtag"
5. Take the quiz or navigate pages
6. You should see analytics requests being sent

### Step 5: Check Real-Time Reports

1. Go back to Google Analytics
2. Click "Reports" → "Realtime"
3. Navigate your website
4. You should see yourself in the real-time view!

## 📊 Key Metrics to Monitor

### Quiz Performance
- **Quiz Completion Rate**: Started vs Completed
- **Most Popular Characters**: Which results users get
- **Share Rate**: Completed vs Shared
- **Email Capture Rate**: Completed vs Email Submitted
- **Retake Rate**: How many retake the quiz

### User Engagement
- **Page Views**: Most visited pages
- **Session Duration**: How long users stay
- **Bounce Rate**: Single-page visits
- **Pages per Session**: Navigation depth

### Conversion Funnels
1. Homepage → Quiz Start
2. Quiz Start → Quiz Complete
3. Quiz Complete → Email Capture
4. Quiz Complete → Social Share

### Traffic Sources
- Direct traffic
- Social media referrals
- Search engines
- Referral sites

## 🎯 Custom Dashboards

### Recommended Dashboard: Quiz Performance

Create a custom dashboard with:
1. Quiz starts (today vs yesterday)
2. Quiz completions (today vs yesterday)
3. Top 5 character results
4. Share rate percentage
5. Email capture rate
6. Average time to complete quiz

### How to Create:
1. Go to "Explore" in Google Analytics
2. Click "Blank" template
3. Add metrics and dimensions
4. Save as "Quiz Performance Dashboard"

## 🔍 Advanced Tracking (Future)

### Heatmaps & Session Recording
Consider adding:
- **Hotjar**: Visual heatmaps and session recordings
- **Microsoft Clarity**: Free heatmaps and recordings
- **FullStory**: Advanced session replay

### A/B Testing
- **Google Optimize**: Test different quiz questions
- **Optimizely**: Test homepage variations
- **VWO**: Test CTA buttons and layouts

### Conversion Optimization
- **Google Tag Manager**: Advanced event tracking
- **Segment**: Unified analytics platform
- **Mixpanel**: Product analytics

## 🚨 Privacy & Compliance

### GDPR Compliance
- Add cookie consent banner
- Provide opt-out mechanism
- Update privacy policy
- Anonymize IP addresses

### Cookie Consent
Consider adding:
- **CookieYes**: Free cookie consent solution
- **OneTrust**: Enterprise cookie management
- **Cookiebot**: GDPR-compliant consent

## 📈 Success Metrics

### Week 1 Goals
- [ ] 100+ quiz completions
- [ ] 20%+ share rate
- [ ] 10%+ email capture rate
- [ ] <5% bounce rate on quiz page

### Month 1 Goals
- [ ] 1,000+ quiz completions
- [ ] 25%+ share rate
- [ ] 15%+ email capture rate
- [ ] 500+ email subscribers

### Quarter 1 Goals
- [ ] 10,000+ quiz completions
- [ ] 30%+ share rate
- [ ] 20%+ email capture rate
- [ ] 5,000+ email subscribers
- [ ] Viral coefficient > 1.0

## 🛠️ Troubleshooting

### Analytics Not Working?
1. Check `.env.local` file exists
2. Verify Measurement ID format (G-XXXXXXXXXX)
3. Restart development server
4. Check browser console for errors
5. Disable ad blockers for testing

### Events Not Showing?
1. Wait 24-48 hours for data processing
2. Check "Realtime" reports for immediate data
3. Verify event names match exactly
4. Check browser network tab for gtag requests

### No Data in Reports?
1. Ensure website is publicly accessible
2. Check Data Stream is active
3. Verify Measurement ID is correct
4. Wait for data processing (up to 48 hours)

## 📚 Resources

- [Google Analytics 4 Documentation](https://support.google.com/analytics/answer/10089681)
- [GA4 Event Tracking Guide](https://support.google.com/analytics/answer/9322688)
- [GA4 vs Universal Analytics](https://support.google.com/analytics/answer/11583528)
- [GA4 Best Practices](https://support.google.com/analytics/answer/9267735)

## ✅ Checklist

- [ ] Create Google Analytics 4 property
- [ ] Get Measurement ID
- [ ] Add to `.env.local`
- [ ] Restart development server
- [ ] Verify in browser DevTools
- [ ] Check Real-Time reports
- [ ] Create custom dashboards
- [ ] Set up conversion goals
- [ ] Add cookie consent (if needed)
- [ ] Document baseline metrics

---

**Status**: Infrastructure complete, awaiting Google Analytics setup
**Time to Complete**: ~15 minutes
**Impact**: Unlock data-driven optimization and growth tracking
