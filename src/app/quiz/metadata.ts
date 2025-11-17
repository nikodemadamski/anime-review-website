import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Which Anime Character Are You? | Personality Quiz',
  description: 'Take our viral anime personality quiz and discover which character matches your personality! 18 characters, 8 questions, 2 minutes. Join 10,000+ people who found their match!',
  keywords: ['anime quiz', 'personality quiz', 'which anime character', 'anime personality test', 'character quiz', 'anime test'],
  openGraph: {
    title: 'Which Anime Character Are You? 🎭',
    description: 'Take the viral personality quiz! 18 characters • 2 minutes • Easy to share',
    type: 'website',
    url: '/quiz',
    images: [
      {
        url: '/quiz/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Which Anime Character Are You? Quiz',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Which Anime Character Are You? 🎭',
    description: 'Take the viral personality quiz! 18 characters • 2 minutes • Easy to share',
    images: ['/quiz/opengraph-image'],
  },
};
