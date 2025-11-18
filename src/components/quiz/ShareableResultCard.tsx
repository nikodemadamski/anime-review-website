'use client';

import { CharacterResult, RARITY_CONFIG } from '@/data/quiz-data';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';

interface ShareableResultCardProps {
  character: CharacterResult;
  showForDownload?: boolean;
}

/**
 * Shareable Result Card Component
 * 
 * Designed for Instagram Story format (1080x1920px)
 * Optimized for social media sharing with:
 * - Character-themed gradient backgrounds
 * - High-quality character images
 * - Personality traits with icons
 * - QR code for easy sharing
 * - Clear branding
 */
export function ShareableResultCard({ 
  character, 
  showForDownload = false 
}: ShareableResultCardProps) {
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/quiz?ref=share&char=${character.id}`;
  
  // Character-specific gradient backgrounds
  const gradients: Record<string, string> = {
    // Legendary - Warm, Bold
    'goku': 'linear-gradient(135deg, #FF6B35 0%, #FF8C00 100%)',
    'naruto': 'linear-gradient(135deg, #FF6B35 0%, #FF8C00 100%)',
    'luffy': 'linear-gradient(135deg, #DC143C 0%, #FF6B35 100%)',
    'saitama': 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    'levi': 'linear-gradient(135deg, #2F4F4F 0%, #4A5568 100%)',
    'sailor-moon': 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)',
    'mikasa': 'linear-gradient(135deg, #DC143C 0%, #8B0000 100%)',
    'nezuko': 'linear-gradient(135deg, #FF1493 0%, #FF69B4 100%)',
    'anya': 'linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%)',
    'pikachu': 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    
    // Ultra-Rare - Elegant, Mysterious
    'violet': 'linear-gradient(135deg, #9370DB 0%, #DDA0DD 100%)',
    'yor': 'linear-gradient(135deg, #DC143C 0%, #8B0000 100%)',
    'makima': 'linear-gradient(135deg, #FFD700 0%, #FF6B9D 100%)',
    'mai': 'linear-gradient(135deg, #9370DB 0%, #B19CD9 100%)',
    'death-note': 'linear-gradient(135deg, #000000 0%, #2C2C2C 100%)',
    
    // Rare - Vibrant, Energetic
    'light': 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
    'edward': 'linear-gradient(135deg, #FFD700 0%, #DAA520 100%)',
    'ichigo': 'linear-gradient(135deg, #FF8C00 0%, #FF6347 100%)',
    'eren': 'linear-gradient(135deg, #228B22 0%, #32CD32 100%)',
    'tanjiro': 'linear-gradient(135deg, #228B22 0%, #006400 100%)',
    'zero-two': 'linear-gradient(135deg, #FF1493 0%, #FF69B4 100%)',
    'rem': 'linear-gradient(135deg, #87CEEB 0%, #B0E0E6 100%)',
    'hinata': 'linear-gradient(135deg, #9370DB 0%, #BA55D3 100%)',
    'power': 'linear-gradient(135deg, #FF69B4 0%, #FFB6C1 100%)',
    'nami': 'linear-gradient(135deg, #FF8C00 0%, #FFA500 100%)',
  };

  const gradient = gradients[character.id] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  const rarityConfig = RARITY_CONFIG[character.rarity];

  // Trait icons mapping
  const traitIcons: Record<string, string> = {
    'determined': '💪',
    'brave': '🦸',
    'strong': '⚡',
    'intelligent': '🧠',
    'kind': '💝',
    'caring': '🌸',
    'loyal': '🛡️',
    'friendly': '😊',
    'energetic': '⚡',
    'calm': '😌',
    'mysterious': '🌙',
    'social': '👥',
    'protective': '🛡️',
    'analytical': '🔍',
    'empathetic': '💕',
    'curious': '🔭',
    'peaceful': '☮️',
    'creative': '🎨',
    'wise': '📚',
    'passionate': '🔥',
    'unique': '✨',
    'optimistic': '🌟',
    'emotional': '💗',
    'disciplined': '🎯',
    'powerful': '💎',
    'humble': '🙏',
    'elegant': '👑',
    'strategic': '♟️',
    'ambitious': '🎯',
    'persistent': '🔥',
    'rebellious': '⚔️',
    'shy': '🌺',
    'chaotic': '🌪️',
    'funny': '😄',
    'resourceful': '🧰',
    'innocent': '🌼',
    'cute': '🎀',
  };

  return (
    <div
      id="shareable-card"
      className="relative overflow-hidden"
      style={{
        width: showForDownload ? '1080px' : '100%',
        aspectRatio: '9/16',
        maxWidth: showForDownload ? '1080px' : '600px',
        background: gradient,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Subtle background pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Content Container */}
      <div className="relative h-full flex flex-col items-center justify-between p-12">
        
        {/* Top Section: Rarity Badge */}
        <div className="flex-shrink-0 mt-8">
          <div
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full animate-pulse"
            style={{
              backgroundColor: rarityConfig.color + '30',
              border: `4px solid ${rarityConfig.color}`,
              boxShadow: `0 8px 32px ${rarityConfig.color}66`,
            }}
          >
            <span className="text-4xl">{rarityConfig.emoji}</span>
            <span 
              className="font-black text-2xl uppercase tracking-wider"
              style={{ color: rarityConfig.color }}
            >
              {rarityConfig.label}
            </span>
          </div>
        </div>

        {/* Middle Section: Character Image */}
        <div className="flex-shrink-0 my-8">
          <div
            className="relative overflow-hidden"
            style={{
              width: showForDownload ? '700px' : 'min(70vw, 350px)',
              height: showForDownload ? '700px' : 'min(70vw, 350px)',
              borderRadius: '40px',
              border: '8px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}
          >
            <Image
              src={character.image}
              alt={character.name}
              fill
              className="object-cover"
              sizes={showForDownload ? '700px' : '350px'}
              unoptimized={showForDownload}
            />
            {/* Gradient overlay for depth */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, transparent 60%, rgba(0, 0, 0, 0.3) 100%)',
              }}
            />
          </div>
        </div>

        {/* Personality Section */}
        <div className="flex-shrink-0 text-center px-8 py-6">
          {/* Heading */}
          <h1 
            className="font-black mb-4"
            style={{
              fontSize: showForDownload ? '72px' : 'clamp(32px, 8vw, 48px)',
              lineHeight: '1.1',
              color: '#FFFFFF',
              textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
              letterSpacing: '-0.02em',
            }}
          >
            You are a<br />{character.name}!
          </h1>

          {/* Character Emoji */}
          <div 
            className="mb-6"
            style={{ fontSize: showForDownload ? '80px' : 'clamp(40px, 10vw, 60px)' }}
          >
            {character.emoji}
          </div>

          {/* Personality Traits Grid */}
          <div 
            className="grid gap-4 mb-6"
            style={{
              gridTemplateColumns: 'repeat(2, 1fr)',
              maxWidth: showForDownload ? '600px' : '400px',
              margin: '0 auto',
            }}
          >
            {character.traits.slice(0, 4).map((trait) => (
              <div
                key={trait}
                className="flex items-center justify-center gap-3 px-6 py-3 rounded-full"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                <span style={{ fontSize: showForDownload ? '32px' : '24px' }}>
                  {traitIcons[trait] || '✨'}
                </span>
                <span
                  className="font-semibold capitalize"
                  style={{
                    fontSize: showForDownload ? '28px' : 'clamp(14px, 3vw, 20px)',
                    color: '#FFFFFF',
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  {trait}
                </span>
              </div>
            ))}
          </div>

          {/* Anime Name */}
          <p
            className="font-bold"
            style={{
              fontSize: showForDownload ? '36px' : 'clamp(18px, 4vw, 28px)',
              color: 'rgba(255, 255, 255, 0.95)',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            }}
          >
            From {character.anime}
          </p>
        </div>

        {/* Bottom Section: Branding */}
        <div className="flex-shrink-0 text-center pb-8">
          {/* Logo placeholder */}
          <div 
            className="font-black mb-4"
            style={{
              fontSize: showForDownload ? '48px' : 'clamp(24px, 5vw, 36px)',
              color: '#FFFFFF',
              textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
              letterSpacing: '0.05em',
            }}
          >
            ANIME QUIZ
          </div>

          {/* QR Code */}
          <div 
            className="inline-block p-4 rounded-3xl mb-4"
            style={{
              backgroundColor: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            }}
          >
            <QRCodeSVG
              value={shareUrl}
              size={showForDownload ? 180 : 120}
              level="H"
              includeMargin={false}
            />
          </div>

          {/* Website URL */}
          <p
            className="font-bold mb-2"
            style={{
              fontSize: showForDownload ? '32px' : 'clamp(16px, 3.5vw, 24px)',
              color: '#FFFFFF',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            }}
          >
            yoursite.com/quiz
          </p>

          {/* CTA */}
          <p
            className="font-semibold"
            style={{
              fontSize: showForDownload ? '28px' : 'clamp(14px, 3vw, 20px)',
              color: 'rgba(255, 255, 255, 0.9)',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            }}
          >
            Take the quiz to find your character!
          </p>
        </div>
      </div>
    </div>
  );
}
