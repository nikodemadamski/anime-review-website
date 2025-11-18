'use client';

import { Container } from '@/components/ui';
import Link from 'next/link';
import Image from 'next/image';
import { CategoryCardRow } from './CategoryCardRow';

interface CategoryExplanation {
  category: 'Visual' | 'Music' | 'Story' | 'Character';
  color: string;
  icon: string;
  description: string;
  href: string;
}

const categories: CategoryExplanation[] = [
  {
    category: 'Visual',
    color: '#FF6B9D',
    icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
    description: 'Animation quality, art style, and visual effects',
    href: '/browse?sort=visual',
  },
  {
    category: 'Music',
    color: '#9D4EDD',
    icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
    description: 'Opening/ending themes, soundtrack, and audio design',
    href: '/browse?sort=music',
  },
  {
    category: 'Story',
    color: '#06B6D4',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    description: 'Plot development, pacing, and narrative structure',
    href: '/browse?sort=story',
  },
  {
    category: 'Character',
    color: '#F59E0B',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    description: 'Character development, design, and relationships',
    href: '/browse?sort=character',
  },
];

export function HowWeRateSection() {
  return (
    <section
      className="pt-8 pb-12 md:pb-16"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <Container size="xl">
        {/* Logo at the top - closer to top and text */}
        <div className="text-center mb-4">
          <Image
            src="/logo-dark.png"
            alt="Anime Reviews Logo"
            width={240}
            height={120}
            className="mx-auto dark:hidden"
            priority
          />
          <Image
            src="/logo-light.png"
            alt="Anime Reviews Logo"
            width={240}
            height={120}
            className="mx-auto hidden dark:block"
            priority
          />
        </div>

        <div className="text-center mb-10">
          <h2
            className="text-2xl md:text-4xl font-black mb-3"
            style={{ color: 'var(--foreground)' }}
          >
            How We Rate Anime
          </h2>
          <p
            className="text-lg"
            style={{ color: 'var(--secondary)' }}
          >
            Click a category to explore anime sorted by that rating
          </p>
        </div>

        {/* Mobile: Horizontal scrollable row */}
        <div className="md:hidden">
          <CategoryCardRow categories={categories} />
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.category}
              href={cat.href}
              className="group p-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 cursor-pointer"
              style={{
                backgroundColor: 'var(--card-background)',
                borderColor: 'var(--border)',
              }}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: cat.color }}
              >
                <svg
                  className="w-7 h-7 text-white"
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
                className="text-lg font-bold text-center mb-2"
                style={{ color: cat.color }}
              >
                {cat.category}
              </h3>

              {/* Description */}
              <p
                className="text-sm text-center leading-relaxed"
                style={{ color: 'var(--secondary)' }}
              >
                {cat.description}
              </p>

              {/* Click indicator */}
              <p
                className="text-xs text-center mt-3 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: cat.color }}
              >
                Click to explore →
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
