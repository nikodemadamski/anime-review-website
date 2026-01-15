'use client';

import React, { useState } from 'react';
import { useReviews } from '@/hooks/useReviews';
import { Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface WriteReviewFormProps {
    animeId: string;
}

export function WriteReviewForm({ animeId }: WriteReviewFormProps) {
    const { submitReview } = useReviews(animeId);
    const { user } = useAuth();

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    if (!user) {
        return (
            <div className="glass-panel p-6 rounded-xl text-center">
                <p className="text-muted mb-2">Want to share your thoughts?</p>
                <button className="text-accent underline font-bold" onClick={() => {/* Trigger auth modal if available */ }}>
                    Sign in to write a review
                </button>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }
        if (content.trim().length < 10) {
            setError('Review must be at least 10 characters long');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await submitReview(content, rating);
            setSuccess(true);
            setContent('');
            setRating(0);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="glass-panel p-6 rounded-xl space-y-4">
            <h3 className="text-xl font-bold">Write a Review</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Rating Selection */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-muted uppercase tracking-wider">Your Rating</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="transition-transform hover:scale-110 focus:outline-none"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                            >
                                <Star
                                    className={`w-6 h-6 transition-colors ${star <= (hoverRating || rating)
                                            ? 'text-accent fill-accent'
                                            : 'text-muted/30'
                                        }`}
                                />
                            </button>
                        ))}
                        <span className="ml-2 font-bold text-lg w-8 text-center">
                            {hoverRating || rating || '-'}
                        </span>
                    </div>
                </div>

                {/* Content Input */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-muted uppercase tracking-wider">Your Review</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-32 bg-background/50 border border-white/10 rounded-lg p-4 text-foreground placeholder:text-muted/50 focus:ring-2 focus:ring-accent focus:outline-none transition-all resize-none"
                        placeholder="What did you think about the story, characters, and visuals?"
                        disabled={isSubmitting}
                    />
                </div>

                {/* Messages */}
                {error && (
                    <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="text-green-500 text-sm bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                        Review submitted successfully!
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-accent text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Posting...' : 'Post Review'}
                    </button>
                </div>
            </form>
        </div>
    );
}
