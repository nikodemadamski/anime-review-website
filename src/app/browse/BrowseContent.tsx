'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container } from '@/components/ui';
import { useDebounce } from '@/hooks/useDebounce';
import { BrowseHero } from '@/components/browse/BrowseHero';
import { BrowseFilters } from '@/components/browse/BrowseFilters';
import { CategoryTabs, CategoryType } from '@/components/browse/CategoryTabs';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Eye, Music, BookOpen, Users } from 'lucide-react';

type StatusOption = 'all' | 'airing' | 'finished' | 'upcoming';

export function BrowseContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [allAnime, setAllAnime] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryType>('overall');
  const [statusFilter, setStatusFilter] = useState<StatusOption>('all');

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Load Data
  useEffect(() => {
    async function loadAnime() {
      try {
        const response = await fetch('/api/anime');
        if (response.ok) {
          const result = await response.json();
          const data = result.data || result;
          setAllAnime(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Failed to load anime:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnime();
  }, []);

  // Filter & Sort Logic
  const filteredAnime = useMemo(() => {
    if (!Array.isArray(allAnime)) return [];
    let filtered = [...allAnime];

    // Search
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (anime) =>
          anime.title.toLowerCase().includes(query) ||
          anime.description?.toLowerCase().includes(query) ||
          anime.genres.some((g: string) => g.toLowerCase().includes(query))
      );
    }

    // Genres
    if (selectedGenres.length > 0) {
      filtered = filtered.filter((anime) =>
        selectedGenres.every((genre) =>
          anime.genres.some((g: string) => g.toLowerCase() === genre.toLowerCase())
        )
      );
    }

    // Status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((anime) => {
        if (statusFilter === 'airing') return anime.status === 'ongoing';
        if (statusFilter === 'finished') return anime.status === 'finished';
        if (statusFilter === 'upcoming') return anime.status === 'upcoming';
        return true;
      });
    }

    // Sort by Active Category
    filtered.sort((a, b) => {
      const key = activeCategory === 'overall' ? 'site' : activeCategory;
      const aRating = a.ratings[key] || 0;
      const bRating = b.ratings[key] || 0;
      return bRating - aRating;
    });

    return filtered;
  }, [allAnime, debouncedSearch, selectedGenres, statusFilter, activeCategory]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenres([]);
    setStatusFilter('all');
    setActiveCategory('overall');
  };

  // Helper to get score and icon based on active category
  const getScoreDisplay = (anime: any) => {
    const key = activeCategory === 'overall' ? 'site' : activeCategory;
    const score = anime.ratings[key]?.toFixed(1) || 'N/A';

    let Icon = Star;
    let colorClass = 'text-yellow-400';

    if (activeCategory === 'visual') { Icon = Eye; colorClass = 'text-pink-400'; }
    if (activeCategory === 'music') { Icon = Music; colorClass = 'text-violet-400'; }
    if (activeCategory === 'story') { Icon = BookOpen; colorClass = 'text-cyan-400'; }
    if (activeCategory === 'character') { Icon = Users; colorClass = 'text-amber-400'; }

    return { score, Icon, colorClass };
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BrowseHero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        resultCount={filteredAnime.length}
      />

      <Container size="xl" className="pb-20">
        {/* Category Tabs - The "Meat" */}
        <CategoryTabs activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

        <BrowseFilters
          selectedGenres={selectedGenres}
          toggleGenre={toggleGenre}
          sortBy={activeCategory} // Pass active category as sort
          setSortBy={() => { }} // Disable manual sort override for now to keep category focus
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          clearFilters={clearFilters}
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-2xl bg-secondary/10 animate-pulse" />
            ))}
          </div>
        ) : filteredAnime.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No anime found</h3>
            <p className="text-muted mb-6">Try adjusting your filters or search query.</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          >
            <AnimatePresence mode='popLayout'>
              {filteredAnime.map((anime, index) => {
                const { score, Icon, colorClass } = getScoreDisplay(anime);

                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={anime.id}
                  >
                    <Link href={`/anime/${anime.id}`} className="group block relative h-full">
                      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-3 glass-panel transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-indigo-500/20">
                        {/* Rank Badge */}
                        <div className="absolute top-2 left-2 z-10 w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md flex items-center justify-center text-white font-bold text-sm border border-white/10">
                          #{index + 1}
                        </div>

                        <Image
                          src={anime.coverImage}
                          alt={anime.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <p className="text-white text-xs font-bold mb-1 line-clamp-2">{anime.description}</p>
                          </div>
                        </div>

                        {/* Score Badge - Dynamic based on Category */}
                        <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md text-white px-2 py-1 rounded-lg text-sm font-black flex items-center gap-1 border border-white/10 shadow-lg">
                          <Icon className={`w-4 h-4 ${colorClass} fill-current`} />
                          {score}
                        </div>
                      </div>

                      <h3 className="font-bold text-sm md:text-base line-clamp-1 group-hover:text-indigo-500 transition-colors">
                        {anime.title}
                      </h3>
                      <p className="text-xs text-muted line-clamp-1">
                        {anime.genres.join(', ')}
                      </p>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </Container>
    </div>
  );
}
