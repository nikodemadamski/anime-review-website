'use client';

import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, Filter } from 'lucide-react';

interface MobileBrowseLayoutProps {
    children: React.ReactNode; // The list of anime
    filters: React.ReactNode; // The filter pills
}

export function MobileBrowseLayout({ children, filters }: MobileBrowseLayoutProps) {
    const { scrollY } = useScroll();

    const headerHeight = useTransform(scrollY, [0, 100], [120, 60]);
    const titleScale = useTransform(scrollY, [0, 100], [1, 0.8]);
    const titleY = useTransform(scrollY, [0, 100], [0, -10]);
    const opacity = useTransform(scrollY, [0, 50], [1, 0]);

    return (
        <div className="min-h-screen bg-background pb-24 md:hidden">
            {/* Sticky Header */}
            <motion.div
                style={{ height: headerHeight }}
                className="sticky top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-b border-white/5 px-4 flex flex-col justify-end pb-3 transition-all"
            >
                <div className="flex items-end justify-between">
                    <motion.h1
                        style={{ scale: titleScale, y: titleY, originX: 0 }}
                        className="text-3xl font-black tracking-tighter text-foreground"
                    >
                        Browse
                    </motion.h1>
                    <div className="flex gap-2">
                        <button className="p-2 rounded-full bg-secondary/10 text-foreground">
                            <Search className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Search Bar - Fades out on scroll */}
                <motion.div style={{ opacity }} className="mt-3 relative">
                    <input
                        type="text"
                        placeholder="Search anime..."
                        className="w-full bg-secondary/10 border-none rounded-xl py-2 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/50"
                    />
                </motion.div>
            </motion.div>

            {/* Filters Container */}
            <div className="sticky top-[60px] z-30 bg-background/95 backdrop-blur-xl py-3 border-b border-white/5">
                {filters}
            </div>

            {/* Content */}
            <div className="px-4 pt-4 space-y-4">
                {children}
            </div>
        </div>
    );
}
