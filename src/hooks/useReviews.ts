import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Review } from '@/types/review';
import { useAuth } from '@/context/AuthContext';

export function useReviews(animeId: string) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const fetchReviews = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('reviews')
                .select(`
          *,
          user:profiles(full_name, avatar_url)
        `)
                .eq('anime_id', animeId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Transform data to match Review interface (handling the join structure)
            const formattedReviews: Review[] = (data || []).map((item: any) => ({
                ...item,
                user: item.user
            }));

            setReviews(formattedReviews);
        } catch (err: any) {
            console.error('Error fetching reviews:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [animeId]);

    const submitReview = async (content: string, rating: number) => {
        if (!user) throw new Error('You must be logged in to submit a review');

        try {
            const { data, error } = await supabase
                .from('reviews')
                .insert({
                    user_id: user.id,
                    anime_id: animeId,
                    content,
                    rating
                })
                .select()
                .single();

            if (error) throw error;

            // Refresh reviews
            await fetchReviews();
            return data;
        } catch (err: any) {
            console.error('Error submitting review:', err);
            throw err;
        }
    };

    const deleteReview = async (reviewId: string) => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from('reviews')
                .delete()
                .eq('id', reviewId)
                .eq('user_id', user.id); // Security check handled by RLS, but good practice

            if (error) throw error;

            // Optimistic update
            setReviews(prev => prev.filter(r => r.id !== reviewId));
        } catch (err: any) {
            console.error('Error deleting review:', err);
            throw err;
        }
    }

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    return { reviews, loading, error, submitReview, deleteReview, refreshReviews: fetchReviews };
}
