import React from 'react';

interface SegmentedProgressBarProps {
    score: number; // 0 to 10
    color: string; // Tailwind text color class, e.g., "text-blue-500"
}

export function SegmentedProgressBar({ score, color }: SegmentedProgressBarProps) {
    // Map text colors to background colors for Tailwind JIT
    const colorMap: Record<string, string> = {
        'text-blue-500': 'bg-blue-500',
        'text-pink-500': 'bg-pink-500',
        'text-orange-500': 'bg-orange-500',
        'text-violet-500': 'bg-violet-500',
        'text-yellow-500': 'bg-yellow-500',
        'text-cyan-500': 'bg-cyan-500',
    };

    const bgClass = colorMap[color] || 'bg-primary';
    const filledSegments = Math.floor(score);
    const decimalPart = score - filledSegments;

    return (
        <div className="flex gap-1 w-full h-4">
            {[...Array(10)].map((_, index) => {
                const isFull = index < filledSegments;
                const isPartial = index === filledSegments && decimalPart > 0;

                return (
                    <div
                        key={index}
                        className="flex-1 bg-secondary/20 rounded-sm overflow-hidden relative"
                    >
                        {isFull && (
                            <div className={`absolute inset-0 ${bgClass}`} />
                        )}
                        {isPartial && (
                            <div
                                className={`absolute inset-y-0 left-0 ${bgClass}`}
                                style={{ width: `${decimalPart * 100}%` }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
