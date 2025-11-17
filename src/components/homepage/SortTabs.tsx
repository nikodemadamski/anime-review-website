'use client';

import { useState } from 'react';

export type SortType = 'overall' | 'visual' | 'music' | 'story' | 'character';

interface SortTabsProps {
  activeSort: SortType;
  onSortChange: (sort: SortType) => void;
}

const tabs = [
  { key: 'overall' as const, label: 'Overall', icon: '⭐' },
  { key: 'visual' as const, label: 'Visual', icon: '👁️', color: '#FF6B9D' },
  { key: 'music' as const, label: 'Music', icon: '🎵', color: '#9D4EDD' },
  { key: 'story' as const, label: 'Story', icon: '📖', color: '#06B6D4' },
  { key: 'character' as const, label: 'Character', icon: '👥', color: '#F59E0B' },
];

export function SortTabs({ activeSort, onSortChange }: SortTabsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {tabs.map((tab) => {
        const isActive = activeSort === tab.key;
        
        return (
          <button
            key={tab.key}
            onClick={() => onSortChange(tab.key)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105 whitespace-nowrap"
            style={{
              backgroundColor: isActive ? (tab.color || 'var(--accent)') : 'var(--card-background)',
              color: isActive ? '#FFFFFF' : 'var(--foreground)',
              borderWidth: '2px',
              borderColor: isActive ? (tab.color || 'var(--accent)') : 'var(--border)',
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
