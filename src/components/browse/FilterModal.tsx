'use client';

import { useEffect } from 'react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function FilterModal({ isOpen, onClose, children }: FilterModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // ESC key handler
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
        aria-label="Close filters"
      />
      
      {/* Mobile Bottom Sheet */}
      <div 
        role="dialog"
        aria-label="Filter options"
        aria-modal="true"
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden animate-slide-up"
      >
        <div 
          className="rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
          style={{
            backgroundColor: 'var(--card-background)',
            boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.2)',
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
              Filters
            </h2>
            <button
              onClick={onClose}
              aria-label="Close filters"
              className="text-2xl w-10 h-10 flex items-center justify-center rounded-lg transition-colors"
              style={{ color: 'var(--secondary)' }}
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>
          {children}
        </div>
      </div>
      
      {/* Desktop Modal */}
      <div 
        role="dialog"
        aria-label="Filter options"
        aria-modal="true"
        className="hidden md:block fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl animate-scale-in"
      >
        <div 
          className="rounded-2xl p-8 max-h-[85vh] overflow-y-auto"
          style={{
            backgroundColor: 'var(--card-background)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
              Filters
            </h2>
            <button
              onClick={onClose}
              aria-label="Close filters"
              className="text-2xl w-10 h-10 flex items-center justify-center rounded-lg transition-colors hover:bg-opacity-10"
              style={{ color: 'var(--secondary)' }}
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
