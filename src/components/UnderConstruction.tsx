'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui';

interface UnderConstructionProps {
  pageName?: string;
  revolutLink?: string;
}

// Replace this with your actual Revolut payment link
const DEFAULT_REVOLUT_LINK = 'https://revolut.me/yourhandle';

export const UnderConstruction: React.FC<UnderConstructionProps> = ({ 
  pageName = 'This page',
  revolutLink = DEFAULT_REVOLUT_LINK
}) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      <Container size="sm">
        <div className="text-center space-y-8">
          {/* Construction Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                <svg 
                  className="w-12 h-12 text-yellow-600 dark:text-yellow-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                  />
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <svg 
                  className="w-5 h-5 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
              Under Construction
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {pageName} is currently being built. Check back soon!
            </p>
          </div>

          {/* Buy Me a Coffee Button */}
          <div className="pt-4">
            <a
              href={revolutLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white text-sm rounded-full transition-all duration-300 hover:scale-105 shadow-lg font-medium"
            >
              <svg 
                className="w-4 h-4" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M2 21h19v-3H2v3zM20 8H4V6h16v2zm0-4H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-1 9H5V7h14v6z"/>
              </svg>
              Buy Me a Coffee
            </a>
          </div>

          {/* Back to Home */}
          <div className="pt-4">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};
