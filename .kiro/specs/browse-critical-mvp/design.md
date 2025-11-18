# Design Document

## Overview

This design implements 5 critical MVP enhancements to the Browse Page, focusing on visual polish, simplified UX, performance optimization, engagement features, and conversion tracking. The approach prioritizes quick wins that deliver immediate user value while laying groundwork for future scalability.

## Architecture

### Component Structure

```
BrowseContent (Client Component)
├── TrendingSection (New)
│   └── TrendingCarousel
├── SearchBar (Enhanced - Sticky)
├── FilterSection (Simplified)
│   ├── SortButtons (User-friendly labels)
│   ├── GenreFilters (Top 6 + Dropdown)
│   ├── StatusFilters
│   └── ClearAllButton (New)
├── ResultsCount (Enhanced with social proof)
├── AnimeGrid (Enhanced with skeleton loaders)
│   └── AnimeCard (Enhanced)
│       ├── CardImage (Blur placeholder)
│       ├── CardContent
│       ├── SocialProofBadge (New)
│       ├── WatchlistButton
│       └── WatchNowButton (New)
├── EmptyState (Enhanced with suggestions)
└── NewsletterPrompt (New - Conditional)
```

### State Management

```typescript
interface BrowseState {
  // Existing
  allAnime: Anime[];
  loading: boolean;
  error: string | null;
  sortBy: SortOption;
  searchQuery: string;
  selectedGenres: string[];
  statusFilter: StatusOption;
  
  // New
  page: number;
  itemsPerPage: number;
  trendingAnime: Anime[];
  watchlistAddCount: number;
  showNewsletterPrompt: boolean;
}
```

### URL State Synchronization

Filters will sync with URL params for shareable links:
- `/browse?search=naruto&genres=action,adventure&sort=popular&status=airing`

## Components and Interfaces

### 1. Enhanced Anime Card

**Visual Enhancements:**
- Hover state: `transform: scale(1.05)` with `box-shadow: 0 10px 30px rgba(0,0,0,0.2)`
- Transition: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`
- Blur placeholder on images using Next.js `placeholder="blur"`

**New Elements:**
- Social proof badge: "🔥 234 watching" (top-left overlay)
- Watch Now button: Secondary CTA below watchlist button
- Improved genre tags with better contrast

```typescript
interface AnimeCardProps {
  anime: Anime;
  onWatchlistToggle: (id: string) => void;
  onWatchNowClick: (id: string) => void;
  socialProof?: {
    watchingCount: number;
    isTrending: boolean;
  };
}
```

### 2. Skeleton Loader

Replace spinner with skeleton grid matching actual card layout:

```typescript
function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[2/3] bg-gray-300 rounded-t-xl" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        <div className="h-3 bg-gray-300 rounded w-1/2" />
        <div className="h-8 bg-gray-300 rounded" />
      </div>
    </div>
  );
}
```

### 3. Simplified Filter Section

**Genre Filters:**
- Show top 6 genres: Action, Adventure, Comedy, Drama, Fantasy, Romance
- "More Genres +" button opens dropdown with remaining genres
- Dropdown uses portal/modal on mobile for better UX

**Sort Options Mapping:**
```typescript
const sortOptions = [
  { value: 'site', label: 'Most Popular', icon: '⭐' },
  { value: 'visual', label: 'Best Visuals', icon: '🎨' },
  { value: 'music', label: 'Best Music', icon: '🎵' },
  { value: 'story', label: 'Best Story', icon: '📖' },
  { value: 'character', label: 'Best Characters', icon: '👥' },
];
```

**Clear All Button:**
- Only visible when filters are active
- Resets: search, genres, status, sort (back to default)
- Positioned prominently near filters

### 4. Sticky Search Bar

```typescript
const [isSticky, setIsSticky] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setIsSticky(window.scrollY > 200);
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

Sticky styles:
- Fixed position at top with backdrop blur
- Smooth transition when becoming sticky
- Z-index above content but below navigation
- Maintains search state and shows active filter count

### 5. Trending Section

**Data Source:**
- Track watchlist additions with timestamps in localStorage
- Calculate trending: anime added to watchlists in last 7 days
- Sort by addition count, show top 6

**Layout:**
- Horizontal scrollable carousel above main grid
- Smaller card size (aspect ratio 16:9 instead of 2:3)
- "Trending Now 🔥" header with flame animation

```typescript
interface TrendingData {
  animeId: string;
  addCount: number;
  lastAdded: number; // timestamp
}

function calculateTrending(watchlistHistory: WatchlistEvent[]): string[] {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentAdds = watchlistHistory.filter(e => e.timestamp > sevenDaysAgo);
  
  const counts = recentAdds.reduce((acc, event) => {
    acc[event.animeId] = (acc[event.animeId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([id]) => id);
}
```

### 6. Pagination/Infinite Scroll

**Implementation Choice:** Start with pagination (simpler, better for MVP)

```typescript
const ITEMS_PER_PAGE = 24;

const paginatedAnime = useMemo(() => {
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  return filteredAndSortedAnime.slice(start, end);
}, [filteredAndSortedAnime, page]);
```

**Pagination UI:**
- Simple prev/next buttons
- Page numbers (show 5 at a time)
- "Showing 1-24 of 156 anime"
- Scroll to top on page change

**Future:** Can upgrade to infinite scroll using Intersection Observer

### 7. URL State Management

```typescript
// Sync filters to URL
useEffect(() => {
  const params = new URLSearchParams();
  if (searchQuery) params.set('search', searchQuery);
  if (selectedGenres.length) params.set('genres', selectedGenres.join(','));
  if (sortBy !== 'site') params.set('sort', sortBy);
  if (statusFilter !== 'all') params.set('status', statusFilter);
  if (page > 1) params.set('page', page.toString());
  
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', newUrl);
}, [searchQuery, selectedGenres, sortBy, statusFilter, page]);

// Read from URL on mount
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('search')) setSearchQuery(params.get('search')!);
  if (params.get('genres')) setSelectedGenres(params.get('genres')!.split(','));
  if (params.get('sort')) setSortBy(params.get('sort') as SortOption);
  if (params.get('status')) setStatusFilter(params.get('status') as StatusOption);
  if (params.get('page')) setPage(parseInt(params.get('page')!));
}, []);
```

### 8. Enhanced Empty State

Instead of just "No anime found":

```typescript
function EmptyState({ onClearFilters, suggestions }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-2xl font-bold mb-2">No anime found</h3>
      <p className="text-secondary mb-6">
        Try adjusting your filters or search terms
      </p>
      <button onClick={onClearFilters} className="btn-primary mb-8">
        Clear All Filters
      </button>
      
      <div className="mt-8">
        <h4 className="text-lg font-semibold mb-4">You might like these:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestions.map(anime => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

Suggestions logic:
- Show 3 most popular anime from user's previously selected genres
- If no genre history, show overall most popular

### 9. Newsletter Prompt

Trigger after 3 watchlist additions:

```typescript
function NewsletterPrompt({ onClose, onSignup }: NewsletterPromptProps) {
  return (
    <div className="fixed bottom-4 right-4 bg-card p-6 rounded-xl shadow-2xl max-w-sm z-50">
      <button onClick={onClose} className="absolute top-2 right-2">✕</button>
      <div className="text-4xl mb-2">📬</div>
      <h3 className="font-bold text-lg mb-2">Love anime?</h3>
      <p className="text-sm text-secondary mb-4">
        Get weekly recommendations based on your watchlist!
      </p>
      <input 
        type="email" 
        placeholder="your@email.com"
        className="w-full px-3 py-2 border rounded mb-3"
      />
      <button onClick={onSignup} className="btn-primary w-full">
        Subscribe
      </button>
    </div>
  );
}
```

### 10. Analytics Tracking

```typescript
// Track user interactions
function trackEvent(event: string, data: any) {
  // Send to analytics service (Google Analytics, Mixpanel, etc.)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, data);
  }
  
  // Also store locally for trending calculation
  const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
  events.push({ event, data, timestamp: Date.now() });
  localStorage.setItem('analytics_events', JSON.stringify(events));
}

// Usage
trackEvent('filter_applied', { type: 'genre', value: 'action' });
trackEvent('search_performed', { query: searchQuery });
trackEvent('sort_changed', { sortBy });
trackEvent('watchlist_added', { animeId });
```

## Data Models

### Watchlist Event (for trending)

```typescript
interface WatchlistEvent {
  animeId: string;
  action: 'add' | 'remove';
  timestamp: number;
  userId?: string; // for future multi-user support
}
```

### Analytics Event

```typescript
interface AnalyticsEvent {
  event: string;
  data: Record<string, any>;
  timestamp: number;
  sessionId: string;
}
```

## Error Handling

### Error Boundary

```typescript
class BrowseErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
          <p className="text-secondary mb-6">
            We're having trouble loading the browse page
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

### API Error Handling

```typescript
async function loadAnime() {
  try {
    const response = await fetch('/api/anime');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const result = await response.json();
    setAllAnime(result.data || result);
  } catch (err) {
    console.error('Failed to load anime:', err);
    setError('Unable to load anime. Please check your connection and try again.');
    trackEvent('api_error', { endpoint: '/api/anime', error: err.message });
  } finally {
    setLoading(false);
  }
}
```

## Testing Strategy

### Unit Tests
- Filter logic (genre, status, search)
- Sort logic (all sort options)
- Pagination calculations
- Trending calculation algorithm
- URL param parsing/serialization

### Integration Tests
- Filter + search combinations
- URL state sync (apply filters, check URL, reload, verify state)
- Watchlist integration
- Newsletter prompt trigger

### Visual Regression Tests
- Skeleton loader appearance
- Card hover states
- Mobile responsive layouts
- Sticky search bar behavior

### Performance Tests
- Filtering performance with 1000+ anime
- Image loading optimization
- Scroll performance with pagination

## Accessibility

### Keyboard Navigation
- Tab through all filters and cards
- Enter/Space to activate buttons
- Escape to close dropdowns/modals
- Arrow keys for pagination

### ARIA Labels
```typescript
<button 
  aria-label={`Filter by ${genre.label} genre`}
  aria-pressed={selectedGenres.includes(genre.id)}
>
  {genre.icon} {genre.label}
</button>

<div 
  role="status" 
  aria-live="polite"
  aria-atomic="true"
>
  Showing {count} of {total} anime
</div>
```

### Screen Reader Announcements
- Announce filter changes
- Announce result count updates
- Announce loading states

## Performance Optimizations

1. **Image Optimization**
   - Next.js Image with blur placeholders
   - Lazy loading for below-fold images
   - Responsive image sizes

2. **Memoization**
   - useMemo for filtered/sorted results
   - useCallback for event handlers
   - React.memo for AnimeCard component

3. **Debouncing**
   - Search input (300ms)
   - Scroll events for sticky header (100ms)

4. **Code Splitting**
   - Lazy load newsletter prompt
   - Lazy load genre dropdown
   - Dynamic imports for heavy components

## Mobile Considerations

- Touch-friendly 44px minimum tap targets
- Swipeable trending carousel
- Bottom sheet for genre dropdown (better than dropdown on mobile)
- Sticky search bar with compact design on mobile
- Optimized image sizes for mobile bandwidth

## Future Enhancements (Out of Scope)

- Server-side filtering/pagination
- Advanced personalization engine
- Video preview on hover
- Multiple watchlist categories
- Social features (comments, ratings)
- PWA offline support
