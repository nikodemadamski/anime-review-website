'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, Calendar, Clock, PlayCircle } from 'lucide-react';

interface AnimeDetailsHeroProps {
    anime: any;
}

export function AnimeDetailsHero({ anime }: AnimeDetailsHeroProps) {
    return (
        <div className="relative min-h-[60vh] flex items-end pb-20 overflow-hidden">
            {/* Background Image with Blur */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={anime.coverImage}
                    alt={anime.title}
                    fill
                    className="object-cover blur-xl opacity-50 scale-110"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row gap-8 items-end">
                    {/* Cover Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-64 aspect-[2/3] relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20 flex-shrink-0 mx-auto md:mx-0"
                    >
                        <Image
                            src={anime.coverImage}
                            alt={anime.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mb-4"
                        >
                            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                                {anime.genres.map((genre: string) => (
                                    <span key={genre} className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold border border-white/10">
                                        {genre}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2 text-white drop-shadow-lg">
                                {anime.title}
                            </h1>
                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-muted-foreground text-sm md:text-base">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{anime.season} {anime.year}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{anime.episodes} Episodes</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <PlayCircle className="w-4 h-4" />
                                    <span className="capitalize">{anime.status}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Haki Power Level */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-4 p-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 mt-4"
                        >
                            <div className="text-left">
                                <p className="text-xs text-white/60 font-bold uppercase tracking-wider">Haki Level</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-yellow-400">{anime.ratings.site.toFixed(1)}</span>
                                    <span className="text-sm text-white/40">/ 10</span>
                                </div>
                            </div>
                            <div className="h-10 w-px bg-white/10" />
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < Math.round(anime.ratings.site / 2) ? 'text-yellow-400 fill-current' : 'text-white/20'}`}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
