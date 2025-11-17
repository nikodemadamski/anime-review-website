import React from 'react';
import { cn } from '@/utils/cn';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'overline';
  component?: keyof React.JSX.IntrinsicElements;
  children: React.ReactNode;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant = 'body', component, children, ...props }, ref) => {
    const variants = {
      h1: 'text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl',
      h2: 'text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl',
      h3: 'text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100',
      h4: 'text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100',
      h5: 'text-lg font-medium text-gray-900 dark:text-gray-100',
      h6: 'text-base font-medium text-gray-900 dark:text-gray-100',
      body: 'text-base text-gray-700 dark:text-gray-300 leading-relaxed',
      caption: 'text-sm text-gray-600 dark:text-gray-400',
      overline: 'text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-500',
    };

    // Default component mapping
    const defaultComponents = {
      h1: 'h1',
      h2: 'h2',
      h3: 'h3',
      h4: 'h4',
      h5: 'h5',
      h6: 'h6',
      body: 'p',
      caption: 'span',
      overline: 'span',
    } as const;

    const Component = (component || defaultComponents[variant]) as keyof React.JSX.IntrinsicElements;

    return React.createElement(
      Component,
      {
        className: cn(variants[variant], className),
        ref,
        ...props,
      },
      children
    );
  }
);

Typography.displayName = 'Typography';

export { Typography };