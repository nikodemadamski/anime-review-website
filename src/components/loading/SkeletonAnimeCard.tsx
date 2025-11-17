export function SkeletonAnimeCard() {
  return (
    <div 
      className="rounded-xl overflow-hidden animate-pulse"
      style={{ backgroundColor: 'var(--card-background)' }}
    >
      {/* Image skeleton */}
      <div 
        className="aspect-[3/4] relative"
        style={{ backgroundColor: 'var(--border)' }}
      >
        {/* Shimmer effect */}
        <div 
          className="absolute inset-0 shimmer"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            animation: 'shimmer 1.5s infinite'
          }}
        />
      </div>
      
      {/* Content skeleton */}
      <div className="p-3 space-y-2">
        <div 
          className="h-4 rounded"
          style={{ backgroundColor: 'var(--border)', width: '80%' }}
        />
        <div 
          className="h-3 rounded"
          style={{ backgroundColor: 'var(--border)', width: '60%' }}
        />
      </div>
    </div>
  );
}
