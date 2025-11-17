'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchCurrentSeason } from '@/app/actions/anime';
import { SkeletonGrid } from '@/components/loading/SkeletonGrid';

interface TrendingAnime {
  id: string;
  title: string;
  image: string;
  score: number;
  members: number;
}

export function TrendingSection() {
  const [trending, setTrending] = useState<TrendingAnime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrending() {
      try {
        const result = await fetchCurrentSeason();
        if (result.success && result.data) {
          // Get top 6 by score
          const topAnime = result.data
            .filter(anime => anime.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 6)
            .map(anime => ({
              id: anime.id,
              title: anime.title,
              image: anime.image,
              score: anime.score,
              members: anime.members,
            }));
          setTrending(topAnime);
        }
      } catch (error) {
        console.error('Error loading trending anime:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTrending();
  }, []);

  if (loading) {
    return (
      <section className="py-16" style={{ backgroundColor: 'var(--background)' }}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-black mb-8 text-center" style={{ color: 'var(--foreground)' }}>
            🔥 Trending This Season
          </h2>
          <SkeletonGrid count={6} columns={6} />
        </div>
      </section>
    );
  }

  if (trending.length === 0) {
    return null;
  }

  return (
    <section className="py-16" style={{ backgroundColor: 'var(--background)' }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black" style={{ color: 'var(--foreground)' }}>
            🔥 Trending This Season
          </h2>
          <Link
            href="/browse"
            className="text-sm font-semibold hover:underline"
            style={{ color: 'var(--accent)' }}
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {trending.map((anime, index) => (
            <Link
              key={anime.id}
              href={`/anime/mal/${anime.id}`}
              className="group relative rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{ backgroundColor: 'var(--card-background)' }}
            >
              {/* Rank Badge */}
              <div
                className="absolute top-2 left-2 z-10 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-lg"
                style={{
                  backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : 'var(--accent)',
                  color: '#FFFFFF',
                }}
              >
                {index + 1}
              </div>

              {/* Image */}
              <div className="relative aspect-[2/3] overflow-hidden">
                <Image
                  src={anime.image}
                  alt={anime.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Info */}
              <div className="p-3">
                <h3
                  className="font-bold text-sm line-clamp-2 mb-1 group-hover:text-accent transition-colors"
                  style={{ color: 'var(--foreground)' }}
                >
                  {anime.title}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>
                      {anime.score.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>
                    •
                  </span>
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>
                    {(anime.members / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Social Proof */}
        <div className="mt-8 text-center">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            <span className="font-bold" style={{ color: 'var(--accent)' }}>
              {trending.reduce((sum, anime) => sum + anime.members, 0).toLocaleString()}+
            </span>{' '}
            people are watching these shows this season
          </p>
        </div>
      </div>
    </section>
  );
}
