# Design Document - Council Priority Features

## Overview

This design document outlines the technical architecture and implementation approach for the three priority features identified by the Council:
1. Shareable Quiz Result Cards (viral growth)
2. Mobile Menu Critical Fix (foundation)
3. Personalized Anime Recommendations (retention)

## Architecture

### High-Level System Flow

```
User Takes Quiz → Gets Character Match → Views Result Page
                                              ↓
                    ┌─────────────────────────┴─────────────────────────┐
                    ↓                                                     ↓
          Shareable Result Card                          Personalized Recommendations
                    ↓                                                     ↓
          Download / Share                                    Browse Recommended Anime
                    ↓                                                     ↓
          Friend Sees Share                                   Add to Watchlist
                    ↓                                                     ↓
          Friend Takes Quiz                                   Return to Site
                    ↓                                                     ↓
              VIRAL LOOP                                        RETENTION LOOP
```

### Component Architecture

```
src/
├── components/
│   ├── quiz/
│   │   ├── ShareableResultCard.tsx       (NEW - main result card)
│   │   ├── SocialShareButtons.tsx        (NEW - share functionality)
│   │   ├── RecommendationsSection.tsx    (NEW - anime recommendations)
│   │   └── QuizResult.tsx                (MODIFIED - integrate new components)
│   ├── layout/
│   │   └── Header.tsx                    (MODIFIED - fix mobile menu)
│   └── anime/
│       └── RecommendedAnimeCard.tsx      (NEW - recommendation card)
├── lib/
│   ├── recommendation-engine.ts          (NEW - matching algorithm)
│   ├── image-generator.ts                (NEW - card to image conversion)
│   └── share-utils.ts                    (NEW - social sharing helpers)
└── hooks/
    └── useShareableCard.ts               (NEW - card generation logic)
```

## Feature 1: Mobile Menu Critical Fix

### Problem Statement
Mobile menu lacks backdrop overlay, allowing users to interact with content behind the menu. Body scroll is not locked, causing confusion. Menu doesn't close when clicking outside.

### Technical Solution

#### 1. Backdrop Component
```typescript
// components/layout/MobileMenuBackdrop.tsx
interface BackdropProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenuBackdrop({ isOpen, onClose }: BackdropProps) {
  // Render semi-transparent overlay
  // Handle click to close
  // Manage z-index (z-40)
}
```

#### 2. Body Scroll Lock
```typescript
// hooks/useBodyScrollLock.ts
export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
  }, [isLocked]);
}
```

#### 3. Header Component Updates
```typescript
// components/layout/Header.tsx (modifications)
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
useBodyScrollLock(mobileMenuOpen);

return (
  <>
    {/* Existing header */}
    <MobileMenuBackdrop 
      isOpen={mobileMenuOpen} 
      onClose={() => setMobileMenuOpen(false)} 
    />
    <MobileMenu 
      isOpen={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
    />
  </>
);
```

### Z-Index Management
- Backdrop: `z-40`
- Mobile Menu: `z-50`
- All other content: `z-0` to `z-30`

### Testing Strategy
- Test on iOS Safari (scroll lock behavior)
- Test on Android Chrome (backdrop rendering)
- Verify click-outside closes menu
- Verify menu links close menu on navigation

---

## Feature 2: Shareable Quiz Result Cards

### Problem Statement
Users have no way to visually share their quiz results, limiting viral potential. Text-only sharing has <5% share rate. Need Instagram/TikTok-optimized graphics.

### Technical Solution

#### 1. Result Card Component

```typescript
// components/quiz/ShareableResultCard.tsx
interface ShareableResultCardProps {
  character: Character;
  personalityTraits: string[];
  quizScore: QuizScore;
}

export function ShareableResultCard({ 
  character, 
  personalityTraits, 
  quizScore 
}: ShareableResultCardProps) {
  return (
    <div className="result-card" id="shareable-card">
      {/* Character Image */}
      <div className="character-hero">
        <Image src={character.imageUrl} alt={character.name} />
      </div>
      
      {/* Personality Traits */}
      <div className="traits-section">
        <h2>You are: {character.name}</h2>
        <ul>
          {personalityTraits.map(trait => (
            <li key={trait}>{trait}</li>
          ))}
        </ul>
      </div>
      
      {/* Branding */}
      <div className="branding">
        <Logo />
        <QRCode value="https://yoursite.com/quiz" />
        <p>yoursite.com/quiz</p>
      </div>
    </div>
  );
}
```

#### 2. Image Generation

```typescript
// lib/image-generator.ts
import { toPng } from 'html-to-image';

export async function generateResultCardImage(
  elementId: string
): Promise<string> {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Element not found');
  
  // Generate high-quality PNG
  const dataUrl = await toPng(element, {
    quality: 1.0,
    pixelRatio: 2, // Retina quality
    width: 1080,
    height: 1920, // Instagram Story dimensions
  });
  
  return dataUrl;
}

export async function downloadImage(
  dataUrl: string, 
  filename: string
): Promise<void> {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
```

#### 3. Social Sharing

```typescript
// components/quiz/SocialShareButtons.tsx
interface SocialShareButtonsProps {
  characterName: string;
  shareUrl: string;
  imageDataUrl?: string;
}

export function SocialShareButtons({ 
  characterName, 
  shareUrl,
  imageDataUrl 
}: SocialShareButtonsProps) {
  const shareText = `I'm a ${characterName}! Which anime character are you? 🎭✨`;
  
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        // Convert data URL to blob for native sharing
        const blob = await (await fetch(imageDataUrl)).blob();
        const file = new File([blob], 'my-result.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'My Anime Character Result',
          text: shareText,
          url: shareUrl,
          files: [file],
        });
        
        trackEvent('result_card_shared', { platform: 'native' });
      } catch (error) {
        console.error('Share failed:', error);
      }
    }
  };
  
  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
    trackEvent('result_card_shared', { platform: 'twitter' });
  };
  
  // Similar handlers for Facebook, Instagram, Copy Link
  
  return (
    <div className="share-buttons">
      {navigator.share && (
        <button onClick={handleNativeShare}>Share</button>
      )}
      <button onClick={handleTwitterShare}>Twitter</button>
      <button onClick={handleFacebookShare}>Facebook</button>
      <button onClick={handleCopyLink}>Copy Link</button>
    </div>
  );
}
```

#### 4. Custom Hook for Card Generation

```typescript
// hooks/useShareableCard.ts
export function useShareableCard(elementId: string) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  const generateCard = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const dataUrl = await generateResultCardImage(elementId);
      setImageDataUrl(dataUrl);
      trackEvent('result_card_generated');
    } catch (err) {
      setError(err as Error);
      console.error('Failed to generate card:', err);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const downloadCard = async () => {
    if (!imageDataUrl) return;
    
    await downloadImage(imageDataUrl, 'my-anime-character.png');
    trackEvent('result_card_downloaded');
  };
  
  return {
    generateCard,
    downloadCard,
    imageDataUrl,
    isGenerating,
    error,
  };
}
```

### Design Specifications

#### Card Dimensions
- **Instagram Story:** 1080x1920px (9:16 ratio)
- **Instagram Post:** 1080x1080px (1:1 ratio) - future iteration
- **Twitter:** 1200x675px (16:9 ratio) - future iteration

#### Visual Hierarchy
1. **Character Image** (top 50% of card)
   - High quality, centered
   - Subtle gradient overlay at bottom
   
2. **Personality Section** (middle 30%)
   - Character name as heading
   - 3-5 personality traits with icons
   - Clean, readable typography
   
3. **Branding Section** (bottom 20%)
   - Logo (small, unobtrusive)
   - QR code (scannable but not dominant)
   - Website URL in readable font

#### Color Scheme
- Background: Gradient matching character theme
- Text: High contrast for readability (WCAG AA)
- Accents: Brand colors (#C8A34E gold, #FF6B9D pink)

### Analytics Events

```typescript
// Track throughout the flow
trackEvent('result_card_viewed', { characterId });
trackEvent('result_card_generated', { characterId });
trackEvent('result_card_downloaded', { characterId });
trackEvent('result_card_shared', { characterId, platform });
trackEvent('share_link_clicked', { referrer, characterId });
```

---

## Feature 3: Personalized Anime Recommendations

### Problem Statement
Quiz results are a dead end. Users don't know what to do next. Need to connect quiz results to anime browsing to increase engagement and retention.

### Technical Solution

#### 1. Recommendation Algorithm

```typescript
// lib/recommendation-engine.ts

interface CharacterProfile {
  id: string;
  name: string;
  categoryWeights: {
    visual: number;
    music: number;
    story: number;
    character: number;
  };
  preferredGenres?: string[];
}

interface AnimeScore {
  anime: Anime;
  score: number;
  matchReasons: string[];
}

export class RecommendationEngine {
  /**
   * Get personalized anime recommendations based on character match
   */
  static getRecommendations(
    character: CharacterProfile,
    allAnime: Anime[],
    count: number = 8
  ): AnimeScore[] {
    const scoredAnime = allAnime.map(anime => {
      const score = this.calculateMatchScore(character, anime);
      const reasons = this.getMatchReasons(character, anime);
      
      return { anime, score, matchReasons: reasons };
    });
    
    // Sort by score and add randomization to prevent same results
    const sorted = scoredAnime
      .sort((a, b) => b.score - a.score)
      .slice(0, count * 2); // Get top 2x to allow randomization
    
    // Randomly select from top results
    return this.randomizeTopResults(sorted, count);
  }
  
  /**
   * Calculate match score based on category weights
   */
  private static calculateMatchScore(
    character: CharacterProfile,
    anime: Anime
  ): number {
    const { visual, music, story, character: char } = character.categoryWeights;
    
    const weightedScore = 
      (anime.ratings.visual * visual) +
      (anime.ratings.music * music) +
      (anime.ratings.story * story) +
      (anime.ratings.character * char);
    
    // Bonus for genre match
    let genreBonus = 0;
    if (character.preferredGenres) {
      const matchingGenres = anime.genres.filter(g => 
        character.preferredGenres!.includes(g)
      );
      genreBonus = matchingGenres.length * 0.5;
    }
    
    return weightedScore + genreBonus;
  }
  
  /**
   * Generate human-readable match reasons
   */
  private static getMatchReasons(
    character: CharacterProfile,
    anime: Anime
  ): string[] {
    const reasons: string[] = [];
    const weights = character.categoryWeights;
    
    // Find top 2 weighted categories
    const sortedCategories = Object.entries(weights)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2);
    
    sortedCategories.forEach(([category, weight]) => {
      if (weight > 0.3) {
        const rating = anime.ratings[category as keyof typeof anime.ratings];
        if (rating > 8.0) {
          reasons.push(`Exceptional ${category}`);
        }
      }
    });
    
    return reasons;
  }
  
  /**
   * Add randomization to prevent identical results
   */
  private static randomizeTopResults(
    scored: AnimeScore[],
    count: number
  ): AnimeScore[] {
    // Take top results and shuffle slightly
    const topTier = scored.slice(0, count);
    const shuffled = topTier.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
}
```

#### 2. Character Profiles Data

```typescript
// data/character-profiles.ts

export const CHARACTER_PROFILES: Record<string, CharacterProfile> = {
  'luffy': {
    id: 'luffy',
    name: 'Monkey D. Luffy',
    categoryWeights: {
      visual: 0.2,
      music: 0.1,
      story: 0.4,  // Adventure-focused
      character: 0.3,
    },
    preferredGenres: ['Action', 'Adventure', 'Shounen'],
  },
  'violet-evergarden': {
    id: 'violet-evergarden',
    name: 'Violet Evergarden',
    categoryWeights: {
      visual: 0.4,  // Beautiful animation
      music: 0.3,   // Emotional soundtrack
      story: 0.2,
      character: 0.1,
    },
    preferredGenres: ['Drama', 'Slice of Life'],
  },
  // ... 16 more character profiles
};
```

#### 3. Recommendations Component

```typescript
// components/quiz/RecommendationsSection.tsx

interface RecommendationsSectionProps {
  character: Character;
  allAnime: Anime[];
}

export function RecommendationsSection({ 
  character, 
  allAnime 
}: RecommendationsSectionProps) {
  const profile = CHARACTER_PROFILES[character.id];
  const recommendations = RecommendationEngine.getRecommendations(
    profile,
    allAnime,
    8
  );
  
  useEffect(() => {
    trackEvent('recommendations_viewed', { 
      characterId: character.id,
      count: recommendations.length 
    });
  }, []);
  
  return (
    <section className="recommendations-section">
      <h2>Anime Perfect For You</h2>
      <p>Based on your {character.name} personality</p>
      
      <div className="recommendations-grid">
        {recommendations.map(({ anime, matchReasons }) => (
          <RecommendedAnimeCard
            key={anime.id}
            anime={anime}
            matchReasons={matchReasons}
            onView={() => trackEvent('recommendation_clicked', { 
              animeId: anime.id,
              characterId: character.id 
            })}
          />
        ))}
      </div>
      
      <Link href="/browse">
        <button>Browse All Anime</button>
      </Link>
    </section>
  );
}
```

#### 4. Recommended Anime Card

```typescript
// components/anime/RecommendedAnimeCard.tsx

interface RecommendedAnimeCardProps {
  anime: Anime;
  matchReasons: string[];
  onView: () => void;
}

export function RecommendedAnimeCard({ 
  anime, 
  matchReasons,
  onView 
}: RecommendedAnimeCardProps) {
  return (
    <Link 
      href={`/anime/${anime.id}`}
      onClick={onView}
      className="recommended-card"
    >
      <div className="card-image">
        <Image 
          src={anime.coverImage} 
          alt={anime.title}
          width={200}
          height={300}
        />
      </div>
      
      <div className="card-content">
        <h3>{anime.title}</h3>
        
        <div className="ratings">
          <Badge variant="site">{anime.ratings.site.toFixed(1)}</Badge>
        </div>
        
        {matchReasons.length > 0 && (
          <div className="match-reasons">
            {matchReasons.map(reason => (
              <span key={reason} className="reason-tag">
                ✨ {reason}
              </span>
            ))}
          </div>
        )}
        
        <div className="actions">
          <button>View Details</button>
          <WatchlistButton animeId={anime.id} />
        </div>
      </div>
    </Link>
  );
}
```

### Algorithm Iteration Plan

**Phase 1 (MVP - Day 4):**
- Simple category weight matching
- Basic genre preferences
- Randomization to prevent repetition

**Phase 2 (Week 2):**
- Track which recommendations users click
- Adjust weights based on click-through data
- Add collaborative filtering (users like you als
o liked this)

**Phase 3 (Month 2):**
- Machine learning model based on user behavior
- Personalized weights per user
- A/B test different algorithms

### Success Metrics

- **Click-through rate:** 50% of users click at least one recommendation
- **Browse conversion:** 30% visit browse page from recommendations
- **Watchlist adds:** 20% add recommended anime to watchlist
- **Return visits:** 15% return within 7 days to check recommendations

---

## Data Models

### Character Profile
```typescript
interface CharacterProfile {
  id: string;
  name: string;
  imageUrl: string;
  categoryWeights: {
    visual: number;    // 0-1, sum to 1.0
    music: number;
    story: number;
    character: number;
  };
  preferredGenres?: string[];
  personalityTraits: string[];
}
```

### Anime Score
```typescript
interface AnimeScore {
  anime: Anime;
  score: number;           // Calculated match score
  matchReasons: string[];  // Human-readable reasons
}
```

### Share Event
```typescript
interface ShareEvent {
  userId?: string;
  characterId: string;
  platform: 'native' | 'twitter' | 'facebook' | 'copy';
  timestamp: Date;
  referrer?: string;
}
```

---

## Error Handling

### Image Generation Failures
```typescript
try {
  const imageUrl = await generateResultCardImage('shareable-card');
  setImageDataUrl(imageUrl);
} catch (error) {
  console.error('Image generation failed:', error);
  
  // Fallback: Show text-based share options
  setShowTextShareFallback(true);
  
  // Track error for monitoring
  trackError('image_generation_failed', { error: error.message });
}
```

### Share API Not Supported
```typescript
if (!navigator.share) {
  // Fallback to custom share buttons
  return <CustomShareButtons />;
}
```

### Recommendation Algorithm Failures
```typescript
try {
  const recommendations = RecommendationEngine.getRecommendations(
    profile,
    allAnime,
    8
  );
  
  if (recommendations.length === 0) {
    // Fallback: Show top-rated anime
    return <TopRatedAnime count={8} />;
  }
} catch (error) {
  console.error('Recommendation failed:', error);
  // Fallback: Show trending anime
  return <TrendingAnime count={8} />;
}
```

---

## Performance Considerations

### Image Generation
- **Challenge:** html-to-image can be slow (1-3 seconds)
- **Solution:** Show loading spinner, generate on user action (not automatically)
- **Optimization:** Cache generated images in memory for re-sharing

### Lazy Loading
- **Challenge:** Result cards and recommendations add page weight
- **Solution:** Lazy load recommendations section (below fold)
- **Optimization:** Preload character images during quiz

### Bundle Size
- **Challenge:** html-to-image library adds ~50KB
- **Solution:** Dynamic import, only load when needed
- **Code:**
```typescript
const generateImage = async () => {
  const { toPng } = await import('html-to-image');
  return toPng(element);
};
```

---

## Testing Strategy

### Unit Tests
- `recommendation-engine.test.ts`: Test scoring algorithm
- `image-generator.test.ts`: Test image generation (mocked)
- `share-utils.test.ts`: Test share URL generation

### Integration Tests
- Test full quiz → result → share flow
- Test quiz → result → recommendations → browse flow
- Test mobile menu open → backdrop → close

### E2E Tests
- User completes quiz, downloads result card
- User shares result, friend clicks link
- User clicks recommendation, adds to watchlist

### Manual Testing Checklist
- [ ] Mobile menu works on iOS Safari
- [ ] Result card generates correctly on all devices
- [ ] Download works on iOS and Android
- [ ] Native share works on mobile
- [ ] Recommendations show relevant anime
- [ ] All analytics events fire correctly

---

## Deployment Strategy

### Day 1 Deployment
- Deploy mobile menu fix immediately after testing
- No feature flag needed (bug fix)

### Day 3 Deployment
- Deploy shareable cards behind feature flag
- Enable for 10% of users initially
- Monitor error rates and share rates
- Roll out to 100% if metrics are good

### Day 4 Deployment
- Deploy recommendations with shareable cards
- No separate feature flag (complementary feature)

### Rollback Plan
- Feature flags allow instant disable
- Mobile menu fix has no rollback (it's a fix)
- Monitor error tracking dashboard for issues

---

## Future Enhancements (Post-MVP)

### Shareable Cards v2
- Multiple card designs (user can choose)
- Animated GIFs for social media
- Video clips with character moments
- Personalized anime recommendations on card

### Recommendations v2
- Machine learning model
- Collaborative filtering
- User feedback ("Not interested" button)
- Explanation of why each anime was recommended

### Mobile Menu v2
- Smooth slide-in animation
- User profile quick access
- Notification badges
- Search bar in menu

---

## Technical Debt & Trade-offs

### Accepted Trade-offs
1. **Simple recommendation algorithm:** Using category weights instead of ML for speed
2. **Single card design:** Not A/B testing designs initially
3. **Manual character profiles:** Not auto-generating from quiz data

### Future Refactoring
1. **Recommendation engine:** Move to backend API for better performance
2. **Image generation:** Consider server-side rendering for consistency
3. **Analytics:** Batch events instead of real-time for performance

---

## Dependencies

### External Libraries
- `html-to-image` (^1.11.11): Convert DOM to image
- `qrcode.react` (^3.1.0): Generate QR codes
- `react-share` (^5.0.3): Social share buttons (optional)

### Internal Dependencies
- Quiz result data structure
- Character images (18 files)
- Anime database with ratings
- Analytics tracking system

### API Dependencies
- None (all client-side for MVP)
- Future: Recommendation API for ML model

---

## Monitoring & Observability

### Key Metrics Dashboard
- Share rate by character
- Download rate by device
- Recommendation click-through rate
- Mobile menu error rate
- Image generation success rate

### Alerts
- Share rate drops below 15%
- Image generation failure rate > 5%
- Mobile menu errors > 1%
- Recommendation API errors (future)

### A/B Testing (Future)
- Card design variations
- Recommendation count (6 vs 8 vs 12)
- Share button placement
- CTA copy variations

---

## Conclusion

This design provides a complete technical blueprint for implementing the Council's priority features. The architecture is modular, testable, and allows for rapid iteration based on user feedback and metrics.

**Key Success Factors:**
1. Ship fast (4 days)
2. Measure everything (analytics)
3. Iterate based on data
4. Maintain code quality

**Next Steps:**
1. Review and approve design
2. Begin implementation (Day 1)
3. Daily standups to track progress
4. Ship and measure
