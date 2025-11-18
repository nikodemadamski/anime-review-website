// Extended Character Types and Configuration

export type CharacterRarity = 'legendary' | 'ultra-rare' | 'rare' | 'uncommon' | 'common';
export type CharacterCategory = 'male' | 'female' | 'creature' | 'object';

export interface ExtendedCharacter {
  id: string;
  name: string;
  anime: string;
  description: string;
  traits: string[];
  image: string;
  color: string;
  emoji: string;
  category: CharacterCategory;
  rarity: CharacterRarity;
  tags: string[];
  rarityWeight: number;
}

export const RARITY_CONFIG: Record<CharacterRarity, { weight: number; color: string; label: string }> = {
  legendary: {
    weight: 5,
    color: '#FFD700',
    label: 'Legendary'
  },
  'ultra-rare': {
    weight: 10,
    color: '#9370DB',
    label: 'Ultra Rare'
  },
  rare: {
    weight: 20,
    color: '#4169E1',
    label: 'Rare'
  },
  uncommon: {
    weight: 35,
    color: '#32CD32',
    label: 'Uncommon'
  },
  common: {
    weight: 40,
    color: '#808080',
    label: 'Common'
  }
};
