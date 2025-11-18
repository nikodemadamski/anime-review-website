import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AnimeCardList } from '../AnimeCardList';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('AnimeCardList', () => {
  const mockAnime = {
    id: '1',
    title: 'Test Anime Title',
    coverImage: '/test-image.jpg',
    ratings: {
      visual: 8.5,
      music: 7.8,
      story: 9.2,
      character: 8.9,
    },
    genres: ['Action', 'Adventure', 'Fantasy'],
  };

  const mockProps = {
    anime: mockAnime,
    rank: 5,
  };

  it('renders with correct height (120px)', () => {
    render(<AnimeCardList {...mockProps} />);

    const card = screen.getByRole('listitem');
    expect(card).toHaveClass('h-[120px]');
  });

  it('displays rank number correctly', () => {
    render(<AnimeCardList {...mockProps} />);

    expect(screen.getByText('#5')).toBeInTheDocument();
  });

  it('displays rank number with different values', () => {
    const { rerender } = render(<AnimeCardList {...mockProps} rank={1} />);
    expect(screen.getByText('#1')).toBeInTheDocument();

    rerender(<AnimeCardList {...mockProps} rank={42} />);
    expect(screen.getByText('#42')).toBeInTheDocument();

    rerender(<AnimeCardList {...mockProps} rank={100} />);
    expect(screen.getByText('#100')).toBeInTheDocument();
  });

  it('shows all 4 ratings', () => {
    render(<AnimeCardList {...mockProps} />);

    expect(screen.getByText('8.5')).toBeInTheDocument(); // Visual
    expect(screen.getByText('7.8')).toBeInTheDocument(); // Music
    expect(screen.getByText('9.2')).toBeInTheDocument(); // Story
    expect(screen.getByText('8.9')).toBeInTheDocument(); // Character
  });

  it('displays title correctly', () => {
    render(<AnimeCardList {...mockProps} />);

    expect(screen.getByText('Test Anime Title')).toBeInTheDocument();
  });

  it('truncates long titles with line-clamp-1', () => {
    const longTitleAnime = {
      ...mockAnime,
      title: 'This is a very long anime title that should be truncated to one line',
    };

    render(<AnimeCardList {...mockProps} anime={longTitleAnime} />);

    const titleElement = screen.getByText(longTitleAnime.title);
    expect(titleElement).toHaveClass('line-clamp-1');
  });

  it('displays thumbnail image', () => {
    render(<AnimeCardList {...mockProps} />);

    const image = screen.getByAltText('Test Anime Title');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');
  });

  it('displays first genre only', () => {
    render(<AnimeCardList {...mockProps} />);

    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.queryByText('Adventure')).not.toBeInTheDocument();
    expect(screen.queryByText('Fantasy')).not.toBeInTheDocument();
  });

  it('handles anime with no genres', () => {
    const noGenreAnime = {
      ...mockAnime,
      genres: [],
    };

    render(<AnimeCardList {...mockProps} anime={noGenreAnime} />);

    // Should still render without errors
    expect(screen.getByText('Test Anime Title')).toBeInTheDocument();
  });

  it('links to correct anime detail page', () => {
    render(<AnimeCardList {...mockProps} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/anime/1');
  });
});
