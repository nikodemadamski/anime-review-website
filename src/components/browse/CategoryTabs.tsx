'use client';

import { motion } from 'framer-motion';
import { Eye, Music, BookOpen, Users, Layers } from 'lucide-react';

export type CategoryType = 'overall' | 'visual' | 'music' | 'story' | 'character';

interface CategoryTabsProps {
    activeCategory: CategoryType;
    setActiveCategory: (category: CategoryType) => void;
}

const categories = [
    { id: 'overall', label: 'Overall', icon: Layers, color: 'bg-indigo-500', text: 'text-indigo-500' },
    { id: 'visual', label: 'Visuals', icon: Eye, color: 'bg-pink-500', text: 'text-pink-500' },
    { id: 'music', label: 'Music', icon: Music, color: 'bg-violet-500', text: 'text-violet-500' },
    { id: 'story', label: 'Story', icon: BookOpen, color: 'bg-cyan-500', text: 'text-cyan-500' },
    { id: 'character', label: 'Characters', icon: Users, color: 'bg-amber-500', text: 'text-amber-500' },
];

export function CategoryTabs({ activeCategory, setActiveCategory }: CategoryTabsProps) {
    return (
        <div className="flex flex-wrap justify-center gap-4 mb-10">
            {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                const Icon = cat.icon;

                return (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id as CategoryType)}
                        className={`relative px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition-all duration-300 ${isActive
                                ? 'text-white shadow-lg scale-105'
                                : 'bg-secondary/10 text-muted hover:bg-secondary/20 hover:scale-105'
                            }`}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeTab"
                                className={`absolute inset-0 rounded-2xl ${cat.color}`}
                                initial={false}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : cat.text}`} />
                            {cat.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
