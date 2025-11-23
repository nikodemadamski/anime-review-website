'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, Eye, Music, BookOpen, Users } from 'lucide-react';
import { Container } from '@/components/ui';

type CategoryType = 'overall' | 'visual' | 'music' | 'story' | 'character';

const categories = [
    { id: 'overall', label: 'Overall', icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { id: 'visual', label: 'Visuals', icon: Eye, color: 'text-pink-400', bg: 'bg-pink-400/10' },
    { id: 'music', label: 'Music', icon: Music, color: 'text-violet-400', bg: 'bg-violet-400/10' },
    { id: 'story', label: 'Story', icon: BookOpen, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { id: 'character', label: 'Characters', icon: Users, color: 'text-amber-400', bg: 'bg-amber-400/10' },
];

export function TopRatedCategorySection() {
    const [activeCategory, setActiveCategory] = useState<CategoryType>('overall');
    const [animeList, setAnimeList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTopRated() {
            setLoading(true);
            try {
                const response = await fetch('/api/anime');
                if (response.ok) {
                    const result = await response.json();
                    const data = Array.isArray(result.data) ? result.data : [];

                    // Sort by active category
                    const key = activeCategory === 'overall' ? 'site' : activeCategory;
                    const sorted = [...data].sort((a, b) => (b.ratings[key] || 0) - (a.ratings[key] || 0));

                    setAnimeList(sorted.slice(0, 6));
                }
            } catch (error) {
                console.error('Failed to fetch anime:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchTopRated();
    }, [activeCategory]);

    const activeCatInfo = categories.find(c => c.id === activeCategory)!;

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent pointer-events-none" />

            <Container size="xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 mb-4 font-bold text-sm"
                        >
                            <Star className="w-4 h-4 fill-current" />
                            <span>Hall of Fame</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl md:text-5xl font-black"
                        >
                            Top Rated <span className="text-gradient">Anime</span>
                        </motion.h2>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => {
                            const Icon = cat.icon;
                            const isActive = activeCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id as CategoryType)}
                                    className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition-all ${isActive
                                        ? 'bg-foreground text-background shadow-lg scale-105'
                                        : 'bg-secondary/10 text-muted hover:bg-secondary/20'
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-background' : ''}`} />
                                    {cat.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Anime Grid */}
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 md:grid md:grid-cols-3 lg:grid-cols-6 md:gap-6 md:pb-0 md:mx-0 md:px-0 scrollbar-hide">
                    <AnimatePresence mode='wait'>
                        {loading ? (
                            [...Array(6)].map((_, i) => (
                                <div key={i} className="flex-none w-[140px] md:w-auto aspect-[2/3] rounded-2xl bg-secondary/10 animate-pulse snap-center" />
                            ))
                        ) : (
                            animeList.map((anime, index) => (
                                <motion.div
                                    key={anime.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex-none w-[140px] md:w-auto snap-center"
                                >
                                    <Link href={`/anime/${anime.id}`} className="group block relative h-full">
                                        <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-2 md:mb-3 glass-panel transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-indigo-500/20">
                                            {/* Rank Badge */}
                                            <div className={`absolute top-1 left-1 md:top-2 md:left-2 z-10 w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center font-black text-sm md:text-lg shadow-lg ${index === 0 ? 'bg-yellow-400 text-black' :
                                                index === 1 ? 'bg-slate-300 text-black' :
                                                    index === 2 ? 'bg-amber-600 text-white' :
                                                        'bg-black/60 text-white backdrop-blur-md border border-white/10'
                                                }`}>
                                                {index + 1}
                                            </div>

                                            <Image
                                                src={anime.coverImage}
                                                alt={anime.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                sizes="(max-width: 768px) 140px, 20vw"
                                            />

                                            {/* Score Overlay */}
                                            <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                                                <div className="flex items-center justify-between">
                                                    <div className={`flex items-center gap-1 font-black text-sm md:text-lg ${activeCatInfo.color}`}>
                                                        <activeCatInfo.icon className="w-3 h-3 md:w-5 md:h-5 fill-current" />
                                                        {anime.ratings[activeCategory === 'overall' ? 'site' : activeCategory].toFixed(1)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <h3 className="font-bold text-sm md:text-lg line-clamp-1 group-hover:text-indigo-500 transition-colors">
                                            {anime.title}
                                        </h3>
                                        <p className="text-xs md:text-sm text-muted line-clamp-1">
                                            {anime.genres.join(', ')}
                                        </p>
                                    </Link>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>

                {/* See More Link */}
                <div className="mt-10 text-center">
                    <Link
                        href={`/browse?sort=${activeCategory}`}
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-secondary/10 hover:bg-secondary/20 text-foreground font-bold transition-all hover:scale-105"
                    >
                        See All {activeCatInfo.label} Anime
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </Container>
        </section>
    );
}
