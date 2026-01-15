import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileTabs } from '../ProfileTabs';
import { vi, describe, it, expect } from 'vitest';

// Mock ReviewList
vi.mock('@/components/reviews/ReviewList', () => ({
    ReviewList: () => <div data-testid="review-list">Mock Review List</div>
}));

describe('ProfileTabs', () => {
    const defaultProps = {
        userId: 'u1',
        initialReviews: [],
        watchlistCount: 5,
    };

    it('renders default Overview tab', () => {
        render(<ProfileTabs {...defaultProps} />);
        expect(screen.getByText('Recent Reviews')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /overview/i })).toHaveClass('text-accent');
    });

    it('switches to Watchlist tab', () => {
        render(<ProfileTabs {...defaultProps} />);
        fireEvent.click(screen.getByRole('button', { name: /watchlist/i }));

        expect(screen.getByText('Watchlist display coming soon...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /watchlist/i })).toHaveClass('text-accent');
    });

    it('switches to Reviews tab', () => {
        render(<ProfileTabs {...defaultProps} />);
        fireEvent.click(screen.getByRole('button', { name: /reviews/i }));

        expect(screen.getByTestId('review-list')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /reviews/i })).toHaveClass('text-accent');
    });

    it('displays counts correctly', () => {
        render(<ProfileTabs {...defaultProps} />);
        // Watchlist count
        expect(screen.getByText('5')).toBeInTheDocument();
        // Reviews count (initial is 0)
        expect(screen.getByText('0')).toBeInTheDocument();
    });
});
