export function SkeletonAnimeCard() {
  return (
    <div 
      className="rounded-xl overflow-hidden animate-pulse"
      style={{ backgroundColor: 'var(--card-background)' }}
    >
      {/* Image skeleton - matching browse page 2:3 aspect ratio */}
      <div 
        className="aspect-[2/3] relative"
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
      
      {/* Content skeleton - matching browse page card layout */}
      <div className="p-4 space-y-3">
        {/* Title skeleton */}
        <div 
          className="h-5 rounded"
          style={{ backgroundColor: 'var(--border)', width: '85%' }}
        />
        <div 
          className="h-5 rounded"
          style={{ backgroundColor: 'var(--border)', width: '60%' }}
        />
        
        {/* Genre tags skeleton */}
        <div className="flex gap-1 pt-1">
          <div 
            className="h-6 rounded-full"
            style={{ backgroundColor: 'var(--border)', width: '60px' }}
          />
          <div 
            className="h-6 rounded-full"
            style={{ backgroundColor: 'var(--border)', width: '70px' }}
          />
          <div 
            className="h-6 rounded-full"
            style={{ backgroundColor: 'var(--border)', width: '55px' }}
          />
        </div>
        
        {/* Button skeleton */}
        <div 
          className="h-10 rounded-lg mt-3"
          style={{ backgroundColor: 'var(--border)' }}
        />
      </div>
    </div>
  );
}
