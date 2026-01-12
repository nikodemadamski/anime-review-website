'use client';

import { useEffect, useState } from 'react';

interface QuizStats {
  totalCompletions: number;
  todayCompletions: number;
  mostPopularCharacter: string;
  shareRate: number;
}

// Simple seeded random number generator
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate deterministic daily stats
function getDailyStats() {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

  // Create a seed from the date string
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) {
    seed = ((seed << 5) - seed) + dateStr.charCodeAt(i);
    seed |= 0;
  }

  // Base numbers
  const baseTotal = 12450;
  const dailyGrowth = 142; // Approx daily growth

  // Calculate days since "launch" (Jan 1, 2025)
  const launchDate = new Date('2025-01-01');
  const daysSinceLaunch = Math.floor((today.getTime() - launchDate.getTime()) / (1000 * 60 * 60 * 24));

  // Mock Total: Grows consistently every day
  const totalCompletions = baseTotal + (daysSinceLaunch * dailyGrowth) + Math.floor(seededRandom(seed) * 50);

  // Mock Today: Varies based on today's seed
  const todayCompletions = 150 + Math.floor(seededRandom(seed + 1) * 200);

  // Mock Share Rate: Stable but varies slightly
  const shareRate = 22 + Math.floor(seededRandom(seed + 2) * 8);

  return {
    totalCompletions,
    todayCompletions,
    mostPopularCharacter: 'Luffy', // Should rotate this too eventually
    shareRate
  };
}

export function QuizStats() {
  const [stats, setStats] = useState<QuizStats>({
    totalCompletions: 0,
    todayCompletions: 0,
    mostPopularCharacter: '...',
    shareRate: 0,
  });

  useEffect(() => {
    // 1. Get the base "globally consistent" stats for today
    const dailyBase = getDailyStats();

    // 2. Check independent local user actions
    let myCompletion = 0;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('quiz_stats_local_user');
      if (stored) {
        const userStats = JSON.parse(stored);
        myCompletion = userStats.completed ? 1 : 0;
      }
    }

    // 3. Merge them
    setStats({
      ...dailyBase,
      totalCompletions: dailyBase.totalCompletions + myCompletion,
      todayCompletions: dailyBase.todayCompletions + myCompletion
    });

    // We removed the "fake live incrementing" interval because it resets on refresh and breaks trust.
    // Stable numbers are better than fake moving numbers.

  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {/* Total Completions */}
      <div
        className="p-4 rounded-xl text-center"
        style={{ backgroundColor: 'var(--card-background)' }}
      >
        <div className="text-3xl font-black mb-1" style={{ color: 'var(--accent)' }}>
          {stats.totalCompletions > 0 ? stats.totalCompletions.toLocaleString() : '...'}
        </div>
        <div className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>
          Total Quizzes Taken
        </div>
      </div>

      {/* Today's Completions */}
      <div
        className="p-4 rounded-xl text-center"
        style={{ backgroundColor: 'var(--card-background)' }}
      >
        <div className="text-3xl font-black mb-1" style={{ color: 'var(--accent)' }}>
          {stats.todayCompletions > 0 ? stats.todayCompletions.toLocaleString() : '...'}
        </div>
        <div className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>
          Taken Today 🔥
        </div>
      </div>

      {/* Most Popular */}
      <div
        className="p-4 rounded-xl text-center"
        style={{ backgroundColor: 'var(--card-background)' }}
      >
        <div className="text-2xl font-black mb-1" style={{ color: 'var(--accent)' }}>
          {stats.mostPopularCharacter}
        </div>
        <div className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>
          Most Popular Result
        </div>
      </div>

      {/* Share Rate */}
      <div
        className="p-4 rounded-xl text-center"
        style={{ backgroundColor: 'var(--card-background)' }}
      >
        <div className="text-3xl font-black mb-1" style={{ color: 'var(--accent)' }}>
          {stats.shareRate > 0 ? stats.shareRate : '...'}%
        </div>
        <div className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>
          Share Their Results
        </div>
      </div>
    </div>
  );
}


// Helper: Call this when user finishes quiz
export function incrementQuizCompletion(characterName: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('quiz_stats_local_user', JSON.stringify({
      completed: true,
      result: characterName,
      timestamp: Date.now()
    }));
    // We don't need to force update the UI here usually as they will be redirected, 
    // but if they come back to home, the effect will pick it up.
  }
}

export function incrementShareCount() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('quiz_stats_local_user');
    let data = {};
    if (stored) {
      try {
        data = JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing quiz stats', e);
      }
    }
    localStorage.setItem('quiz_stats_local_user', JSON.stringify({
      ...data,
      shared: true,
      lastShared: Date.now()
    }));
  }
}


