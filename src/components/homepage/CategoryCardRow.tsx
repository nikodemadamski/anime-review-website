'use client';

import Link from 'next/link';

interface CategoryExplanation {
  category: 'Visual' | 'Music' | 'Story' | 'Character';
  color: string;
  icon: string;
  href: string;
}

interface CategoryCardRowProps {
  categories: CategoryExplanation[];
}

export function CategoryCardRow({ categories }: CategoryCardRowProps) {
  return (
    <div className="overflow-x-auto px-4 -mx-4">
      <div 
        className="flex gap-4 snap-x snap-mandatory"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {categories.map((cat) => (
          <Link
            key={cat.category}
            href={cat.href}
            className="flex-shrink-0 snap-start w-[120px] h-[140px] rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:scale-105 border-2"
            style={{
              backgroundColor: 'var(--card-background)',
              borderColor: 'var(--border)',
            }}
          >
            {/* Icon */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: cat.color }}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={cat.icon}
                />
              </svg>
            </div>

            {/* Category Name */}
            <h3
              className="text-sm font-bold text-center px-2"
              style={{ color: cat.color }}
            >
              {cat.category}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
