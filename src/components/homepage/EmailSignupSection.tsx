'use client';

import { useState } from 'react';
import { Container } from '@/components/ui';

export function EmailSignupSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address 📧');
      return;
    }

    setStatus('loading');
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setMessage(data.message || "You're in! 🎉 We'll email you when amazing anime drops");
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Oops! Something went wrong. Please try again or contact us.');
    }
  };

  return (
    <section
      className="py-16 border-y"
      style={{
        background: 'linear-gradient(135deg, var(--text-block) 0%, var(--background) 100%)',
        borderColor: 'var(--border)',
      }}
    >
      <Container size="lg">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-5xl mb-4">📬</div>
          <h2
            className="text-3xl md:text-4xl font-black mb-4"
            style={{ color: 'var(--foreground)' }}
          >
            Get Weekly Top 10 Anime by Category 🎯
          </h2>
          <p
            className="text-lg mb-6"
            style={{ color: 'var(--secondary)' }}
          >
            Every Monday, we send you the top-rated anime in Visual, Music, Story & Character. 
            Discover your next favorite anime before everyone else!
          </p>

          {/* Newsletter Preview */}
          <div 
            className="max-w-md mx-auto mb-8 p-4 rounded-xl border-2"
            style={{
              backgroundColor: 'var(--card-background)',
              borderColor: 'var(--border)'
            }}
          >
            <p className="text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              📧 What you'll get:
            </p>
            <ul className="text-sm space-y-1 text-left" style={{ color: 'var(--secondary)' }}>
              <li>✨ Top 10 anime by Visual, Music, Story & Character</li>
              <li>🎬 New releases with 9+ ratings</li>
              <li>🔥 Trending anime this week</li>
              <li>💎 Hidden gems you might have missed</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={status === 'loading' || status === 'success'}
                className="flex-1 px-6 py-4 rounded-xl text-base border-2 transition-all duration-300 focus:outline-none focus:scale-105"
                style={{
                  backgroundColor: 'var(--card-background)',
                  borderColor: status === 'error' ? 'var(--error)' : 'var(--border)',
                  color: 'var(--foreground)',
                }}
              />
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                style={{
                  backgroundColor: 'var(--btn-primary)',
                  color: 'var(--btn-primary-text)',
                }}
              >
                {status === 'loading' ? 'Subscribing...' : status === 'success' ? '✓ Subscribed' : 'Subscribe'}
              </button>
            </div>

            {message && (
              <p
                className="mt-4 text-sm font-semibold"
                style={{ color: status === 'success' ? 'var(--success)' : 'var(--error)' }}
              >
                {message}
              </p>
            )}
          </form>

          {/* Enhanced Social Proof */}
          <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {['#FF6B9D', '#9D4EDD', '#06B6D4', '#F59E0B'].map((color, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-white font-bold text-xs"
                    style={{ backgroundColor: color, borderColor: 'var(--background)' }}
                  >
                    {['M', 'A', 'L', 'K'][i]}
                  </div>
                ))}
              </div>
              <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                Join 5,000+ subscribers
              </p>
            </div>
            <div className="w-px h-6" style={{ backgroundColor: 'var(--border)' }} />
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              🔒 No spam • 📧 Weekly only • ✨ Unsubscribe anytime
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
