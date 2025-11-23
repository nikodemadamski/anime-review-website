'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';

interface Anime {
    id: string;
    title: string;
    coverImage: string;
    malScore?: number;
    ratings?: { site: number };
}

interface CategoryPodiumCardProps {
    category: string;
    items: Anime[];
}

export function CategoryPodiumCard({ category, items }: CategoryPodiumCardProps) {
    const medals = [
        { color: 'from-yellow-300 to-yellow-600', shadow: 'shadow-yellow-500/50', label: '1' }, // Gold
        { color: 'from-slate-300 to-slate-500', shadow: 'shadow-slate-500/50', label: '2' },   // Silver
        { color: 'from-orange-300 to-orange-600', shadow: 'shadow-orange-500/50', label: '3' }, // Bronze
    ];

    return (
        <div className="w-full p-5 rounded-[32px] bg-secondary/5 border border-white/5 relative overflow-hidden">
            {/* Background Blur/Gradient */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />

            <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="font-black text-xl tracking-tight">{category}</h3>
                <Link href={`/browse?genre=${category}`} className="text-xs font-bold text-primary px-3 py-1 rounded-full bg-primary/10">
                    See All
                </Link>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {items.slice(0, 3).map((anime, index) => {
                    const medal = medals[index];
                    const score = anime.malScore || anime.ratings?.site || 0;

                    return (
                        <Link key={anime.id} href={`/anime/${anime.id}`} className="flex flex-col gap-2 group">
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 group-active:scale-95">
                                <Image
                                    src={anime.coverImage}
                                    alt={anime.title}
                                    fill
                                    className="object-cover"
                                />

                                {/* Medal Badge */}
                                <div className={`absolute top-0 left-0 w-7 h-7 rounded-br-xl bg-gradient-to-br ${medal.color} flex items-center justify-center text-white font-black text-xs shadow-lg z-10`}>
                                    {medal.label}
                                </div>

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <div className="text-center">
                                <h4 className="font-bold text-[11px] leading-tight line-clamp-2 h-8 mb-1 text-foreground/90">
                                    {anime.title}
                                </h4>
                                <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-secondary/10 border border-white/5">
                                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                    <span className="text-[10px] font-black">{score.toFixed(1)}</span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
