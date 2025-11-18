# Implementation Plan

- [x] 1. Reduce homepage logo size
  - Update Image component width and height props from 400×200 to 240×120 in HowWeRateSection.tsx
  - Test both light and dark theme logo variants
  - Verify logo remains centered and properly aligned
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Create mobile category cards row component
  - [x] 2.1 Create CategoryCardRow.tsx component
    - Create new component file in src/components/homepage/
    - Define CategoryCardRowProps interface with categories array
    - Implement horizontal scrollable container with CSS scroll-snap
    - Style each card: 120px width, 140px height, 16px gap
    - Display icon (48px) and category name only
    - Add Link navigation to browse page with category sort parameter
    - _Requirements: 2.1, 2.2, 2.3, 2.5_

  - [x] 2.2 Update HowWeRateSection.tsx for responsive layout
    - Import CategoryCardRow component
    - Add responsive rendering: CategoryCardRow for mobile, existing grid for desktop
    - Use Tailwind breakpoint: `md:hidden` for mobile, `hidden md:grid` for desktop
    - Reduce desktop card padding from p-6 to p-4
    - Reduce desktop icon size from w-16 h-16 to w-14 h-14
    - Reduce desktop title font from text-xl to text-lg
    - _Requirements: 2.1, 2.6, 2.7, 2.8, 2.9_

  - [x] 2.3 Update homepage content hierarchy
    - Modify src/app/page.tsx to ensure HowWeRateSection is first content section
    - Reduce mobile heading size from text-3xl to text-2xl (keep md:text-4xl for desktop)
    - Verify category cards appear within first viewport on mobile devices
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 3. Implement view mode state management and persistence
  - [x] 3.1 Create local storage helper functions
    - Create src/lib/view-mode-storage.ts file
    - Define BrowsePreferences interface with viewMode, lastUpdated, version
    - Implement saveViewMode function with error handling
    - Implement loadViewMode function with validation and fallback to 'large'
    - Add STORAGE_KEY constant and STORAGE_VERSION number
    - _Requirements: 7.1, 7.2, 9.1, 9.2_

  - [x] 3.2 Create useViewMode custom hook
    - Create src/hooks/useViewMode.ts file
    - Implement useState with loadViewMode as initial value
    - Implement updateViewMode function that updates state and calls saveViewMode
    - Add try-catch error handling for localStorage failures
    - Return viewMode and updateViewMode as tuple
    - _Requirements: 4.3, 4.4, 7.1, 7.2_

  - [x] 3.3 Create useIsMobile custom hook
    - Create src/hooks/useIsMobile.ts file
    - Implement useState for isMobile boolean
    - Add useEffect with window resize listener
    - Set breakpoint at 768px (matches Tailwind md breakpoint)
    - Clean up event listener on unmount
    - _Requirements: 4.1, 9.1, 9.3_

- [x] 4. Create ViewModeToggle component
  - Create src/components/browse/ViewModeToggle.tsx file
  - Define ViewModeToggleProps interface with currentMode and onChange
  - Implement three buttons: Large, Grid, List with icons
  - Style active button with accent background, inactive with border
  - Ensure each button is 44px height (touch-friendly)
  - Add ARIA labels and aria-pressed attributes
  - Add keyboard navigation support (Enter/Space)
  - Hide component on desktop with md:hidden class
  - _Requirements: 4.1, 4.2, 4.5, 7.3, 7.4, 7.5_

- [x] 5. Create Large View mode component
  - [x] 5.1 Create AnimeCardLarge component
    - Create src/components/browse/AnimeCardLarge.tsx file
    - Define AnimeCardLargeProps interface
    - Implement full-width card layout with rounded corners
    - Add Link-wrapped cover image with aspect-[2/3], min-h-[400px], max-h-[500px]
    - Display title with text-xl, font-bold, line-clamp-2
    - Show all 4 rating badges (Visual, Music, Story, Character) in a row
    - Display up to 3 genre tags in pill style
    - Add "Add to Watchlist" button with toggle state
    - Add WatchNowButton component
    - Include trending badge if applicable
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 5.2 Integrate Large View into BrowseContent
    - Import AnimeCardLarge and useViewMode hook
    - Add viewMode state using useViewMode hook
    - Add conditional rendering based on viewMode === 'large'
    - Replace grid layout with flex flex-col gap-6 for large view
    - Pass anime data and callbacks to AnimeCardLarge
    - Maintain existing ranking order
    - _Requirements: 5.5, 9.3_

- [x] 6. Implement Grid View mode
  - Modify existing grid layout in BrowseContent.tsx for grid view mode
  - Change grid from 4 columns to 2 columns when viewMode === 'grid' and isMobile
  - Update grid gap from gap-4 to gap-3 for tighter spacing
  - Hide genre tags when in grid view mode (conditional rendering)
  - Hide action buttons when in grid view mode (conditional rendering)
  - Keep cover image, title (line-clamp-1), and primary rating badge only
  - Ensure entire card is clickable and navigates to detail page
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 7. Create List View mode component
  - [x] 7.1 Create AnimeCardList component
    - Create src/components/browse/AnimeCardList.tsx file
    - Define AnimeCardListProps interface with anime and rank
    - Implement horizontal card layout with max height 120px
    - Add thumbnail image on left (80px width, 120px height)
    - Display rank number with # prefix in accent color
    - Show title with line-clamp-1 truncation
    - Display all 4 rating badges with size="xs" variant
    - Show first genre only in compact pill style
    - Wrap entire card in Link to detail page
    - Add hover shadow effect
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [x] 7.2 Add xs size variant to Badge component
    - Modify src/components/ui/Badge.tsx
    - Add 'xs' to size type definition
    - Add xs size styles: text-[10px] px-1.5 py-0.5
    - Update sizeStyles object with xs variant
    - _Requirements: 7.3_

  - [x] 7.3 Integrate List View into BrowseContent
    - Import AnimeCardList component
    - Add conditional rendering for viewMode === 'list'
    - Use flex flex-col gap-2 layout for list view
    - Pass anime data and calculated rank to AnimeCardList
    - Calculate rank based on current page and index: (page - 1) * ITEMS_PER_PAGE + index + 1
    - Maintain current sort order
    - _Requirements: 7.6_

- [x] 8. Integrate ViewModeToggle into BrowseContent
  - Import ViewModeToggle component into BrowseContent.tsx
  - Import useViewMode and useIsMobile hooks
  - Add viewMode and isMobile state at component level
  - Position ViewModeToggle after "Results Count" section and before anime grid
  - Pass currentMode={viewMode} and onChange={updateViewMode} props
  - Only render ViewModeToggle when isMobile is true
  - _Requirements: 4.1, 4.2, 9.1_

- [x] 9. Add view mode transitions and animations
  - Add CSS transition classes for view mode changes in BrowseContent.tsx
  - Use transition-opacity and transition-transform with 200ms duration
  - Add will-change: opacity, transform for GPU acceleration
  - Implement fade-in animation when switching views
  - Ensure transitions complete within 300ms
  - _Requirements: 9.1, 9.2, 10.1, 10.2_

- [x] 10. Implement scroll position maintenance
  - Add useEffect to save scroll position before view mode change
  - Restore scroll position after view mode change (for grid ↔ list only)
  - Reset scroll to top when switching to/from large view
  - Use window.scrollTo with smooth behavior
  - _Requirements: 10.3_

- [x] 11. Add analytics tracking for view mode
  - [x] 11.1 Create analytics functions
    - Add trackViewModeChange function to src/lib/analytics-events.ts
    - Add trackCategoryClick function for mobile category card clicks
    - Include parameters: mode, isMobile, timestamp for view mode changes
    - Include parameters: category, device, position for category clicks
    - Add console.log for development environment
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [x] 11.2 Integrate analytics into components
    - Call trackViewModeChange in useViewMode hook when mode changes
    - Call trackCategoryClick in CategoryCardRow when card is clicked
    - Track default view mode on BrowseContent mount
    - Add view mode to existing browse page view analytics
    - _Requirements: 11.1, 11.2, 11.4_

- [x] 12. Add accessibility features
  - [x] 12.1 Add ARIA labels to ViewModeToggle
    - Add role="group" and aria-label="View mode toggle" to container
    - Add descriptive aria-label to each button (e.g., "Large view - one anime per screen")
    - Add aria-pressed attribute to indicate active state
    - _Requirements: 7.4, 8.3_

  - [x] 12.2 Add screen reader announcements
    - Add announcement state to BrowseContent
    - Update announcement when view mode changes
    - Add hidden div with role="status", aria-live="polite", aria-atomic="true"
    - Announce view mode changes (e.g., "View mode changed to large")
    - _Requirements: 7.4_

  - [x] 12.3 Add keyboard navigation
    - Ensure all ViewModeToggle buttons are keyboard accessible
    - Add onKeyDown handlers for Enter and Space keys
    - Verify tab order is logical
    - Test focus indicators are visible
    - _Requirements: 7.3, 8.3_

  - [x] 12.4 Add ARIA labels to anime cards
    - Add role="list" and aria-label="Anime results" to card container
    - Add role="listitem" to each anime card
    - Add descriptive aria-label to cards in all view modes
    - _Requirements: 8.3_

- [x] 13. Optimize image loading for different view modes
  - Update Image component sizes prop based on view mode
  - Large view: '(max-width: 768px) 100vw, 50vw'
  - Grid view: '(max-width: 768px) 50vw, 25vw'
  - List view: '80px'
  - Set loading="eager" for first 2 cards in large view
  - Set loading="lazy" for remaining cards
  - Maintain existing placeholder and error handling
  - _Requirements: 10.4, 10.5_

- [x] 14. Add responsive breakpoint handling
  - Ensure ViewModeToggle is hidden on desktop (>= 768px)
  - Ensure CategoryCardRow is hidden on desktop
  - Ensure desktop grid maintains 4 columns regardless of stored view mode
  - Test window resize behavior across breakpoint
  - Verify no layout shift during resize
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [x] 15. Write component tests
  - [x] 15.1 Test ViewModeToggle component
    - Test component renders three buttons
    - Test onChange callback is called with correct mode
    - Test active state styling is applied correctly
    - Test keyboard navigation (Enter/Space keys)
    - _Requirements: 4.5, 7.3_

  - [x] 15.2 Test local storage helpers
    - Test saveViewMode stores correct data structure
    - Test loadViewMode retrieves correct data
    - Test loadViewMode handles corrupted data gracefully
    - Test loadViewMode returns 'large' default on error
    - _Requirements: 7.1, 7.2_

  - [x] 15.3 Test AnimeCardLarge component
    - Test component renders all 4 rating badges
    - Test component displays correct anime data
    - Test watchlist toggle callback is called
    - Test watch now callback is called
    - _Requirements: 5.3, 5.4_

  - [x] 15.4 Test AnimeCardList component
    - Test component renders with correct height (120px)
    - Test rank number is displayed correctly
    - Test all 4 ratings are shown
    - Test title truncation works
    - _Requirements: 7.2, 7.3, 7.4, 7.5_

  - [x] 15.5 Test CategoryCardRow component
    - Test horizontal scroll container renders
    - Test correct number of cards are displayed
    - Test each card links to correct browse page URL
    - Test cards show icon and name only
    - _Requirements: 2.2, 2.3, 2.5_

- [ ] 16. Perform integration testing
  - [ ] 16.1 Test view mode switching
    - Test switching from Large to Grid updates layout correctly
    - Test switching from Grid to List updates layout correctly
    - Test switching from List to Large updates layout correctly
    - Test view mode preference persists across page reloads
    - Test desktop ignores mobile view mode preferences
    - _Requirements: 4.5, 7.1, 7.2, 9.1, 9.2_

  - [ ] 16.2 Test homepage mobile layout
    - Test category cards appear above the fold on mobile
    - Test horizontal scroll works smoothly
    - Test scroll-snap behavior works correctly
    - Test category card links navigate to correct pages
    - _Requirements: 2.1, 2.2, 3.1, 3.2_

  - [ ] 16.3 Test responsive behavior
    - Test ViewModeToggle shows on mobile, hides on desktop
    - Test CategoryCardRow shows on mobile, hides on desktop
    - Test window resize updates layout appropriately
    - Test no layout shift during transitions
    - _Requirements: 9.1, 9.2, 9.3_

- [ ] 17. Perform accessibility audit
  - [ ] 17.1 Test keyboard navigation
    - Test tab order through ViewModeToggle is logical
    - Test Enter/Space keys activate buttons
    - Test focus indicators are visible on all interactive elements
    - Test keyboard navigation works in all view modes
    - _Requirements: 7.3, 8.3_

  - [ ] 17.2 Test screen reader compatibility
    - Test ViewModeToggle announces correctly
    - Test view mode changes are announced
    - Test anime cards have proper labels in all views
    - Test ARIA attributes are correct
    - _Requirements: 7.4, 8.3_

  - [ ] 17.3 Test touch targets
    - Test all buttons meet 44×44px minimum size
    - Test adequate spacing between touch targets
    - Test no accidental taps occur
    - _Requirements: 7.5_

  - [ ] 17.4 Test color contrast
    - Test all text meets WCAG AA standards (4.5:1)
    - Test interactive elements have 3:1 contrast with background
    - Test focus indicators are visible (2px outline, 3:1 contrast)
    - _Requirements: 8.3_

- [ ] 18. Perform performance testing
  - [ ] 18.1 Test view mode transition performance
    - Test transitions complete within 300ms
    - Test no layout thrashing occurs
    - Test CSS transitions are smooth
    - _Requirements: 9.1, 10.1, 10.2_

  - [ ] 18.2 Test image loading performance
    - Test lazy loading works in all view modes
    - Test placeholder prevents layout shift
    - Test progressive loading in large view
    - _Requirements: 10.4, 10.5_

  - [ ] 18.3 Test scroll performance
    - Test horizontal scroll is smooth on mobile (category cards)
    - Test vertical scroll maintains 60fps in all view modes
    - Test no jank during view mode switches
    - _Requirements: 2.2, 10.3_
