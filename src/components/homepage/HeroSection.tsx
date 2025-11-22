'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';

export function HeroSection() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/browse?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20 pb-10">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[128px]" />
      </div>

      <div className="container mx-auto px-4 z-10 relative">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8"
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-foreground/80">The Future of Anime Discovery</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight"
          >
            Find Your Next <br />
            <span className="text-gradient">Masterpiece</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted mb-10 max-w-2xl"
          >
            Stop scrolling, start watching. We rate anime based on what actually matters:
            <span className="text-pink-400 font-semibold"> Visuals</span>,
            <span className="text-violet-400 font-semibold"> Music</span>,
            <span className="text-cyan-400 font-semibold"> Story</span>, and
            <span className="text-amber-400 font-semibold"> Characters</span>.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full max-w-xl relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative flex items-center glass-panel rounded-2xl p-2">
              <Search className="w-6 h-6 text-muted ml-3" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search for anime, genres, or vibes..."
                className="w-full bg-transparent border-none focus:ring-0 text-foreground placeholder:text-muted/50 px-4 py-3 text-lg"
              />
              <button
                onClick={handleSearch}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-colors"
              >
                Search
              </button>
            </div>
          </motion.div>

          {/* Floating Elements (Decorative) */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 hidden lg:block pointer-events-none">
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-64 h-80 rounded-2xl overflow-hidden glass-panel p-2 rotate-[-6deg]"
            >
              <div className="w-full h-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden relative transition-colors duration-300">
                {/* Placeholder for anime image */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20" />
              </div>
            </motion.div>
          </div>

          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 hidden lg:block pointer-events-none">
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-64 h-80 rounded-2xl overflow-hidden glass-panel p-2 rotate-[6deg]"
            >
              <div className="w-full h-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden relative transition-colors duration-300">
                {/* Placeholder for anime image */}
                <div className="absolute inset-0 bg-gradient-to-bl from-pink-500/20 to-rose-500/20" />
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
