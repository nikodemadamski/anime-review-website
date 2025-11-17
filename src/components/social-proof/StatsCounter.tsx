'use client';

import { useEffect, useState, useRef } from 'react';

interface StatsCounterProps {
  value: number;
  label: string;
  icon?: string;
  duration?: number;
  suffix?: string;
}

export function StatsCounter({ value, label, icon, duration = 2000, suffix = '' }: StatsCounterProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * value);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(value);
      }
    };

    requestAnimationFrame(updateCount);
  }, [isVisible, value, duration]);

  // Format large numbers (1000 -> 1K, 1000000 -> 1M)
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div ref={ref} className="flex items-center gap-2">
      {icon && <span className="text-2xl">{icon}</span>}
      <div className="text-left">
        <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>
          {formatNumber(count)}{suffix}
        </p>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          {label}
        </p>
      </div>
    </div>
  );
}
