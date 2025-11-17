'use client';

import { useState, useEffect } from 'react';
import { Container } from '@/components/ui';
import { quizQuestions, calculateResult, type CharacterResult } from '@/data/quiz-data';
import { trackQuizEvent } from '@/lib/analytics';
import { QuizStats, incrementQuizCompletion, incrementShareCount } from '@/components/quiz/QuizStats';
import { DownloadResultCard } from '@/components/quiz/DownloadResultCard';
import Image from 'next/image';
import Link from 'next/link';

export default function QuizPage() {
  const [started, setStarted] = useState(false);
  const [userName, setUserName] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[][]>([]);
  const [result, setResult] = useState<CharacterResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handleAnswer = (traits: string[]) => {
    const newAnswers = [...answers, traits];
    setAnswers(newAnswers);

    // Track question answered
    trackQuizEvent.questionAnswered(currentQuestion + 1, traits.join(', '));

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz complete - calculate result
      const characterResult = calculateResult(newAnswers);
      setResult(characterResult);
      setShowResult(true);
      
      // Track quiz completion
      trackQuizEvent.completed(characterResult.name, userName);
      incrementQuizCompletion(characterResult.name);
    }
  };



  const startQuiz = () => {
    if (userName.trim()) {
      setStarted(true);
      trackQuizEvent.started(userName);
    }
  };

  const restartQuiz = () => {
    trackQuizEvent.retaken();
    setStarted(false);
    setUserName('');
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setShowResult(false);
    setShowEmailModal(false);
  };

  const shareResult = () => {
    if (!result) return;
    
    const text = `I'm ${result.name} from ${result.anime}! ${result.emoji} I'm ${result.traits[0]}, ${result.traits[1]}, and ${result.traits[2]}! Take the quiz to find your anime character match!`;
    const url = window.location.origin + '/quiz';

    if (navigator.share) {
      navigator.share({
        title: 'Which Anime Character Are You?',
        text,
        url
      }).then(() => {
        trackQuizEvent.resultShared(result.name, 'native-share');
        incrementShareCount();
      });
    } else {
      // Fallback - Twitter share
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=AnimeQuiz,WhichAnimeCharacter,${result.anime.replace(/\s+/g, '')}`;
      window.open(twitterUrl, '_blank');
      trackQuizEvent.resultShared(result.name, 'twitter');
      incrementShareCount();
    }
  };

  const handleEmailSubmit = async (email: string) => {
    if (!result) return;
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          source: 'quiz',
          result: `${userName} is ${result.name}!`
        }),
      });

      if (response.ok) {
        setShowEmailModal(false);
        trackQuizEvent.emailCaptured(result.name);
        alert('Success! Check your email for your result and anime recommendations! 🎉');
      }
    } catch (error) {
      console.error('Email submission error:', error);
    }
  };

  if (showResult && result) {
    return (
      <div className="min-h-screen py-12" style={{ backgroundColor: 'var(--background)' }}>
        <Container>
          <div className="max-w-2xl mx-auto">
            {/* Result Card */}
            <div 
              className="rounded-3xl p-8 shadow-2xl border-4 animate-fade-in-up"
              style={{
                backgroundColor: 'var(--card-background)',
                borderColor: result.color
              }}
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{result.emoji}</div>
                <h1 className="text-4xl font-black mb-2" style={{ color: result.color }}>
                  {userName} is {result.name}!
                </h1>
                <p className="text-xl font-semibold mb-3" style={{ color: 'var(--secondary)' }}>
                  from {result.anime}
                </p>
              </div>

              {/* Character Image */}
              <div 
                className="relative w-48 h-48 mx-auto mb-6 rounded-2xl overflow-hidden border-4 shadow-xl flex items-center justify-center"
                style={{ 
                  borderColor: result.color,
                  background: `linear-gradient(135deg, ${result.color}20 0%, ${result.color}40 100%)`
                }}
              >
                <Image
                  src={result.image}
                  alt={result.name}
                  fill
                  className="object-cover"
                  sizes="192px"
                  onError={(e) => {
                    // Fallback to emoji if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <div className="text-9xl pointer-events-none">{result.emoji}</div>
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
                  YOUR TRAITS
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

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Download Result Card - NEW! */}
                <DownloadResultCard character={result} userName={userName} />

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={shareResult}
                    className="flex-1 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: result.color,
                      color: '#FFFFFF'
                    }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share Result
                  </button>
                  <button
                    onClick={restartQuiz}
                    className="flex-1 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
                    style={{
                      backgroundColor: 'var(--btn-secondary)',
                      color: 'var(--btn-secondary-text)',
                      borderWidth: '2px',
                      borderColor: 'var(--border)'
                    }}
                  >
                    Retake Quiz
                  </button>
                </div>

                {/* Shareable Link */}
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/quiz/result/${result.id}`;
                    navigator.clipboard.writeText(url);
                    alert('Shareable link copied! 📋 Anyone can view this character result.');
                  }}
                  className="w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: 'var(--text-block)',
                    color: 'var(--foreground)'
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Copy Shareable Link
                </button>
              </div>

              {/* Email Capture CTA */}
              <button
                onClick={() => setShowEmailModal(true)}
                className="block w-full mt-6 text-center px-6 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 border-2"
                style={{
                  backgroundColor: 'var(--text-block)',
                  borderColor: result.color,
                  color: 'var(--foreground)'
                }}
              >
                📧 Get Your Result + Anime Recommendations via Email
              </button>

              {/* Browse Anime CTA */}
              <Link
                href="/browse"
                className="block mt-4 text-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: 'var(--card-background)',
                  color: 'var(--foreground)'
                }}
              >
                Browse Anime Like {result.anime} →
              </Link>
            </div>

            {/* Email Modal */}
            {showEmailModal && (
              <>
                <div 
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
                  onClick={() => setShowEmailModal(false)}
                />
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div 
                    className="max-w-md w-full rounded-3xl p-8 shadow-2xl border-4 animate-fade-in-up"
                    style={{
                      backgroundColor: 'var(--card-background)',
                      borderColor: result.color
                    }}
                  >
                    <div className="text-center mb-6">
                      <div className="text-5xl mb-4">📬</div>
                      <h3 className="text-2xl font-black mb-2" style={{ color: 'var(--foreground)' }}>
                        Get Your Result!
                      </h3>
                      <p style={{ color: 'var(--secondary)' }}>
                        We'll send you your result + personalized anime recommendations based on your personality!
                      </p>
                    </div>

                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const email = (e.target as any).email.value;
                      handleEmailSubmit(email);
                    }}>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email..."
                        required
                        className="w-full px-6 py-4 rounded-xl text-base border-2 transition-all duration-300 focus:outline-none mb-4"
                        style={{
                          backgroundColor: 'var(--background)',
                          borderColor: 'var(--border)',
                          color: 'var(--foreground)',
                        }}
                      />

                      <button
                        type="submit"
                        className="w-full px-6 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg mb-3"
                        style={{
                          backgroundColor: result.color,
                          color: '#FFFFFF',
                        }}
                      >
                        Send Me My Result! ✨
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowEmailModal(false)}
                        className="w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                        style={{
                          backgroundColor: 'var(--text-block)',
                          color: 'var(--foreground)',
                        }}
                      >
                        Maybe Later
                      </button>
                    </form>

                    <p className="text-xs text-center mt-4" style={{ color: 'var(--muted)' }}>
                      We respect your privacy. Unsubscribe anytime.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </Container>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];
  // Welcome Screen
  if (!started) {
    return (
      <div className="min-h-screen py-12" style={{ backgroundColor: 'var(--background)' }}>
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-8xl mb-6 animate-bounce">🎭</div>
              <h1 className="text-5xl md:text-6xl font-black mb-4" style={{ color: 'var(--foreground)' }}>
                Which Anime Character Are You?
              </h1>
              <p className="text-xl mb-6" style={{ color: 'var(--secondary)' }}>
                Discover your anime personality in just 8 fun questions!
              </p>
            </div>

            {/* Quiz Stats */}
            <QuizStats />

            {/* Name Input Card */}
            <div 
              className="rounded-3xl p-8 shadow-xl border-2 animate-fade-in-up"
              style={{
                backgroundColor: 'var(--card-background)',
                borderColor: 'var(--border)'
              }}
            >
              <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--foreground)' }}>
                What's your name?
              </h2>
              
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && startQuiz()}
                placeholder="Enter your name..."
                className="w-full px-6 py-4 rounded-xl text-lg border-2 transition-all duration-300 focus:outline-none focus:scale-105 mb-6"
                style={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                }}
                autoFocus
              />

              <button
                onClick={startQuiz}
                disabled={!userName.trim()}
                className="w-full px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'var(--btn-primary)',
                  color: 'var(--btn-primary-text)',
                }}
              >
                Start Quiz ✨
              </button>

              <p className="text-center text-sm mt-4" style={{ color: 'var(--muted)' }}>
                Your result will be personalized with your name!
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              {[
                { emoji: '⚡', text: 'Takes 2 minutes' },
                { emoji: '🎨', text: 'Beautiful results' },
                { emoji: '📱', text: 'Easy to share' },
              ].map((feature, i) => (
                <div 
                  key={i}
                  className="text-center p-4 rounded-xl"
                  style={{ backgroundColor: 'var(--card-background)' }}
                >
                  <div className="text-3xl mb-2">{feature.emoji}</div>
                  <p className="font-semibold" style={{ color: 'var(--foreground)' }}>
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <div className="min-h-screen py-12" style={{ backgroundColor: 'var(--background)' }}>
      <Container>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-bounce">🎭</div>
            <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ color: 'var(--foreground)' }}>
              Which Anime Character Are You?
            </h1>
            <p className="text-lg" style={{ color: 'var(--secondary)' }}>
              Answer {quizQuestions.length} fun questions to discover your anime personality!
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>
                Question {currentQuestion + 1} of {quizQuestions.length}
              </span>
              <span className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                {Math.round(progress)}%
              </span>
            </div>
            <div 
              className="w-full h-3 rounded-full overflow-hidden"
              style={{ backgroundColor: 'var(--border)' }}
            >
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: 'var(--accent)'
                }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div 
            className="rounded-3xl p-8 shadow-xl border-2 animate-fade-in-up"
            style={{
              backgroundColor: 'var(--card-background)',
              borderColor: 'var(--border)'
            }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center" style={{ color: 'var(--foreground)' }}>
              {question.question}
            </h2>

            <div className="space-y-4">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.traits)}
                  className="w-full p-6 rounded-2xl font-semibold text-lg text-left transition-all duration-300 hover:scale-105 hover:shadow-xl border-2"
                  style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.backgroundColor = 'var(--text-block)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.backgroundColor = 'var(--background)';
                  }}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>

          {/* Back Button */}
          {currentQuestion > 0 && (
            <button
              onClick={() => {
                setCurrentQuestion(currentQuestion - 1);
                setAnswers(answers.slice(0, -1));
              }}
              className="mt-6 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto"
              style={{
                backgroundColor: 'var(--card-background)',
                color: 'var(--foreground)',
                borderWidth: '2px',
                borderColor: 'var(--border)'
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
          )}
        </div>
      </Container>
    </div>
  );
}
