import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GitHubDataAccess } from '@/lib/github-data-access';
import { AnimeDetailsHero } from '@/components/anime/AnimeDetailsHero';
import { AnimeStatsGrid } from '@/components/anime/AnimeStatsGrid';
import { Container } from '@/components/ui';

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
    title: `${anime.title} - Haki Review`,
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
    <main className="min-h-screen bg-background text-foreground">
      <AnimeDetailsHero anime={anime} />

      <Container size="xl" className="-mt-10 relative z-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Synopsis */}
            <section className="glass-panel p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-indigo-500 rounded-full" />
                Synopsis
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {anime.description}
              </p>
            </section>

            {/* Detailed Stats */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-pink-500 rounded-full" />
                Haki Analysis
              </h2>
              <AnimeStatsGrid ratings={anime.ratings} />
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="font-bold text-lg mb-4 border-b border-white/10 pb-2">Information</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Studio</span>
                  <span className="font-semibold">{anime.studios?.join(', ')}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Source</span>
                  <span className="font-semibold capitalize">{anime.source}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-semibold">{anime.ratings.site.toFixed(1)}</span>
                </li>
              </ul>
            </div>

            {/* Where to Watch (Placeholder) */}
            <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
              <h3 className="font-bold text-lg mb-2">Where to Watch</h3>
              <p className="text-sm text-muted-foreground mb-4">Stream this anime on your favorite platforms.</p>
              <div className="flex gap-2">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">📺</div>
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">🎬</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
