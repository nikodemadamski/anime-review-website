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
    color?: string;
}

export function CategoryPodiumCard({ category, items, color = 'bg-primary' }: CategoryPodiumCardProps) {
    const topAnime = items[0];
    if (!topAnime) return null;

    const score = topAnime.malScore || topAnime.ratings?.site || 0;

    return (
        <Link href={`/browse?sort=${category.toLowerCase()}`} className="block relative w-full aspect-[4/3] rounded-2xl overflow-hidden group">
            {/* Background Image */}
            <Image
                src={topAnime.coverImage}
                alt={topAnime.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 p-3 flex flex-col justify-between">
                {/* Category Badge */}
                <div className="self-start px-2 py-1 rounded-lg bg-white/20 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider">
                    {category}
                </div>

                {/* Anime Info */}
                <div>
                    <div className="flex items-center gap-1 mb-1">
                        <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center text-[10px] font-black text-black shadow-lg shadow-yellow-400/20">
                            1
                        </div>
                        <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-black/40 backdrop-blur-sm border border-white/10">
                            <Star className="w-2.5 h-2.5 text-yellow-400 fill-current" />
                            <span className="text-white text-[10px] font-bold">{score.toFixed(1)}</span>
                        </div>
                    </div>
                    <h3 className="text-white font-bold text-sm line-clamp-2 leading-tight">
                        {topAnime.title}
                    </h3>
                </div>
            </div>
        </Link>
    );
}
