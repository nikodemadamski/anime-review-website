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
        { color: 'bg-yellow-400', text: 'text-black', label: '1' },
        { color: 'bg-slate-300', text: 'text-black', label: '2' },
        { color: 'bg-orange-400', text: 'text-black', label: '3' },
    ];

    return (
        <Link
            href={`/browse?sort=${category.toLowerCase()}`}
            className="block w-full h-full bg-secondary/5 border border-white/5 rounded-2xl overflow-hidden relative group active:scale-95 transition-transform"
        >
            {/* Header */}
            <div className="px-3 py-2 bg-white/5 border-b border-white/5 flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-muted-foreground">{category}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            </div>

            {/* List of Top 3 */}
            <div className="p-2 space-y-2">
                {items.slice(0, 3).map((anime, index) => {
                    const medal = medals[index];
                    const score = anime.malScore || anime.ratings?.site || 0;

                    return (
                        <div key={anime.id} className="flex items-center gap-2">
                            {/* Rank & Image */}
                            <div className="relative shrink-0 w-8 h-10 rounded-md overflow-hidden">
                                <Image
                                    src={anime.coverImage}
                                    alt={anime.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className={`absolute top-0 left-0 w-3.5 h-3.5 ${medal.color} flex items-center justify-center text-[8px] font-black ${medal.text} rounded-br-md`}>
                                    {medal.label}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[10px] font-bold leading-tight line-clamp-1 mb-0.5">{anime.title}</h4>
                                <div className="flex items-center gap-1">
                                    <Star className="w-2 h-2 text-yellow-500 fill-current" />
                                    <span className="text-[9px] font-bold text-muted-foreground">{score.toFixed(1)}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Link>
    );
}
