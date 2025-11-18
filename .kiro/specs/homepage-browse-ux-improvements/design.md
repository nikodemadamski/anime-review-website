# Design Document

## Overview

This design implements critical UX improvements for both the homepage and browse page, focusing on mobile-first design principles while maintaining desktop functionality. The solution addresses user feedback about information hierarchy on mobile and provides flexible viewing options for the browse page.

### Design Goals

1. **Mobile-First Information Architecture**: Place critical information (rating categories) above the fold on mobile
2. **Flexible Browse Experience**: Provide three distinct view modes optimized for different use cases
3. **Performance**: Maintain fast load times and smooth transitions
4. **Accessibility**: Ensure all features work with keyboard navigation and screen readers
5. **Progressive Enhancement**: Desktop experience remains unchanged while mobile gets enhanced features

## Architecture

### Component Structure

```
Homepage
├── HeroLogo (modified)
├── HowWeRateSection (modified)
│   ├── CategoryCardRow (new - mobile)
│   └── CategoryCardGrid (existing - desktop)
├── TrendingSection (unchanged)
├── TopRatedSection (unchanged)
└── ... (other sections)

Browse Page
├── BrowseContent (modified)
│   ├── ViewModeToggle (new - mobile only)
│   ├── FilterControls (unchanged)
│   └── AnimeDisplay (modified)
│       ├── LargeView (new)
│       ├── GridView (modified)
│       └── ListView (new)
```

### State Management

```typescript
// Browse Page View Mode State
interface ViewModeState {
  mode: 'large' | 'grid' | 'list';
  isMobile: boolean;
}

// Local Storage Schema
interface BrowsePreferences {
  viewMode: 'large' | 'grid' | 'list';
  lastUpdated: string;
}
```

## Components and Interfaces

### 1. Homepage Logo Reduction

**Component**: `HowWeRateSection.tsx`

**Changes**:
- Reduce logo width from 400px to 240px (60% reduction)
- Reduce logo height from 200px to 120px (60% reduction)
- Maintain aspect ratio and image quality

**Implementation**:
```typescript
// Current
<Image
  src="/logo-dark.png"
  alt="Anime Reviews Logo"
  width={400}
  height={200}
  className="mx-auto dark:hidden"
  priority
/>

// New
<Image
  src="/logo-dark.png"
  alt="Anime Reviews Logo"
  width={240}
  height={120}
  className="mx-auto dark:hidden"
  priority
/>
```

### 2. Mobile Category Cards Row

**New Component**: `CategoryCardRow.tsx`

**Purpose**: Display category cards in a horizontal scrollable row on mobile

**Props**:
```typescript
interface CategoryCardRowProps {
  categories: CategoryExplanation[];
}

interface CategoryExplanation {
  category: 'Visual' | 'Music' | 'Story' | 'Character';
  color: string;
  icon: string;
  href: string;
}
```

**Design Specifications**:
- **Mobile (< 768px)**:
  - Horizontal scroll container with snap points
  - Each card: 120px width × 140px height
  - 16px gap between cards
  - 16px padding on container sides
  - Show icon (48px) and category name only
  - No descriptions
  - Smooth scroll behavior with CSS scroll-snap
  
- **Visual Design**:
  ```css
  .category-row {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 16px;
    padding: 0 16px;
    -webkit-overflow-scrolling: touch;
  }
  
  .category-card-mobile {
    width: 120px;
    height: 140px;
    flex-shrink: 0;
    scroll-snap-align: start;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
  
  .category-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
  }
  
  .category-name {
    font-size: 14px;
    font-weight: 700;
    text-align: center;
  }
  ```

### 3. Desktop Category Cards Grid

**Component**: `HowWeRateSection.tsx` (modified)

**Changes**:
- Reduce padding from `p-6` to `p-4` (33% reduction)
- Maintain 2×2 grid layout
- Keep all existing content (icon, title, description)
- Reduce icon size from 64px to 56px
- Reduce title font from `text-xl` to `text-lg`

**Responsive Breakpoint**:
```typescript
// Mobile: Show CategoryCardRow
// Desktop (>= 768px): Show CategoryCardGrid

<div className="md:hidden">
  <CategoryCardRow categories={categories} />
</div>

<div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Existing desktop cards with reduced padding */}
</div>
```

### 4. Mobile Homepage Content Reordering

**Component**: `page.tsx` (Homepage)

**Changes**:
- Move HowWeRateSection to top (after header)
- Reduce section heading from `text-3xl md:text-4xl` to `text-2xl md:text-4xl`
- Ensure category cards appear within first viewport on mobile

**Content Order**:
1. Logo (reduced size)
2. "How We Rate Anime" heading (smaller on mobile)
3. Category cards row (mobile) / grid (desktop)
4. Trending section
5. Top rated section
6. Quiz CTA
7. Featured reviews
8. Email signup

### 5. View Mode Toggle Component

**New Component**: `ViewModeToggle.tsx`

**Purpose**: Allow mobile users to switch between three view modes

**Props**:
```typescript
interface ViewModeToggleProps {
  currentMode: 'large' | 'grid' | 'list';
  onChange: (mode: 'large' | 'grid' | 'list') => void;
}
```

**Design Specifications**:
- **Position**: Below filter controls, above anime results
- **Layout**: Three buttons in a row, equal width
- **Size**: Each button 44px height (touch-friendly)
- **Icons**: 
  - Large: Single square icon
  - Grid: 2×2 grid icon
  - List: Three horizontal lines icon
- **Active State**: Filled background with accent color
- **Inactive State**: Outline style with transparent background

**Visual Design**:
```typescript
const ViewModeToggle = ({ currentMode, onChange }: ViewModeToggleProps) => {
  return (
    <div className="flex gap-2 mb-4 md:hidden" role="group" aria-label="View mode toggle">
      <button
        onClick={() => onChange('large')}
        aria-label="Large view - one anime per screen"
        aria-pressed={currentMode === 'large'}
        className={`flex-1 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
          currentMode === 'large' ? 'bg-accent text-white' : 'bg-card-background border-2 border-border'
        }`}
      >
        <SquareIcon />
        <span className="text-sm">Large</span>
      </button>
      {/* Similar for Grid and List */}
    </div>
  );
};
```

### 6. Large View Mode

**Component**: `AnimeCardLarge.tsx` (new)

**Purpose**: Display one anime per row with full details

**Design Specifications**:
- **Layout**: Full width card, vertical orientation
- **Cover Image**: 
  - Aspect ratio 2:3
  - Minimum height 400px
  - Maximum height 500px
  - Rounded corners (16px)
- **Content Below Image**:
  - Title (text-xl, font-bold, 2 lines max)
  - All 4 rating badges in a row (Visual, Music, Story, Character)
  - Genres (3 max, pill style)
  - Add to Watchlist button
  - Watch Now button
- **Spacing**: 24px gap between cards

**Component Structure**:
```typescript
interface AnimeCardLargeProps {
  anime: Anime;
  onWatchlistToggle: (id: string) => void;
  onWatchNowClick: (id: string, title: string) => void;
  isInWatchlist: boolean;
}

const AnimeCardLarge = ({ anime, onWatchlistToggle, onWatchNowClick, isInWatchlist }: AnimeCardLargeProps) => {
  return (
    <div className="bg-card-background rounded-xl overflow-hidden shadow-lg">
      {/* Cover Image */}
      <Link href={`/anime/${anime.id}`}>
        <div className="relative aspect-[2/3] min-h-[400px] max-h-[500px]">
          <Image
            src={anime.coverImage}
            alt={anime.title}
            fill
            className="object-cover"
          />
          {/* Trending badge if applicable */}
        </div>
      </Link>
      
      {/* Content */}
      <div className="p-4 space-y-3">
        <Link href={`/anime/${anime.id}`}>
          <h3 className="text-xl font-bold line-clamp-2">{anime.title}</h3>
        </Link>
        
        {/* All 4 ratings */}
        <div className="flex gap-2 flex-wrap">
          <Badge variant="visual">{anime.ratings.visual.toFixed(1)}</Badge>
          <Badge variant="music">{anime.ratings.music.toFixed(1)}</Badge>
          <Badge variant="story">{anime.ratings.story.toFixed(1)}</Badge>
          <Badge variant="character">{anime.ratings.character.toFixed(1)}</Badge>
        </div>
        
        {/* Genres */}
        <div className="flex gap-2 flex-wrap">
          {anime.genres.slice(0, 3).map(genre => (
            <span key={genre} className="text-xs px-2 py-1 rounded-full bg-text-block">
              {genre}
            </span>
          ))}
        </div>
        
        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={() => onWatchlistToggle(anime.id)}
            className="w-full py-3 rounded-lg font-medium"
          >
            {isInWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
          </button>
          <WatchNowButton 
            animeId={anime.id}
            animeTitle={anime.title}
            onWatchNowClick={onWatchNowClick}
          />
        </div>
      </div>
    </div>
  );
};
```

### 7. Grid View Mode

**Component**: Modify existing grid in `BrowseContent.tsx`

**Design Specifications**:
- **Layout**: 2×2 grid (2 columns)
- **Card Size**: Approximately 4 cards visible per viewport
- **Content**: 
  - Cover image (aspect ratio 2:3)
  - Title (1 line, truncated)
  - Primary rating badge only (based on current sort)
  - No genres
  - No action buttons
- **Interaction**: Tap anywhere on card to navigate to detail page

**CSS**:
```css
.grid-view {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.anime-card-grid {
  aspect-ratio: 2/3;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}
```

### 8. List View Mode

**Component**: `AnimeCardList.tsx` (new)

**Purpose**: Display anime in compact list format with all ratings

**Design Specifications**:
- **Layout**: Horizontal card, one per row
- **Height**: Maximum 120px
- **Structure**:
  - Left: Thumbnail (80px × 120px)
  - Right: Content area
    - Row 1: Rank number + Title (1 line)
    - Row 2: All 4 rating badges (compact, 16px height)
    - Row 3: Primary genre (1 only)
- **Spacing**: 8px gap between cards

**Component Structure**:
```typescript
interface AnimeCardListProps {
  anime: Anime;
  rank: number;
}

const AnimeCardList = ({ anime, rank }: AnimeCardListProps) => {
  return (
    <Link href={`/anime/${anime.id}`}>
      <div className="flex gap-3 bg-card-background rounded-lg overflow-hidden h-[120px] hover:shadow-lg transition-shadow">
        {/* Thumbnail */}
        <div className="relative w-[80px] h-[120px] flex-shrink-0">
          <Image
            src={anime.coverImage}
            alt={anime.title}
            fill
            className="object-cover"
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 py-2 pr-2 flex flex-col justify-between min-w-0">
          {/* Title row */}
          <div className="flex items-start gap-2">
            <span className="text-xs font-bold text-accent flex-shrink-0">#{rank}</span>
            <h3 className="text-sm font-bold line-clamp-1 flex-1">{anime.title}</h3>
          </div>
          
          {/* Ratings row */}
          <div className="flex gap-1 flex-wrap">
            <Badge variant="visual" size="xs">{anime.ratings.visual.toFixed(1)}</Badge>
            <Badge variant="music" size="xs">{anime.ratings.music.toFixed(1)}</Badge>
            <Badge variant="story" size="xs">{anime.ratings.story.toFixed(1)}</Badge>
            <Badge variant="character" size="xs">{anime.ratings.character.toFixed(1)}</Badge>
          </div>
          
          {/* Genre */}
          <div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-text-block">
              {anime.genres[0]}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
```

## Data Models

### Local Storage Schema

```typescript
// Key: 'anime-browse-preferences'
interface BrowsePreferences {
  viewMode: 'large' | 'grid' | 'list';
  lastUpdated: string; // ISO 8601 timestamp
  version: number; // Schema version for future migrations
}

// Helper functions
const STORAGE_KEY = 'anime-browse-preferences';
const STORAGE_VERSION = 1;

function saveViewMode(mode: 'large' | 'grid' | 'list'): void {
  const preferences: BrowsePreferences = {
    viewMode: mode,
    lastUpdated: new Date().toISOString(),
    version: STORAGE_VERSION,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
}

function loadViewMode(): 'large' | 'grid' | 'list' {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return 'large'; // Default
    
    const preferences: BrowsePreferences = JSON.parse(stored);
    
    // Validate
    if (preferences.version !== STORAGE_VERSION) return 'large';
    if (!['large', 'grid', 'list'].includes(preferences.viewMode)) return 'large';
    
    return preferences.viewMode;
  } catch {
    return 'large'; // Fallback on error
  }
}
```

### Badge Component Enhancement

```typescript
// Add new size variant to Badge component
interface BadgeProps {
  variant: 'default' | 'success' | 'warning' | 'error' | 'info' | 'site' | 'visual' | 'music' | 'story' | 'character';
  size?: 'sm' | 'md' | 'xs'; // Add 'xs' for list view
  children: React.ReactNode;
}

// Size styles
const sizeStyles = {
  xs: 'text-[10px] px-1.5 py-0.5',
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1.5',
};
```

## Error Handling

### View Mode Persistence Errors

**Scenario**: Local storage is unavailable or corrupted

**Handling**:
1. Catch all localStorage errors
2. Fall back to default 'large' view mode
3. Continue functioning without persistence
4. Log error to analytics (non-blocking)

```typescript
function useViewMode() {
  const [viewMode, setViewMode] = useState<'large' | 'grid' | 'list'>(() => {
    if (typeof window === 'undefined') return 'large';
    return loadViewMode();
  });
  
  const updateViewMode = (mode: 'large' | 'grid' | 'list') => {
    setViewMode(mode);
    try {
      saveViewMode(mode);
      trackViewModeChange(mode);
    } catch (error) {
      console.error('Failed to save view mode preference:', error);
      // Continue without persistence
    }
  };
  
  return [viewMode, updateViewMode] as const;
}
```

### Image Loading Errors

**Scenario**: Anime cover images fail to load in any view mode

**Handling**:
- Use existing `imageErrors` state pattern
- Show placeholder SVG
- Maintain layout stability

### Responsive Breakpoint Detection

**Scenario**: Window resize crosses mobile/desktop threshold

**Handling**:
```typescript
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
}
```

## Testing Strategy

### Unit Tests

1. **ViewModeToggle Component**
   - Renders three buttons
   - Calls onChange with correct mode
   - Shows active state correctly
   - Keyboard navigation works

2. **Local Storage Helpers**
   - saveViewMode stores correct data
   - loadViewMode retrieves correct data
   - Handles corrupted data gracefully
   - Returns default on error

3. **AnimeCardLarge Component**
   - Renders all 4 rating badges
   - Shows correct anime data
   - Calls callbacks correctly
   - Handles missing data

4. **AnimeCardList Component**
   - Renders in correct height (120px)
   - Shows rank number
   - Displays all 4 ratings
   - Truncates long titles

### Integration Tests

1. **View Mode Switching**
   - Switch from Large to Grid updates layout
   - Switch from Grid to List updates layout
   - Preference persists across page reloads
   - Desktop ignores mobile view modes

2. **Homepage Mobile Layout**
   - Category cards appear above fold
   - Horizontal scroll works smoothly
   - Cards snap to position
   - Links navigate correctly

3. **Responsive Behavior**
   - Mobile shows ViewModeToggle
   - Desktop hides ViewModeToggle
   - Resize window updates layout
   - No layout shift during transitions

### Visual Regression Tests

1. Homepage logo at 60% size
2. Category cards in horizontal row (mobile)
3. Category cards in 2×2 grid (desktop)
4. Large view mode layout
5. Grid view mode layout (2×2)
6. List view mode layout
7. View mode toggle component

### Accessibility Tests

1. **Keyboard Navigation**
   - Tab through view mode toggle
   - Enter/Space activates buttons
   - Focus visible on all interactive elements

2. **Screen Reader**
   - View mode toggle announces correctly
   - View mode changes announced
   - All anime cards have proper labels
   - ARIA attributes correct

3. **Touch Targets**
   - All buttons minimum 44×44px
   - Adequate spacing between targets
   - No accidental taps

### Performance Tests

1. **View Mode Transition**
   - Completes within 300ms
   - No layout thrashing
   - Smooth CSS transitions

2. **Image Loading**
   - Lazy loading works in all views
   - Placeholder prevents layout shift
   - Progressive loading for large view

3. **Scroll Performance**
   - Horizontal scroll smooth on mobile
   - Vertical scroll maintains 60fps
   - No jank during view mode switch

## Performance Considerations

### CSS Transitions

Use GPU-accelerated properties for smooth animations:
```css
.view-transition {
  transition: opacity 200ms ease-in-out, transform 200ms ease-in-out;
  will-change: opacity, transform;
}
```

### Image Optimization

- **Large View**: Load full-size images (priority for first 2)
- **Grid View**: Load medium-size images (400px width)
- **List View**: Load thumbnails (160px width)

```typescript
const imageSizes = {
  large: '(max-width: 768px) 100vw, 50vw',
  grid: '(max-width: 768px) 50vw, 25vw',
  list: '80px',
};
```

### Scroll Performance

- Use `scroll-snap` for category cards (CSS-based, no JS)
- Use `will-change` sparingly
- Debounce resize listeners
- Use `passive: true` for scroll listeners

### Bundle Size

- No new dependencies required
- Reuse existing components (Badge, Card, Image)
- Total new code: ~500 lines
- Estimated bundle increase: ~2KB gzipped

## Accessibility

### ARIA Labels

```typescript
// View Mode Toggle
<div role="group" aria-label="View mode toggle">
  <button
    aria-label="Large view - one anime per screen"
    aria-pressed={currentMode === 'large'}
  >
    Large
  </button>
</div>

// Category Cards Row
<div role="list" aria-label="Rating categories">
  <Link role="listitem" aria-label="Visual rating category">
    {/* Card content */}
  </Link>
</div>

// Anime Cards
<div role="list" aria-label="Anime results">
  <article role="listitem" aria-label={`${anime.title}, rated ${anime.ratings.site}`}>
    {/* Card content */}
  </article>
</div>
```

### Keyboard Navigation

- All interactive elements focusable
- Logical tab order
- Enter/Space activate buttons
- Escape closes modals
- Arrow keys for horizontal scroll (optional enhancement)

### Screen Reader Announcements

```typescript
// Announce view mode changes
const [announcement, setAnnouncement] = useState('');

const handleViewModeChange = (mode: string) => {
  setViewMode(mode);
  setAnnouncement(`View mode changed to ${mode}`);
};

// In JSX
<div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
  {announcement}
</div>
```

### Color Contrast

- All text meets WCAG AA standards (4.5:1 for normal text)
- Interactive elements have 3:1 contrast with background
- Focus indicators visible (2px outline, 3:1 contrast)

## Analytics Events

### New Events to Track

```typescript
// View mode changes
trackEvent('browse_view_mode_change', {
  from_mode: 'large',
  to_mode: 'grid',
  is_mobile: true,
  timestamp: Date.now(),
});

// Category card clicks (mobile)
trackEvent('homepage_category_click', {
  category: 'visual',
  device: 'mobile',
  position: 1, // Position in horizontal scroll
});

// View mode on page load
trackEvent('browse_page_view', {
  view_mode: 'large',
  is_default: true,
  is_mobile: true,
});

// Homepage scroll depth (mobile)
trackEvent('homepage_scroll', {
  depth_percentage: 50,
  saw_categories: true,
  device: 'mobile',
});
```

### Analytics Integration

Add to existing `analytics-events.ts`:
```typescript
export function trackViewModeChange(
  fromMode: string,
  toMode: string,
  isMobile: boolean
): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Google Analytics
    window.gtag?.('event', 'view_mode_change', {
      from_mode: fromMode,
      to_mode: toMode,
      is_mobile: isMobile,
    });
    
    // Console log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] View mode change:', { fromMode, toMode, isMobile });
    }
  } catch (error) {
    console.error('Analytics error:', error);
  }
}

export function trackCategoryClick(
  category: string,
  device: 'mobile' | 'desktop',
  position?: number
): void {
  if (typeof window === 'undefined') return;
  
  try {
    window.gtag?.('event', 'category_click', {
      category,
      device,
      position,
    });
  } catch (error) {
    console.error('Analytics error:', error);
  }
}
```

## Migration Strategy

### Phase 1: Homepage Changes (Low Risk)
1. Reduce logo size
2. Create CategoryCardRow component
3. Update HowWeRateSection with responsive logic
4. Test on mobile and desktop

### Phase 2: Browse Page - View Toggle (Medium Risk)
1. Create ViewModeToggle component
2. Add local storage helpers
3. Implement view mode state management
4. Test persistence

### Phase 3: Browse Page - Large View (Medium Risk)
1. Create AnimeCardLarge component
2. Integrate with BrowseContent
3. Test with real data
4. Verify performance

### Phase 4: Browse Page - List View (Low Risk)
1. Create AnimeCardList component
2. Add to view mode switch
3. Test layout and interactions

### Phase 5: Analytics & Polish (Low Risk)
1. Add analytics events
2. Test all transitions
3. Accessibility audit
4. Performance optimization

## Rollback Plan

Each phase can be rolled back independently:

1. **Homepage**: Revert logo size and category layout changes
2. **View Toggle**: Hide component, use default grid
3. **Large View**: Fall back to grid view
4. **List View**: Remove from toggle options

Feature flags (optional):
```typescript
const FEATURES = {
  MOBILE_CATEGORY_ROW: true,
  VIEW_MODE_TOGGLE: true,
  LARGE_VIEW: true,
  LIST_VIEW: true,
};
```

## Future Enhancements

1. **Swipe Gestures**: Swipe between view modes on mobile
2. **View Mode Presets**: Save custom view preferences per sort/filter
3. **Compact Mode**: Even denser list view for power users
4. **Category Animations**: Subtle animations on category card interactions
5. **Smart Defaults**: ML-based view mode suggestions based on usage patterns
6. **Infinite Scroll**: Replace pagination in large view mode
7. **Card Customization**: Let users choose which ratings to show in list view
