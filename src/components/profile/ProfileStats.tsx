'use client';

import React from 'react';
import { PlayCircle, Star, PenTool } from 'lucide-react';

interface ProfileStatsProps {
    stats: {
        animeWatched: number;
        totalReviews: number;
        averageScore: number;
    };
}

export function ProfileStats({ stats }: ProfileStatsProps) {
    const items = [
        {
            label: 'Anime Watched',
            value: stats.animeWatched,
            icon: PlayCircle,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            label: 'Reviews Written',
            value: stats.totalReviews,
            icon: PenTool,
            color: 'text-pink-500',
            bg: 'bg-pink-500/10'
        },
        {
            label: 'Avg Score Given',
            value: stats.averageScore.toFixed(1),
            icon: Star,
            color: 'text-yellow-500',
            bg: 'bg-yellow-500/10'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {items.map((item, i) => (
                <div key={i} className="glass-panel p-6 rounded-2xl flex items-center gap-4">
                    <div className={`p-4 rounded-xl ${item.bg}`}>
                        <item.icon className={`w-8 h-8 ${item.color}`} />
                    </div>
                    <div>
                        <p className="text-3xl font-black">{item.value}</p>
                        <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider">{item.label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
