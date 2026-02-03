import React from 'react';

export function EntropyMeter({ entropy, combinations, id }) {
    // Analyze strength variables
    let strength = 'Very Weak';
    let color = '#EF4444'; // Red
    let widthStr = '5%';
    let isDemon = false;

    const safeEntropy = entropy || 0;

    // Thresholds & Logic
    if (safeEntropy > 200) {
        strength = 'Absolute Demon';
        color = '#D946EF'; // Fuchsia base (Paranoiac color)
        widthStr = 'calc(100% + 4rem)'; // Full overflow
        isDemon = true;
    } else if (safeEntropy > 150) {
        strength = 'Paranoiac';
        color = '#D946EF'; // Fuchsia
        widthStr = 'calc(100% + 4rem)'; // Full overflow
    } else if (safeEntropy > 120) {
        strength = 'Overkill';
        color = '#8b5cf6'; // Violet
        widthStr = 'calc(100% + 2rem)'; // Half overflow
    } else if (safeEntropy > 80) {
        strength = 'Excellent';
        color = '#10B981'; // Green
        widthStr = `${Math.min(100, (safeEntropy / 100) * 100)}%`;
    } else {
        // Standard scaling (< 80)
        if (safeEntropy > 50) { strength = 'Strong'; color = '#4FD8FF'; }
        else if (safeEntropy > 35) { strength = 'Medium'; color = '#FBBF24'; }
        else if (safeEntropy > 20) { strength = 'Weak'; color = '#F97316'; }

        widthStr = `${Math.min(100, Math.max(5, (safeEntropy / 100) * 100))}%`;
    }

    return (
        <div className="w-full mt-2 flex flex-col gap-2" id={id}>
            {/* Centered Label */}
            <span className="label-text text-center w-full block mb-1" id={id ? `${id}-label` : undefined}>
                Security Strength
            </span>

            <div className="flex items-center gap-4 relative">
                {/* Left: Strength Info */}
                <div className="flex flex-col items-start shrink-0 min-w-[120px]" style={{ flexShrink: 0 }}>
                    <span
                        className="font-bold uppercase tracking-wider text-sm transition-colors duration-200"
                        key={strength}
                        style={{ color }}
                        id={id ? `${id}-strength` : undefined}
                    >
                        {strength}
                    </span>
                    <span className="text-muted text-xs font-mono whitespace-nowrap" id={id ? `${id}-bits` : undefined}>
                        {Math.round(safeEntropy)} bits
                        {combinations && (
                            <span className="opacity-60 ml-1" title="Combinations">
                                • {new Intl.NumberFormat('en-US', { notation: "scientific", maximumSignificantDigits: 3 }).format(combinations)}
                            </span>
                        )}
                    </span>
                </div>

                {/* Right: Bar Track with Reserved Margin */}
                {/* mr-16 = 4rem, reserving space for the Paranoiac overflow */}
                <div
                    className="relative flex-1 mr-16"
                    id={id ? `${id}-bar-container` : undefined}
                >
                    {/* The Track (Background) - Ends at 100% */}
                    <div
                        className="rounded-full w-full"
                        style={{
                            height: '6px',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }}
                    />

                    {/* The Fill - Can exceed 100% */}
                    <div
                        id={id ? `${id}-bar-fill` : undefined}
                        className="rounded-full absolute left-0 top-0 transition-all duration-500 ease-out flex items-center overflow-hidden"
                        style={{
                            height: '6px',
                            width: widthStr,
                            backgroundColor: color, // Base color
                            boxShadow: (safeEntropy > 100 || isDemon) ? `0 0 15px ${color}` : 'none',
                            zIndex: 10
                        }}
                    >
                        {/* Helix Effect for Absolute Demon */}
                        {isDemon && (
                            <div
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.8) 5px, rgba(0,0,0,0.8) 10px)',
                                    animation: 'helixMove 20s linear infinite'
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes helixMove {
                    from { background-position: 0 0; }
                    to { background-position: 200px 0; }
                }
            `}</style>
        </div>
    );
}
