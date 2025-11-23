'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Music, User, Palette, ThumbsUp, Star, ChevronDown, ChevronUp } from 'lucide-react';

// --- Lightbox Component ---
function Lightbox({ image, onClose }: { image: string; onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
                <ChevronDown className="w-6 h-6 rotate-45" />
            </button>
            <div className="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl">
                <Image
                    src={image}
                    alt="Full size preview"
                    fill
                    className="object-contain"
                />
            </div>
        </motion.div>
    );
}

// --- Synopsis Section ---
export function Synopsis({ text }: { text: string }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const shouldTruncate = text.length > 300;

    return (
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500" />
            <h3 className="text-xl font-bold mb-3">Synopsis</h3>
            <div className={`relative ${!isExpanded && shouldTruncate ? 'max-h-32 overflow-hidden' : ''}`}>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    {text}
                </p>
                {!isExpanded && shouldTruncate && (
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card to-transparent" />
                )}
            </div>
            {shouldTruncate && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-4 flex items-center gap-1 text-sm font-bold text-indigo-500 hover:text-indigo-400 transition-colors"
                >
                    {isExpanded ? (
                        <>Show Less <ChevronUp className="w-4 h-4" /></>
                    ) : (
                        <>Read More <ChevronDown className="w-4 h-4" /></>
                    )}
                </button>
            )}
        </div>
    );
}

// --- Characters Section ---
export function CharactersList({ characters }: { characters: any[] }) {
    if (!characters || characters.length === 0) return null;

    return (
        <div className="space-y-3 mt-4">
            <div className="grid grid-cols-1 gap-3">
                {characters.slice(0, 4).map((char, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/5 hover:bg-secondary/10 transition-colors">
                        <div className="w-12 h-12 rounded-full overflow-hidden relative bg-gray-800 flex-shrink-0 border border-border">
                            {char.image ? (
                                <Image
                                    src={char.image}
                                    alt={char.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center text-xs font-bold text-white/40">
                                    {char.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="font-bold text-sm truncate">{char.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{char.role}</p>
                        </div>
                    </div>
                ))}
            </div>
            {characters.length > 4 && (
                <button className="w-full py-2 text-xs font-bold text-center text-muted-foreground hover:text-foreground transition-colors border border-dashed border-border rounded-lg">
                    View All {characters.length} Characters
                </button>
            )}
        </div>
    );
}

// --- Music Section ---
export function MusicList({ music, animeTitle }: { music: any, animeTitle?: string }) {
    if (!music) return null;

    const hasOpenings = music.openings && music.openings.length > 0;
    const hasEndings = music.endings && music.endings.length > 0;

    if (!hasOpenings && !hasEndings) return null;

    const getYoutubeLink = (song: string) => {
        const query = encodeURIComponent(`${animeTitle || ''} ${song}`);
        return `https://www.youtube.com/results?search_query=${query}`;
    };

    return (
        <div className="space-y-3 mt-4">
            {hasOpenings && (
                <div className="space-y-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Openings</p>
                    {music.openings.slice(0, 2).map((op: string, i: number) => (
                        <a
                            key={`op-${i}`}
                            href={getYoutubeLink(op)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 rounded-lg bg-violet-500/5 border border-violet-500/10 hover:bg-violet-500/10 transition-colors group"
                        >
                            <Play className="w-3 h-3 text-violet-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                            <p className="text-xs font-medium truncate group-hover:text-violet-400 transition-colors">{op}</p>
                        </a>
                    ))}
                </div>
            )}
            {hasEndings && (
                <div className="space-y-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Endings</p>
                    {music.endings.slice(0, 2).map((ed: string, i: number) => (
                        <a
                            key={`ed-${i}`}
                            href={getYoutubeLink(ed)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 rounded-lg bg-pink-500/5 border border-pink-500/10 hover:bg-pink-500/10 transition-colors group"
                        >
                            <Music className="w-3 h-3 text-pink-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                            <p className="text-xs font-medium truncate group-hover:text-pink-400 transition-colors">{ed}</p>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}

// --- Gallery Section ---
export function GalleryGrid({ images }: { images: string[] }) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    if (!images || images.length === 0) return null;

    return (
        <section className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
                <Palette className="w-5 h-5 text-pink-500" />
                Gallery
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.slice(0, 8).map((img, i) => (
                    <div
                        key={i}
                        className="aspect-video rounded-xl overflow-hidden relative bg-gray-900 group cursor-pointer"
                        onClick={() => setSelectedImage(img)}
                    >
                        <Image
                            src={img}
                            alt={`Gallery image ${i + 1}`}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                            <span className="text-white text-xs font-bold">View Full</span>
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {selectedImage && (
                    <Lightbox image={selectedImage} onClose={() => setSelectedImage(null)} />
                )}
            </AnimatePresence>
        </section>
    );
}

// --- Seasons/Relations Section ---
export function SeasonsList({ seasons }: { seasons: any[] }) {
    if (!seasons || seasons.length === 0) return null;

    return (
        <div className="bg-card rounded-xl p-4 border border-border space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Related Seasons
            </h3>
            <div className="space-y-3">
                {seasons.map((season) => (
                    <Link
                        key={season.id}
                        href={`/anime/${season.id}`}
                        className="flex gap-3 group"
                    >
                        <div className="relative w-12 h-16 rounded-md overflow-hidden flex-shrink-0 bg-secondary/20">
                            <Image
                                src={season.coverImage}
                                alt={season.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform"
                            />
                        </div>
                        <div className="min-w-0 py-1">
                            <p className="text-sm font-bold line-clamp-2 group-hover:text-indigo-500 transition-colors">
                                {season.title}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">
                                {season.relationType || 'Sequel'} • {season.year}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

// --- Recommendations Section ---
export function RecommendationsList({ recommendations }: { recommendations: Array<{ id: number; title: string; coverImage: string }> }) {
    if (!recommendations || recommendations.length === 0) return null;

    return (
        <section className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
                <ThumbsUp className="w-5 h-5 text-cyan-500" />
                Fans Also Liked
            </h3>
            <div className="grid grid-cols-3 gap-4">
                {recommendations.slice(0, 6).map((rec) => (
                    <Link key={rec.id} href={`/anime/${rec.id}`} className="group space-y-2">
                        <div className="aspect-[2/3] rounded-xl bg-gray-800 overflow-hidden relative">
                            <Image
                                src={rec.coverImage}
                                alt={rec.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                        </div>
                        <p className="text-xs font-bold text-center truncate group-hover:text-cyan-400 transition-colors">
                            {rec.title}
                        </p>
                    </Link>
                ))}
            </div>
        </section>
    );
}

// --- Episode List Section ---
export function EpisodeList({ episodes }: { episodes: Array<{ number: number; title: string; airDate?: string; score?: number; filler?: boolean }> }) {
    if (!episodes || episodes.length === 0) return null;

    const [expanded, setExpanded] = React.useState(false);
    const displayEpisodes = expanded ? episodes : episodes.slice(0, 12);

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Play className="w-5 h-5 text-indigo-500" />
                    Episodes ({episodes.length})
                </h3>
                {episodes.length > 12 && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-sm font-bold text-indigo-500 hover:text-indigo-400 transition-colors"
                    >
                        {expanded ? 'Show Less' : `Show All ${episodes.length}`}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {displayEpisodes.map((ep) => (
                    <a
                        key={ep.number}
                        href={`https://www.crunchyroll.com/search?q=${encodeURIComponent(ep.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block p-4 rounded-lg border transition-all hover:scale-[1.02] ${ep.filler
                            ? 'bg-yellow-500/5 border-yellow-500/20 hover:bg-yellow-500/10'
                            : 'bg-card border-border hover:bg-card/80 hover:shadow-md'
                            }`}
                    >
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="text-xs font-bold text-indigo-500">EP {ep.number}</span>
                            {ep.score && (
                                <div className="flex items-center gap-1 text-xs">
                                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                    <span className="font-bold">{ep.score.toFixed(1)}</span>
                                </div>
                            )}
                        </div>
                        <h4 className="font-medium text-sm line-clamp-2 mb-1 group-hover:text-indigo-400 transition-colors">{ep.title}</h4>
                        {ep.airDate && (
                            <p className="text-xs text-muted-foreground">{new Date(ep.airDate).toLocaleDateString()}</p>
                        )}
                        {ep.filler && (
                            <span className="inline-block mt-2 px-2 py-0.5 text-xs font-bold bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded">
                                Filler
                            </span>
                        )}
                    </a>
                ))}
            </div>
        </section>
    );
}
