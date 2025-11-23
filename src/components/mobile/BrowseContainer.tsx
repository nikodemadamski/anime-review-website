'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, List, Search } from 'lucide-react';
import { MobileBrowseLayout } from './MobileBrowseLayout';
import { DiscoverView } from './DiscoverView';
import { CatalogView } from './CatalogView';

export function BrowseContainer() {
    const [viewMode, setViewMode] = useState<'discover' | 'catalog'>('discover');

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header with Segmented Control */}
            <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5 pt-12 pb-2 px-4">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-black tracking-tighter">Browse</h1>
                    <button className="p-2 rounded-full bg-secondary/10">
                        <Search className="w-5 h-5" />
                    </button>
                </div>

                {/* iOS Segmented Control */}
                <div className="bg-secondary/10 p-1 rounded-xl flex relative">
                    <motion.div
                        className="absolute top-1 bottom-1 bg-background rounded-lg shadow-sm"
                        initial={false}
                        animate={{
                            left: viewMode === 'discover' ? '4px' : '50%',
                            width: 'calc(50% - 4px)',
                            x: viewMode === 'catalog' ? '0%' : '0%'
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                    <button
                        onClick={() => setViewMode('discover')}
                        className={`flex-1 relative z-10 py-1.5 text-sm font-bold transition-colors ${viewMode === 'discover' ? 'text-foreground' : 'text-muted-foreground'}`}
                    >
                        Discover
                    </button>
                    <button
                        onClick={() => setViewMode('catalog')}
                        className={`flex-1 relative z-10 py-1.5 text-sm font-bold transition-colors ${viewMode === 'catalog' ? 'text-foreground' : 'text-muted-foreground'}`}
                    >
                        Catalog
                    </button>
                </div>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={viewMode}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {viewMode === 'discover' ? <DiscoverView /> : <CatalogView />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
