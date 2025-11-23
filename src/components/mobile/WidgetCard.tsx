'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, PlayCircle, Heart, Info } from 'lucide-react';
import { MobileSheet } from './MobileSheet';
import { DynamicIsland } from './DynamicIsland';

interface WidgetCardProps {
    id: string;
    title: string;
    image: string;
    score: number;
    rank?: number;
    subtitle?: string;
}

export function WidgetCard({ id, title, image, score, rank, subtitle }: WidgetCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    const handleLike = () => {
        setIsLiked(!isLiked);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    return (
        <>
            {/* Dynamic Island Feedback */}
            <DynamicIsland isVisible={showToast} message={isLiked ? "Added to Watchlist" : "Removed from Watchlist"} />

            <div
                onClick={() => setIsOpen(true)}
                className="block relative w-[160px] h-[160px] flex-shrink-0 active:scale-95 transition-transform duration-200 cursor-pointer"
            >
                <div className="relative w-full h-full rounded-[20px] overflow-hidden shadow-sm border border-white/10 bg-card">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="160px"
                    />

                    {/* Gradient Overlay - Softer Apple Style */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    {/* Rank Badge - Glassmorphism */}
                    {rank && (
                        <div className="absolute top-2 left-2 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20 shadow-sm">
                            #{rank}
                        </div>
                    )}

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="text-white font-semibold text-[13px] line-clamp-2 leading-tight mb-1 tracking-tight">
                            {title}
                        </h3>
                        <div className="flex items-center justify-between">
                            {subtitle && (
                                <span className="text-[10px] text-white/80 line-clamp-1 font-medium">{subtitle}</span>
                            )}
                            <div className="flex items-center gap-1 text-white text-[10px] font-bold bg-black/30 px-1.5 py-0.5 rounded-md backdrop-blur-md border border-white/10">
                                <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                                {score.toFixed(1)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick View Sheet */}
            <MobileSheet isOpen={isOpen} onClose={() => setIsOpen(false)} title="Quick View">
                <div className="flex flex-col gap-6">
                    <div className="flex gap-4">
                        <div className="relative w-28 h-40 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                            <Image src={image} alt={title} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-black leading-tight mb-2">{title}</h3>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {subtitle && <span className="px-2 py-1 rounded-md bg-secondary/10 text-xs font-bold text-muted-foreground">{subtitle}</span>}
                                <span className="px-2 py-1 rounded-md bg-yellow-500/10 text-yellow-500 text-xs font-bold flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-current" /> {score.toFixed(1)}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                Tap "View Details" to see full information, reviews, and more about this anime.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Link
                            href={`/anime/${id}`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm active:scale-95 transition-transform"
                        >
                            <Info className="w-4 h-4" />
                            View Details
                        </Link>
                        <button
                            onClick={handleLike}
                            className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 ${isLiked ? 'bg-pink-500 text-white' : 'bg-secondary text-secondary-foreground'}`}
                        >
                            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                            {isLiked ? 'Saved' : 'Watchlist'}
                        </button>
                    </div>
                </div>
            </MobileSheet>
        </>
    );
}
