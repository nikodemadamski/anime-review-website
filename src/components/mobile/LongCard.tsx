'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, PlayCircle, Heart, Info } from 'lucide-react';
import { MobileSheet } from './MobileSheet';

interface LongCardProps {
    id: string;
    title: string;
    image: string;
    score: number;
    description?: string;
    genres?: string[];
    rank?: number;
}

export function LongCard({ id, title, image, score, description, genres, rank }: LongCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div
                onClick={() => setIsOpen(true)}
                className="block relative w-[320px] h-[140px] flex-shrink-0 active:scale-95 transition-transform duration-200 cursor-pointer"
            >
                <div className="relative w-full h-full rounded-[24px] overflow-hidden shadow-sm border border-border/50 bg-card">
                    {/* Background Image with Blur */}
                    <div className="absolute inset-0">
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover opacity-20 blur-xl scale-110"
                            sizes="320px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
                    </div>

                    <div className="relative h-full flex items-center p-3 gap-4">
                        {/* Main Image */}
                        <div className="relative w-[88px] h-[116px] flex-shrink-0 rounded-[16px] overflow-hidden shadow-md ring-1 ring-white/10">
                            <Image
                                src={image}
                                alt={title}
                                fill
                                className="object-cover"
                                sizes="100px"
                            />
                            {rank && (
                                <div className="absolute top-1.5 left-1.5 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20">
                                    #{rank}
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-center h-full py-1 min-w-0">
                            <h3 className="font-semibold text-[15px] leading-tight mb-1.5 line-clamp-2 tracking-tight text-foreground">
                                {title}
                            </h3>

                            {genres && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {genres.slice(0, 2).map(g => (
                                        <span key={g} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/5 text-primary/80 font-medium border border-primary/10">
                                            {g}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {description && (
                                <p className="text-[11px] text-muted-foreground line-clamp-2 mb-2 leading-relaxed font-medium">
                                    {description}
                                </p>
                            )}

                            <div className="flex items-center gap-3 mt-auto">
                                <div className="flex items-center gap-1 text-foreground text-xs font-bold bg-secondary/30 px-2 py-1 rounded-lg">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    {score.toFixed(1)}
                                </div>
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
                                {genres && genres.slice(0, 3).map(g => (
                                    <span key={g} className="px-2 py-1 rounded-md bg-secondary/10 text-xs font-bold text-muted-foreground">{g}</span>
                                ))}
                                <span className="px-2 py-1 rounded-md bg-yellow-500/10 text-yellow-500 text-xs font-bold flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-current" /> {score.toFixed(1)}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {description || 'No description available.'}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Link
                            href={`/anime/${id}`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm"
                        >
                            <Info className="w-4 h-4" />
                            View Details
                        </Link>
                        <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-secondary text-secondary-foreground font-bold text-sm">
                            <Heart className="w-4 h-4" />
                            Watchlist
                        </button>
                    </div>
                </div>
            </MobileSheet>
        </>
    );
}
