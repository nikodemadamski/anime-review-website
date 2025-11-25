import React from 'react';
import { Container, Typography } from '@/components/ui';
import { cn } from '@/utils/cn';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      className={cn('border-t mt-auto', className)}
      style={{
        backgroundColor: 'var(--footer-bg)',
        borderColor: 'var(--border)',
        color: 'var(--footer-text)',
      }}
    >
      <Container>
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: 'var(--btn-primary)' }}
                >
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <Typography variant="h6" style={{ color: 'var(--footer-text)' }}>
                  Anime Review Website
                </Typography>
              </div>
              <Typography variant="caption" className="max-w-md" style={{ color: 'var(--muted)' }}>
                Discover and review the best anime of 2025. Rate shows across Visual, Music, Story, and Character categories to help fellow anime fans find their next favorite series.
              </Typography>
            </div>

            {/* Quick Links */}
            <div>
              <Typography variant="h6" className="mb-4" style={{ color: 'var(--footer-text)' }}>
                Quick Links
              </Typography>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/"
                    className="transition-colors"
                    style={{ color: 'var(--muted)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted)'}
                  >
                    Browse Anime
                  </a>
                </li>
                <li>
                  <a
                    href="/top-rated"
                    className="transition-colors"
                    style={{ color: 'var(--muted)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted)'}
                  >
                    Top Rated
                  </a>
                </li>
                <li>
                  <a
                    href="/new-releases"
                    className="transition-colors"
                    style={{ color: 'var(--muted)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted)'}
                  >
                    New Releases
                  </a>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <Typography variant="h6" className="mb-4" style={{ color: 'var(--footer-text)' }}>
                Categories
              </Typography>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/genre/action"
                    className="transition-colors"
                    style={{ color: 'var(--muted)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted)'}
                  >
                    Action
                  </a>
                </li>
                <li>
                  <a
                    href="/genre/adventure"
                    className="transition-colors"
                    style={{ color: 'var(--muted)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted)'}
                  >
                    Adventure
                  </a>
                </li>
                <li>
                  <a
                    href="/genre/comedy"
                    className="transition-colors"
                    style={{ color: 'var(--muted)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted)'}
                  >
                    Comedy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Buy Me a Coffee Section */}
          <div className="mt-8 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="text-center mb-6">
              <Typography variant="h6" className="mb-2" style={{ color: 'var(--footer-text)' }}>
                Support This Project
              </Typography>
              <Typography variant="caption" className="mb-4 block" style={{ color: 'var(--muted)' }}>
                Help keep this website updated and running with a small donation
              </Typography>
              <a
                href="https://www.buymeacoffee.com/nick20"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
                style={{
                  backgroundColor: 'var(--rating-overall)',
                  color: '#FFFFFF'
                }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 21h19v-3H2v3zM20 8H4V6h16v2zm0-4H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-1 9H5V7h14v6z" />
                </svg>
                Buy Me a Coffee
              </a>
            </div>
          </div>

          {/* Bottom section */}
          <div
            className="mt-6 pt-6 flex flex-col sm:flex-row justify-between items-center"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <Typography variant="caption" style={{ color: 'var(--muted)' }}>
              © 2025 Anime Review Website. All rights reserved.
            </Typography>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a
                href="/privacy"
                className="transition-colors text-sm"
                style={{ color: 'var(--muted)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted)'}
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="transition-colors text-sm"
                style={{ color: 'var(--muted)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted)'}
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export { Footer };