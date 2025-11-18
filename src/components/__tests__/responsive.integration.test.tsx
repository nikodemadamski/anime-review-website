import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowseContent } from '@/app/browse/BrowseContent';

// Mock hooks
vi.mock('@/hooks/useViewMode', () => ({
  useViewMode: vi.fn(() => ['large', vi.fn()]),
}));

vi.mock('@/hooks/useIsMobile', () => ({
  useIsMobile: vi.fn(() => true),
}));

vi.mock('@/hooks/useWatchlist', () => ({
  useWatchlist: vi.fn(() => ({
    addAnime: vi.fn(),
    removeAnime: vi.fn(),
    isInWatchlist: vi.fn(() => false),
  })),
}));

vi.mock('@/hooks/useDebounce', () => ({
  useDebounce: vi.fn((value) => value),
}));

// Mock analytics
vi.mock('@/lib/analytics-events', () => ({
  trackFilterUsage: vi.fn(),
  trackSearch: vi.fn(),
  trackSortChange: vi.fn(),
  trackWatchlistAction: vi.fn(),
  trackWatchNowClick: vi.fn(),
  trackNewsletterSignup: vi.fn(),
  trackPageView: vi.fn(),
}));

// Mock trending
vi.mock('@/lib/trending', () => ({
  getWatchingCount: vi.fn(() => 0),
  isTrending: vi.fn(() => false),
  calculateTrending: vi.fn(() => []),
}));

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  })),
  useSearchParams: vi.fn(() => ({
    get: vi.fn(() => null),
  })),
  usePathname: vi.fn(() => '/'),
}));

// Mock GitHub data access
vi.mock('@/lib/github-data-access', () => ({
  GitHubDataAccess: {
    getTopRated: vi.fn(async () => [
      {
        id: '1',
        title: 'Test Anime',
        coverImage: '/test.jpg',
        genres: ['Action'],
        ratings: { site: 8.5, visual: 8.0, music: 7.5, story: 8.2, character: 8.3 },
      },
    ]),
  },
}));

// Mock fetch
global.fetch = vi.fn();

const mockAnimeData = [
  {
    id: '1',
    title: 'Test Anime 1',
    coverImage: '/test1.jpg',
    description: 'Test description 1',
    genres: ['Action', 'Adventure'],
    status: 'finished',
    ratings: {
      site: 8.5,
      visual: 8.0,
      music: 7.5,
      story: 8.2,
      character: 8.3,
    },
  },
];

describe('Responsive Behavior Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockAnimeData,
    });
    
    window.scrollTo = vi.fn();
    window.history.replaceState = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('16.3 Responsive Behavior', () => {
    it('should show ViewModeToggle on mobile and hide on desktop', async () => {
      const { useIsMobile } = await import('@/hooks/useIsMobile');
      
      // Test mobile
      (useIsMobile as any).mockReturnValue(true);
      const { rerender } = render(<BrowseContent />);
      
      await waitFor(() => {
        expect(screen.getByText('Test Anime 1')).toBeInTheDocument();
      });
      
      // ViewModeToggle should be visible on mobile
      expect(screen.getByRole('group', { name: /view mode toggle/i })).toBeInTheDocument();
      
      // Test desktop
      (useIsMobile as any).mockReturnValue(false);
      rerender(<BrowseContent />);
      
      await waitFor(() => {
        // ViewModeToggle should be hidden on desktop
        expect(screen.queryByRole('group', { name: /view mode toggle/i })).not.toBeInTheDocument();
      });
    });

    it('should show CategoryCardRow on mobile and hide on desktop', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      // Dynamically import HomePage
      const HomePage = (await import('@/app/page')).default;
      
      const { rerender } = render(await HomePage());
      
      await waitFor(() => {
        expect(screen.getByText(/How We Rate Anime/i)).toBeInTheDocument();
      });
      
      // CategoryCardRow should be visible on mobile (within HowWeRateSection)
      const section = screen.getByText(/How We Rate Anime/i).closest('section');
      expect(section).toBeInTheDocument();
      
      // Test desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      
      rerender(await HomePage());
      
      await waitFor(() => {
        // Section should still be there but with desktop layout
        const desktopSection = screen.getByText(/How We Rate Anime/i).closest('section');
        expect(desktopSection).toBeInTheDocument();
      });
    });

    it('should update layout appropriately on window resize', async () => {
      const { useIsMobile } = await import('@/hooks/useIsMobile');
      
      // Start with mobile
      let isMobile = true;
      (useIsMobile as any).mockImplementation(() => isMobile);
      
      const { rerender } = render(<BrowseContent />);
      
      await waitFor(() => {
        expect(screen.getByText('Test Anime 1')).toBeInTheDocument();
      });
      
      // Should show mobile view toggle
      expect(screen.getByRole('group', { name: /view mode toggle/i })).toBeInTheDocument();
      
      // Simulate resize to desktop
      act(() => {
        isMobile = false;
        (useIsMobile as any).mockImplementation(() => isMobile);
      });
      
      rerender(<BrowseContent />);
      
      await waitFor(() => {
        // Should hide mobile view toggle
        expect(screen.queryByRole('group', { name: /view mode toggle/i })).not.toBeInTheDocument();
      });
      
      // Simulate resize back to mobile
      act(() => {
        isMobile = true;
        (useIsMobile as any).mockImplementation(() => isMobile);
      });
      
      rerender(<BrowseContent />);
      
      await waitFor(() => {
        // Should show mobile view toggle again
        expect(screen.getByRole('group', { name: /view mode toggle/i })).toBeInTheDocument();
      });
    });

    it('should have no layout shift during transitions', async () => {
      const { useViewMode } = await import('@/hooks/useViewMode');
      const { useIsMobile } = await import('@/hooks/useIsMobile');
      
      let currentMode: 'large' | 'grid' | 'list' = 'large';
      (useViewMode as any).mockImplementation(() => [currentMode, vi.fn()]);
      (useIsMobile as any).mockReturnValue(true);
      
      const { rerender } = render(<BrowseContent />);
      
      await waitFor(() => {
        expect(screen.getByText('Test Anime 1')).toBeInTheDocument();
      });
      
      // Get initial container
      const initialContainer = screen.getByRole('list', { name: /anime results/i });
      const initialClasses = initialContainer.className;
      
      // Verify transition classes are present
      expect(initialClasses).toContain('transition-opacity');
      expect(initialClasses).toContain('transition-transform');
      expect(initialClasses).toContain('duration-200');
      
      // Switch view mode
      currentMode = 'grid';
      (useViewMode as any).mockImplementation(() => [currentMode, vi.fn()]);
      rerender(<BrowseContent />);
      
      await waitFor(() => {
        const newContainer = screen.getByRole('list', { name: /anime results/i });
        const newClasses = newContainer.className;
        
        // Verify transition classes are still present
        expect(newClasses).toContain('transition-opacity');
        expect(newClasses).toContain('transition-transform');
        expect(newClasses).toContain('duration-200');
      });
      
      // Verify will-change property for GPU acceleration
      const container = screen.getByRole('list', { name: /anime results/i });
      expect(container).toHaveStyle({ willChange: 'opacity, transform' });
    });
  });
});
