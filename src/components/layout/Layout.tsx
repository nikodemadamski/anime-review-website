'use client';

import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileNavbar } from './MobileNavbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileNavbar />
    </div>
  );
};

export { Layout };