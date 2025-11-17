// Anime Character Personality Quiz Data

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    traits: string[]; // personality traits this answer represents
  }[];
}

export interface CharacterResult {
  id: string;
  name: string;
  anime: string;
  description: string;
  traits: string[];
  image: string;
  color: string;
  emoji: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary';
  rarityWeight: number;
}

export const RARITY_CONFIG = {
  'legendary': { emoji: '👑', color: '#FFD700', weight: 5, label: 'LEGENDARY' },
  'ultra-rare': { emoji: '💎', color: '#9D4EDD', weight: 10, label: 'ULTRA RARE' },
  'rare': { emoji: '⭐', color: '#FF6B9D', weight: 20, label: 'RARE' },
  'uncommon': { emoji: '✨', color: '#06B6D4', weight: 30, label: 'UNCOMMON' },
  'common': { emoji: '🎭', color: '#8A867E', weight: 35, label: 'COMMON' }
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "It's Saturday morning. What are you doing?",
    options: [
      { text: "Training or working out 💪", traits: ["determined", "strong", "disciplined"] },
      { text: "Reading or studying 📚", traits: ["intelligent", "curious", "analytical"] },
      { text: "Hanging with friends 🎉", traits: ["social", "friendly", "energetic"] },
      { text: "Relaxing at home 🏠", traits: ["calm", "introverted", "peaceful"] },
    ]
  },
  {
    id: 2,
    question: "Your friend is in trouble. What do you do?",
    options: [
      { text: "Jump in immediately to help! 🦸", traits: ["brave", "loyal", "protective"] },
      { text: "Make a strategic plan first 🧠", traits: ["intelligent", "analytical", "careful"] },
      { text: "Rally everyone to help together 👥", traits: ["social", "leader", "friendly"] },
      { text: "Offer emotional support 💝", traits: ["kind", "empathetic", "caring"] },
    ]
  },
  {
    id: 3,
    question: "Pick your ideal superpower:",
    options: [
      { text: "Super strength 💥", traits: ["strong", "determined", "brave"] },
      { text: "Mind reading 🧠", traits: ["intelligent", "curious", "analytical"] },
      { text: "Invisibility 👻", traits: ["mysterious", "introverted", "observant"] },
      { text: "Healing powers ✨", traits: ["kind", "caring", "empathetic"] },
    ]
  },
  {
    id: 4,
    question: "How do you handle stress?",
    options: [
      { text: "Face it head-on! 🔥", traits: ["brave", "determined", "strong"] },
      { text: "Think it through logically 🤔", traits: ["intelligent", "analytical", "calm"] },
      { text: "Talk to friends about it 💬", traits: ["social", "friendly", "open"] },
      { text: "Take time alone to process 🌙", traits: ["introverted", "peaceful", "reflective"] },
    ]
  },
  {
    id: 5,
    question: "What's your biggest strength?",
    options: [
      { text: "Never giving up 💪", traits: ["determined", "strong", "persistent"] },
      { text: "Problem-solving skills 🧩", traits: ["intelligent", "analytical", "creative"] },
      { text: "Making people smile 😊", traits: ["friendly", "kind", "energetic"] },
      { text: "Staying calm under pressure 😌", traits: ["calm", "peaceful", "wise"] },
    ]
  },
  {
    id: 6,
    question: "Pick a color that speaks to you:",
    options: [
      { text: "Red - Passionate & Bold 🔴", traits: ["brave", "energetic", "determined"] },
      { text: "Blue - Calm & Intelligent 🔵", traits: ["intelligent", "calm", "analytical"] },
      { text: "Yellow - Happy & Social ⭐", traits: ["friendly", "energetic", "social"] },
      { text: "Purple - Mysterious & Unique 💜", traits: ["mysterious", "creative", "unique"] },
    ]
  },
  {
    id: 7,
    question: "What's your ideal weekend activity?",
    options: [
      { text: "Adventure or sports 🏃", traits: ["energetic", "brave", "active"] },
      { text: "Museum or learning something new 🎨", traits: ["curious", "intelligent", "cultured"] },
      { text: "Party or social gathering 🎊", traits: ["social", "friendly", "outgoing"] },
      { text: "Cozy time with a good book/show 📖", traits: ["introverted", "peaceful", "reflective"] },
    ]
  },
  {
    id: 8,
    question: "How do your friends describe you?",
    options: [
      { text: "The brave protector 🛡️", traits: ["brave", "loyal", "protective"] },
      { text: "The smart one 🎓", traits: ["intelligent", "wise", "analytical"] },
      { text: "The life of the party 🎉", traits: ["social", "energetic", "fun"] },
      { text: "The kind listener 👂", traits: ["kind", "empathetic", "caring"] },
    ]
  }
];

export const characterResults: CharacterResult[] = [
  // LEGENDARY CHARACTERS (Most Iconic)
  {
    id: "goku",
    name: "Son Goku",
    anime: "Dragon Ball Z",
    description: "You're the ultimate warrior! Pure-hearted, always training, and you love a good fight. You protect everyone and never give up!",
    traits: ["strong", "determined", "friendly", "brave", "optimistic"],
    image: "https://cdn.myanimelist.net/images/characters/7/284129.jpg",
    color: "#FF8C00",
    emoji: "🥋",
    rarity: "legendary",
    rarityWeight: 5
  },
  {
    id: "naruto",
    name: "Naruto Uzumaki",
    anime: "Naruto",
    description: "You're determined, energetic, and never give up! Like Naruto, you face challenges head-on with unwavering optimism and inspire others with your passion.",
    traits: ["determined", "brave", "energetic", "loyal", "friendly"],
    image: "https://s4.anilist.co/file/anilistcdn/character/large/b17-IazKGogQwJ1p.png",
    color: "#FF6B35",
    emoji: "🍜",
    rarity: "legendary",
    rarityWeight: 5
  },
  {
    id: "luffy",
    name: "Monkey D. Luffy",
    anime: "One Piece",
    description: "You're adventurous, free-spirited, and fiercely loyal to your friends! Like Luffy, you live life to the fullest and never back down from protecting those you care about.",
    traits: ["brave", "loyal", "energetic", "friendly", "determined"],
    image: "https://cdn.myanimelist.net/images/characters/9/310307.jpg",
    color: "#DC143C",
    emoji: "🏴‍☠️",
    rarity: "legendary",
    rarityWeight: 5
  },
  {
    id: "saitama",
    name: "Saitama",
    anime: "One Punch Man",
    description: "You're incredibly strong but surprisingly chill! Like Saitama, you don't need to show off - your actions speak louder than words.",
    traits: ["strong", "calm", "humble", "powerful", "peaceful"],
    image: "https://cdn.myanimelist.net/images/characters/11/294388.jpg",
    color: "#FFD700",
    emoji: "👊",
    rarity: "legendary",
    rarityWeight: 5
  },
  {
    id: "levi",
    name: "Levi Ackerman",
    anime: "Attack on Titan",
    description: "You're humanity's strongest soldier! Disciplined, skilled, and fiercely protective of those you care about.",
    traits: ["strong", "disciplined", "brave", "protective", "determined"],
    image: "https://cdn.myanimelist.net/images/characters/2/241413.jpg",
    color: "#2F4F4F",
    emoji: "⚔️",
    rarity: "legendary",
    rarityWeight: 5
  },
  {
    id: "sailor-moon",
    name: "Usagi (Sailor Moon)",
    anime: "Sailor Moon",
    description: "You're the champion of love and justice! Kind-hearted, emotional, and always fighting for what's right.",
    traits: ["kind", "brave", "emotional", "caring", "optimistic"],
    image: "https://cdn.myanimelist.net/images/characters/8/379533.jpg",
    color: "#FFB6C1",
    emoji: "🌙",
    rarity: "legendary",
    rarityWeight: 5
  },
  {
    id: "mikasa",
    name: "Mikasa Ackerman",
    anime: "Attack on Titan",
    description: "You're fiercely protective and incredibly skilled! Like Mikasa, you're loyal to those you love and unstoppable in battle.",
    traits: ["strong", "loyal", "protective", "brave", "determined"],
    image: "https://cdn.myanimelist.net/images/characters/9/215563.jpg",
    color: "#DC143C",
    emoji: "🧣",
    rarity: "legendary",
    rarityWeight: 5
  },
  {
    id: "nezuko",
    name: "Nezuko Kamado",
    anime: "Demon Slayer",
    description: "You're adorable, protective, and surprisingly strong! Like Nezuko, you care deeply for your family and friends.",
    traits: ["kind", "protective", "strong", "loyal", "caring"],
    image: "https://cdn.myanimelist.net/images/characters/3/378286.jpg",
    color: "#FF1493",
    emoji: "🎀",
    rarity: "legendary",
    rarityWeight: 5
  },
  {
    id: "anya",
    name: "Anya Forger",
    anime: "Spy x Family",
    description: "You can read minds! You're cute, funny, and love peanuts! Waku waku!",
    traits: ["curious", "friendly", "energetic", "funny", "innocent"],
    image: "https://cdn.myanimelist.net/images/characters/3/457748.jpg",
    color: "#FFB6C1",
    emoji: "🥜",
    rarity: "legendary",
    rarityWeight: 5
  },
  {
    id: "pikachu",
    name: "Pikachu",
    anime: "Pokémon",
    description: "Pika pika! You're cute, electric, and everyone's favorite! Loyal and full of energy!",
    traits: ["friendly", "energetic", "loyal", "brave", "cute"],
    image: "https://cdn.myanimelist.net/images/characters/5/330893.jpg",
    color: "#FFD700",
    emoji: "⚡",
    rarity: "legendary",
    rarityWeight: 5
  },
  
  // ULTRA RARE CHARACTERS (Extremely Beautiful/Unique)
  {
    id: "violet",
    name: "Violet Evergarden",
    anime: "Violet Evergarden",
    description: "You're kind, empathetic, and deeply caring. Like Violet, you may seem reserved but have a beautiful heart and help others understand their emotions.",
    traits: ["kind", "caring", "empathetic", "calm", "loyal"],
    image: "https://cdn.myanimelist.net/images/characters/9/345616.jpg",
    color: "#9370DB",
    emoji: "💌",
    rarity: "ultra-rare",
    rarityWeight: 10
  },
  {
    id: "yor",
    name: "Yor Forger",
    anime: "Spy x Family",
    description: "You're elegant, deadly, and surprisingly caring! Like Yor, you're a perfect balance of grace and strength.",
    traits: ["strong", "kind", "protective", "elegant", "loyal"],
    image: "https://cdn.myanimelist.net/images/characters/10/457747.jpg",
    color: "#DC143C",
    emoji: "🗡️",
    rarity: "ultra-rare",
    rarityWeight: 10
  },
  {
    id: "makima",
    name: "Makima",
    anime: "Chainsaw Man",
    description: "You're mysterious, powerful, and captivating. Like Makima, people are drawn to your enigmatic presence.",
    traits: ["intelligent", "mysterious", "powerful", "calm", "strategic"],
    image: "https://cdn.myanimelist.net/images/characters/7/494969.jpg",
    color: "#FFD700",
    emoji: "🔗",
    rarity: "ultra-rare",
    rarityWeight: 10
  },
  {
    id: "mai",
    name: "Mai Sakurajima",
    anime: "Bunny Girl Senpai",
    description: "You're elegant, intelligent, and captivating. Like Mai, you command attention wherever you go.",
    traits: ["intelligent", "elegant", "calm", "caring", "mysterious"],
    image: "https://cdn.myanimelist.net/images/characters/3/371606.jpg",
    color: "#9370DB",
    emoji: "🐰",
    rarity: "ultra-rare",
    rarityWeight: 10
  },
  {
    id: "death-note",
    name: "The Death Note",
    anime: "Death Note",
    description: "You're powerful, mysterious, and dangerous! Like the Death Note, you have immense influence over others.",
    traits: ["powerful", "mysterious", "intelligent", "dark", "influential"],
    image: "https://cdn.myanimelist.net/images/anime/9/9453.jpg",
    color: "#000000",
    emoji: "📓",
    rarity: "ultra-rare",
    rarityWeight: 10
  },
  
  // RARE CHARACTERS (Popular & Well-Known)
  {
    id: "light",
    name: "Light Yagami",
    anime: "Death Note",
    description: "You're highly intelligent, strategic, and analytical. Like Light, you think several steps ahead and approach problems with logic and careful planning.",
    traits: ["intelligent", "analytical", "strategic", "ambitious", "calm"],
    image: "https://cdn.myanimelist.net/images/characters/6/63870.jpg",
    color: "#8B4513",
    emoji: "📓",
    rarity: "rare",
    rarityWeight: 20
  },
  {
    id: "edward",
    name: "Edward Elric",
    anime: "Fullmetal Alchemist",
    description: "You're determined, intelligent, and never give up on your goals! Like Edward, you combine brains and bravery to overcome any obstacle.",
    traits: ["determined", "intelligent", "brave", "loyal", "persistent"],
    image: "https://cdn.myanimelist.net/images/characters/9/72533.jpg",
    color: "#FFD700",
    emoji: "⚗️",
    rarity: "rare",
    rarityWeight: 20
  },
  {
    id: "ichigo",
    name: "Ichigo Kurosaki",
    anime: "Bleach",
    description: "You're brave, protective, and always ready to fight for what's right! Like Ichigo, you never back down from a challenge.",
    traits: ["brave", "protective", "strong", "determined", "loyal"],
    image: "https://cdn.myanimelist.net/images/characters/2/285788.jpg",
    color: "#FF8C00",
    emoji: "⚔️",
    rarity: "rare",
    rarityWeight: 20
  },
  {
    id: "eren",
    name: "Eren Yeager",
    anime: "Attack on Titan",
    description: "You're determined, passionate, and willing to do whatever it takes! Like Eren, you fight for freedom above all else.",
    traits: ["determined", "brave", "passionate", "strong", "rebellious"],
    image: "https://cdn.myanimelist.net/images/characters/10/216895.jpg",
    color: "#228B22",
    emoji: "🗡️",
    rarity: "rare",
    rarityWeight: 20
  },
  {
    id: "tanjiro",
    name: "Tanjiro Kamado",
    anime: "Demon Slayer",
    description: "You're kind, determined, and always put others first! Like Tanjiro, you have a pure heart and never give up.",
    traits: ["kind", "determined", "brave", "caring", "loyal"],
    image: "https://cdn.myanimelist.net/images/characters/4/377467.jpg",
    color: "#228B22",
    emoji: "🌊",
    rarity: "rare",
    rarityWeight: 20
  },
  {
    id: "zero-two",
    name: "Zero Two",
    anime: "Darling in the Franxx",
    description: "You're unique, passionate, and unforgettable! Like Zero Two, you're one of a kind and fiercely loyal to those you love.",
    traits: ["passionate", "unique", "brave", "loyal", "mysterious"],
    image: "https://cdn.myanimelist.net/images/characters/13/371574.jpg",
    color: "#FF1493",
    emoji: "🦖",
    rarity: "rare",
    rarityWeight: 20
  },
  {
    id: "rem",
    name: "Rem",
    anime: "Re:Zero",
    description: "You're loyal, caring, and would do anything for those you love! Like Rem, you're devoted and strong.",
    traits: ["loyal", "caring", "strong", "protective", "kind"],
    image: "https://cdn.myanimelist.net/images/characters/9/317513.jpg",
    color: "#87CEEB",
    emoji: "💙",
    rarity: "rare",
    rarityWeight: 20
  },
  {
    id: "hinata",
    name: "Hinata Hyuga",
    anime: "Naruto",
    description: "You're kind, shy, but incredibly strong when it matters! Like Hinata, you grow stronger through determination and love.",
    traits: ["kind", "shy", "determined", "loyal", "caring"],
    image: "https://cdn.myanimelist.net/images/characters/5/89531.jpg",
    color: "#9370DB",
    emoji: "👁️",
    rarity: "rare",
    rarityWeight: 20
  },
  {
    id: "power",
    name: "Power",
    anime: "Chainsaw Man",
    description: "You're chaotic, loud, and love your cat! Like Power, you're unpredictable but lovable.",
    traits: ["chaotic", "energetic", "funny", "loyal", "unique"],
    image: "https://cdn.myanimelist.net/images/characters/7/494971.jpg",
    color: "#FF69B4",
    emoji: "🩸",
    rarity: "rare",
    rarityWeight: 20
  },
  {
    id: "nami",
    name: "Nami",
    anime: "One Piece",
    description: "You're smart, resourceful, and love treasure! Like Nami, you're the navigator of your own destiny.",
    traits: ["intelligent", "resourceful", "brave", "caring", "ambitious"],
    image: "https://cdn.myanimelist.net/images/characters/5/315101.jpg",
    color: "#FF8C00",
    emoji: "🍊",
    rarity: "rare",
    rarityWeight: 20
  }
];

// Calculate which character matches best based on traits
export function calculateResult(answers: string[][]): CharacterResult {
  // Count trait occurrences
  const traitCounts: Record<string, number> = {};
  
  answers.flat().forEach(trait => {
    traitCounts[trait] = (traitCounts[trait] || 0) + 1;
  });

  // Find character with most matching traits
  let bestMatch = characterResults[0];
  let bestScore = 0;

  characterResults.forEach(character => {
    let score = 0;
    character.traits.forEach(trait => {
      score += traitCounts[trait] || 0;
    });

    if (score > bestScore) {
      bestScore = score;
      bestMatch = character;
    }
  });

  return bestMatch;
}
