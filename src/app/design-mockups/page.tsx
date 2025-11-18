'use client';

import { ShareableResultCard } from '@/components/quiz/ShareableResultCard';
import { characterResults } from '@/data/quiz-data';
import { Container } from '@/components/ui';
import { useState } from 'react';

/**
 * Design Mockups Showcase Page
 * 
 * Displays shareable result card designs for:
 * - Naruto (Legendary)
 * - Violet Evergarden (Ultra-Rare)
 * - Zero Two (Rare)
 * 
 * This page serves as the design deliverable showing
 * variations across different character themes and rarities.
 */
export default function DesignMockupsPage() {
  const [selectedCharacter, setSelectedCharacter] = useState<string>('naruto');

  // Featured characters for mockups
  const featuredCharacters = [
    characterResults.find(c => c.id === 'naruto')!,
    characterResults.find(c => c.id === 'violet')!,
    characterResults.find(c => c.id === 'zero-two')!,
  ];

  const currentCharacter = characterResults.find(c => c.id === selectedCharacter) || featuredCharacters[0];

  return (
    <div className="min-h-screen py-12" style={{ backgroundColor: 'var(--background)' }}>
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black mb-4" style={{ color: 'var(--foreground)' }}>
              Shareable Result Card Designs
            </h1>
            <p className="text-xl mb-2" style={{ color: 'var(--secondary)' }}>
              Instagram Story Format (1080×1920px)
            </p>
            <p className="text-lg" style={{ color: 'var(--muted)' }}>
              Design mockups for council-meeting spec - Task 2
            </p>
          </div>

          {/* Design Principles */}
          <div 
            className="p-8 rounded-2xl mb-12"
            style={{ backgroundColor: 'var(--card-background)' }}
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
              Design Principles
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <div className="text-4xl mb-2">✨</div>
                <h3 className="font-bold mb-1" style={{ color: 'var(--foreground)' }}>
                  Instagram-worthy
                </h3>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                  Beautiful enough to post on your story
                </p>
              </div>
              <div>
                <div className="text-4xl mb-2">🎀</div>
                <h3 className="font-bold mb-1" style={{ color: 'var(--foreground)' }}>
                  Cute
                </h3>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                  Appeals to target demographic
                </p>
              </div>
              <div>
                <div className="text-4xl mb-2">🏷️</div>
                <h3 className="font-bold mb-1" style={{ color: 'var(--foreground)' }}>
                  Clear Branding
                </h3>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                  Subtle but present
                </p>
              </div>
              <div>
                <div className="text-4xl mb-2">📱</div>
                <h3 className="font-bold mb-1" style={{ color: 'var(--foreground)' }}>
                  Shareable
                </h3>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                  Easy to understand at a glance
                </p>
              </div>
            </div>
          </div>

          {/* Featured Mockups */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
              Featured Character Variations
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {featuredCharacters.map((character) => (
                <button
                  key={character.id}
                  onClick={() => setSelectedCharacter(character.id)}
                  className="text-left p-6 rounded-2xl transition-all hover:scale-105"
                  style={{
                    backgroundColor: selectedCharacter === character.id 
                      ? 'var(--card-background)' 
                      : 'var(--text-block)',
                    border: selectedCharacter === character.id 
                      ? `3px solid ${character.color}` 
                      : '3px solid transparent',
                  }}
                >
                  <div className="text-4xl mb-2">{character.emoji}</div>
                  <h3 className="font-bold text-lg mb-1" style={{ color: character.color }}>
                    {character.name}
                  </h3>
                  <p className="text-sm mb-2" style={{ color: 'var(--secondary)' }}>
                    {character.anime}
                  </p>
                  <div
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                    style={{
                      backgroundColor: character.color + '30',
                      color: character.color,
                    }}
                  >
                    {character.rarity.toUpperCase()}
                  </div>
                </button>
              ))}
            </div>

            {/* Large Preview */}
            <div className="flex justify-center">
              <div className="relative">
                <ShareableResultCard character={currentCharacter} />
                
                {/* Dimensions Label */}
                <div 
                  className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg text-sm font-mono"
                  style={{ 
                    backgroundColor: 'var(--card-background)',
                    color: 'var(--muted)',
                  }}
                >
                  1080×1920px (9:16 ratio)
                </div>
              </div>
            </div>
          </div>

          {/* All Characters Grid */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
              All Character Designs
            </h2>
            <p className="text-lg mb-8" style={{ color: 'var(--muted)' }}>
              Click any character to preview their shareable card design
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {characterResults.map((character) => (
                <button
                  key={character.id}
                  onClick={() => setSelectedCharacter(character.id)}
                  className="p-4 rounded-xl transition-all hover:scale-105 text-center"
                  style={{
                    backgroundColor: selectedCharacter === character.id 
                      ? 'var(--card-background)' 
                      : 'var(--text-block)',
                    border: selectedCharacter === character.id 
                      ? `2px solid ${character.color}` 
                      : '2px solid transparent',
                  }}
                >
                  <div className="text-3xl mb-2">{character.emoji}</div>
                  <div className="text-xs font-bold truncate" style={{ color: 'var(--foreground)' }}>
                    {character.name.split(' ')[0]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Design Specifications */}
          <div 
            className="mt-12 p-8 rounded-2xl"
            style={{ backgroundColor: 'var(--card-background)' }}
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
              Design Specifications
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-3" style={{ color: 'var(--foreground)' }}>
                  Layout Hierarchy
                </h3>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--muted)' }}>
                  <li>• <strong>Top 50%:</strong> Character image (hero element)</li>
                  <li>• <strong>Middle 30%:</strong> Personality traits with icons</li>
                  <li>• <strong>Bottom 20%:</strong> Branding, QR code, URL</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-3" style={{ color: 'var(--foreground)' }}>
                  Color System
                </h3>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--muted)' }}>
                  <li>• Character-themed gradient backgrounds</li>
                  <li>• High contrast text (WCAG AA compliant)</li>
                  <li>• Rarity-specific badge colors</li>
                  <li>• Text shadows for readability</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-3" style={{ color: 'var(--foreground)' }}>
                  Typography
                </h3>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--muted)' }}>
                  <li>• System font stack for fast loading</li>
                  <li>• Minimum 24px for mobile readability</li>
                  <li>• Bold weights for hierarchy</li>
                  <li>• Text shadows on gradients</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-3" style={{ color: 'var(--foreground)' }}>
                  QR Code
                </h3>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--muted)' }}>
                  <li>• 180×180px (scannable from phone)</li>
                  <li>• High contrast black on white</li>
                  <li>• Includes tracking parameters</li>
                  <li>• Rounded corners with shadow</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Success Criteria */}
          <div 
            className="mt-8 p-8 rounded-2xl"
            style={{ backgroundColor: 'var(--text-block)' }}
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
              ✅ Success Criteria
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--foreground)' }}>
                    Instagram-worthy design
                  </p>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>
                    Passes "would I share this?" test
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--foreground)' }}>
                    QR code scannable
                  </p>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>
                    Tested from phone screen at 6 inches
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--foreground)' }}>
                    Text readable
                  </p>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>
                    At Instagram Story size on mobile
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--foreground)' }}>
                    Branding visible
                  </p>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>
                    But not overwhelming ({"<"}10% of space)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div 
            className="mt-8 p-8 rounded-2xl text-center"
            style={{ 
              backgroundColor: 'var(--card-background)',
              borderLeft: '4px solid var(--btn-primary)',
            }}
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
              📋 Next Steps
            </h2>
            <p className="text-lg mb-4" style={{ color: 'var(--secondary)' }}>
              Design mockups complete! Ready for implementation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div 
                className="px-6 py-3 rounded-lg"
                style={{ backgroundColor: 'var(--text-block)' }}
              >
                <p className="font-semibold" style={{ color: 'var(--foreground)' }}>
                  Task 3: Component Infrastructure
                </p>
              </div>
              <div 
                className="px-6 py-3 rounded-lg"
                style={{ backgroundColor: 'var(--text-block)' }}
              >
                <p className="font-semibold" style={{ color: 'var(--foreground)' }}>
                  Task 4: Visual Implementation
                </p>
              </div>
              <div 
                className="px-6 py-3 rounded-lg"
                style={{ backgroundColor: 'var(--text-block)' }}
              >
                <p className="font-semibold" style={{ color: 'var(--foreground)' }}>
                  Task 5: Social Sharing
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
