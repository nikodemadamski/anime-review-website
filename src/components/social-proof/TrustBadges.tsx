interface TrustBadge {
  icon: string;
  label: string;
  description?: string;
}

interface TrustBadgesProps {
  layout?: 'horizontal' | 'vertical' | 'grid';
}

const defaultBadges: TrustBadge[] = [
  {
    icon: '👥',
    label: 'Community Driven',
    description: 'Built by anime fans, for anime fans'
  },
  {
    icon: '✅',
    label: '10,000+ Reviews',
    description: 'Comprehensive anime database'
  },
  {
    icon: '🔄',
    label: 'Updated Daily',
    description: 'Fresh content every day'
  },
  {
    icon: '🎯',
    label: '4-Category System',
    description: 'Detailed rating breakdown'
  }
];

export function TrustBadges({ layout = 'horizontal' }: TrustBadgesProps) {
  const layoutClasses = {
    horizontal: 'flex flex-wrap items-center justify-center gap-4',
    vertical: 'flex flex-col gap-3',
    grid: 'grid grid-cols-2 md:grid-cols-4 gap-4'
  };

  return (
    <div className={layoutClasses[layout]}>
      {defaultBadges.map((badge, index) => (
        <div
          key={index}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105"
          style={{
            backgroundColor: 'var(--card-background)',
            borderWidth: '1px',
            borderColor: 'var(--border)'
          }}
          title={badge.description}
        >
          <span className="text-xl">{badge.icon}</span>
          <span className="text-sm font-semibold whitespace-nowrap" style={{ color: 'var(--foreground)' }}>
            {badge.label}
          </span>
        </div>
      ))}
    </div>
  );
}
