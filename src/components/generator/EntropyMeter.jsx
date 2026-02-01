import React from 'react';

export function EntropyMeter({ entropy, combinations, id }) {
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
    else if (safeEntropy > 50) { strength = 'Strong'; color = '#4FD8FF'; } // Cyan (Hex for consistency)
    else if (safeEntropy > 35) { strength = 'Medium'; color = '#FBBF24'; } // Amber
    else if (safeEntropy > 20) { strength = 'Weak'; color = '#F97316'; } // Orange (Hex for consistency)
    else { strength = 'Very Weak'; color = '#EF4444'; }

    // Visual bar width (capped at 100% for ~128 bits)
    const percentage = Math.min(100, (safeEntropy / 128) * 100);

    return (
        <div className="w-full mt-4" id={id}>
            <div className="flex justify-between mb-1" id={id ? `${id}-header` : undefined}>
                <span className="label-text" id={id ? `${id}-label` : undefined}>Security Strength</span>
                <span
                    className="label-text transition-colors duration-200"
                    key={strength} // Force re-render on text change to ensure color updates
                    style={{ color, fontWeight: 'bold' }}
                    id={id ? `${id}-strength` : undefined}
                >
                    {strength}
                    <span className="text-muted font-normal ml-2" id={id ? `${id}-bits` : undefined}>
                        ({Math.round(safeEntropy)} bits)
                        {combinations && (
                            <span className="opacity-70 ml-1" title="Combinations (Search Space)">
                                • {new Intl.NumberFormat('en-US', { notation: "scientific", maximumSignificantDigits: 3 }).format(combinations)} combs
                            </span>
                        )}
                    </span>
                </span>
            </div>
            <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden" id={id ? `${id}-bar-bg` : undefined}>
                <div
                    id={id ? `${id}-bar-fill` : undefined}
                    className="h-full transition-all duration-500 ease-out"
                    style={{ width: `${Math.max(5, percentage)}%`, backgroundColor: color }}
                />
            </div>
        </div>
    );
}
