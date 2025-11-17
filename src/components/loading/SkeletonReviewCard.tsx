export function SkeletonReviewCard() {
  return (
    <div 
      className="rounded-xl p-4 animate-pulse border"
      style={{ 
        backgroundColor: 'var(--card-background)',
        borderColor: 'var(--border)'
      }}
    >
      {/* Header with avatar and name */}
      <div className="flex items-start gap-3 mb-3">
        <div 
          className="w-12 h-16 rounded-lg flex-shrink-0"
          style={{ backgroundColor: 'var(--border)' }}
        />
        <div className="flex-1 space-y-2">
          <div 
            className="h-4 rounded"
            style={{ backgroundColor: 'var(--border)', width: '60%' }}
          />
          <div 
            className="h-3 rounded"
            style={{ backgroundColor: 'var(--border)', width: '40%' }}
          />
        </div>
      </div>
      
      {/* Review content */}
      <div className="space-y-2">
        <div 
          className="h-3 rounded"
          style={{ backgroundColor: 'var(--border)', width: '100%' }}
        />
        <div 
          className="h-3 rounded"
          style={{ backgroundColor: 'var(--border)', width: '90%' }}
        />
        <div 
          className="h-3 rounded"
          style={{ backgroundColor: 'var(--border)', width: '70%' }}
        />
      </div>
    </div>
  );
}
