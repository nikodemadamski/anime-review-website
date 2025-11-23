'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface MobileSearchPageProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MobileSearchPage({ isOpen, onClose }: MobileSearchPageProps) {
    const [query, setQuery] = useState('');
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Load recent searches from local storage
            const saved = localStorage.getItem('recent_searches');
            if (saved) {
                setRecentSearches(JSON.parse(saved));
            }
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        // Save to recent
        const newRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
        setRecentSearches(newRecent);
        localStorage.setItem('recent_searches', JSON.stringify(newRecent));

        // Navigate (mock for now, normally router.push)
        console.log('Searching for:', query);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed inset-0 z-[100] bg-background md:hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center gap-3 p-4 border-b border-border">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <form onSubmit={handleSearch}>
                                <input
                                    autoFocus
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search anime, characters..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/10 border-none focus:ring-2 focus:ring-primary/50 text-base font-medium"
                                />
                            </form>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-primary font-semibold text-sm"
                        >
                            Cancel
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {query ? (
                            <div className="text-center py-20 text-muted-foreground">
                                <p>Press enter to search for "{query}"</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* Recent Searches */}
                                {recentSearches.length > 0 && (
                                    <section>
                                        <h3 className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider">Recent</h3>
                                        <div className="space-y-1">
                                            {recentSearches.map((term) => (
                                                <button
                                                    key={term}
                                                    onClick={() => setQuery(term)}
                                                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-secondary/10 transition-colors group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                                        <span className="font-medium">{term}</span>
                                                    </div>
                                                    <ArrowRight className="w-4 h-4 text-muted-foreground -rotate-45 group-hover:rotate-0 transition-transform" />
                                                </button>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Trending */}
                                <section>
                                    <h3 className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider">Trending Now</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['One Piece', 'Jujutsu Kaisen', 'Demon Slayer', 'Chainsaw Man'].map((anime) => (
                                            <button
                                                key={anime}
                                                onClick={() => setQuery(anime)}
                                                className="flex items-center gap-2 p-3 rounded-xl bg-secondary/5 border border-border/50 text-left"
                                            >
                                                <TrendingUp className="w-4 h-4 text-primary" />
                                                <span className="font-bold text-sm line-clamp-1">{anime}</span>
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
