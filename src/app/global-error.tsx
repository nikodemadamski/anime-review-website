'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
          padding: '20px',
        }}>
          <div style={{ maxWidth: '600px', textAlign: 'center' }}>
            <div style={{ fontSize: '100px', marginBottom: '20px' }}>😅</div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>
              Something Went Wrong
            </h1>
            <p style={{ fontSize: '18px', marginBottom: '32px', opacity: 0.8 }}>
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            <button
              onClick={reset}
              style={{
                padding: '16px 32px',
                fontSize: '18px',
                fontWeight: 'bold',
                backgroundColor: '#FF6B9D',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
