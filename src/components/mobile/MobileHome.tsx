'use client';

import React, { useEffect, useState } from 'react';
import { WidgetCard } from './WidgetCard';
import { LongCard } from './LongCard';
import { SkeletonGrid } from '@/components/loading/SkeletonGrid';
import Link from 'next/link';
import { ChevronRight, Flame, Trophy, Sparkles } from 'lucide-react';

export function MobileHome() {
    const [trending, setTrending] = useState<any[]>([]);
    const [topRated, setTopRated] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [trendingRes, animeRes] = await Promise.all([
                    fetch('/api/trending'),
                    fetch('/api/anime?limit=10&sortBy=site')
                ]);

                if (trendingRes.ok && animeRes.ok) {
                    const trendingData = await trendingRes.json();
                    const animeData = await animeRes.json();

                    const tData = trendingData.data || trendingData;
                    const aData = animeData.data || animeData;

                    // Process Trending
                    const topTrending = (Array.isArray(tData) ? tData : [])
                        .filter((anime: any) => anime.ratings?.site > 0)
                        .sort((a: any, b: any) => b.ratings.site - a.ratings.site)
                        .slice(0, 8);

                    setTrending(topTrending);
                    setTopRated(Array.isArray(aData) ? aData : []);
                }
            } catch (error) {
                console.error('Error loading mobile home data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="pb-24 pt-4 px-4 space-y-8">
                <SkeletonGrid count={4} columns={2} />
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-full h-32 bg-secondary/10 rounded-2xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="pb-24 pt-2 space-y-6 overflow-x-hidden bg-background min-h-screen">

            {/* Hero / Featured Widget (Top 1 Trending) */}
            {trending.length > 0 && (
                <section className="px-4 pt-2">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="font-bold text-xl tracking-tight">Featured</h2>
                    </div>
                    <Link href={`/anime/${trending[0].id}`} className="block relative w-full aspect-[2/1] rounded-[24px] overflow-hidden shadow-lg border border-white/10 active:scale-[0.98] transition-transform duration-200">
                        <div className="absolute inset-0">
                            <img
                                src={trending[0].coverImage}
                                alt={trending[0].title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        </div>
                        <div className="absolute bottom-0 left-0 p-5 w-full">
                            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold mb-2 border border-white/20">
                                <Sparkles className="w-3 h-3 text-yellow-300" />
                                #{1} Trending
                            </div>
                            <h1 className="text-white font-bold text-2xl line-clamp-1 mb-1 tracking-tight">{trending[0].title}</h1>
                            <p className="text-white/80 text-xs line-clamp-2 font-medium leading-relaxed">{trending[0].description}</p>
                        </div>
                    </Link>
                </section>
            )}

            {/* Trending Widgets (Horizontal Scroll) */}
            <section>
                <div className="px-4 flex items-center justify-between mb-3">
                    <h2 className="font-bold text-xl tracking-tight">Trending Now</h2>
                    <Link href="/browse?sort=trending" className="p-1 rounded-full bg-secondary/10 hover:bg-secondary/20 transition-colors">
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </Link>
                </div>

                <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 px-4 pb-4 scrollbar-hide -mr-4 pr-8">
                    {trending.slice(1).map((anime, index) => (
                        <div key={anime.id} className="snap-start">
                            <WidgetCard
                                id={anime.id}
                                title={anime.title}
                                image={anime.coverImage}
                                score={anime.malScore ?? anime.ratings.site}
                                rank={index + 2}
                                subtitle={anime.genres?.[0]}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Top Rated Long Cards (Horizontal Scroll) */}
            <section>
                <div className="px-4 flex items-center justify-between mb-3">
                    <h2 className="font-bold text-xl tracking-tight">All Time Best</h2>
                    <Link href="/browse?sort=site" className="p-1 rounded-full bg-secondary/10 hover:bg-secondary/20 transition-colors">
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </Link>
                </div>

                <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 px-4 pb-4 scrollbar-hide -mr-4 pr-8">
                    {topRated.map((anime, index) => (
                        <div key={anime.id} className="snap-start">
                            <LongCard
                                id={anime.id}
                                title={anime.title}
                                image={anime.coverImage}
                                score={anime.malScore ?? anime.ratings.site}
                                description={anime.description}
                                genres={anime.genres}
                                rank={index + 1}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Quick Categories (Pills) */}
            <section className="px-4">
                <h2 className="font-bold text-xl tracking-tight mb-3">Browse by Genre</h2>
                <div className="flex flex-wrap gap-2.5">
                    {['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Sci-Fi', 'Romance', 'Slice of Life'].map(genre => (
                        <Link
                            key={genre}
                            href={`/browse?genre=${genre}`}
                            className="px-5 py-2.5 rounded-full bg-secondary/5 text-[13px] font-semibold hover:bg-secondary/10 transition-colors border border-border/50 active:scale-95 duration-200"
                        >
                            {genre}
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
