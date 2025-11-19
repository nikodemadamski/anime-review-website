'use client';

import React from 'react';

interface ViewModeToggleProps {
  currentMode: 'large' | 'grid' | 'list';
  onChange: (mode: 'large' | 'grid' | 'list') => void;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ currentMode, onChange }) => {
  const handleKeyDown = (e: React.KeyboardEvent, mode: 'large' | 'grid' | 'list') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(mode);
    }
  };

  return (
    <div 
      className="flex gap-2 mb-4" 
      role="group" 
      aria-label="View mode toggle"
    >
      {/* Large View Button */}
      <button
        onClick={() => onChange('large')}
        onKeyDown={(e) => handleKeyDown(e, 'large')}
        aria-label="Large view - one anime per screen"
        aria-pressed={currentMode === 'large'}
        style={{
          backgroundColor: currentMode === 'large' ? 'var(--accent)' : 'var(--card-background)',
          color: currentMode === 'large' ? '#FFFFFF' : 'var(--foreground)',
          borderWidth: '2px',
          borderColor: currentMode === 'large' ? 'var(--accent)' : 'var(--border)',
        }}
        className="flex-1 h-11 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 hover:opacity-80"
      >
        {/* Large view icon - single square */}
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect 
            x="3" 
            y="3" 
            width="14" 
            height="14" 
            rx="2" 
            stroke="currentColor" 
            strokeWidth="2"
          />
        </svg>
        <span className="text-sm">Large</span>
      </button>

      {/* Grid View Button */}
      <button
        onClick={() => onChange('grid')}
        onKeyDown={(e) => handleKeyDown(e, 'grid')}
        aria-label="Grid view - four anime per screen"
        aria-pressed={currentMode === 'grid'}
        style={{
          backgroundColor: currentMode === 'grid' ? 'var(--accent)' : 'var(--card-background)',
          color: currentMode === 'grid' ? '#FFFFFF' : 'var(--foreground)',
          borderWidth: '2px',
          borderColor: currentMode === 'grid' ? 'var(--accent)' : 'var(--border)',
        }}
        className="flex-1 h-11 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 hover:opacity-80"
      >
        {/* Grid view icon - 2x2 grid */}
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
          <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
          <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
          <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
        </svg>
        <span className="text-sm">Grid</span>
      </button>

      {/* List View Button */}
      <button
        onClick={() => onChange('list')}
        onKeyDown={(e) => handleKeyDown(e, 'list')}
        aria-label="List view - compact list with all ratings"
        aria-pressed={currentMode === 'list'}
        style={{
          backgroundColor: currentMode === 'list' ? 'var(--accent)' : 'var(--card-background)',
          color: currentMode === 'list' ? '#FFFFFF' : 'var(--foreground)',
          borderWidth: '2px',
          borderColor: currentMode === 'list' ? 'var(--accent)' : 'var(--border)',
        }}
        className="flex-1 h-11 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 hover:opacity-80"
      >
        {/* List view icon - three horizontal lines */}
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <line x1="3" y1="5" x2="17" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="3" y1="15" x2="17" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="text-sm">List</span>
      </button>
    </div>
  );
};

export default ViewModeToggle;
