import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GitHubDataAccess } from '@/lib/github-data-access';
import { Container, Badge } from '@/components/ui';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Calendar, Clock, PlayCircle, ArrowLeft, ExternalLink, MapPin } from 'lucide-react';
import { CharactersList, MusicList, GalleryGrid, RecommendationsList, EpisodeList } from '@/components/anime/AnimeComponents';

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
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="capitalize font-medium">{anime.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Season</span>
                  <span className="font-medium">{anime.season} {anime.releaseYear}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Studio</span>
                  <span className="font-medium text-right">{anime.studios?.join(', ') || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Country</span>
                  <span className="font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Japan
                  </span>
                </div>
              </div>

              {/* Watch Links */}
              <div className="pt-2 space-y-2">
                <a href="#" className="flex items-center justify-center gap-2 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm transition-colors">
                  <PlayCircle className="w-4 h-4" />
                  Watch Now
                </a>
                <a href="#" className="flex items-center justify-center gap-2 w-full py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg font-bold text-sm transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  Official Site
                </a>
              </div>
            </div>

            {/* Recommendations Sidebar (Desktop) */}
            <div className="hidden lg:block">
              {anime.recommendations && anime.recommendations.length > 0 && (
                <RecommendationsList recommendations={anime.recommendations} />
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-10 pt-8 lg:pt-32">
            {/* Title & Genres */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {anime.genres.map((genre: string) => (
                  <Badge key={genre} variant="info" className="px-3 py-1 text-sm">{genre}</Badge>
                ))}
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">{anime.title}</h1>

              {/* Synopsis */}
              <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500" />
                <h3 className="text-xl font-bold mb-3">Synopsis</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {anime.description}
                </p>
              </div>
            </div>

            {/* Detailed Ratings */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-gradient-to-b from-pink-500 to-violet-500 rounded-full" />
                Haki Analysis
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <RatingCard label="Visuals" score={anime.ratings.visual} color="text-pink-500" />
                <RatingCard label="Music" score={anime.ratings.music} color="text-violet-500" />
                <RatingCard label="Story" score={anime.ratings.story} color="text-blue-500" />
                <RatingCard label="Characters" score={anime.ratings.character} color="text-orange-500" />
              </div>
            </div>

            {/* New Sections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {anime.characters && anime.characters.length > 0 && (
                <CharactersList characters={anime.characters} />
              )}
              {anime.music && (anime.music.openings?.length || anime.music.endings?.length) ? (
                <MusicList music={anime.music} />
              ) : null}
            </div>

            {/* Gallery */}
            {anime.gallery && anime.gallery.length > 0 && (
              <GalleryGrid images={anime.gallery} />
            )}

            {/* Episode Guide */}
            {anime.episodeGuide && anime.episodeGuide.length > 0 && (
              <EpisodeList episodes={anime.episodeGuide} />
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
                  {anime.reviews.slice(0, 3).map((review: any, i: number) => (
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

function RatingCard({ label, score, color }: { label: string, score: number, color: string }) {
  return (
    <div className="bg-card p-5 rounded-xl border border-border flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
      <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-2">{label}</span>
      <span className={`text-4xl font-black ${color}`}>{score}</span>
      <div className="w-full bg-secondary/30 h-2 rounded-full mt-4 overflow-hidden">
        <div
          className={`h-full bg-current ${color.replace('text-', 'bg-')}`}
          style={{ width: `${(score / 10) * 100}%` }}
        />
      </div>
    </div>
  );
}
