'use client';

import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-16 h-8 rounded-full bg-slate-800/20" />;
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`relative w-16 h-8 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? 'bg-slate-800' : 'bg-sky-200'
        }`}
      aria-label="Toggle theme"
    >
      {/* Track Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2">
        <Moon className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500/50'}`} />
        <Sun className={`w-4 h-4 ${isDark ? 'text-yellow-500/50' : 'text-yellow-600'}`} />
      </div>

      {/* Sliding Thumb */}
      <motion.div
        className="relative w-6 h-6 rounded-full shadow-md flex items-center justify-center z-10"
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        animate={{
          x: isDark ? 0 : 32, // Left for Dark, Right for Light
          backgroundColor: isDark ? '#0f172a' : '#ffffff'
        }}
      >
        {isDark ? (
          <Moon className="w-3 h-3 text-indigo-400" />
        ) : (
          <Sun className="w-3 h-3 text-orange-500" />
        )}
      </motion.div>
    </button>
  );
}