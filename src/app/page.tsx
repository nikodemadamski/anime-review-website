import { Suspense } from 'react';
import { Container, Badge } from '@/components/ui';
import { GitHubDataAccess } from '@/lib/github-data-access';
import { HowWeRateSection } from '@/components/homepage/HowWeRateSection';
import { EmailSignupSection } from '@/components/homepage/EmailSignupSection';
import { TrendingSection } from '@/components/homepage/TrendingSection';
import { QuizCTASection } from '@/components/homepage/QuizCTASection';
import { CategoryFilterPills } from '@/components/homepage/CategoryFilterPills';
import { FilteredContent } from '@/components/homepage/FilteredContent';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  const topAnime = await GitHubDataAccess.getTopRated(20); // Get more for filtering

  return (
    <div className="min-h-screen">
      {/* How We Rate Section - First section with logo above */}
      <HowWeRateSection />

      {/* Trending This Season */}
      <TrendingSection />

      {/* Top Rated - Compact */}
      <section
        className="py-12"
        style={{ backgroundColor: 'var(--background)' }}
      >
        <Container size="xl">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2
              className="text-2xl md:text-3xl font-black"
              style={{ color: 'var(--foreground)' }}
            >
              ⭐ Top Rated Anime
            </h2>
            <Link
              href="/browse"
              className="px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 font-bold shadow-md flex items-center gap-2 text-sm"
              style={{
                backgroundColor: 'var(--btn-primary)',
                color: 'var(--btn-primary-text)'
              }}
            >
              <span>View All</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* Category Filter Pills */}
          <div className="mb-6">
            <Suspense fallback={<div className="h-12" />}>
              <CategoryFilterPills />
            </Suspense>
          </div>

          {/* Filtered Content - Dynamically sorted by category */}
          <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading...</div>}>
            <FilteredContent allAnime={topAnime} />
          </Suspense>
        </Container>
      </section>

      {/* Quiz CTA - Positioned after Top Rated for better flow */}
      <QuizCTASection />

      {/* Featured Reviews - From Top Anime with Fallback */}
      <section
        className="py-12 border-t"
        style={{
          backgroundColor: 'var(--text-block)',
          borderColor: 'var(--border)'
        }}
      >
        <Container size="xl">
          <h2
            className="text-2xl md:text-3xl font-black mb-6"
            style={{ color: 'var(--foreground)' }}
          >
            💬 Featured Reviews
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topAnime.slice(0, 3).map((anime) => {
              const review = anime.reviews?.[0];
              
              return (
                <Link
                  key={anime.id}
                  href={`/anime/${anime.id}`}
                  className="group rounded-xl p-4 border transition-all duration-300 hover:scale-102 hover:shadow-xl"
                  style={{
                    backgroundColor: 'var(--card-background)',
                    borderColor: 'var(--border)'
                  }}
                >
                  {/* Anime Info with Thumbnail */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={anime.coverImage}
                        alt={anime.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-bold text-sm line-clamp-1 group-hover:underline"
                        style={{ color: 'var(--foreground)' }}
                      >
                        {anime.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="info" size="sm">{anime.ratings.site.toFixed(1)}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Review Content or Placeholder */}
                  <div className="border-t pt-3" style={{ borderColor: 'var(--border)' }}>
                    {review ? (
                      <>
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs"
                            style={{ backgroundColor: 'var(--btn-primary)' }}
                          >
                            {review.username.charAt(0).toUpperCase()}
                          </div>
                          <p
                            className="font-semibold text-xs"
                            style={{ color: 'var(--foreground)' }}
                          >
                            {review.username}
                          </p>
                          <Badge variant="info" size="sm">{review.score.toFixed(1)}</Badge>
                        </div>
                        <p
                          className="text-sm line-clamp-3"
                          style={{ color: 'var(--secondary)' }}
                        >
                          {review.content}
                        </p>
                        <p
                          className="text-xs mt-2 group-hover:underline"
                          style={{ color: 'var(--accent)' }}
                        >
                          Read full review →
                        </p>
                      </>
                    ) : (
                      <>
                        <p
                          className="text-sm mb-2"
                          style={{ color: 'var(--secondary)' }}
                        >
                          Highly rated anime with exceptional {anime.ratings.visual > 8.5 ? 'visuals' : anime.ratings.music > 8.5 ? 'music' : anime.ratings.story > 8.5 ? 'story' : 'characters'}.
                        </p>
                        <p
                          className="text-xs group-hover:underline"
                          style={{ color: 'var(--accent)' }}
                        >
                          View details →
                        </p>
                      </>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Email Signup Section */}
      <EmailSignupSection />
    </div>
  );
}
