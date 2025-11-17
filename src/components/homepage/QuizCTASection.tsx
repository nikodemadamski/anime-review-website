'use client';

import Link from 'next/link';
import { QuizStats } from '@/components/quiz/QuizStats';

export function QuizCTASection() {
  return (
    <section
      className="py-12 border-y"
      style={{
        backgroundColor: 'var(--background)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header - Reduced size */}
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-black mb-2 flex items-center justify-center gap-2" style={{ color: 'var(--foreground)' }}>
              <span className="text-3xl">🎭</span>
              <span>Which Anime Character Are You?</span>
            </h2>
            <p className="text-base" style={{ color: 'var(--secondary)' }}>
              Take our personality quiz and discover your anime character match!
            </p>
          </div>

          {/* Quiz Stats - Compact */}
          <QuizStats />

          {/* CTA Button - Smaller */}
          <div className="text-center mt-6">
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #FF6B9D 0%, #9D4EDD 100%)',
                color: '#FFFFFF',
              }}
            >
              <span>Take Quiz</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
