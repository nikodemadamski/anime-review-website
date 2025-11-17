'use client';

import { useCategoryFilter, type CategoryType } from '@/hooks/useCategoryFilter';

const categories = [
  { key: 'visual' as const, label: 'Visual', color: '#FF6B9D', icon: '👁️' },
  { key: 'music' as const, label: 'Music', color: '#9D4EDD', icon: '🎵' },
  { key: 'story' as const, label: 'Story', color: '#06B6D4', icon: '📖' },
  { key: 'character' as const, label: 'Character', color: '#F59E0B', icon: '👥' },
];

export function CategoryFilterPills() {
  const { activeCategory, setCategory, clearFilter } = useCategoryFilter();

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Pills */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.key;
          
          return (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className="group px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 hover:scale-110 shadow-lg flex items-center gap-2"
              style={{
                backgroundColor: isActive ? cat.color : 'var(--card-background)',
                color: isActive ? '#FFFFFF' : 'var(--foreground)',
                borderWidth: '2px',
                borderColor: isActive ? cat.color : 'var(--border)',
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <span className="text-lg">{cat.icon}</span>
              <span>{cat.label}</span>
              {isActive && (
                <span className="ml-1 animate-pulse">✓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Clear Filter Button */}
      {activeCategory && (
        <button
          onClick={clearFilter}
          className="text-sm font-semibold transition-all hover:scale-105 flex items-center gap-1 animate-fade-in"
          style={{ color: 'var(--accent)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>Clear Filter</span>
        </button>
      )}
    </div>
  );
}
