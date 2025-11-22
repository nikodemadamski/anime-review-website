'use client';

import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';

interface BrowseHeroProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    resultCount: number;
}

export function BrowseHero({ searchQuery, setSearchQuery, resultCount }: BrowseHeroProps) {
    return (
        <div className="relative py-12 md:py-20 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 mb-6"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-bold">Explore the Collection</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black tracking-tight mb-6"
                    >
                        Discover Your Next <br />
                        <span className="text-gradient">Favorite Anime</span>
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative max-w-2xl mx-auto group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
                        <div className="relative flex items-center glass-panel rounded-2xl p-2">
                            <Search className="w-5 h-5 text-muted ml-3" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by title, genre, or studio..."
                                className="w-full bg-transparent border-none focus:ring-0 text-foreground placeholder:text-muted/50 px-4 py-3 text-lg"
                            />
                            <div className="hidden md:block px-4 py-2 text-sm font-medium text-muted">
                                {resultCount} Results
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
