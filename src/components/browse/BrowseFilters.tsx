'use client';

import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, X } from 'lucide-react';

interface BrowseFiltersProps {
    selectedGenres: string[];
    toggleGenre: (genre: string) => void;
    sortBy: string;
    setSortBy: (sort: any) => void;
    statusFilter: string;
    setStatusFilter: (status: any) => void;
    clearFilters: () => void;
}

const genres = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy',
    'Romance', 'Sci-Fi', 'Slice of Life', 'Horror', 'Mystery'
];

const sortOptions = [
    { value: 'site', label: 'Popularity' },
    { value: 'visual', label: 'Visuals' },
    { value: 'music', label: 'Music' },
    { value: 'story', label: 'Story' },
    { value: 'character', label: 'Characters' },
];

export function BrowseFilters({
    selectedGenres,
    toggleGenre,
    sortBy,
    setSortBy,
    statusFilter,
    setStatusFilter,
    clearFilters
}: BrowseFiltersProps) {
    const hasActiveFilters = selectedGenres.length > 0 || statusFilter !== 'all' || sortBy !== 'site';

    return (
        <div className="sticky top-20 z-30 mb-8">
            <div className="glass-panel rounded-2xl p-4 shadow-lg backdrop-blur-xl">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

                    {/* Genre Pills */}
                    <div className="flex-1 overflow-x-auto pb-2 md:pb-0 scrollbar-hide w-full -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory">
                        <div className="flex items-center gap-2 w-max">
                            <div className="flex items-center gap-2 text-sm font-bold text-muted mr-2 sticky left-0 bg-card z-10 pr-2 md:static md:bg-transparent md:pr-0">
                                <Filter className="w-4 h-4" />
                                <span>Genres:</span>
                            </div>
                            {genres.map((genre) => {
                                const isSelected = selectedGenres.includes(genre.toLowerCase());
                                return (
                                    <button
                                        key={genre}
                                        onClick={() => toggleGenre(genre.toLowerCase())}
                                        className={`snap-start px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap active:scale-95
                      ${isSelected
                                                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                                                : 'bg-secondary/10 text-secondary hover:bg-secondary/20'}`}
                                    >
                                        {genre}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sort & Status */}
                    <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 border-border pt-4 md:pt-0">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-secondary/10 border-none rounded-lg text-sm font-medium py-2 pl-3 pr-8 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                            {sortOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>Sort: {opt.label}</option>
                            ))}
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-secondary/10 border-none rounded-lg text-sm font-medium py-2 pl-3 pr-8 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                            <option value="all">Status: All</option>
                            <option value="airing">Airing</option>
                            <option value="finished">Finished</option>
                            <option value="upcoming">Upcoming</option>
                        </select>

                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                                title="Clear Filters"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
