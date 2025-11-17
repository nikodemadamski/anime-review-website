'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Container, Badge } from '@/components/ui';
import { fetchAnimeById } from '@/app/actions/anime';
import Image from 'next/image';
import Link from 'next/link';

export default function MALAnimePage() {
  const params = useParams();
  const malId = params.malId as string;
  const [anime, setAnime] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadAnime() {
      try {
        const result = await fetchAnimeById(malId);
        if (result.success && result.data) {
          setAnime(result.data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadAnime();
  }, [malId]);

  if (loading) {
    return (
      <div className="min-h-screen py-12" style={{ backgroundColor: 'var(--background)' }}>
        <Container>
          <div className="animate-pulse">
            <div className="h-96 bg-gray-300 rounded-3xl mb-8" />
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-300 rounded w-full mb-2" />
            <div className="h-4 bg-gray-300 rounded w-5/6" />
          </div>
        </Container>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <Container>
          <div className="text-center">
            <div className="text-8xl mb-4">😅</div>
            <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
              Anime Not Found
            </h1>
            <Link href="/" className="px-6 py-3 rounded-xl font-bold" style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}>
              Go Home
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <Image
          src={anime.image}
          alt={anime.title}
          fill
          className="object-cover opacity-30 blur-sm"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <Container>
          <div className="relative h-96 flex items-end pb-12">
            <div className="flex gap-6 items-end">
              <div className="relative w-48 h-72 rounded-xl overflow-hidden shadow-2xl flex-shrink-0">
                <Image
                  src={anime.image}
                  alt={anime.title}
                  fill
                  className="object-cover"
                  sizes="192px"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-black mb-3 text-white drop-shadow-lg">
                  {anime.title}
                </h1>
                {anime.englishTitle && anime.englishTitle !== anime.title && (
                  <p className="text-xl text-white/80 mb-4">{anime.englishTitle}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default" size="md">⭐ {anime.score.toFixed(1)}</Badge>
                  <Badge variant="info" size="md">#{anime.rank}</Badge>
                  {anime.episodes > 0 && <Badge variant="default" size="md">{anime.episodes} Episodes</Badge>}
                  <Badge variant="info" size="md">{anime.status}</Badge>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Content */}
      <Container>
        <div className="py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Synopsis */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--card-background)' }}>
              <h2 className="text-2xl font-black mb-4" style={{ color: 'var(--foreground)' }}>
                Synopsis
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: 'var(--secondary)' }}>
                {anime.synopsis}
              </p>
            </div>

            {/* Genres & Themes */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--card-background)' }}>
              <h3 className="text-xl font-black mb-4" style={{ color: 'var(--foreground)' }}>
                Genres & Themes
              </h3>
              <div className="flex flex-wrap gap-2">
                {anime.genres.map((genre: string) => (
                  <Badge key={genre} variant="default">{genre}</Badge>
                ))}
                {anime.themes.map((theme: string) => (
                  <Badge key={theme} variant="info">{theme}</Badge>
                ))}
              </div>
            </div>

            {/* Quiz CTA */}
            <div className="rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg, #FF6B9D20 0%, #9D4EDD20 100%)', borderWidth: '2px', borderColor: '#FF6B9D' }}>
              <div className="text-5xl mb-4">🎭</div>
              <h3 className="text-2xl font-black mb-3" style={{ color: 'var(--foreground)' }}>
                Which Character Are You?
              </h3>
              <p className="mb-6" style={{ color: 'var(--secondary)' }}>
                Take our personality quiz and discover your anime character match!
              </p>
              <Link
                href="/quiz"
                className="inline-block px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
                style={{ backgroundColor: '#FF6B9D', color: '#FFFFFF' }}
              >
                Take Quiz Now
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info Card */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--card-background)' }}>
              <h3 className="text-xl font-black mb-4" style={{ color: 'var(--foreground)' }}>
                Information
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold" style={{ color: 'var(--muted)' }}>Score</p>
                  <p className="font-bold text-lg" style={{ color: 'var(--foreground)' }}>⭐ {anime.score.toFixed(2)}</p>
                </div>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--muted)' }}>Ranked</p>
                  <p className="font-bold" style={{ color: 'var(--foreground)' }}>#{anime.rank}</p>
                </div>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--muted)' }}>Popularity</p>
                  <p className="font-bold" style={{ color: 'var(--foreground)' }}>#{anime.popularity}</p>
                </div>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--muted)' }}>Members</p>
                  <p className="font-bold" style={{ color: 'var(--foreground)' }}>{anime.members.toLocaleString()}</p>
                </div>
                {anime.studios.length > 0 && (
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--muted)' }}>Studio</p>
                    <p className="font-bold" style={{ color: 'var(--foreground)' }}>{anime.studios.join(', ')}</p>
                  </div>
                )}
                <div>
                  <p className="font-semibold" style={{ color: 'var(--muted)' }}>Aired</p>
                  <p className="font-bold" style={{ color: 'var(--foreground)' }}>{anime.aired}</p>
                </div>
              </div>
            </div>

            {/* Watch Now CTA */}
            <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: 'var(--card-background)' }}>
              <h3 className="text-lg font-black mb-3" style={{ color: 'var(--foreground)' }}>
                Where to Watch
              </h3>
              <a
                href={`https://myanimelist.net/anime/${malId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 mb-2"
                style={{ backgroundColor: 'var(--btn-primary)', color: 'var(--btn-primary-text)' }}
              >
                View on MyAnimeList →
              </a>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                Find streaming options and more info
              </p>
            </div>

            {/* Add to Watchlist */}
            <button
              className="w-full px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 border-2"
              style={{ borderColor: 'var(--accent)', color: 'var(--accent)', backgroundColor: 'transparent' }}
            >
              ❤️ Add to Watchlist
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
}
