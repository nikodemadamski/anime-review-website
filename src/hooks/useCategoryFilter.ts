'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export type CategoryType = 'visual' | 'music' | 'story' | 'character' | null;

export function useCategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<CategoryType>(null);

  // Initialize from URL params
  useEffect(() => {
    const category = searchParams.get('category') as CategoryType;
    if (category && ['visual', 'music', 'story', 'character'].includes(category)) {
      setActiveCategory(category);
    }
  }, [searchParams]);

  const setCategory = (category: CategoryType) => {
    setActiveCategory(category);
    
    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    
    // Use replace to avoid adding to history
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const clearFilter = () => {
    setCategory(null);
  };

  return {
    activeCategory,
    setCategory,
    clearFilter,
    isFiltered: activeCategory !== null,
  };
}
