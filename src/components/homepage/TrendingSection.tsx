'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SkeletonGrid } from '@/components/loading/SkeletonGrid';
import { Container } from '@/components/ui';
import { getTrendingAnimeLink } from '@/lib/match-trending-anime';
import { TrendingUp, Star, Users } from 'lucide-react';

interface TrendingAnime {
  id: string;
  title: string;
  coverImage: string;
  ratings: {
    site: number;
  };
  members?: number;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function TrendingSection() {
  const [trending, setTrending] = useState<TrendingAnime[]>([]);
  const [loading, setLoading] = useState(true);
  const [allAnime, setAllAnime] = useState<any[]>([]);

  useEffect(() => {
    async function loadTrending() {
      try {
        const trendingResponse = await fetch('/api/trending');
        if (trendingResponse.ok) {
          const trendingResult = await trendingResponse.json();
          const trendingData = trendingResult.data || trendingResult;

          const animeResponse = await fetch('/api/anime');
          if (animeResponse.ok) {
            const animeResult = await animeResponse.json();
            const animeData = animeResult.data || animeResult;
            setAllAnime(Array.isArray(animeData) ? animeData : []);
          }

          const topAnime = (Array.isArray(trendingData) ? trendingData : [])
            .filter((anime: any) => anime.ratings?.site > 0)
            .sort((a: any, b: any) => b.ratings.site - a.ratings.site)
            .slice(0, 6);

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
      <section className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-black mb-8 text-center flex items-center justify-center gap-2">
            <TrendingUp className="w-8 h-8 text-pink-500" />
            Trending This Season
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
    <section className="py-16 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-cyan-500/5 blur-3xl -z-10" />

      <Container size="xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-500">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-black tracking-tight">
              Trending This Season
            </h2>
          </div>
          <Link
            href="/browse"
            className="text-sm font-bold text-muted hover:text-foreground transition-colors flex items-center gap-1"
          >
            View All <span className="text-lg">→</span>
          </Link>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 md:grid md:grid-cols-3 lg:grid-cols-6 md:gap-6 md:pb-0 md:mx-0 md:px-0 scrollbar-hide"
        >
          {trending.map((anime, index) => {
            const animeLink = getTrendingAnimeLink(anime, allAnime);

            return (
              <motion.div key={anime.id} variants={item} className="flex-none w-[140px] md:w-auto snap-center">
                <Link
                  href={animeLink}
                  className="group relative block h-full"
                >
                  <div className="relative rounded-2xl overflow-hidden aspect-[2/3] mb-2 md:mb-3 glass-panel transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-pink-500/20">
                    {/* Rank Badge */}
                    <div
                      className={`absolute top-1 left-1 md:top-2 md:left-2 z-10 w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center font-black text-sm md:text-lg shadow-lg backdrop-blur-md
                        ${index === 0 ? 'bg-yellow-400/90 text-black' :
                          index === 1 ? 'bg-slate-300/90 text-black' :
                            index === 2 ? 'bg-amber-600/90 text-white' :
                              'bg-black/50 text-white border border-white/20'}`}
                    >
                      {index + 1}
                    </div>

                    <Image
                      src={anime.coverImage}
                      alt={anime.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 140px, (max-width: 1024px) 33vw, 16vw"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <button className="w-full py-2 bg-white text-black font-bold rounded-lg text-xs transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        View Details
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="px-1">
                    <h3 className="font-bold text-sm md:text-lg line-clamp-1 mb-1 group-hover:text-pink-500 transition-colors">
                      {anime.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs md:text-sm text-muted">
                      <div className="flex items-center gap-1 text-yellow-500 font-bold">
                        <Star className="w-3 h-3 fill-current" />
                        {anime.ratings.site.toFixed(1)}
                      </div>
                      {anime.members && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {(anime.members / 1000).toFixed(0)}k
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
