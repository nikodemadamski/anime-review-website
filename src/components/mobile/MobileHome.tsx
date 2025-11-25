'use client';

import React, { useEffect, useState } from 'react';
import { WidgetCard } from './WidgetCard';
import { CategoryPodiumWidget } from './CategoryPodiumWidget';
import { SkeletonGrid } from '@/components/loading/SkeletonGrid';
import Link from 'next/link';
import { ChevronRight, Sparkles, Flame, Eye, Music, BookOpen, Users } from 'lucide-react';

export function MobileHome() {
    const [trending, setTrending] = useState<any[]>([]);
    const [topRated, setTopRated] = useState<any[]>([]);
    const [categoryData, setCategoryData] = useState<Record<string, any[]>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                // Map display names to API sort keys
                const categoryMap = {
                    'Visuals': 'visual',
                    'Music': 'music',
                    'Story': 'story',
                    'Characters': 'character'
                };

                const promises = [
                    fetch('/api/trending'),
                    fetch('/api/anime?limit=10&sortBy=mal'), // Use MAL sort for All Time Best
                    ...Object.values(categoryMap).map(sortKey => fetch(`/api/anime?limit=3&sortBy=${sortKey}`))
                ];

                const responses = await Promise.all(promises);

                const trendingRes = await responses[0].json();
                const topRatedRes = await responses[1].json();

                const catResults: Record<string, any[]> = {};
                const catKeys = Object.keys(categoryMap);

                for (let i = 0; i < catKeys.length; i++) {
                    const res = await responses[i + 2].json();
                    catResults[catKeys[i]] = res.data || res;
                }

                setTrending(trendingRes.data || trendingRes);
                setTopRated(topRatedRes.data || topRatedRes);
                setCategoryData(catResults);

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

    const categoryConfig = {
        'Visuals': { icon: Eye, theme: 'text-pink-400', accent: 'bg-pink-500' },
        'Music': { icon: Music, theme: 'text-violet-400', accent: 'bg-violet-500' },
        'Story': { icon: BookOpen, theme: 'text-cyan-400', accent: 'bg-cyan-500' },
        'Characters': { icon: Users, theme: 'text-amber-400', accent: 'bg-amber-500' },
    };

    return (
        <div className="pb-24 pt-2 space-y-8 overflow-x-hidden bg-background min-h-screen">

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

            {/* All Time Best (Sorted by MAL Score) - MOVED UP */}
            <section>
                <div className="px-4 flex items-center justify-between mb-3">
                    <h2 className="font-bold text-xl tracking-tight">All Time Best</h2>
                    <Link href="/browse?sort=mal" className="p-1 rounded-full bg-secondary/10 hover:bg-secondary/20 transition-colors">
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </Link>
                </div>

                <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 px-4 pb-4 scrollbar-hide -mr-4 pr-8">
                    {topRated.map((anime, index) => (
                        <div key={anime.id} className="snap-start">
                            <WidgetCard
                                id={anime.id}
                                title={anime.title}
                                image={anime.coverImage}
                                score={anime.malScore ?? anime.ratings.site}
                                rank={index + 1}
                                subtitle={anime.genres?.[0]}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Category Podiums (Horizontal Scroll) */}
            <section>
                <div className="px-4 flex items-center justify-between mb-3">
                    <h2 className="font-bold text-xl tracking-tight">Top Categories</h2>
                </div>

                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 pb-4 scrollbar-hide">
                    {Object.entries(categoryData).map(([category, items]) => {
                        const config = categoryConfig[category as keyof typeof categoryConfig] || { icon: Flame, theme: 'text-orange-400', accent: 'bg-orange-500' };

                        return (
                            <div key={category} className="snap-center shrink-0 h-[380px]">
                                <CategoryPodiumWidget
                                    category={category}
                                    items={items}
                                    icon={config.icon}
                                    themeColor={config.theme}
                                    accentColor={config.accent}
                                />
                            </div>
                        );
                    })}
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
