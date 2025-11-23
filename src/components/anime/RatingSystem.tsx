import React from 'react';

interface SegmentedProgressBarProps {
    score: number; // 0 to 10
    color: string; // Tailwind text color class, e.g., "text-blue-500"
}

export function SegmentedProgressBar({ score, color }: SegmentedProgressBarProps) {
    // Extract the color name (e.g., "blue-500") from "text-blue-500"
    const colorName = color.replace('text-', '');
    const filledSegments = Math.floor(score);
    const decimalPart = score - filledSegments;

    return (
        <div className="flex gap-1 w-full h-3">
            {[...Array(10)].map((_, index) => {
                const isFull = index < filledSegments;
                const isPartial = index === filledSegments && decimalPart > 0;

                return (
                    <div
                        key={index}
                        className="flex-1 bg-secondary/20 rounded-sm overflow-hidden relative"
                    >
                        {isFull && (
                            <div className={`absolute inset-0 bg-${colorName}`} />
                        )}
                        {isPartial && (
                            <div
                                className={`absolute inset-y-0 left-0 bg-${colorName}`}
                                style={{ width: `${decimalPart * 100}%` }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
