import React from 'react';

export function EntropyMeter({ entropy }) {
    // Analyze strength based on bits
    let strength = 'Very Weak';
    let color = '#EF4444'; // Red

    // Typical Entropy: 
    // 8 chars alphanumeric ~47 bits
    // 12 chars ~70 bits (Strong)
    // 16 chars ~95 bits (Excellent)

    const safeEntropy = entropy || 0;

    if (safeEntropy > 120) { strength = 'Overkill'; color = '#8b5cf6'; } // Violet
    else if (safeEntropy > 80) { strength = 'Excellent'; color = '#10B981'; } // Green
    else if (safeEntropy > 50) { strength = 'Strong'; color = 'var(--secondary)'; } // Cyan
    else if (safeEntropy > 35) { strength = 'Medium'; color = '#FBBF24'; } // Amber
    else if (safeEntropy > 20) { strength = 'Weak'; color = 'var(--tertiary)'; } // Orange
    else { strength = 'Very Weak'; color = '#EF4444'; }

    // Visual bar width (capped at 100% for ~128 bits)
    const percentage = Math.min(100, (safeEntropy / 128) * 100);

    return (
        <div className="w-full mt-4">
            <div className="flex justify-between mb-1">
                <span className="label-text">Security Strength</span>
                <span className="label-text" style={{ color, fontWeight: 'bold' }}>{strength} <span className="text-muted font-normal">({Math.round(safeEntropy)} bits)</span></span>
            </div>
            <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                <div
                    className="h-full transition-all duration-500 ease-out"
                    style={{ width: `${Math.max(5, percentage)}%`, backgroundColor: color }}
                />
            </div>
        </div>
    );
}
