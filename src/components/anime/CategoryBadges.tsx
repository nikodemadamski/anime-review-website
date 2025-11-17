interface CategoryBadgesProps {
  ratings: {
    visual: number;
    music: number;
    story: number;
    character: number;
  };
  size?: 'mini' | 'small' | 'medium';
  showLabels?: boolean;
}

const categoryConfig = {
  visual: { color: '#FF6B9D', label: 'V', fullLabel: 'Visual' },
  music: { color: '#9D4EDD', label: 'M', fullLabel: 'Music' },
  story: { color: '#06B6D4', label: 'S', fullLabel: 'Story' },
  character: { color: '#F59E0B', label: 'C', fullLabel: 'Character' },
};

export function CategoryBadges({ ratings, size = 'mini', showLabels = false }: CategoryBadgesProps) {
  const sizes = {
    mini: 'w-6 h-6 text-[10px]',
    small: 'w-8 h-8 text-xs',
    medium: 'w-10 h-10 text-sm',
  };

  return (
    <div className="flex items-center gap-1">
      {Object.entries(categoryConfig).map(([key, config]) => {
        const rating = ratings[key as keyof typeof ratings];
        
        return (
          <div
            key={key}
            className={`${sizes[size]} rounded-lg flex items-center justify-center font-bold text-white shadow-sm`}
            style={{ backgroundColor: config.color }}
            title={`${config.fullLabel}: ${rating.toFixed(1)}`}
          >
            {showLabels ? config.label : rating.toFixed(1)}
          </div>
        );
      })}
    </div>
  );
}
