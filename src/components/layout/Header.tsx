'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Container, Typography } from '@/components/ui';
import { cn } from '@/utils/cn';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from 'next-themes';
import { useMobileMenu } from '@/hooks/useMobileMenu';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const { theme } = useTheme();
  const { isOpen: mobileMenuOpen, open: openMobileMenu, close: closeMobileMenu } = useMobileMenu();
  const [watchlistCount, setWatchlistCount] = useState(0);

  // Load watchlist count
  useEffect(() => {
    const updateCount = () => {
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('anime-watchlist');
          if (stored) {
            const items = JSON.parse(stored);
            setWatchlistCount(items.length);
          } else {
            setWatchlistCount(0);
          }
        } catch {
          setWatchlistCount(0);
        }
      }
    };

    updateCount();

    // Listen for watchlist updates
    window.addEventListener('watchlistUpdated', updateCount);
    window.addEventListener('storage', updateCount);

    return () => {
      window.removeEventListener('watchlistUpdated', updateCount);
      window.removeEventListener('storage', updateCount);
    };
  }, []);

  // ESC key handler to close menu
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [mobileMenuOpen, closeMobileMenu]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) { // if scroll down and past 100px
          setIsVisible(false);
        } else { // if scroll up
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 backdrop-blur-md border-b transition-transform duration-300',
        'bg-white/80 border-slate-200', // Light mode
        'dark:bg-slate-900/80 dark:border-slate-800', // Dark mode
        isVisible ? 'translate-y-0' : '-translate-y-full',
        className
      )}
    >
      <Container>
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="relative w-40 h-12 md:w-48 md:h-14">
              <Image
                src="/images/light-logo.png"
                alt="Haki Logo"
                fill
                className="object-contain dark:hidden"
                priority
              />
              <Image
                src="/images/dark-logo.png"
                alt="Haki Logo"
                fill
                className="object-contain hidden dark:block"
                priority
              />
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-2 md:mx-8 relative">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-secondary/10 border-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium transition-all"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            <Link
              href="/"
              className="transition-colors font-bold text-lg"
              style={{
                color: 'var(--secondary)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--secondary)'}
            >
              Home
            </Link>
            <Link
              href="/browse"
              className="transition-colors font-bold text-lg"
              style={{
                color: 'var(--secondary)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--secondary)'}
            >
              Browse All
            </Link>
            <Link
              href="/quiz"
              className="transition-colors font-bold text-lg flex items-center gap-1"
              style={{
                color: 'var(--secondary)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--secondary)'}
            >
              <span>🎭 Quiz</span>
              <span
                className="px-1.5 py-0.5 rounded text-xs font-black animate-pulse"
                style={{
                  backgroundColor: '#FF6B9D',
                  color: '#FFFFFF'
                }}
              >
                NEW
              </span>
            </Link>
            <Link
              href="/watchlist"
              className="transition-colors font-bold text-lg flex items-center gap-1.5"
              style={{
                color: 'var(--secondary)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--secondary)'}
            >
              <span>❤️ Watchlist</span>
              {watchlistCount > 0 && (
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-black"
                  style={{
                    backgroundColor: '#FF6B9D',
                    color: '#FFFFFF'
                  }}
                >
                  {watchlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/contact"
              className="transition-colors font-bold text-lg"
              style={{
                color: 'var(--secondary)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--secondary)'}
            >
              Contact
            </Link>
            <ThemeToggle />
          </nav>

          {/* Mobile menu - Hidden as we use Bottom Nav */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </Container>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] md:hidden"
              onClick={closeMobileMenu}
            />

            {/* Menu Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-background border-l border-border z-[70] md:hidden flex flex-col shadow-2xl"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-border bg-background">
                <Typography variant="h5" className="font-black tracking-tight">
                  Menu
                </Typography>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-full hover:bg-secondary/20 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Menu Links */}
              <nav className="flex-1 overflow-y-auto p-6 space-y-2 bg-background">
                {[
                  { href: '/', label: 'Home', icon: '🏠' },
                  { href: '/browse', label: 'Browse All', icon: '🔍' },
                  { href: '/quiz', label: 'Personality Quiz', icon: '🎭', badge: 'NEW' },
                  { href: '/watchlist', label: 'Watchlist', icon: '❤️', count: watchlistCount },
                  { href: '/contact', label: 'Contact', icon: '✉️' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-secondary/10 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl group-hover:scale-110 transition-transform">{link.icon}</span>
                      <span className="font-bold text-lg">{link.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {link.badge && (
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-pink-500 text-white animate-pulse">
                          {link.badge}
                        </span>
                      )}
                      {link.count !== undefined && link.count > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-pink-500 text-white">
                          {link.count}
                        </span>
                      )}
                      <svg className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </nav>

              {/* Menu Footer */}
              <div className="p-6 border-t border-border bg-secondary/5">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-sm text-muted-foreground">Appearance</span>
                  <ThemeToggle />
                </div>
                <p className="text-xs text-center text-muted-foreground mt-6">
                  © 2025 Haki Anime Reviews
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export { Header };