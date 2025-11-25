'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Info, LucideIcon } from 'lucide-react';
import { MobileSheet } from './MobileSheet';

interface Anime {
    id: string;
    title: string;
    coverImage: string;
    malScore?: number;
    ratings?: {
        site: number;
        visual: number;
        music: number;
        story: number;
        character: number;
    };
    description?: string;
    releaseYear?: number;
    status?: string;
    genres?: string[];
}

interface CategoryPodiumWidgetProps {
    category: string;
    items: Anime[];
    icon: LucideIcon;
    themeColor: string;
    accentColor: string; // For gradients/backgrounds
}

export function CategoryPodiumWidget({ category, items, icon: Icon, themeColor, accentColor }: CategoryPodiumWidgetProps) {
    const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);

    // Helper to get the specific rating for this category
    const getCategoryRating = (anime: Anime) => {
        if (!anime.ratings) return 0;
        const key = category.toLowerCase() as keyof typeof anime.ratings;
        return anime.ratings[key] || anime.ratings.site || 0;
    };

    return (
        <>
            <div className="w-[85vw] md:w-[360px] h-full flex flex-col bg-secondary/5 border border-white/5 rounded-[28px] overflow-hidden relative shadow-sm">
                {/* Header - More integrated and subtle */}
                <div className="px-4 py-3 flex items-center justify-between relative">
                    <div className={`absolute inset-0 opacity-[0.08] bg-gradient-to-r from-${accentColor.replace('bg-', '')} to-transparent`} />
                    <div className="flex items-center gap-2 relative z-10">
                        <div className={`p-1.5 rounded-lg ${accentColor} bg-opacity-10 border border-white/5`}>
                            <Icon className={`w-3.5 h-3.5 ${themeColor}`} />
                        </div>
                        <span className="font-bold text-[15px] tracking-tight text-foreground/90">{category}</span>
                    </div>
                </div>

                {/* List - Compact Layout */}
                <div className="flex-1 px-3 pb-3 space-y-2">
                    {items.slice(0, 3).map((anime, index) => {
                        const rating = getCategoryRating(anime);
                        const rank = index + 1;

                        return (
                            <div key={anime.id} className="group relative flex items-center gap-3 p-1.5 pr-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all active:scale-[0.99]">

                                {/* Image Container with Rank Badge */}
                                <Link href={`/anime/${anime.id}`} className="relative shrink-0 w-[48px] aspect-[2/3] rounded-xl overflow-hidden shadow-sm">
                                    <Image
                                        src={anime.coverImage}
                                        alt={anime.title}
                                        fill
                                        className="object-cover"
                                        sizes="48px"
                                    />
                                    {/* Glassmorphism Rank Badge */}
                                    <div className="absolute top-0 left-0 w-5 h-5 bg-black/40 backdrop-blur-md flex items-center justify-center rounded-br-lg border-r border-b border-white/10">
                                        <span className={`text-[10px] font-black ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-slate-300' : 'text-orange-400'}`}>
                                            {rank}
                                        </span>
                                    </div>
                                </Link>

                                {/* Info */}
                                <div className="flex-1 min-w-0 py-0.5">
                                    <Link href={`/anime/${anime.id}`} className="block mb-1">
                                        <h4 className="font-bold text-[13px] leading-tight line-clamp-1 text-foreground/90 mb-0.5">{anime.title}</h4>
                                        <p className="text-[10px] text-muted-foreground line-clamp-1 font-medium">
                                            {anime.genres?.[0] || "Anime"} • {anime.releaseYear || "2025"}
                                        </p>
                                    </Link>

                                    <div className="flex items-center justify-between">
                                        {/* Rating Pill */}
                                        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md ${accentColor} bg-opacity-10 border border-white/5`}>
                                            <Icon className={`w-2.5 h-2.5 ${themeColor}`} />
                                            <span className={`text-[10px] font-bold ${themeColor}`}>{rating.toFixed(1)}</span>
                                        </div>

                                        {/* Quick Preview Trigger - Subtle */}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setSelectedAnime(anime);
                                            }}
                                            className="p-1.5 -mr-1 rounded-full text-muted-foreground/50 hover:text-foreground hover:bg-white/5 transition-colors"
                                        >
                                            <Info className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Quick Preview Sheet */}
            <MobileSheet
                isOpen={!!selectedAnime}
                onClose={() => setSelectedAnime(null)}
                title="Category Breakdown"
            >
                {selectedAnime && (
                    <div className="flex flex-col gap-6">
                        {/* Header Info */}
                        <div className="flex gap-4">
                            <div className="relative w-28 h-40 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                                <Image src={selectedAnime.coverImage} alt={selectedAnime.title} fill className="object-cover" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-black leading-tight mb-2">{selectedAnime.title}</h3>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <span className="px-2 py-1 rounded-md bg-secondary/10 text-xs font-bold text-muted-foreground">
                                        {selectedAnime.releaseYear || '2025'}
                                    </span>
                                    <span className="px-2 py-1 rounded-md bg-secondary/10 text-xs font-bold text-muted-foreground">
                                        {selectedAnime.status || 'Unknown'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`px-2 py-1 rounded-md ${accentColor} bg-opacity-10 border border-white/5`}>
                                        <span className={`text-xs font-bold ${themeColor}`}>
                                            {category}: {getCategoryRating(selectedAnime).toFixed(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* All Ratings Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'Visuals', val: selectedAnime.ratings?.visual, icon: Star },
                                { label: 'Music', val: selectedAnime.ratings?.music, icon: Star },
                                { label: 'Story', val: selectedAnime.ratings?.story, icon: Star },
                                { label: 'Characters', val: selectedAnime.ratings?.character, icon: Star },
                            ].map((r) => (
                                <div key={r.label} className="p-3 rounded-xl bg-secondary/5 border border-white/5 flex items-center justify-between">
                                    <span className="text-xs font-medium text-muted-foreground">{r.label}</span>
                                    <span className="text-sm font-bold">{(r.val || 0).toFixed(1)}</span>
                                </div>
                            ))}
                        </div>

                        {/* Synopsis */}
                        <div>
                            <h4 className="font-bold text-sm mb-2">Synopsis</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                                {selectedAnime.description}
                            </p>
                        </div>

                        {/* CTA */}
                        <Link
                            href={`/anime/${selectedAnime.id}`}
                            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-center active:scale-95 transition-transform"
                        >
                            View Full Details
                        </Link>
                    </div>
                )}
            </MobileSheet>
        </>
    );
}
