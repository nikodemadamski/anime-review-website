'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container, Typography } from '@/components/ui';
import { cn } from '@/utils/cn';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '@/components/ThemeProvider';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const { theme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [watchlistCount, setWatchlistCount] = useState(0);

  // Prevent body scroll when mobile menu is open
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

  const closeMobileMenu = () => setMobileMenuOpen(false);
  
  return (
    <header 
      className={cn('sticky top-0 z-50 backdrop-blur-md border-b', className)}
      style={{
        backgroundColor: 'var(--header-bg)',
        borderColor: 'var(--header-divider)',
      }}
    >
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            style={{ color: 'var(--header-text)' }}
          >
            <Image
              src={theme === 'dark' ? '/logo-dark.png' : '/logo-light.png'}
              alt="Anime Review Logo"
              width={40}
              height={40}
              className="rounded-xl"
            />
            <Typography variant="h5" component="span" className="hidden sm:block font-bold">
              Anime Review
            </Typography>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="transition-colors font-medium"
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
              className="transition-colors font-medium"
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
              className="transition-colors font-medium flex items-center gap-1"
              style={{ 
                color: 'var(--secondary)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--secondary)'}
            >
              <span>🎭 Quiz</span>
              <span 
                className="px-1.5 py-0.5 rounded text-xs font-bold animate-pulse"
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
              className="transition-colors font-medium flex items-center gap-1.5"
              style={{ 
                color: 'var(--secondary)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--secondary)'}
            >
              <span>❤️ Watchlist</span>
              {watchlistCount > 0 && (
                <span 
                  className="px-2 py-0.5 rounded-full text-xs font-bold"
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
              className="transition-colors font-medium"
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

          {/* Mobile menu */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--foreground)' }}
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-fade-in"
            onClick={closeMobileMenu}
          />
          
          {/* Slide-in Menu */}
          <div 
            className="fixed top-0 right-0 bottom-0 w-[280px] z-50 md:hidden shadow-2xl animate-slide-in-right"
            style={{
              backgroundColor: 'var(--card-background)',
            }}
          >
            {/* Menu Header */}
            <div 
              className="flex items-center justify-between p-4 border-b"
              style={{ borderColor: 'var(--border)' }}
            >
              <Typography variant="h6" className="font-bold" style={{ color: 'var(--foreground)' }}>
                Menu
              </Typography>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-lg transition-colors hover:bg-opacity-10"
                style={{ color: 'var(--foreground)' }}
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu Links */}
            <nav className="flex flex-col p-4 space-y-2">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-semibold"
                style={{ color: 'var(--foreground)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--text-block)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </Link>

              <Link
                href="/browse"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-semibold"
                style={{ color: 'var(--foreground)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--text-block)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Browse All
              </Link>

              <Link
                href="/quiz"
                onClick={closeMobileMenu}
                className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 font-semibold"
                style={{ color: 'var(--foreground)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--text-block)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🎭</span>
                  <span>Personality Quiz</span>
                </div>
                <span 
                  className="px-2 py-0.5 rounded text-xs font-bold animate-pulse"
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
                onClick={closeMobileMenu}
                className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 font-semibold"
                style={{ color: 'var(--foreground)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--text-block)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>❤️ Watchlist</span>
                </div>
                {watchlistCount > 0 && (
                  <span 
                    className="px-2 py-0.5 rounded-full text-xs font-bold"
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
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-semibold"
                style={{ color: 'var(--foreground)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--text-block)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact
              </Link>
            </nav>

            {/* Theme Toggle in Menu */}
            <div 
              className="absolute bottom-0 left-0 right-0 p-4 border-t"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex items-center justify-between px-4 py-2">
                <span className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
                  Theme
                </span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export { Header };