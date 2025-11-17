'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui';

interface Anime {
  id: string;
  title: string;
  coverImage: string;
  ratings: {
    site: number;
    visual: number;
    music: number;
    story: number;
    character: number;
  };
  genres?: string[];
  episodes?: number;
  status?: string;
  description?: string;
}

interface FeaturedAnimeCardProps {
  anime: Anime;
  rank: number;
}

const categoryColors = {
  visual: '#FF6B9D',
  music: '#9D4EDD',
  story: '#06B6D4',
  character: '#F59E0B',
};

export function FeaturedAnimeCard({ anime, rank }: FeaturedAnimeCardProps) {
  const rankBadgeStyle = {
    1: { bg: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', label: '🏆 #1 Top Pick' },
    2: { bg: 'linear-gradient(135deg, #C0C0C0 0%, #808080 100%)', label: '🥈 #2' },
    3: { bg: 'linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)', label: '🥉 #3' },
  }[rank] || { bg: 'var(--btn-primary)', label: `#${rank}` };

  return (
    <Link href={`/anime/${anime.id}`} className="group block">
      <div
        className="relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl border-2"
        style={{
          backgroundColor: 'var(--card-background)',
          borderColor: 'var(--border)',
        }}
      >
        {/* Desktop Layout: Horizontal */}
        <div className="hidden md:flex">
          {/* Image Section */}
          <div className="relative w-2/5 aspect-[3/4] overflow-hidden">
            <Image
              src={anime.coverImage}
              alt={anime.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="40vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            {/* Rank Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-black text-sm shadow-lg mb-4 self-start"
              style={{ background: rankBadgeStyle.bg }}
            >
              {rankBadgeStyle.label}
            </div>

            {/* Title */}
            <h3
              className="text-2xl font-black mb-3 line-clamp-2"
              style={{ color: 'var(--foreground)' }}
            >
              {anime.title}
            </h3>

            {/* Description */}
            {anime.description && (
              <p
                className="text-sm mb-4 line-clamp-3"
                style={{ color: 'var(--secondary)' }}
              >
                {anime.description.substring(0, 150)}
                {anime.description.length > 150 ? '...' : ''}
              </p>
            )}

            {/* Category Ratings */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                { key: 'visual', label: 'Visual', color: categoryColors.visual },
                { key: 'music', label: 'Music', color: categoryColors.music },
                { key: 'story', label: 'Story', color: categoryColors.story },
                { key: 'character', label: 'Char', color: categoryColors.character },
              ].map(({ key, label, color }) => (
                <div
                  key={key}
                  className="text-center p-2 rounded-lg"
                  style={{ backgroundColor: 'var(--text-block)' }}
                >
                  <div className="text-lg font-black" style={{ color }}>
                    {anime.ratings[key as keyof typeof anime.ratings].toFixed(1)}
                  </div>
                  <div className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Genres and Metadata */}
            <div className="flex flex-wrap gap-2 mb-4">
              {anime.genres?.slice(0, 3).map((genre) => (
                <Badge key={genre} variant="default" size="sm">
                  {genre}
                </Badge>
              ))}
              {anime.episodes && (
                <Badge variant="info" size="sm">
                  {anime.episodes} eps
                </Badge>
              )}
              {anime.status && (
                <Badge variant="info" size="sm">
                  {anime.status}
                </Badge>
              )}
            </div>

            {/* View Details Button */}
            <button
              className="w-full py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-md"
              style={{
                backgroundColor: 'var(--btn-primary)',
                color: 'var(--btn-primary-text)',
              }}
            >
              View Details →
            </button>
          </div>
        </div>

        {/* Mobile Layout: Enhanced with 2 ratings */}
        <div className="md:hidden">
          <div className="aspect-[3/4] relative overflow-hidden">
            <Image
              src={anime.coverImage}
              alt={anime.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Rank Badge */}
            <div
              className="absolute top-2 left-2 px-3 py-1.5 rounded-full text-white font-black text-xs shadow-lg"
              style={{ background: rankBadgeStyle.bg }}
            >
              {rankBadgeStyle.label}
            </div>

            {/* Rating Badge */}
            <div
              className="absolute top-2 right-2 px-3 py-1.5 rounded-lg shadow-lg"
              style={{ backgroundColor: 'var(--rating-overall)' }}
            >
              <span className="text-sm font-bold text-white">
                {anime.ratings.site.toFixed(1)}
              </span>
            </div>

            {/* Title and Mini Ratings */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
              <h3 className="text-white font-bold text-sm line-clamp-2 drop-shadow-lg mb-2">
                {anime.title}
              </h3>
              {/* Show 2 top ratings on mobile */}
              <div className="flex gap-2">
                {[
                  { key: 'visual', label: 'Visual', color: categoryColors.visual },
                  { key: 'story', label: 'Story', color: categoryColors.story },
                ].map(({ key, label, color }) => (
                  <div
                    key={key}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                  >
                    <span className="font-bold text-white">
                      {anime.ratings[key as keyof typeof anime.ratings].toFixed(1)}
                    </span>
                    <span className="text-white/80">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
