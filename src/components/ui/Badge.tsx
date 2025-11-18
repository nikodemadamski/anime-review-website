import React from 'react';
import { cn } from '@/utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'site' | 'visual' | 'music' | 'story' | 'character';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center font-medium rounded-full transition-colors';
    
    const variants = {
      default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      error: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      site: 'text-white',
      visual: 'text-white',
      music: 'text-white',
      story: 'text-white',
      character: 'text-white',
    };
    
    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
    };

    // Category color mapping
    const categoryColors: Record<string, string> = {
      site: '#C8A34E',
      visual: '#FF6B9D',
      music: '#9D4EDD',
      story: '#06B6D4',
      character: '#F59E0B',
    };

    // Apply inline style for category variants
    const style = categoryColors[variant] 
      ? { backgroundColor: categoryColors[variant] }
      : undefined;

    return (
      <span
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        style={style}
        ref={ref}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };