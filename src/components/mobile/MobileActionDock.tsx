'use client';

import React from 'react';
import { Play, Heart, Share2 } from 'lucide-react';

interface MobileActionDockProps {
    title: string;
}

export function MobileActionDock({ title }: MobileActionDockProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 bg-background/80 backdrop-blur-xl border-t border-white/10 md:hidden z-50">
            <div className="flex items-center gap-3">
                <button className="flex-1 bg-white text-black font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-white/10">
                    <Play className="w-5 h-5 fill-current" />
                    Watch Now
                </button>

                <button className="p-3.5 rounded-2xl bg-secondary/20 text-white backdrop-blur-md border border-white/10 active:scale-90 transition-transform">
                    <Heart className="w-6 h-6" />
                </button>

                <button className="p-3.5 rounded-2xl bg-secondary/20 text-white backdrop-blur-md border border-white/10 active:scale-90 transition-transform">
                    <Share2 className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
