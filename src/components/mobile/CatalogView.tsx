'use client';

import React, { useState, useEffect } from 'react';
import { LongCard } from './LongCard';
import { Filter, Grid, List as ListIcon } from 'lucide-react';
import { MobileSheet } from './MobileSheet';
import { BrowseFilters } from '@/components/browse/BrowseFilters';

export function CatalogView() {
    const [animeList, setAnimeList] = useState<any[]>([]);
    const [isGridView, setIsGridView] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Mock data loading for now - reuse existing logic later
    useEffect(() => {
        fetch('/api/anime').then(res => res.json()).then(data => setAnimeList(data.data || data));
    }, []);

    return (
        <div className="pt-4 px-4">
            {/* Tools Bar */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-muted-foreground">{animeList.length} Results</span>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsGridView(!isGridView)}
                        className="p-2 rounded-full bg-secondary/10 hover:bg-secondary/20 transition-colors"
                    >
                        {isGridView ? <ListIcon className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
                    </button>
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground font-bold text-sm"
                    >
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                </div>
            </div>

            {/* Grid/List View */}
            <div className={isGridView ? "grid grid-cols-3 gap-3" : "space-y-4"}>
                {animeList.map((anime, i) => (
                    isGridView ? (
                        <div key={anime.id} className="aspect-[2/3] rounded-xl bg-secondary/10 relative overflow-hidden">
                            <img src={anime.coverImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur px-1.5 rounded text-[10px] font-bold text-white">
                                {anime.malScore?.toFixed(1)}
                            </div>
                        </div>
                    ) : (
                        <LongCard
                            key={anime.id}
                            {...anime}
                            image={anime.coverImage}
                            score={anime.malScore || anime.ratings?.site}
                            rank={i + 1}
                        />
                    )
                ))}
            </div>

            {/* Filter Sheet */}
            <MobileSheet isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} title="Filters">
                <div className="p-4 pb-20">
                    {/* Reuse BrowseFilters logic here later */}
                    <p className="text-center text-muted-foreground">Filter options coming soon...</p>
                </div>
            </MobileSheet>
        </div>
    );
}
