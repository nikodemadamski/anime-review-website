'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Music, User, Palette, ThumbsUp, Star } from 'lucide-react';

// --- Characters Section ---
export function CharactersList({ characters }: { characters: any[] }) {
    if (!characters || characters.length === 0) return null;

    return (
        <section className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
                <User className="w-5 h-5 text-amber-500" />
                Characters & Voice Actors
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {characters.map((char, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl glass-panel hover:bg-white/5 transition-colors">
                        <div className="w-12 h-12 rounded-full overflow-hidden relative bg-gray-800">
                            {/* Placeholder for Character Image */}
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20" />
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white/40">
                                {char.name.charAt(0)}
                            </div>
                        </div>
                        <div>
                            <p className="font-bold text-sm">{char.name}</p>
                            <p className="text-xs text-muted-foreground">{char.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

// --- Music Section ---
export function MusicList({ music }: { music: any }) {
    if (!music) return null;

    return (
        <section className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
                <Music className="w-5 h-5 text-violet-500" />
                Soundtrack
            </h3>
            <div className="space-y-3">
                {music.openings?.map((op: string, i: number) => (
                    <div key={`op-${i}`} className="flex items-center gap-3 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                        <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center flex-shrink-0">
                            <Play className="w-3 h-3 text-white fill-current ml-0.5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{op}</p>
                            <p className="text-xs text-violet-400 font-bold">Opening {i + 1}</p>
                        </div>
                    </div>
                ))}
                {music.endings?.map((ed: string, i: number) => (
                    <div key={`ed-${i}`} className="flex items-center gap-3 p-3 rounded-xl bg-pink-500/10 border border-pink-500/20">
                        <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0">
                            <Music className="w-3 h-3 text-white" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{ed}</p>
                            <p className="text-xs text-pink-400 font-bold">Ending {i + 1}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

// --- Gallery Section ---
export function GalleryGrid({ images }: { images: string[] }) {
    if (!images || images.length === 0) return null;

    return (
        <section className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
                <Palette className="w-5 h-5 text-pink-500" />
                Gallery
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.slice(0, 8).map((img, i) => (
                    <div key={i} className="aspect-video rounded-xl overflow-hidden relative bg-gray-900 group cursor-pointer">
                        <Image
                            src={img}
                            alt={`Gallery image ${i + 1}`}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                            <span className="text-white text-xs font-bold">View</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
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
                    <div
                        key={ep.number}
                        className={`p-4 rounded-lg border transition-colors ${ep.filler
                            ? 'bg-yellow-500/5 border-yellow-500/20 hover:bg-yellow-500/10'
                            : 'bg-card border-border hover:bg-card/80'
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
                        <h4 className="font-medium text-sm line-clamp-2 mb-1">{ep.title}</h4>
                        {ep.airDate && (
                            <p className="text-xs text-muted-foreground">{new Date(ep.airDate).toLocaleDateString()}</p>
                        )}
                        {ep.filler && (
                            <span className="inline-block mt-2 px-2 py-0.5 text-xs font-bold bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded">
                                Filler
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
