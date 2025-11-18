# Critical MVP Design Document

## Overview

This design document outlines the technical implementation for 5 critical fixes identified through user testing and council review. These fixes address mobile usability issues and visual clarity problems that directly impact user engagement.

**Estimated Total Effort:** 12 hours
**Target Ship Date:** 1-2 days

---

## Architecture

### Component Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Layout.tsx (UPDATE - mobile menu fix)
│   │   └── MobileMenu.tsx (NEW - extracted component)
│   ├── ui/
│   │   └── Badge.tsx (UPDATE - add category colors)
│   └── browse/
│       ├── FilterPills.tsx (UPDATE - touch targets)
│       ├── SortButtons.tsx (UPDATE - touch targets)
│       └── EmptyState.tsx (NEW - no results messaging)
├── app/
│   └── browse/
│       └── BrowseContent.tsx (UPDATE - lazy loading, hierarchy)
└── hooks/
    └── useMobileMenu.ts (NEW - menu state management)
```

---

## Design 1: Mobile Menu Overlay Fix

### Problem
- Menu overlays content but doesn't block clicks underneath
- No backdrop to indicate modal state
- Body scrolls while menu is open
- No click-outside-to-close functionality
- Z-index conflicts with other elements

### Solution Architecture

#### 1.1 Create Mobile Menu Hook
**File:** `src/hooks/useMobileMenu.ts`

```typescript
import { useState, useEffect } from 'react';

export function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Lock body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(!isOpen);

  return { isOpen, open, close, toggle };
}
```

#### 1.2 Update Layout Component
**File:** `src/components/layout/Layout.tsx`

**Changes:**
1. Extract mobile menu to separate component
2. Add backdrop overlay
3. Implement click-outside-to-close
4. Fix z-index layering

**Z-Index Strategy:**
- Header: `z-40`
- Mobile Menu Backdrop: `z-50`
- Mobile Menu: `z-50` (same layer as backdrop)
- Modals/Dialogs: `z-60+` (for future use)

**Implementation:**
```tsx
// Backdrop overlay
{isMenuOpen && (
  <div
    className="fixed inset-0 bg-black/50 md:hidden"
    style={{ zIndex: 50 }}
    onClick={closeMenu}
    aria-hidden="true"
  />
)}

// Mobile menu
<div
  className={`fixed top-16 right-0 h-[calc(100vh-4rem)] w-64 transform transition-transform duration-300 md:hidden ${
    isMenuOpen ? 'translate-x-0' : 'translate-x-full'
  }`}
  style={{
    zIndex: 50,
    backgroundColor: 'var(--card-background)',
  }}
>
  {/* Menu content */}
</div>
```

#### 1.3 Accessibility Considerations
- Add `aria-expanded` to hamburger button
- Add `aria-label="Close menu"` to backdrop
- Trap focus within menu when open
- Support ESC key to close menu

---

## Design 2: Color-Coded Rating Badges

### Problem
- Rating badges use generic blue color
- Hard to distinguish rating types at a glance
- Doesn't leverage existing category color system

### Solution Architecture

#### 2.1 Update Badge Component
**File:** `src/components/ui/Badge.tsx`

**Add Category Variant:**
```typescript
type BadgeVariant = 
  | 'default' 
  | 'info' 
  | 'success' 
  | 'warning' 
  | 'error'
  | 'site'      // NEW - gold
  | 'visual'    // NEW - pink
  | 'music'     // NEW - purple
  | 'story'     // NEW - cyan
  | 'character' // NEW - orange

const variantStyles: Record<BadgeVariant, string> = {
  // ... existing variants
  site: 'bg-[#C8A34E] text-white',
  visual: 'bg-[#FF6B9D] text-white',
  music: 'bg-[#9D4EDD] text-white',
  story: 'bg-[#06B6D4] text-white',
  character: 'bg-[#F59E0B] text-white',
};
```

#### 2.2 Update Browse Page
**File:** `src/app/browse/BrowseContent.tsx`

**Map Sort Type to Badge Variant:**
```typescript
const getBadgeVariant = (sortBy: SortOption): BadgeVariant => {
  const variantMap: Record<SortOption, BadgeVariant> = {
    site: 'site',
    visual: 'visual',
    music: 'music',
    story: 'story',
    character: 'character',
  };
  return variantMap[sortBy];
};

// Usage in card
<Badge variant={getBadgeVariant(sortBy)}>
  {anime.ratings[sortBy].toFixed(1)}
</Badge>
```

#### 2.3 Update Homepage
**File:** `src/app/page.tsx`

Ensure homepage featured reviews also use category colors for consistency.

---

## Design 3: Mobile-First Touch Targets

### Problem
- Filter pills and buttons too small on mobile
- Insufficient spacing between interactive elements
- Text too small to read comfortably

### Solution Architecture

#### 3.1 Update Filter Pills
**File:** `src/app/browse/BrowseContent.tsx`

**Changes:**
```tsx
// Genre filter pills
<button
  className="px-4 py-3 rounded-full text-sm font-medium transition-all min-h-[44px]"
  style={{
    backgroundColor: selected ? 'var(--accent)' : 'var(--card-background)',
    color: selected ? '#FFFFFF' : 'var(--foreground)',
    borderWidth: '2px',
    borderColor: selected ? 'transparent' : 'var(--border)',
  }}
>
  {genre.icon} {genre.label}
</button>
```

**Key Changes:**
- `min-h-[44px]` - Ensures 44px minimum height
- `px-4 py-3` - Adequate padding for touch
- `text-sm` - 14px font size (readable on mobile)

#### 3.2 Update Sort Buttons
```tsx
<button
  className="px-4 py-3 rounded-lg font-medium transition-all min-h-[44px] min-w-[80px]"
  style={{
    backgroundColor: active ? color : 'var(--card-background)',
    color: active ? '#FFFFFF' : 'var(--foreground)',
  }}
>
  {label}
</button>
```

#### 3.3 Update Watchlist Buttons
```tsx
<button
  className="w-full py-3 rounded-lg font-medium transition-all min-h-[44px]"
  style={{
    backgroundColor: inWatchlist ? 'var(--accent)' : 'var(--btn-primary)',
    color: '#FFFFFF',
  }}
>
  {inWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
</button>
```

#### 3.4 Responsive Spacing
```tsx
// Filter sections
<div className="mb-8 space-y-6">
  {/* Search */}
  <div className="relative">...</div>
  
  {/* Sort - increased gap on mobile */}
  <div className="flex flex-wrap gap-3">...</div>
  
  {/* Genres - increased gap on mobile */}
  <div className="flex flex-wrap gap-3">...</div>
  
  {/* Status - increased gap on mobile */}
  <div className="flex flex-wrap gap-3">...</div>
</div>
```

---

## Design 4: Lazy Load Anime Cover Images

### Problem
- All 10 anime covers load immediately
- Slow on mobile connections
- Wastes data for images user may not see

### Solution Architecture

#### 4.1 Update Image Component Usage
**File:** `src/app/browse/BrowseContent.tsx`

**Implementation:**
```tsx
import Image from 'next/image';

// In anime card
<div className="relative aspect-[2/3] overflow-hidden rounded-t-xl">
  <Image
    src={anime.coverImage}
    alt={anime.title}
    fill
    className="object-cover group-hover:scale-110 transition-transform duration-300"
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
    loading={index < 4 ? 'eager' : 'lazy'}
    placeholder="blur"
    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2YwZjBmMCIvPjwvc3ZnPg=="
  />
</div>
```

**Key Features:**
- `loading="eager"` for first 4 cards (above fold)
- `loading="lazy"` for remaining cards
- `placeholder="blur"` for smooth loading
- `sizes` attribute for responsive optimization
- Fallback blur data URL (light gray placeholder)

#### 4.2 Error Handling
```tsx
const [imageError, setImageError] = useState(false);

<Image
  src={imageError ? '/placeholder-anime.png' : anime.coverImage}
  onError={() => setImageError(true)}
  // ... other props
/>
```

#### 4.3 Performance Metrics
**Expected Improvements:**
- Initial page load: -40% (from ~2MB to ~1.2MB)
- Time to interactive: -30%
- Mobile data usage: -50% (if user doesn't scroll to bottom)

---

## Design 5: Clear Visual Hierarchy

### Problem
- Users don't know if filters worked
- No clear feedback on active states
- Empty states are confusing
- Results count not prominent

### Solution Architecture

#### 5.1 Results Count Component
**File:** `src/app/browse/BrowseContent.tsx`

```tsx
<div className="mb-6 flex items-center justify-between flex-wrap gap-4">
  {/* Results count */}
  <p className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
    Showing {filteredAndSortedAnime.length} of {allAnime.length} anime
  </p>
  
  {/* Clear filters button - only show if filters active */}
  {(selectedGenres.length > 0 || statusFilter !== 'all' || searchQuery) && (
    <button
      onClick={clearAllFilters}
      className="px-4 py-2 rounded-lg font-medium transition-all"
      style={{
        backgroundColor: 'var(--text-block)',
        color: 'var(--accent)',
      }}
    >
      ✕ Clear all filters
    </button>
  )}
</div>
```

#### 5.2 Enhanced Active States

**Sort Buttons:**
```tsx
<button
  className={`px-4 py-3 rounded-lg font-medium transition-all ${
    active ? 'ring-2 ring-offset-2' : ''
  }`}
  style={{
    backgroundColor: active ? color : 'var(--card-background)',
    color: active ? '#FFFFFF' : 'var(--foreground)',
    ringColor: active ? color : 'transparent',
  }}
>
  {label}
</button>
```

**Filter Pills:**
```tsx
<button
  className={`px-4 py-3 rounded-full font-medium transition-all ${
    selected ? 'shadow-lg scale-105' : 'hover:scale-102'
  }`}
  style={{
    backgroundColor: selected ? 'var(--accent)' : 'var(--card-background)',
    color: selected ? '#FFFFFF' : 'var(--foreground)',
    borderWidth: '2px',
    borderColor: selected ? 'var(--accent)' : 'var(--border)',
  }}
>
  {selected && <span className="mr-1">✓</span>}
  {genre.icon} {genre.label}
</button>
```

#### 5.3 Empty State Component
**File:** `src/components/browse/EmptyState.tsx` (NEW)

```tsx
interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

export function EmptyState({ hasFilters, onClearFilters }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
        No anime found
      </h3>
      <p className="text-lg mb-6" style={{ color: 'var(--secondary)' }}>
        {hasFilters 
          ? "Try adjusting your filters or search terms"
          : "No anime available at the moment"
        }
      </p>
      {hasFilters && (
        <button
          onClick={onClearFilters}
          className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
          style={{
            backgroundColor: 'var(--btn-primary)',
            color: 'var(--btn-primary-text)',
          }}
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
```

#### 5.4 Section Separation
```tsx
<div className="mb-8 space-y-6">
  {/* Search Bar */}
  <div className="relative">...</div>
  
  {/* Sort Options - with border */}
  <div className="pb-6 border-b" style={{ borderColor: 'var(--border)' }}>
    <span className="font-semibold mb-3 block" style={{ color: 'var(--foreground)' }}>
      Sort by:
    </span>
    <div className="flex flex-wrap gap-2">...</div>
  </div>
  
  {/* Genre Filters - with border */}
  <div className="pb-6 border-b" style={{ borderColor: 'var(--border)' }}>
    <span className="font-semibold mb-3 block" style={{ color: 'var(--foreground)' }}>
      Genres:
    </span>
    <div className="flex flex-wrap gap-2">...</div>
  </div>
  
  {/* Status Filter */}
  <div>
    <span className="font-semibold mb-3 block" style={{ color: 'var(--foreground)' }}>
      Status:
    </span>
    <div className="flex flex-wrap gap-2">...</div>
  </div>
</div>
```

---

## Data Models

### Badge Variant Type
```typescript
type BadgeVariant = 
  | 'default' 
  | 'info' 
  | 'success' 
  | 'warning' 
  | 'error'
  | 'site'
  | 'visual'
  | 'music'
  | 'story'
  | 'character';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

### Mobile Menu State
```typescript
interface MobileMenuState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}
```

---

## Error Handling

### Image Loading Errors
- Fallback to placeholder image
- Log error to console (dev mode)
- Don't break card layout

### Menu State Errors
- Ensure body scroll is always restored
- Handle rapid open/close clicks
- Prevent scroll lock on desktop

### Filter State Errors
- Validate filter combinations
- Handle empty results gracefully
- Preserve user's filter state on error

---

## Testing Strategy

### Manual Testing Checklist

**Mobile Menu (iPhone SE, Pixel 5):**
- [ ] Menu opens smoothly
- [ ] Backdrop blocks clicks underneath
- [ ] Click outside closes menu
- [ ] Body scroll locked when open
- [ ] Menu closes on link click
- [ ] ESC key closes menu

**Rating Badges (All pages):**
- [ ] Site rating shows gold
- [ ] Visual rating shows pink
- [ ] Music rating shows purple
- [ ] Story rating shows cyan
- [ ] Character rating shows orange
- [ ] Colors consistent across pages

**Touch Targets (Mobile):**
- [ ] All buttons minimum 44px
- [ ] Easy to tap without mistakes
- [ ] Adequate spacing between elements
- [ ] Text readable at mobile sizes

**Lazy Loading:**
- [ ] First 4 images load immediately
- [ ] Remaining images load on scroll
- [ ] Blur placeholder shows while loading
- [ ] Failed images show fallback

**Visual Hierarchy:**
- [ ] Results count prominent
- [ ] Active filters clearly highlighted
- [ ] Empty state helpful and clear
- [ ] Clear filters button works
- [ ] Section separation clear

### Performance Testing
- Lighthouse mobile score > 90
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Image load time < 500ms per image

---

## Deployment Strategy

### Phase 1: Mobile Menu Fix (Day 1, Morning)
- Deploy mobile menu fix
- Test on real devices
- Monitor error logs

### Phase 2: Rating Badges (Day 1, Afternoon)
- Deploy badge color updates
- Verify across all pages
- Check contrast ratios

### Phase 3: Touch Targets + Lazy Loading (Day 2, Morning)
- Deploy touch target improvements
- Deploy lazy loading
- Run Lighthouse tests

### Phase 4: Visual Hierarchy (Day 2, Afternoon)
- Deploy empty state and hierarchy improvements
- Final QA pass
- Monitor user feedback

---

## Success Metrics

### Key Performance Indicators
- Mobile menu bug reports: 0 (down from current issues)
- Mobile bounce rate: < 40% (target improvement)
- Browse page engagement: +20% time on page
- Page load time: -40% (from lazy loading)
- User satisfaction: Positive feedback on colors/clarity

### Monitoring
- Track mobile menu open/close events
- Monitor image load performance
- Track filter usage patterns
- Collect user feedback on changes
