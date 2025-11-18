'use client';

import { useState, FormEvent } from 'react';

interface NewsletterPromptProps {
  onClose: () => void;
  onSignup: (email: string) => void;
}

export function NewsletterPrompt({ onClose, onSignup }: NewsletterPromptProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call the signup handler
      await onSignup(email);
      
      // Close the prompt after successful signup
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError('Failed to subscribe. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className="fixed inset-0 bg-black/30 z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Prompt Card */}
      <div 
        className="fixed bottom-4 right-4 z-50 max-w-sm w-full mx-4 md:mx-0 animate-slide-up"
        style={{
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        <div 
          className="rounded-xl p-6 shadow-2xl relative"
          style={{
            backgroundColor: 'var(--card-background)',
            borderWidth: '2px',
            borderColor: 'var(--accent)',
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-opacity-10"
            style={{
              color: 'var(--secondary)',
            }}
            aria-label="Close newsletter prompt"
          >
            <span className="text-xl">✕</span>
          </button>

          {/* Icon */}
          <div className="text-5xl mb-3">📬</div>

          {/* Heading */}
          <h3 
            className="font-bold text-xl mb-2"
            style={{ color: 'var(--foreground)' }}
          >
            Love anime?
          </h3>

          {/* Description */}
          <p 
            className="text-sm mb-4"
            style={{ color: 'var(--secondary)' }}
          >
            Get weekly recommendations based on your watchlist!
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2 rounded-lg mb-3 transition-all focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--background)',
                borderWidth: '2px',
                borderColor: error ? 'var(--error)' : 'var(--border)',
                color: 'var(--foreground)',
              }}
              required
            />
            
            {error && (
              <p 
                className="text-sm mb-3"
                style={{ color: 'var(--error)' }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--accent)',
                color: '#FFFFFF',
              }}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>

          {/* Privacy Note */}
          <p 
            className="text-xs mt-3 text-center"
            style={{ color: 'var(--secondary)' }}
          >
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
