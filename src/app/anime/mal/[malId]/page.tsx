import { Container, Badge } from '@/components/ui';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface MALAnimeData {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
  score: number;
  synopsis: string;
  year: number;
  genres: Array<{ name: string }>;
  status: string;
  episodes: number;
  studios: Array<{ name: string }>;
  url: string;
}

async function fetchMALAnime(malId: string): Promise<MALAnimeData | null> {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime/${malId}`, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching MAL anime:', error);
    return null;
  }
}

export default async function MALAnimePage({
  params,
}: {
  params: Promise<{ malId: string }>;
}) {
  const { malId } = await params;
  const anime = await fetchMALAnime(malId);

  if (!anime) {
    notFound();
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <Container size="xl" className="py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 mb-6 transition-colors hover:opacity-70"
            style={{ color: 'var(--accent)' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-semibold">Back to Browse</span>
          </Link>

          {/* Main Content */}
          <div className="grid md:grid-cols-[300px_1fr] gap-8">
            {/* Cover Image */}
            <div>
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={anime.images.jpg.large_image_url}
                  alt={anime.title}
                  fill
                  className="object-cover"
                  sizes="300px"
                  priority
                />
              </div>

              {/* MAL Link */}
              <a
                href={anime.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full px-4 py-3 rounded-xl font-bold text-center transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'var(--btn-primary)',
                  color: 'var(--btn-primary-text)',
                }}
              >
                <span>View on MyAnimeList</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* Details */}
            <div>
              {/* Title */}
              <h1 className="text-4xl font-black mb-4" style={{ color: 'var(--foreground)' }}>
                {anime.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Badge variant="site" size="md">
                  ⭐ {anime.score.toFixed(1)}
                </Badge>
                <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: 'var(--tag-bg)', color: 'var(--foreground)' }}>
                  {anime.year}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: 'var(--tag-bg)', color: 'var(--foreground)' }}>
                  {anime.episodes} Episodes
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: 'var(--tag-bg)', color: 'var(--foreground)' }}>
                  {anime.status}
                </span>
              </div>

              {/* Synopsis */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>
                  Synopsis
                </h2>
                <p className="text-base leading-relaxed" style={{ color: 'var(--secondary)' }}>
                  {anime.synopsis}
                </p>
              </div>

              {/* Genres */}
              {anime.genres.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>
                    Genres
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {anime.genres.map((genre) => (
                      <span
                        key={genre.name}
                        className="px-3 py-1 rounded-full text-sm font-semibold"
                        style={{ backgroundColor: 'var(--accent)', color: '#FFFFFF' }}
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Studios */}
              {anime.studios.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>
                    Studios
                  </h2>
                  <p className="text-base" style={{ color: 'var(--secondary)' }}>
                    {anime.studios.map(s => s.name).join(', ')}
                  </p>
                </div>
              )}

              {/* Notice */}
              <div className="mt-8 p-4 rounded-xl" style={{ backgroundColor: 'var(--text-block)' }}>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                  📌 This anime is currently trending on MyAnimeList. Full reviews and ratings coming soon!
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
