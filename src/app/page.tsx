'use client';

import { HeroSection } from '@/components/homepage/HeroSection';
import { TrendingSection } from '@/components/homepage/TrendingSection';
import { HowWeRateSection } from '@/components/homepage/HowWeRateSection';
import { TopRatedCategorySection } from '@/components/homepage/TopRatedCategorySection';
import { QuizCTASection } from '@/components/homepage/QuizCTASection';
import { EmailSignupSection } from '@/components/homepage/EmailSignupSection';

import { MobileHome } from '@/components/mobile/MobileHome';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Mobile Layout */}
      <div className="md:hidden">
        <MobileHome />
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        {/* Hero Section */}
        <HeroSection />

        {/* Top Rated Categories (Mini Browse) - Moved Up */}
        <div className="relative z-10">
          <TopRatedCategorySection />
        </div>

        {/* Trending Section */}
        <div className="relative z-10">
          <TrendingSection />
        </div>

        {/* Quiz CTA Section */}
        <div className="relative z-10">
          <QuizCTASection />
        </div>

        {/* How We Rate Section */}
        <div className="relative z-10">
          <HowWeRateSection />
        </div>

        {/* Email Signup Section */}
        <div className="relative z-10">
          <EmailSignupSection />
        </div>
      </div>
    </main>
  );
}
