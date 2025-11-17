'use client';

import { useRef } from 'react';
import { CharacterResult, RARITY_CONFIG } from '@/data/quiz-data';
import html2canvas from 'html2canvas';
import Image from 'next/image';

interface DownloadResultCardProps {
  character: CharacterResult;
  userName: string;
}

export function DownloadResultCard({ character, userName }: DownloadResultCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const downloadImage = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#1a1a2e',
        scale: 2,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `${character.name.replace(/\s+/g, '-')}-quiz-result.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  const rarityInfo = RARITY_CONFIG[character.rarity];

  return (
    <div>
      <div
        ref={cardRef}
        className="p-8 rounded-3xl relative overflow-hidden"
        style={{
          backgroundColor: '#1a1a2e',
          borderWidth: '4px',
          borderColor: character.color,
          minWidth: '400px',
        }}
      >
        {/* Rarity Badge - Top */}
        <div className="flex justify-center mb-4">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              backgroundColor: rarityInfo.color + '30',
              borderWidth: '2px',
              borderColor: rarityInfo.color,
            }}
          >
            <span className="text-2xl">{rarityInfo.emoji}</span>
            <span className="font-black text-sm uppercase" style={{ color: rarityInfo.color }}>
              {rarityInfo.label}
            </span>
          </div>
        </div>

        {/* Character Image */}
        <div className="relative w-48 h-48 mx-auto mb-6 rounded-2xl overflow-hidden border-4 shadow-xl" style={{ borderColor: character.color }}>
          <Image
            src={character.image}
            alt={character.name}
            fill
            className="object-cover"
            sizes="192px"
            crossOrigin="anonymous"
          />
        </div>

        {/* Character Info */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">{character.emoji}</div>
          <h2 className="text-3xl font-black mb-2" style={{ color: character.color }}>
            {userName || 'You'} got {character.name}!
          </h2>
          <p className="text-xl mb-4 text-gray-300">
            from {character.anime}
          </p>
        </div>

        {/* Traits */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {character.traits.map((trait) => (
            <span
              key={trait}
              className="px-3 py-1.5 rounded-full font-semibold text-sm capitalize"
              style={{
                backgroundColor: character.color,
                color: '#FFFFFF',
              }}
            >
              {trait}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-center text-gray-300 text-sm leading-relaxed">
          {character.description}
        </p>

        {/* Branding Footer */}
        <div className="mt-6 pt-4 border-t border-gray-700 text-center">
          <p className="text-xs text-gray-400">
            AnimeReviews.com • Which Anime Character Are You?
          </p>
        </div>
      </div>

      <button
        onClick={downloadImage}
        className="mt-4 w-full px-6 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2"
        style={{
          backgroundColor: character.color,
          color: '#FFFFFF',
        }}
      >
        <span className="text-2xl">📥</span>
        <span>Download Result Card</span>
      </button>
    </div>
  );
}
