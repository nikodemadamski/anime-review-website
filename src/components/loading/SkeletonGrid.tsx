import { SkeletonAnimeCard } from './SkeletonAnimeCard';

interface SkeletonGridProps {
  count?: number;
  columns?: 2 | 3 | 4 | 6;
}

export function SkeletonGrid({ count = 6, columns = 6 }: SkeletonGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonAnimeCard key={i} />
      ))}
    </div>
  );
}
