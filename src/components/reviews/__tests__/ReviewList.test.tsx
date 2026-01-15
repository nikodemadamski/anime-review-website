import { render, screen } from '@testing-library/react';
import { ReviewList } from '../ReviewList';
import { vi, describe, it, expect } from 'vitest';

// Mock hook
const mockUseReviews = vi.fn();
vi.mock('@/hooks/useReviews', () => ({
    useReviews: (animeId: string) => mockUseReviews(animeId),
}));

describe('ReviewList', () => {
    it('renders loading state', () => {
        mockUseReviews.mockReturnValue({
            reviews: [],
            loading: true,
            error: null,
        });

        render(<ReviewList animeId="1" />);
        // Check for skeleton elements or container
        const skeletons = document.querySelectorAll('.animate-pulse');
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('renders reviews', () => {
        const mockReviews = [
            {
                id: '1',
                user_id: 'u1',
                anime_id: '1',
                content: 'Great anime!',
                rating: 9,
                likes_count: 0,
                created_at: new Date().toISOString(),
                user: {
                    full_name: 'Test Benz',
                    avatar_url: 'https://example.com/avatar.jpg'
                }
            }
        ];

        mockUseReviews.mockReturnValue({
            reviews: mockReviews,
            loading: false,
            error: null,
        });

        render(<ReviewList animeId="1" />);
        expect(screen.getByText('Test Benz')).toBeInTheDocument();
        expect(screen.getByText('Great anime!')).toBeInTheDocument();
        expect(screen.getByText('9/10')).toBeInTheDocument();
    });

    it('renders empty state', () => {
        mockUseReviews.mockReturnValue({
            reviews: [],
            loading: false,
            error: null,
        });

        render(<ReviewList animeId="1" />);
        expect(screen.getByText(/No reviews yet/i)).toBeInTheDocument();
    });
});
