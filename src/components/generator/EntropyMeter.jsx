import React from 'react';

export function EntropyMeter({ entropy, combinations, id }) {
    // Analyze strength variables
    let strength = 'Very Weak';
    let color = '#EF4444'; // Red
    let widthStr = '5%';
    let isDemon = false;

    const safeEntropy = entropy || 0;
    const percentage = (safeEntropy / 100) * 100;

    // Thresholds & Logic
    // widthStr is now SECTION-relative (not container-relative) because fill is positioned in the row
    if (safeEntropy > 200) {
        strength = 'Absolute Demon';
        color = '#D946EF'; // Fuchsia base (Paranoiac color)
        widthStr = 'calc(100% - 136px)'; // Reaches end of section
        isDemon = true;
    } else if (safeEntropy > 150) {
        strength = 'Paranoiac';
        color = '#D946EF'; // Fuchsia
        widthStr = 'calc(100% - 136px)'; // Reaches end of section
    } else if (safeEntropy > 120) {
        strength = 'Overkill';
        color = '#8b5cf6'; // Violet
        widthStr = 'calc(75% - 136px)'; // Midway between track end (50%) and section end (100%)
    } else if (safeEntropy > 80) {
        strength = 'Excellent';
        color = '#10B981'; // Green
        // Scale within track (0-50% of section = 0-100% of track)
        widthStr = `calc(${Math.min(50, (safeEntropy / 100) * 50)}% - 136px)`;
    } else {
        // Standard scaling (< 80)
        if (safeEntropy > 50) { strength = 'Strong'; color = '#4FD8FF'; }
        else if (safeEntropy > 35) { strength = 'Medium'; color = '#FBBF24'; }
        else if (safeEntropy > 20) { strength = 'Weak'; color = '#F97316'; }

        // Scale within track (0-50% of section)
        widthStr = `calc(${Math.min(50, Math.max(2.5, (safeEntropy / 100) * 50))}% - 136px)`;
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

                {/* Track Container - Just the background track */}
                <div
                    className="relative"
                    id={id ? `${id}-bar-container` : undefined}
                    style={{ width: 'calc(50% - 136px)' }}
                >
                    {/* The Track (Background) - Ends at 50% of section. Hidden if overflow */}
                    <div
                        className="rounded-full w-full transition-opacity duration-300"
                        style={{
                            height: '6px',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            opacity: percentage > 100 ? 0 : 1
                        }}
                    />
                </div>

                {/* The Fill Bar - Positioned absolutely in the ROW, so % is section-relative */}
                <div
                    id={id ? `${id}-bar-fill` : undefined}
                    className="rounded-full absolute transition-all duration-500 ease-out flex items-center overflow-hidden"
                    style={{
                        height: '6px',
                        width: widthStr,
                        backgroundColor: color,
                        boxShadow: (safeEntropy > 100 || isDemon) ? `0 0 15px ${color}` : 'none',
                        zIndex: 10,
                        left: '136px',
                        top: '50%',
                        transform: 'translateY(-50%)'
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

            <style>{`
                @keyframes helixMove {
                    from { background-position: 0 0; }
                    to { background-position: 200px 0; }
                }
            `}</style>
        </div>
    );
}
