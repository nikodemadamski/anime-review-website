'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console or error tracking service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          {/* Error Icon */}
          <div className="text-9xl mb-8 animate-bounce">😅</div>

          {/* Error Message */}
          <h1 className="text-4xl font-black mb-4" style={{ color: 'var(--foreground)' }}>
            Oops! Something Went Wrong
          </h1>
          <p className="text-xl mb-8" style={{ color: 'var(--secondary)' }}>
            Don't worry, even the best anime have filler episodes. Let's get you back on track!
          </p>

          {/* Error Details (Development only) */}
          {process.env.NODE_ENV === 'development' && (
            <div
              className="p-4 rounded-xl mb-8 text-left overflow-auto max-h-40"
              style={{ backgroundColor: 'var(--card-background)', color: 'var(--muted)' }}
            >
              <p className="text-sm font-mono">{error.message}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
              style={{
                backgroundColor: 'var(--btn-primary)',
                color: 'var(--btn-primary-text)',
              }}
            >
              Try Again
            </button>
            <Link
              href="/"
              className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg border-2"
              style={{
                backgroundColor: 'transparent',
                borderColor: 'var(--border)',
                color: 'var(--foreground)',
              }}
            >
              Go Home
            </Link>
          </div>

          {/* Help Text */}
          <p className="text-sm mt-8" style={{ color: 'var(--muted)' }}>
            If this problem persists, try refreshing the page or clearing your browser cache.
          </p>
        </div>
      </Container>
    </div>
  );
}
