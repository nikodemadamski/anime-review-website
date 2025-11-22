'use client';

import { motion } from 'framer-motion';
import { Eye, Music, BookOpen, Users } from 'lucide-react';

interface AnimeStatsGridProps {
    ratings: {
        visual: number;
        music: number;
        story: number;
        character: number;
    };
}

const stats = [
    { id: 'visual', label: 'Visuals', icon: Eye, color: 'bg-pink-500', text: 'text-pink-400' },
    { id: 'music', label: 'Music', icon: Music, color: 'bg-violet-500', text: 'text-violet-400' },
    { id: 'story', label: 'Story', icon: BookOpen, color: 'bg-cyan-500', text: 'text-cyan-400' },
    { id: 'character', label: 'Characters', icon: Users, color: 'bg-amber-500', text: 'text-amber-400' },
];

export function AnimeStatsGrid({ ratings }: AnimeStatsGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.map((stat, index) => {
                const score = ratings[stat.id as keyof typeof ratings] || 0;
                const percentage = (score / 10) * 100;
                const Icon = stat.icon;

                return (
                    <motion.div
                        key={stat.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-panel p-5 rounded-xl flex items-center gap-4"
                    >
                        <div className={`p-3 rounded-lg ${stat.color} bg-opacity-20`}>
                            <Icon className={`w-6 h-6 ${stat.text}`} />
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-end mb-2">
                                <span className="font-bold text-sm uppercase tracking-wide opacity-80">{stat.label}</span>
                                <span className={`font-black text-xl ${stat.text}`}>{score.toFixed(1)}</span>
                            </div>

                            <div className="h-2 w-full bg-secondary/20 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${percentage}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className={`h-full ${stat.color}`}
                                />
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
