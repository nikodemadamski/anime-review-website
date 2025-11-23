'use client';

import React, { useEffect, useState } from 'react';
import { WidgetCard } from './WidgetCard';
import { Sparkles, TrendingUp, Calendar, Heart } from 'lucide-react';
import Link from 'next/link';

export function DiscoverView() {
    const [trending, setTrending] = useState<any[]>([]);
    const [upcoming, setUpcoming] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [trendRes, upRes] = await Promise.all([
                    fetch('/api/trending'),
                    fetch('/api/anime?status=upcoming&limit=5')
                ]);

                const trendData = await trendRes.json();
                const upData = await upRes.json();

                setTrending((trendData.data || trendData).slice(0, 5));
                setUpcoming((upData.data || upData).slice(0, 5));
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return <div className="h-screen animate-pulse bg-background" />;

    return (
        <div className="space-y-8 pt-6">
            {/* Hero Section */}
            <section className="px-4">
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    <h2 className="text-xl font-bold tracking-tight">Editor's Choice</h2>
                </div>
                {trending[0] && (
                    <Link href={`/anime/${trending[0].id}`} className="block relative aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl active:scale-95 transition-transform">
                        <img src={trending[0].coverImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 p-6">
                            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/20 mb-3 inline-block">
                                Must Watch
                            </span>
                            <h3 className="text-3xl font-black text-white leading-tight mb-2">{trending[0].title}</h3>
                            <p className="text-white/80 line-clamp-2 text-sm font-medium">{trending[0].description}</p>
                        </div>
                    </Link>
                )}
            </section>

            {/* Trending Horizontal */}
            <section>
                <div className="px-4 flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-red-400" />
                        <h2 className="text-xl font-bold tracking-tight">Trending Now</h2>
                    </div>
                </div>
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 pb-4 scrollbar-hide">
                    {trending.slice(1).map((anime, i) => (
                        <div key={anime.id} className="snap-start shrink-0 w-[280px]">
                            <WidgetCard {...anime} rank={i + 2} image={anime.coverImage} score={anime.malScore || anime.ratings?.site} />
                        </div>
                    ))}
                </div>
            </section>

            {/* Mood Grid */}
            <section className="px-4">
                <div className="flex items-center gap-2 mb-4">
                    <Heart className="w-5 h-5 text-pink-400" />
                    <h2 className="text-xl font-bold tracking-tight">Browse by Mood</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { label: 'Adrenaline', color: 'bg-orange-500', emoji: '🔥' },
                        { label: 'Chill', color: 'bg-blue-500', emoji: '🧊' },
                        { label: 'Laugh', color: 'bg-yellow-500', emoji: '😂' },
                        { label: 'Cry', color: 'bg-indigo-500', emoji: '😭' },
                    ].map(mood => (
                        <button key={mood.label} className="h-24 rounded-2xl bg-secondary/5 border border-white/5 relative overflow-hidden group active:scale-95 transition-transform">
                            <div className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity ${mood.color}`} />
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                                <span className="text-2xl">{mood.emoji}</span>
                                <span className="font-bold text-sm">{mood.label}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
}
