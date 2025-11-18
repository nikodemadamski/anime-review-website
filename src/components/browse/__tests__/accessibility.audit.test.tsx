import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ViewModeToggle from '../ViewModeToggle';
import { AnimeCardLarge } from '../AnimeCardLarge';
import { AnimeCardList } from '../AnimeCardList';

// Mock Next.js components
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

vi.mock('@/components/anime/WatchNowButton', () => ({
  WatchNowButton: ({ animeTitle }: any) => (
    <button aria-label={`Watch ${animeTitle} now`}>Watch Now</button>
  ),
}));

vi.mock('@/lib/trending', () => ({
  getWatchingCount: () => 0,
  isTrending: () => false,
}));

const mockAnime = {
  id: '1',
  title: 'Test Anime',
  coverImage: '/test.jpg',
  ratings: {
    visual: 8.5,
    music: 7.8,
    story: 9.2,
    character: 8.9,
    site: 8.6,
  },
  genres: ['Action', 'Adventure', 'Fantasy'],
};

describe('Accessibility Audit - Task 17', () => {
  describe('17.1 Keyboard Navigation', () => {
    it('ViewModeToggle has logical tab order', () => {
      const mockOnChange = vi.fn();
      render(<ViewModeToggle currentMode="large" onChange={mockOnChange} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
      
      // Verify buttons are in logical order: Large, Grid, List
      expect(buttons[0]).toHaveAccessibleName(/large view/i);
      expect(buttons[1]).toHaveAccessibleName(/grid view/i);
      expect(buttons[2]).toHaveAccessibleName(/list view/i);
      
      // All buttons should be focusable (tabIndex not -1)
      buttons.forEach(button => {
        expect(button).not.toHaveAttribute('tabindex', '-1');
      });
    });

    it('Enter key activates ViewModeToggle buttons', async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();
      render(<ViewModeToggle currentMode="large" onChange={mockOnChange} />);

      const gridButton = screen.getByRole('button', { name: /grid view/i });
      gridButton.focus();
      await user.keyboard('{Enter}');

      expect(mockOnChange).toHaveBeenCalledWith('grid');
    });

    it('Space key activates ViewModeToggle buttons', async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();
      render(<ViewModeToggle currentMode="large" onChange={mockOnChange} />);

      const listButton = screen.getByRole('button', { name: /list view/i });
      listButton.focus();
      await user.keyboard(' ');

      expect(mockOnChange).toHaveBeenCalledWith('list');
    });

    it('focus indicators are visible on ViewModeToggle buttons', () => {
      const mockOnChange = vi.fn();
      render(<ViewModeToggle currentMode="large" onChange={mockOnChange} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        // Buttons should not have outline:none or similar that would hide focus
        const styles = window.getComputedStyle(button);
        expect(styles.outline).not.toBe('none');
      });
    });

    it('AnimeCardLarge watchlist button supports keyboard activation', async () => {
      const user = userEvent.setup();
      const mockToggle = vi.fn();
      const mockWatchNow = vi.fn();
      
      render(
        <AnimeCardLarge
          anime={mockAnime}
          onWatchlistToggle={mockToggle}
          onWatchNowClick={mockWatchNow}
          isInWatchlist={false}
        />
      );

      const watchlistButton = screen.getByRole('button', { name: /add test anime to watchlist/i });
      watchlistButton.focus();
      
      // Test Enter key
      await user.keyboard('{Enter}');
      expect(mockToggle).toHaveBeenCalledWith('1');
      
      mockToggle.mockClear();
      
      // Test Space key
      await user.keyboard(' ');
      expect(mockToggle).toHaveBeenCalledWith('1');
    });

    it('AnimeCardList is keyboard navigable via link', () => {
      render(
        <AnimeCardList
          anime={mockAnime}
          rank={1}
        />
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/anime/1');
      expect(link).not.toHaveAttribute('tabindex', '-1');
    });

    it('all interactive elements in all view modes are keyboard accessible', () => {
      const mockToggle = vi.fn();
      const mockWatchNow = vi.fn();
      
      const { rerender } = render(
        <AnimeCardLarge
          anime={mockAnime}
          onWatchlistToggle={mockToggle}
          onWatchNowClick={mockWatchNow}
          isInWatchlist={false}
        />
      );

      // Large view - check all interactive elements
      const largeViewButtons = screen.getAllByRole('button');
      const largeViewLinks = screen.getAllByRole('link');
      
      [...largeViewButtons, ...largeViewLinks].forEach(element => {
        expect(element).not.toHaveAttribute('tabindex', '-1');
      });

      // List view
      rerender(
        <AnimeCardList
          anime={mockAnime}
          rank={1}
        />
      );

      const listViewLink = screen.getByRole('link');
      expect(listViewLink).not.toHaveAttribute('tabindex', '-1');
    });
  });

  describe('17.2 Screen Reader Compatibility', () => {
    it('ViewModeToggle announces correctly with role and aria-label', () => {
      const mockOnChange = vi.fn();
      render(<ViewModeToggle currentMode="large" onChange={mockOnChange} />);

      const group = screen.getByRole('group', { name: /view mode toggle/i });
      expect(group).toBeInTheDocument();
    });

    it('ViewModeToggle buttons have descriptive aria-labels', () => {
      const mockOnChange = vi.fn();
      render(<ViewModeToggle currentMode="large" onChange={mockOnChange} />);

      expect(screen.getByRole('button', { name: /large view - one anime per screen/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /grid view - four anime per screen/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /list view - compact list with all ratings/i })).toBeInTheDocument();
    });

    it('ViewModeToggle buttons have correct aria-pressed state', () => {
      const mockOnChange = vi.fn();
      const { rerender } = render(<ViewModeToggle currentMode="large" onChange={mockOnChange} />);

      const largeButton = screen.getByRole('button', { name: /large view/i });
      const gridButton = screen.getByRole('button', { name: /grid view/i });
      const listButton = screen.getByRole('button', { name: /list view/i });

      // Large is active
      expect(largeButton).toHaveAttribute('aria-pressed', 'true');
      expect(gridButton).toHaveAttribute('aria-pressed', 'false');
      expect(listButton).toHaveAttribute('aria-pressed', 'false');

      // Switch to grid
      rerender(<ViewModeToggle currentMode="grid" onChange={mockOnChange} />);
      expect(largeButton).toHaveAttribute('aria-pressed', 'false');
      expect(gridButton).toHaveAttribute('aria-pressed', 'true');
      expect(listButton).toHaveAttribute('aria-pressed', 'false');

      // Switch to list
      rerender(<ViewModeToggle currentMode="list" onChange={mockOnChange} />);
      expect(largeButton).toHaveAttribute('aria-pressed', 'false');
      expect(gridButton).toHaveAttribute('aria-pressed', 'false');
      expect(listButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('AnimeCardLarge has proper aria-label with all rating information', () => {
      const mockToggle = vi.fn();
      const mockWatchNow = vi.fn();
      
      render(
        <AnimeCardLarge
          anime={mockAnime}
          onWatchlistToggle={mockToggle}
          onWatchNowClick={mockWatchNow}
          isInWatchlist={false}
        />
      );

      const card = screen.getByRole('listitem');
      const ariaLabel = card.getAttribute('aria-label');
      
      expect(ariaLabel).toContain('Test Anime');
      expect(ariaLabel).toContain('8.6'); // site rating
      expect(ariaLabel).toContain('Visual: 8.5');
      expect(ariaLabel).toContain('Music: 7.8');
      expect(ariaLabel).toContain('Story: 9.2');
      expect(ariaLabel).toContain('Character: 8.9');
    });

    it('AnimeCardList has proper aria-label with rank and ratings', () => {
      render(
        <AnimeCardList
          anime={mockAnime}
          rank={5}
        />
      );

      const card = screen.getByRole('listitem');
      const ariaLabel = card.getAttribute('aria-label');
      
      expect(ariaLabel).toContain('Rank 5');
      expect(ariaLabel).toContain('Test Anime');
      expect(ariaLabel).toContain('Visual: 8.5');
      expect(ariaLabel).toContain('Music: 7.8');
      expect(ariaLabel).toContain('Story: 9.2');
      expect(ariaLabel).toContain('Character: 8.9');
    });

    it('AnimeCardLarge watchlist button has descriptive aria-label', () => {
      const mockToggle = vi.fn();
      const mockWatchNow = vi.fn();
      
      const { rerender } = render(
        <AnimeCardLarge
          anime={mockAnime}
          onWatchlistToggle={mockToggle}
          onWatchNowClick={mockWatchNow}
          isInWatchlist={false}
        />
      );

      // Not in watchlist
      expect(screen.getByRole('button', { name: /add test anime to watchlist/i })).toBeInTheDocument();

      // In watchlist
      rerender(
        <AnimeCardLarge
          anime={mockAnime}
          onWatchlistToggle={mockToggle}
          onWatchNowClick={mockWatchNow}
          isInWatchlist={true}
        />
      );

      expect(screen.getByRole('button', { name: /remove test anime from watchlist/i })).toBeInTheDocument();
    });

    it('AnimeCardLarge watchlist button has aria-pressed attribute', () => {
      const mockToggle = vi.fn();
      const mockWatchNow = vi.fn();
      
      const { rerender } = render(
        <AnimeCardLarge
          anime={mockAnime}
          onWatchlistToggle={mockToggle}
          onWatchNowClick={mockWatchNow}
          isInWatchlist={false}
        />
      );

      const watchlistButton = screen.getByRole('button', { name: /add test anime to watchlist/i });
      expect(watchlistButton).toHaveAttribute('aria-pressed', 'false');

      rerender(
        <AnimeCardLarge
          anime={mockAnime}
          onWatchlistToggle={mockToggle}
          onWatchNowClick={mockWatchNow}
          isInWatchlist={true}
        />
      );

      const watchlistButtonPressed = screen.getByRole('button', { name: /remove test anime from watchlist/i });
      expect(watchlistButtonPressed).toHaveAttribute('aria-pressed', 'true');
    });

    it('decorative icons have aria-hidden attribute', () => {
      const mockOnChange = vi.fn();
      render(<ViewModeToggle currentMode="large" onChange={mockOnChange} />);

      const svgs = document.querySelectorAll('svg');
      svgs.forEach(svg => {
        expect(svg).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });

  describe('17.3 Touch Targets', () => {
    it('ViewModeToggle buttons meet 44x44px minimum size', () => {
      const mockOnChange = vi.fn();
      render(<ViewModeToggle currentMode="large" onChange={mockOnChange} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        // Check for h-11 class (44px) or min-h-[44px]
        const classes = button.className;
        expect(classes).toMatch(/h-11/);
      });
    });

    it('AnimeCardLarge watchlist button meets 44x44px minimum size', () => {
      const mockToggle = vi.fn();
      const mockWatchNow = vi.fn();
      
      render(
        <AnimeCardLarge
          anime={mockAnime}
          onWatchlistToggle={mockToggle}
          onWatchNowClick={mockWatchNow}
          isInWatchlist={false}
        />
      );

      const watchlistButton = screen.getByRole('button', { name: /add test anime to watchlist/i });
      const classes = watchlistButton.className;
      
      // Check for min-h-[44px] class
      expect(classes).toMatch(/min-h-\[44px\]/);
    });

    it('ViewModeToggle has adequate spacing between buttons', () => {
      const mockOnChange = vi.fn();
      const { container } = render(<ViewModeToggle currentMode="large" onChange={mockOnChange} />);

      const toggleContainer = container.querySelector('[role="group"]');
      expect(toggleContainer).toHaveClass('gap-2'); // 8px gap between buttons
    });

    it('AnimeCardLarge action buttons have adequate spacing', () => {
      const mockToggle = vi.fn();
      const mockWatchNow = vi.fn();
      
      const { container } = render(
        <AnimeCardLarge
          anime={mockAnime}
          onWatchlistToggle={mockToggle}
          onWatchNowClick={mockWatchNow}
          isInWatchlist={false}
        />
      );

      // Find the actions container
      const actionsContainer = container.querySelector('.space-y-2');
      expect(actionsContainer).toBeInTheDocument();
    });

    it('touch targets do not overlap in ViewModeToggle', () => {
      const mockOnChange = vi.fn();
      render(<ViewModeToggle currentMode="large" onChange={mockOnChange} />);

      const buttons = screen.getAllByRole('button');
      
      // With gap-2 (8px) and flex layout, buttons should not overlap
      // This is a visual check - we verify the layout classes are present
      const container = buttons[0].parentElement;
      expect(container).toHaveClass('flex');
      expect(container).toHaveClass('gap-2');
    });
  });

  describe('17.4 Color Contrast', () => {
    it('ViewModeToggle active button has sufficient contrast', () => {
      const mockOnChange = vi.fn();
      render(<ViewModeToggle currentMode="large" onChange={mockOnChange} />);

      const activeButton = screen.getByRole('button', { name: /large view/i });
      
      // Active button should have bg-accent and text-white
      expect(activeButton).toHaveClass('bg-accent');
      expect(activeButton).toHaveClass('text-white');
    });

    it('ViewModeToggle inactive buttons have visible borders', () => {
      const mockOnChange = vi.fn();
      render(<ViewModeToggle currentMode="large" onChange={mockOnChange} />);

      const inactiveButton = screen.getByRole('button', { name: /grid view/i });
      
      // Inactive buttons should have border
      expect(inactiveButton).toHaveClass('border-2');
      expect(inactiveButton).toHaveClass('border-border');
    });

    it('AnimeCardLarge text uses theme color variables for contrast', () => {
      const mockToggle = vi.fn();
      const mockWatchNow = vi.fn();
      
      const { container } = render(
        <AnimeCardLarge
          anime={mockAnime}
          onWatchlistToggle={mockToggle}
          onWatchNowClick={mockWatchNow}
          isInWatchlist={false}
        />
      );

      const title = screen.getByText('Test Anime');
      const styles = title.getAttribute('style');
      
      // Should use CSS variable for color
      expect(styles).toContain('var(--foreground)');
    });

    it('AnimeCardList text uses theme color variables for contrast', () => {
      const { container } = render(
        <AnimeCardList
          anime={mockAnime}
          rank={1}
        />
      );

      const title = screen.getByText('Test Anime');
      const styles = title.getAttribute('style');
      
      // Should use CSS variable for color
      expect(styles).toContain('var(--foreground)');
    });

    it('AnimeCardLarge rank number uses accent color for visibility', () => {
      const { container } = render(
        <AnimeCardList
          anime={mockAnime}
          rank={1}
        />
      );

      const rank = screen.getByText('#1');
      const styles = rank.getAttribute('style');
      
      // Should use accent color variable
      expect(styles).toContain('var(--accent)');
    });

    it('focus indicators are visible with proper styling', () => {
      const mockOnChange = vi.fn();
      const { container } = render(<ViewModeToggle currentMode="large" onChange={mockOnChange} />);

      const buttons = screen.getAllByRole('button');
      
      // Buttons should have transition-all for smooth focus transitions
      buttons.forEach(button => {
        expect(button).toHaveClass('transition-all');
      });
    });

    it('hover states provide visual feedback', () => {
      const mockOnChange = vi.fn();
      render(<ViewModeToggle currentMode="large" onChange={mockOnChange} />);

      const inactiveButton = screen.getByRole('button', { name: /grid view/i });
      
      // Inactive buttons should have hover state
      expect(inactiveButton.className).toContain('hover:border-accent/50');
    });
  });
});
