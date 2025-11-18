import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AnimeCardLarge } from '../AnimeCardLarge';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

// Mock WatchNowButton component
vi.mock('@/components/anime/WatchNowButton', () => ({
  WatchNowButton: ({ onWatchNowClick }: any) => (
    <button onClick={onWatchNowClick}>Watch Now</button>
  ),
}));

// Mock trending functions
vi.mock('@/lib/trending', () => ({
  getWatchingCount: () => 0,
  isTrending: () => false,
}));

describe('AnimeCardLarge', () => {
  const mockAnime = {
    id: '1',
    title: 'Test Anime',
    coverImage: '/test-image.jpg',
    ratings: {
      visual: 8.5,
      music: 7.8,
      story: 9.2,
      character: 8.9,
      site: 8.6,
    },
    genres: ['Action', 'Adventure', 'Fantasy', 'Drama'],
  };

  const mockProps = {
    anime: mockAnime,
    onWatchlistToggle: vi.fn(),
    onWatchNowClick: vi.fn(),
    isInWatchlist: false,
  };

  it('renders all 4 rating badges', () => {
    render(<AnimeCardLarge {...mockProps} />);

    expect(screen.getByText('8.5')).toBeInTheDocument(); // Visual
    expect(screen.getByText('7.8')).toBeInTheDocument(); // Music
    expect(screen.getByText('9.2')).toBeInTheDocument(); // Story
    expect(screen.getByText('8.9')).toBeInTheDocument(); // Character
  });

  it('displays correct anime data', () => {
    render(<AnimeCardLarge {...mockProps} />);

    // Title
    expect(screen.getByText('Test Anime')).toBeInTheDocument();

    // Cover image
    const image = screen.getByAltText('Test Anime');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');

    // Genres (first 3)
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Adventure')).toBeInTheDocument();
    expect(screen.getByText('Fantasy')).toBeInTheDocument();
    expect(screen.queryByText('Drama')).not.toBeInTheDocument(); // 4th genre should not show
  });

  it('calls watchlist toggle callback when button is clicked', async () => {
    const user = userEvent.setup();
    const mockToggle = vi.fn();
    
    render(<AnimeCardLarge {...mockProps} onWatchlistToggle={mockToggle} />);

    const watchlistButton = screen.getByRole('button', { name: /add.*to watchlist/i });
    await user.click(watchlistButton);

    expect(mockToggle).toHaveBeenCalledWith('1');
  });

  it('calls watch now callback when button is clicked', async () => {
    const user = userEvent.setup();
    const mockWatchNow = vi.fn();
    
    render(<AnimeCardLarge {...mockProps} onWatchNowClick={mockWatchNow} />);

    const watchNowButton = screen.getByRole('button', { name: /watch now/i });
    await user.click(watchNowButton);

    expect(mockWatchNow).toHaveBeenCalled();
  });

  it('shows correct watchlist button state when in watchlist', () => {
    render(<AnimeCardLarge {...mockProps} isInWatchlist={true} />);

    const watchlistButton = screen.getByRole('button', { name: /in watchlist/i });
    expect(watchlistButton).toBeInTheDocument();
    expect(watchlistButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows correct watchlist button state when not in watchlist', () => {
    render(<AnimeCardLarge {...mockProps} isInWatchlist={false} />);

    const watchlistButton = screen.getByRole('button', { name: /add.*to watchlist/i });
    expect(watchlistButton).toBeInTheDocument();
    expect(watchlistButton).toHaveAttribute('aria-pressed', 'false');
  });
});
