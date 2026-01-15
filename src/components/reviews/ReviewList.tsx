'use client';

import React from 'react';
import { useReviews } from '@/hooks/useReviews';
import { formatDistanceToNow } from 'date-fns'; // We might need to install date-fns or use a simple formatter
import { Star, User } from 'lucide-react';
import Image from 'next/image';

interface ReviewListProps {
    animeId: string;
}

export function ReviewList({ animeId }: ReviewListProps) {
    const { reviews, loading, error, deleteReview } = useReviews(animeId);
    // We can add current user check here to show delete button

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse glass-panel p-6 rounded-xl flex gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-white/10 rounded w-1/4" />
                            <div className="h-16 bg-white/10 rounded w-full" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">Error loading reviews: {error}</div>;
    }

    if (reviews.length === 0) {
        return (
            <div className="text-center py-10 text-muted">
                <p>No reviews yet. Be the first to share your thoughts!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review.id} className="glass-panel p-6 rounded-xl space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            {/* User Avatar */}
                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-secondary/20">
                                {review.user?.avatar_url ? (
                                    <Image
                                        src={review.user.avatar_url}
                                        alt={review.user.full_name || 'User'}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-muted" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <div className="font-bold text-foreground">
                                    {review.user?.full_name || 'Anonymous User'}
                                </div>
                                <div className="text-xs text-muted">
                                    {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                                </div>
                            </div>
                        </div>

                        {/* Rating Badge */}
                        <div className="flex items-center gap-1 bg-accent/10 px-3 py-1 rounded-full">
                            <Star className="w-4 h-4 text-accent fill-accent" />
                            <span className="font-bold text-accent">{review.rating}/10</span>
                        </div>
                    </div>

                    <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                        {review.content}
                    </p>
                </div>
            ))}
        </div>
    );
}
