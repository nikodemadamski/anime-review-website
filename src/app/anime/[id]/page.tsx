import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GitHubDataAccess } from '@/lib/github-data-access';
import { Container, Badge } from '@/components/ui';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Calendar, Clock, PlayCircle, ArrowLeft, ExternalLink, MapPin, Play } from 'lucide-react';
import { CharactersList, MusicList, GalleryGrid, RecommendationsList, EpisodeList, Synopsis, SeasonsList } from '@/components/anime/AnimeComponents';

interface Review {
  username: string;
  score: number;
  content: string;
  date: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const anime = await GitHubDataAccess.getAnimeById(id);

  if (!anime) {
    return { title: 'Anime Not Found' };
  }

  return {
    title: `${anime.title} - Anime Review`,
    description: anime.description,
  };
}

export default async function AnimePage({ params }: PageProps) {
  const { id } = await params;
  const anime = await GitHubDataAccess.getAnimeById(id);

  if (!anime) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <div className="relative h-[40vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10" />
        <Image
          src={anime.coverImage}
          alt={anime.title}
          fill
          className="object-cover blur-sm opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-black/40 z-0" />

        <Container className="relative z-20 h-full flex flex-col justify-end pb-8">
          <Link
            href="/browse"
            className="absolute top-8 left-4 md:left-8 text-white/80 hover:text-white flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Browse
          </Link>
        </Container>
      </div>

      <Container className="-mt-32 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar - Poster & Key Info */}
          <div className="lg:col-span-3 space-y-6">
            <div className="rounded-xl overflow-hidden shadow-2xl border-4 border-background">
              <div className="aspect-[2/3] relative">
                <Image
                  src={anime.coverImage}
                  alt={anime.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Key Stats Card */}
            <div className="bg-card rounded-xl p-4 border border-border space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-muted-foreground text-sm font-medium">Score</span>
                <div className="flex items-center gap-1 text-yellow-500 font-black text-lg">
                  <Star className="w-5 h-5 fill-current" />
                  {anime.ratings.site.toFixed(1)}
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rank</span>
                  <span className="font-bold">#{anime.rank || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Episodes</span>
                  <span className="font-medium">{anime.episodes || '?'} eps</span>
                </div>

                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 group">
                  <Image
                    src={anime.coverImage}
                    alt={anime.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                    <span className="text-sm font-bold text-white">
                      Rank #{anime.rank || 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-panel p-4 rounded-xl text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Episodes</p>
                    <p className="text-xl font-black">{anime.episodes || '?'}</p>
                  </div>
                  <div className="glass-panel p-4 rounded-xl text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Status</p>
                    <p className="text-xl font-black capitalize">{anime.status}</p>
                  </div>
                </div>

                <a
                  href={`https://www.crunchyroll.com/search?q=${encodeURIComponent(anime.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-[#F47521] hover:bg-[#ff853b] text-white font-black rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg shadow-orange-500/20"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Watch Now
                </a>

                {/* Seasons List */}
                {anime.seasons && anime.seasons.length > 0 && (
                  <SeasonsList seasons={anime.seasons} />
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-10 pt-8 lg:pt-32">
            {/* Title & Genres */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {anime.genres.map((genre: string) => (
                  <span key={genre} className="px-3 py-1 rounded-full bg-secondary/10 text-xs font-bold text-muted-foreground border border-white/5">
                    {genre}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">{anime.title}</h1>

              {/* Synopsis */}
              <Synopsis text={anime.description || 'No synopsis available.'} />
            </div>

            {/* Detailed Ratings & Content Groups */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-gradient-to-b from-pink-500 to-violet-500 rounded-full" />
                Haki Analysis
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Story Rating */}
                <RatingCard
                  label="Story"
                  score={anime.ratings.story}
                  color="text-blue-500"
                  description="Plot development, pacing, and narrative structure."
                >
                  <div className="mt-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                    <p className="text-sm text-muted-foreground italic">
                      "A compelling narrative that keeps you engaged from start to finish."
                    </p>
                  </div>
                </RatingCard>

                {/* Visuals Rating + Gallery Preview */}
                <RatingCard
                  label="Visuals"
                  score={anime.ratings.visual}
                  color="text-pink-500"
                  description="Animation quality, art style, and visual effects."
                >
                  {anime.gallery && anime.gallery.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {anime.gallery.slice(0, 3).map((img: string, i: number) => (
                        <div key={i} className="aspect-video rounded-lg overflow-hidden relative bg-gray-900">
                          <Image src={img} alt="Visual preview" fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </RatingCard>

                {/* Characters Rating + List */}
                <RatingCard
                  label="Characters"
                  score={anime.ratings.character}
                  color="text-orange-500"
                  description="Character development, design, and relationships."
                  className="md:col-span-2 lg:col-span-1"
                >
                  {anime.characters && anime.characters.length > 0 && (
                    <CharactersList characters={anime.characters} />
                  )}
                </RatingCard>

                {/* Music Rating + List */}
                <RatingCard
                  label="Music"
                  score={anime.ratings.music}
                  color="text-violet-500"
                  description="Opening/ending themes, soundtrack, and audio design."
                  className="md:col-span-2 lg:col-span-1"
                >
                  {anime.music && (
                    <MusicList music={anime.music} animeTitle={anime.title} />
                  )}
                </RatingCard>
              </div>
            </div>

            {/* Gallery (Full) */}
            {anime.gallery && anime.gallery.length > 0 && (
              <GalleryGrid images={anime.gallery} />
            )}

            {/* Episodes */}
            {anime.episodeGuide && anime.episodeGuide.length > 0 && (
              <EpisodeList episodes={anime.episodeGuide} />
            )}

            {/* Recommendations */}
            {anime.recommendations && anime.recommendations.length > 0 && (
              <RecommendationsList recommendations={anime.recommendations} />
            )}

            {/* Trailer */}
            {anime.trailer && (
              <section className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-indigo-500" />
                  Trailer
                </h3>
                <div className="aspect-video rounded-xl overflow-hidden bg-gray-900">
                  {anime.trailer.site === 'youtube' ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${anime.trailer.id}`}
                      title="Anime Trailer"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      Trailer available on {anime.trailer.site}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Reviews Section (Restored) */}
            {anime.reviews && anime.reviews.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span className="w-2 h-8 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
                    Community Reviews
                  </h2>
                  <button className="text-sm font-bold text-indigo-500 hover:text-indigo-400">Write a Review</button>
                </div>

                <div className="grid gap-4">
                  {anime.reviews.slice(0, 3).map((review: Review, i: number) => (
                    <div key={i} className="glass-panel p-6 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center font-bold text-white">
                            {review.username?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{review.username || 'Anonymous'}</p>
                            <p className="text-xs text-muted-foreground">{review.date || 'Recently'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500 font-bold">
                          <Star className="w-4 h-4 fill-current" />
                          <span>{review.score?.toFixed(1) || 'N/A'}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4">
                        {review.content || 'No review content available.'}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Mobile Recommendations */}
            <div className="lg:hidden">
              {anime.recommendations && anime.recommendations.length > 0 && (
                <RecommendationsList recommendations={anime.recommendations} />
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

function RatingCard({
  label,
  score,
  color,
  description,
  children,
  className
}: {
  label: string;
  score: number;
  color: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`glass-panel p-6 rounded-2xl ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            {label}
            <div className={`px-2 py-0.5 rounded text-xs font-black bg-secondary/10 ${color}`}>
              {score.toFixed(1)}
            </div>
          </h3>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            {description}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg bg-secondary/5 ${color}`}>
          {Math.round(score)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-secondary/10 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full rounded-full ${color.replace('text-', 'bg-')}`}
          style={{ width: `${(score / 10) * 100}%` }}
        />
      </div>

      {children && (
        <div className="pt-4 border-t border-border/50">
          {children}
        </div>
      )}
    </div>
  );
}
