'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CategoryBadges } from './CategoryBadges';
import type { Anime } from '@/types';

interface SimilarAnimeProps {
  currentAnime: Anime;
}

export function SimilarAnime({ currentAnime }: SimilarAnimeProps) {
  const [similarAnime, setSimilarAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSimilar() {
      try {
        // Fetch all anime and find similar ones
        const response = await fetch('/api/anime');
        const data = await response.json();
        
        if (data.success && data.data) {
          // Find similar anime based on genres and ratings
          const similar = data.data
            .filter((anime: Anime) => anime.id !== currentAnime.id)
            .map((anime: Anime) => {
              // Calculate similarity score
              let score = 0;
              
              // Genre similarity (most important)
              const sharedGenres = anime.genres?.filter(g => 
                currentAnime.genres?.includes(g)
              ).length || 0;
              score += sharedGenres * 3;
              
              // Rating similarity
              const ratingDiff = Math.abs(anime.ratings.site - currentAnime.ratings.site);
              score += (10 - ratingDiff) / 2;
              
              return { anime, score };
            })
            .sort((a: { anime: Anime; score: number }, b: { anime: Anime; score: number }) => b.score - a.score)
            .slice(0, 6)
            .map((item: { anime: Anime; score: number }) => item.anime);
          
          setSimilarAnime(similar);
        }
      } catch (error) {
        console.error('Error fetching similar anime:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSimilar();
  }, [currentAnime]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-gray-300 rounded mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-gray-300 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (similarAnime.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-2xl font-black mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
        <span>🎯</span>
        <span>If You Liked This, Try...</span>
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {similarAnime.map((anime) => (
          <Link
            key={anime.id}
            href={`/anime/${anime.id}`}
            className="group relative rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{ backgroundColor: 'var(--card-background)' }}
          >
            <div className="aspect-[3/4] relative">
              <Image
                src={anime.coverImage}
                alt={anime.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Rating badge */}
              <div
                className="absolute top-2 right-2 px-2 py-1 rounded-lg shadow-lg"
                style={{ backgroundColor: 'var(--rating-overall)' }}
              >
                <span className="text-xs font-bold text-white">
                  {anime.ratings.site.toFixed(1)}
                </span>
              </div>
              
              {/* Category badges */}
              <div className="absolute bottom-2 left-2">
                <CategoryBadges ratings={anime.ratings} size="mini" />
              </div>
              
              {/* Title on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h4 className="text-white font-semibold text-sm line-clamp-2">
                  {anime.title}
                </h4>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
