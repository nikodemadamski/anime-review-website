import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryCardRow } from '../CategoryCardRow';

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock analytics
vi.mock('@/lib/analytics-events', () => ({
  trackCategoryClick: vi.fn(),
}));

describe('CategoryCardRow', () => {
  const mockCategories = [
    {
      category: 'Visual' as const,
      color: '#FF6B6B',
      icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
      href: '/browse?sort=visual',
    },
    {
      category: 'Music' as const,
      color: '#4ECDC4',
      icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2',
      href: '/browse?sort=music',
    },
    {
      category: 'Story' as const,
      color: '#95E1D3',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13',
      href: '/browse?sort=story',
    },
    {
      category: 'Character' as const,
      color: '#F38181',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283',
      href: '/browse?sort=character',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders horizontal scroll container', () => {
    const { container } = render(<CategoryCardRow categories={mockCategories} />);

    const scrollContainer = container.querySelector('.overflow-x-auto');
    expect(scrollContainer).toBeInTheDocument();

    const flexContainer = container.querySelector('.flex.gap-4');
    expect(flexContainer).toBeInTheDocument();
  });

  it('displays correct number of cards', () => {
    render(<CategoryCardRow categories={mockCategories} />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(4);
  });

  it('each card links to correct browse page URL', () => {
    render(<CategoryCardRow categories={mockCategories} />);

    expect(screen.getByRole('link', { name: /visual/i })).toHaveAttribute(
      'href',
      '/browse?sort=visual'
    );
    expect(screen.getByRole('link', { name: /music/i })).toHaveAttribute(
      'href',
      '/browse?sort=music'
    );
    expect(screen.getByRole('link', { name: /story/i })).toHaveAttribute(
      'href',
      '/browse?sort=story'
    );
    expect(screen.getByRole('link', { name: /character/i })).toHaveAttribute(
      'href',
      '/browse?sort=character'
    );
  });

  it('cards show icon and name only', () => {
    const { container } = render(<CategoryCardRow categories={mockCategories} />);

    // Check that category names are displayed
    expect(screen.getByText('Visual')).toBeInTheDocument();
    expect(screen.getByText('Music')).toBeInTheDocument();
    expect(screen.getByText('Story')).toBeInTheDocument();
    expect(screen.getByText('Character')).toBeInTheDocument();

    // Check that icons are rendered (SVG elements)
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBe(4);

    // Verify no descriptions are shown (cards should be compact)
    const cards = screen.getAllByRole('link');
    cards.forEach((card) => {
      // Each card should only have icon and name, no additional text
      const textContent = card.textContent;
      expect(textContent).toMatch(/^(Visual|Music|Story|Character)$/);
    });
  });

  it('tracks analytics when card is clicked', async () => {
    const user = userEvent.setup();
    const { trackCategoryClick } = await import('@/lib/analytics-events');

    render(<CategoryCardRow categories={mockCategories} />);

    const visualCard = screen.getByRole('link', { name: /visual/i });
    await user.click(visualCard);

    expect(trackCategoryClick).toHaveBeenCalled();
  });

  it('renders with correct card dimensions', () => {
    const { container } = render(<CategoryCardRow categories={mockCategories} />);

    const cards = container.querySelectorAll('.w-\\[120px\\].h-\\[140px\\]');
    expect(cards.length).toBe(4);
  });

  it('handles empty categories array', () => {
    render(<CategoryCardRow categories={[]} />);

    const links = screen.queryAllByRole('link');
    expect(links).toHaveLength(0);
  });

  it('handles single category', () => {
    render(<CategoryCardRow categories={[mockCategories[0]]} />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(screen.getByText('Visual')).toBeInTheDocument();
  });
});
