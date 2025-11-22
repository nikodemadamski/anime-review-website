'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';

export function HeroLogo() {
  const { theme } = useTheme();

  return (
    <div className="flex justify-center mb-6">
      <Image
        src={theme === 'dark' ? '/logo-dark.png' : '/logo-light.png'}
        alt="Anime Review Logo"
        width={80}
        height={80}
        className="rounded-3xl shadow-2xl"
      />
    </div>
  );
}