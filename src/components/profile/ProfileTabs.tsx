'use client';

import React, { useState } from 'react';
import { ReviewList } from '@/components/reviews/ReviewList';
import { Review } from '@/types/review';

interface ProfileTabsProps {
    userId: string;
    initialReviews: Review[]; // These should be the user's reviews with anime data joined
    watchlistCount: number; // Placeholder for now, eventually pass watchlist items
}

export function ProfileTabs({ userId, initialReviews, watchlistCount }: ProfileTabsProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'watchlist' | 'reviews'>('overview');

    return (
        <div className="space-y-8">
            {/* Tab Navigation */}
            <div className="flex items-center gap-8 border-b border-border/50">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-4 px-2 font-bold text-sm transition-colors relative ${activeTab === 'overview'
                            ? 'text-accent'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Overview
                    {activeTab === 'overview' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent rounded-full" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('watchlist')}
                    className={`pb-4 px-2 font-bold text-sm transition-colors relative ${activeTab === 'watchlist'
                            ? 'text-accent'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Watchlist
                    <span className="ml-2 px-2 py-0.5 bg-secondary rounded-full text-xs">
                        {watchlistCount}
                    </span>
                    {activeTab === 'watchlist' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent rounded-full" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-4 px-2 font-bold text-sm transition-colors relative ${activeTab === 'reviews'
                            ? 'text-accent'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Reviews
                    <span className="ml-2 px-2 py-0.5 bg-secondary rounded-full text-xs">
                        {initialReviews.length}
                    </span>
                    {activeTab === 'reviews' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent rounded-full" />
                    )}
                </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <h3 className="text-xl font-bold mb-4">Recent Reviews</h3>
                            {initialReviews.length > 0 ? (
                                <ReviewList reviews={initialReviews.slice(0, 3)} mode="profile" />
                            ) : (
                                <p className="text-muted-foreground">No recent reviews.</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'watchlist' && (
                    <div className="text-center py-20 text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <p>Watchlist display coming soon...</p>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ReviewList reviews={initialReviews} mode="profile" />
                    </div>
                )}
            </div>
        </div>
    );
}
