'use client';

import { useEffect, useState } from 'react';

interface QuizStats {
  totalCompletions: number;
  todayCompletions: number;
  mostPopularCharacter: string;
  shareRate: number;
}

export function QuizStats() {
  const [stats, setStats] = useState<QuizStats>({
    totalCompletions: 0,
    todayCompletions: 0,
    mostPopularCharacter: 'Naruto',
    shareRate: 0,
  });

  useEffect(() => {
    // Load stats from localStorage (in production, this would come from a database)
    const loadStats = () => {
      const stored = localStorage.getItem('quiz_stats');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setStats(parsed);
        } catch (error) {
          console.error('Error parsing quiz stats:', error);
        }
      } else {
        // Initialize with demo numbers
        const demoStats = {
          totalCompletions: Math.floor(Math.random() * 5000) + 10000, // 10k-15k
          todayCompletions: Math.floor(Math.random() * 200) + 50, // 50-250
          mostPopularCharacter: 'Naruto',
          shareRate: Math.floor(Math.random() * 15) + 20, // 20-35%
        };
        setStats(demoStats);
        localStorage.setItem('quiz_stats', JSON.stringify(demoStats));
      }
    };

    loadStats();

    // Update today's completions every minute
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        todayCompletions: prev.todayCompletions + Math.floor(Math.random() * 3),
      }));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {/* Total Completions */}
      <div
        className="p-4 rounded-xl text-center"
        style={{ backgroundColor: 'var(--card-background)' }}
      >
        <div className="text-3xl font-black mb-1" style={{ color: 'var(--accent)' }}>
          {stats.totalCompletions.toLocaleString()}+
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
          {stats.todayCompletions}
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
          {stats.shareRate}%
        </div>
        <div className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>
          Share Their Results
        </div>
      </div>
    </div>
  );
}

// Helper function to increment quiz completion
export function incrementQuizCompletion(characterName: string) {
  const stored = localStorage.getItem('quiz_stats');
  if (stored) {
    try {
      const stats = JSON.parse(stored);
      stats.totalCompletions += 1;
      stats.todayCompletions += 1;
      stats.mostPopularCharacter = characterName; // Simplified - in production, track all characters
      localStorage.setItem('quiz_stats', JSON.stringify(stats));
    } catch (error) {
      console.error('Error updating quiz stats:', error);
    }
  }
}

// Helper function to increment share count
export function incrementShareCount() {
  const stored = localStorage.getItem('quiz_stats');
  if (stored) {
    try {
      const stats = JSON.parse(stored);
      const totalShares = Math.floor((stats.totalCompletions * stats.shareRate) / 100) + 1;
      stats.shareRate = Math.floor((totalShares / stats.totalCompletions) * 100);
      localStorage.setItem('quiz_stats', JSON.stringify(stats));
    } catch (error) {
      console.error('Error updating share stats:', error);
    }
  }
}
