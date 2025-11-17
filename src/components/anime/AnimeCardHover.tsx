interface AnimeCardHoverProps {
  title: string;
  ratings: {
    visual: number;
    music: number;
    story: number;
    character: number;
    site: number;
  };
  description?: string;
  genres?: string[];
}

const categoryConfig = {
  visual: { color: '#FF6B9D', label: 'Visual', icon: '👁️' },
  music: { color: '#9D4EDD', label: 'Music', icon: '🎵' },
  story: { color: '#06B6D4', label: 'Story', icon: '📖' },
  character: { color: '#F59E0B', label: 'Character', icon: '👥' },
};

export function AnimeCardHover({ title, ratings, description, genres }: AnimeCardHoverProps) {
  return (
    <div 
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      style={{
        background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 60%, transparent 100%)'
      }}
    >
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
        {/* Title */}
        <h4 className="font-bold text-white text-sm line-clamp-2">
          {title}
        </h4>

        {/* Category Ratings */}
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(categoryConfig).map(([key, config]) => {
            const rating = ratings[key as keyof typeof ratings];
            
            return (
              <div key={key} className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-lg"
                  style={{ backgroundColor: config.color }}
                >
                  {rating.toFixed(1)}
                </div>
                <div className="flex-1">
                  <p className="text-white text-xs font-semibold">{config.label}</p>
                  <div 
                    className="h-1 rounded-full mt-0.5"
                    style={{ 
                      width: `${(rating / 10) * 100}%`,
                      backgroundColor: config.color 
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Description Preview */}
        {description && (
          <p className="text-white/80 text-xs line-clamp-2">
            {description}
          </p>
        )}

        {/* Genres */}
        {genres && genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {genres.slice(0, 3).map((genre) => (
              <span 
                key={genre}
                className="px-2 py-0.5 rounded text-[10px] font-semibold"
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white'
                }}
              >
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
