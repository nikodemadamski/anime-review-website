'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Container } from '@/components/ui';
import { characterResults, RARITY_CONFIG } from '@/data/quiz-data';
import { generateFallbackUrl } from '@/lib/character-images';
import Image from 'next/image';
import Link from 'next/link';

export default function QuizResultPage() {
  const params = useParams();
  const characterId = params.character as string;
  const [imageError, setImageError] = useState(false);

  const result = characterResults.find(c => c.id === characterId);
  
  // Get image URLs with fallback
  const imageUrl = imageError && result ? generateFallbackUrl(result.name, result.color) : (result?.image || '');
  
  const handleImageError = () => {
    console.warn(`Failed to load image for ${result?.name}, using fallback`);
    setImageError(true);
  };

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-8xl mb-4">🤔</div>
        <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
          Character not found
        </h1>
        <Link
          href="/quiz"
          className="px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
          style={{
            backgroundColor: 'var(--btn-primary)',
            color: 'var(--btn-primary-text)'
          }}
        >
          Take the Quiz
        </Link>
      </div>
    );
  }

  const shareResult = () => {
    const text = `I got ${result.name} from ${result.anime}! ${result.emoji} Take the quiz to find your anime character!`;
    const url = window.location.href;

    if (navigator.share) {
      navigator.share({ title: 'Which Anime Character Are You?', text, url });
    } else {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=AnimeQuiz,WhichAnimeCharacter`;
      window.open(twitterUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen py-12" style={{ backgroundColor: 'var(--background)' }}>
      <Container>
        <div className="max-w-2xl mx-auto">
          <div
            className="rounded-3xl p-8 shadow-2xl border-4 animate-fade-in-up"
            style={{
              backgroundColor: 'var(--card-background)',
              borderColor: result.color
            }}
          >
            {/* Header */}
            <div className="text-center mb-6">
              {/* Rarity Badge */}
              <div className="mb-4">
                <div
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full animate-pulse"
                  style={{
                    backgroundColor: RARITY_CONFIG[result.rarity].color + '30',
                    borderWidth: '3px',
                    borderColor: RARITY_CONFIG[result.rarity].color,
                  }}
                >
                  <span className="text-2xl">{RARITY_CONFIG[result.rarity].emoji}</span>
                  <span className="font-black text-base uppercase" style={{ color: RARITY_CONFIG[result.rarity].color }}>
                    {RARITY_CONFIG[result.rarity].label}
                  </span>
                </div>
              </div>
              
              <div className="text-6xl mb-4">{result.emoji}</div>
              <h1 className="text-4xl font-black mb-2" style={{ color: result.color }}>
                {result.name}
              </h1>
              <p className="text-xl font-semibold mb-3" style={{ color: 'var(--secondary)' }}>
                from {result.anime}
              </p>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                style={{
                  backgroundColor: result.color + '20',
                  borderWidth: '2px',
                  borderColor: result.color
                }}
              >
                <span className="text-xl">✨</span>
                <span className="font-bold text-sm" style={{ color: result.color }}>
                  Only {RARITY_CONFIG[result.rarity].weight}% of people get this rarity!
                </span>
              </div>
            </div>

            {/* Character Image */}
            <div className="relative w-48 h-48 mx-auto mb-6 rounded-2xl overflow-hidden border-4 shadow-xl" style={{ borderColor: result.color }}>
              <Image
                src={imageUrl}
                alt={result.name}
                fill
                className="object-cover"
                sizes="192px"
                onError={handleImageError}
                unoptimized={imageError}
              />
            </div>

            {/* Description */}
            <div
              className="p-6 rounded-2xl mb-6"
              style={{ backgroundColor: 'var(--text-block)' }}
            >
              <p className="text-lg leading-relaxed text-center" style={{ color: 'var(--foreground)' }}>
                {result.description}
              </p>
            </div>

            {/* Traits */}
            <div className="mb-8">
              <p className="text-sm font-semibold mb-3 text-center" style={{ color: 'var(--muted)' }}>
                KEY TRAITS
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {result.traits.map((trait) => (
                  <span
                    key={trait}
                    className="px-4 py-2 rounded-full font-semibold text-sm capitalize"
                    style={{
                      backgroundColor: result.color,
                      color: '#FFFFFF'
                    }}
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-4">
              <Link
                href="/quiz"
                className="block w-full px-6 py-4 rounded-xl font-bold text-lg text-center transition-all duration-300 hover:scale-105 shadow-lg"
                style={{
                  backgroundColor: result.color,
                  color: '#FFFFFF'
                }}
              >
                Take the Quiz Yourself! 🎭
              </Link>

              <button
                onClick={shareResult}
                className="w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'var(--card-background)',
                  borderWidth: '2px',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share This Result
              </button>

              <Link
                href="/browse"
                className="block text-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: 'var(--text-block)',
                  color: 'var(--foreground)'
                }}
              >
                Browse Anime Like {result.anime} →
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
