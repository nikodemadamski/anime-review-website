import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowseContent } from '../BrowseContent';

// Mock the hooks
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
  {
    id: '2',
    title: 'Test Anime 2',
    coverImage: '/test2.jpg',
    description: 'Test description 2',
    genres: ['Comedy', 'Romance'],
    status: 'ongoing',
    ratings: {
      site: 7.8,
      visual: 7.5,
      music: 8.0,
      story: 7.6,
      character: 7.9,
    },
  },
];

describe('BrowseContent Integration Tests', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Mock successful fetch
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockAnimeData,
    });
    
    // Mock window.scrollTo
    window.scrollTo = vi.fn();
    
    // Mock window.history
    window.history.replaceState = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('16.1 View Mode Switching', () => {
    it('should switch from Large to Grid and update layout correctly', async () => {
      const { useViewMode } = await import('@/hooks/useViewMode');
      const { useIsMobile } = await import('@/hooks/useIsMobile');
      
      let currentMode: 'large' | 'grid' | 'list' = 'large';
      const mockUpdateViewMode = vi.fn((mode) => {
        currentMode = mode;
      });
      
      (useViewMode as any).mockImplementation(() => [currentMode, mockUpdateViewMode]);
      (useIsMobile as any).mockReturnValue(true);
      
      const { rerender } = render(<BrowseContent />);
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('Test Anime 1')).toBeInTheDocument();
      });
      
      // Should be in large view initially
      const largeViewContainer = screen.getByRole('list', { name: /anime results/i });
      expect(largeViewContainer).toHaveClass('flex', 'flex-col', 'gap-6');
      
      // Switch to grid view
      currentMode = 'grid';
      (useViewMode as any).mockImplementation(() => [currentMode, mockUpdateViewMode]);
      rerender(<BrowseContent />);
      
      await waitFor(() => {
        const gridContainer = screen.getByRole('list', { name: /anime results/i });
        expect(gridContainer).toHaveClass('grid', 'grid-cols-2', 'gap-3');
      });
    });

    it('should switch from Grid to List and update layout correctly', async () => {
      const { useViewMode } = await import('@/hooks/useViewMode');
      const { useIsMobile } = await import('@/hooks/useIsMobile');
      
      let currentMode: 'large' | 'grid' | 'list' = 'grid';
      const mockUpdateViewMode = vi.fn((mode) => {
        currentMode = mode;
      });
      
      (useViewMode as any).mockImplementation(() => [currentMode, mockUpdateViewMode]);
      (useIsMobile as any).mockReturnValue(true);
      
      const { rerender } = render(<BrowseContent />);
      
      await waitFor(() => {
        expect(screen.getByText('Test Anime 1')).toBeInTheDocument();
      });
      
      // Should be in grid view
      let container = screen.getByRole('list', { name: /anime results/i });
      expect(container).toHaveClass('grid', 'grid-cols-2', 'gap-3');
      
      // Switch to list view
      currentMode = 'list';
      (useViewMode as any).mockImplementation(() => [currentMode, mockUpdateViewMode]);
      rerender(<BrowseContent />);
      
      await waitFor(() => {
        const listContainer = screen.getByRole('list', { name: /anime results/i });
        expect(listContainer).toHaveClass('flex', 'flex-col', 'gap-2');
      });
    });

    it('should switch from List to Large and update layout correctly', async () => {
      const { useViewMode } = await import('@/hooks/useViewMode');
      const { useIsMobile } = await import('@/hooks/useIsMobile');
      
      let currentMode: 'large' | 'grid' | 'list' = 'list';
      const mockUpdateViewMode = vi.fn((mode) => {
        currentMode = mode;
      });
      
      (useViewMode as any).mockImplementation(() => [currentMode, mockUpdateViewMode]);
      (useIsMobile as any).mockReturnValue(true);
      
      const { rerender } = render(<BrowseContent />);
      
      await waitFor(() => {
        expect(screen.getByText('Test Anime 1')).toBeInTheDocument();
      });
      
      // Should be in list view
      let container = screen.getByRole('list', { name: /anime results/i });
      expect(container).toHaveClass('flex', 'flex-col', 'gap-2');
      
      // Switch to large view
      currentMode = 'large';
      (useViewMode as any).mockImplementation(() => [currentMode, mockUpdateViewMode]);
      rerender(<BrowseContent />);
      
      await waitFor(() => {
        const largeContainer = screen.getByRole('list', { name: /anime results/i });
        expect(largeContainer).toHaveClass('flex', 'flex-col', 'gap-6');
      });
    });

    it('should persist view mode preference across page reloads', async () => {
      const { loadViewMode, saveViewMode } = await import('@/lib/view-mode-storage');
      
      // Simulate saving a preference
      saveViewMode('grid');
      
      // Simulate page reload by loading the preference
      const loadedMode = loadViewMode();
      
      expect(loadedMode).toBe('grid');
    });

    it('should ignore mobile view mode preferences on desktop', async () => {
      const { useViewMode } = await import('@/hooks/useViewMode');
      const { useIsMobile } = await import('@/hooks/useIsMobile');
      
      // Set mobile view mode to 'list'
      (useViewMode as any).mockReturnValue(['list', vi.fn()]);
      // But we're on desktop
      (useIsMobile as any).mockReturnValue(false);
      
      render(<BrowseContent />);
      
      await waitFor(() => {
        expect(screen.getByText('Test Anime 1')).toBeInTheDocument();
      });
      
      // Should use desktop grid layout regardless of stored view mode
      const container = screen.getByRole('list', { name: /anime results/i });
      expect(container).toHaveClass('grid');
      expect(container).not.toHaveClass('grid-cols-2'); // Not mobile grid
      
      // ViewModeToggle should not be visible on desktop
      expect(screen.queryByRole('group', { name: /view mode toggle/i })).not.toBeInTheDocument();
    });
  });
});
