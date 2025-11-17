'use client';

import Link from 'next/link';

interface CategoryPill {
  label: 'Visual' | 'Music' | 'Story' | 'Character';
  color: string;
  icon: string;
  href: string;
}

const categories: CategoryPill[] = [
  {
    label: 'Visual',
    color: '#FF6B9D',
    icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
    href: '/browse?sort=visual',
  },
  {
    label: 'Music',
    color: '#9D4EDD',
    icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
    href: '/browse?sort=music',
  },
  {
    label: 'Story',
    color: '#06B6D4',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    href: '/browse?sort=story',
  },
  {
    label: 'Character',
    color: '#F59E0B',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    href: '/browse?sort=character',
  },
];

export function CategoryPills() {
  return (
    <div className="flex items-center justify-center gap-4 md:gap-5 flex-wrap">
      {categories.map((category) => (
        <Link
          key={category.label}
          href={category.href}
          className="group flex items-center gap-3 px-6 py-3.5 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-2xl border-2"
          style={{
            backgroundColor: 'var(--card-background)',
            borderColor: 'var(--border)',
          }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg"
            style={{ backgroundColor: category.color }}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={category.icon} />
            </svg>
          </div>
          <span
            className="font-bold text-base md:text-lg"
            style={{ color: 'var(--foreground)' }}
          >
            {category.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
