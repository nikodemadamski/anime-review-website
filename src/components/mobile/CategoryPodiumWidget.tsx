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

    const medals = [
        { color: 'bg-yellow-400', text: 'text-black', label: '1' },
        { color: 'bg-slate-300', text: 'text-black', label: '2' },
        { color: 'bg-orange-400', text: 'text-black', label: '3' },
    ];

    // Helper to get the specific rating for this category
    const getCategoryRating = (anime: Anime) => {
        if (!anime.ratings) return 0;
        const key = category.toLowerCase() as keyof typeof anime.ratings;
        return anime.ratings[key] || anime.ratings.site || 0;
    };

    return (
        <>
            <div className="w-[85vw] md:w-[360px] h-full flex flex-col bg-secondary/5 border border-white/5 rounded-3xl overflow-hidden relative">
                {/* Header */}
                <div className={`px-5 py-4 flex items-center justify-between relative overflow-hidden`}>
                    <div className={`absolute inset-0 opacity-10 ${accentColor}`} />
                    <div className="flex items-center gap-2 relative z-10">
                        <div className={`p-2 rounded-xl ${accentColor} bg-opacity-20`}>
                            <Icon className={`w-5 h-5 ${themeColor}`} />
                        </div>
                        <span className="font-black text-lg tracking-tight">{category}</span>
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 p-3 space-y-2">
                    {items.slice(0, 3).map((anime, index) => {
                        const medal = medals[index];
                        const rating = getCategoryRating(anime);

                        return (
                            <div key={anime.id} className="group relative flex items-center gap-3 p-2 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                {/* Rank Medal */}
                                <div className={`absolute -left-1 top-4 w-6 h-6 ${medal.color} flex items-center justify-center rounded-r-lg shadow-lg z-20`}>
                                    <span className={`font-black text-xs ${medal.text}`}>{medal.label}</span>
                                </div>

                                {/* Cover Image */}
                                <Link href={`/anime/${anime.id}`} className="relative shrink-0 w-[60px] aspect-[2/3] rounded-xl overflow-hidden shadow-md ml-3">
                                    <Image
                                        src={anime.coverImage}
                                        alt={anime.title}
                                        fill
                                        className="object-cover"
                                    />
                                </Link>

                                {/* Info */}
                                <div className="flex-1 min-w-0 py-1">
                                    <Link href={`/anime/${anime.id}`} className="block">
                                        <h4 className="font-bold text-sm leading-tight line-clamp-1 mb-1">{anime.title}</h4>
                                        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed mb-2">
                                            {anime.description || "No description available."}
                                        </p>
                                    </Link>

                                    <div className="flex items-center justify-between">
                                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/5`}>
                                            <Icon className={`w-3 h-3 ${themeColor}`} />
                                            <span className={`text-xs font-bold ${themeColor}`}>{rating.toFixed(1)}</span>
                                        </div>

                                        {/* Quick Preview Trigger */}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setSelectedAnime(anime);
                                            }}
                                            className="p-1.5 rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            <Info className="w-4 h-4" />
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
