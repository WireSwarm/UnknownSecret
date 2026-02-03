import React from 'react';

export function EntropyMeter({ entropy, combinations, id, isPostQuantum }) {
    // Analyze strength variables
    let strength = 'Very Weak';
    let color = '#EF4444'; // Red
    let widthStr = '5%';
    let isDemon = false;
    let barColor = color;
    let textGlow = 'none';

    const rawEntropy = entropy || 0;
    // Post-Quantum Logic: Effective entropy is halved (Grover's algo: sqrt(N) -> bits/2)
    const safeEntropy = isPostQuantum ? rawEntropy / 2 : rawEntropy;
    const percentage = (safeEntropy / 100) * 100;

    // Thresholds & Logic
    // New thresholds: VeryWeak<20, Weak<40, Medium<60, Strong<100, Excellent<500, Overkill<2000, Paranoiac<15000, Demon>=15000
    if (safeEntropy >= 15000) {
        strength = 'Absolute Demon';
        color = '#0a0a0a'; // Black text for Demon
        barColor = '#0a0a0a'; // Near-black bar
        widthStr = 'calc(100% - 136px)';
        isDemon = true;
        textGlow = '0 0 10px #FFD700, 0 0 20px #FFD700, 0 0 30px #FFD700'; // Gold glow
    } else if (safeEntropy >= 2000) {
        strength = 'Paranoiac';
        color = '#D946EF'; // Fuchsia
        barColor = '#D946EF';
        widthStr = 'calc(100% - 136px)';
    } else if (safeEntropy >= 500) {
        strength = 'Overkill';
        color = '#8b5cf6'; // Violet
        barColor = '#8b5cf6';
        widthStr = 'calc(75% - 136px)';
    } else if (safeEntropy >= 100) {
        strength = 'Excellent';
        color = '#10B981'; // Green
        barColor = '#10B981';
        // Excellent: 100-125 bits -> 80-100% of track (saturates at 125)
        const progress = Math.min(1, (safeEntropy - 100) / 25);
        const fraction = 0.8 + progress * 0.2;
        widthStr = `calc(${fraction * 50}% - ${fraction * 136}px)`;
    } else {
        // Standard levels (< 100 bits) - map to 0-80% of track
        // Very Weak: 0-20%, Weak: 20-40%, Medium: 40-60%, Strong: 60-80%
        let fraction = 0;

        if (safeEntropy >= 60) {
            // Strong: 60-100 bits -> 60-80% of track
            strength = 'Strong';
            color = '#4FD8FF';
            barColor = '#4FD8FF';
            const tierProgress = Math.min(1, (safeEntropy - 60) / 40);
            fraction = 0.6 + tierProgress * 0.2;
        } else if (safeEntropy >= 40) {
            // Medium: 40-60 bits -> 40-60% of track
            strength = 'Medium';
            color = '#FBBF24';
            barColor = '#FBBF24';
            const tierProgress = (safeEntropy - 40) / 20;
            fraction = 0.4 + tierProgress * 0.2;
        } else if (safeEntropy >= 20) {
            // Weak: 20-40 bits -> 20-40% of track
            strength = 'Weak';
            color = '#F97316';
            barColor = '#F97316';
            const tierProgress = (safeEntropy - 20) / 20;
            fraction = 0.2 + tierProgress * 0.2;
        } else {
            // Very Weak: 0-20 bits -> 5-20% of track (minimum 5% to be visible)
            const tierProgress = safeEntropy / 20;
            fraction = 0.05 + tierProgress * 0.15;
        }

        // Width = fraction of track width = fraction * (50% - 136px)
        widthStr = `calc(${fraction * 50}% - ${fraction * 136}px)`;
    }

    return (
        <div className="w-full mt-4" id={id}>
            {/* Row: Info on left, Bar on right, all in one line */}
            <div className="flex items-center gap-6 relative" style={{ minHeight: '32px' }}>

                {/* Left: Strength Info - Stacked vertically */}
                <div
                    className="flex flex-col items-start"
                    style={{ flexShrink: 0, minWidth: '120px' }}
                    id={id ? `${id}-info` : undefined}
                >
                    <span
                        className="font-bold uppercase tracking-wider transition-all duration-300"
                        key={strength}
                        style={{
                            color,
                            fontSize: isDemon ? '0.9rem' : '0.8rem',
                            fontWeight: isDemon ? 900 : 700,
                            letterSpacing: '0.1em',
                            textShadow: textGlow
                        }}
                        id={id ? `${id}-strength` : undefined}
                    >
                        {strength}
                    </span>
                    <span
                        className="text-muted font-mono"
                        style={{ fontSize: '0.65rem', opacity: 0.7 }}
                        id={id ? `${id}-bits ` : undefined}
                    >
                        {Math.round(safeEntropy)} bits {isPostQuantum && <span className="text-amber-500" title="Post-Quantum">(PQ) </span>}
                        {combinations && (
                            <span className="ml-1" title="Combinations">
                                • {new Intl.NumberFormat('en-US', { notation: "scientific", maximumSignificantDigits: 3 }).format(combinations)}
                            </span>
                        )}
                    </span>
                </div>

                {/* Center: Label "Security Strength" - positioned above bar */}
                <span
                    className="label-text absolute"
                    style={{
                        left: '136px',
                        top: '-14px',
                        fontSize: '0.6rem',
                        opacity: 0.5
                    }}
                    id={id ? `${id}-label` : undefined}
                >
                    Security Strength
                </span>

                {/* Track (Background) - Positioned absolutely to start at same point as fill */}
                <div
                    className="rounded-full absolute transition-opacity duration-300"
                    id={id ? `${id}-bar-track` : undefined}
                    style={{
                        width: 'calc(50% - 136px)',
                        height: '4px',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        opacity: percentage > 100 ? 0.3 : 1,
                        left: '136px',
                        top: '50%',
                        transform: 'translateY(-50%)'
                    }}
                />

                {/* Fill Bar - Positioned absolutely in the row */}
                <div
                    id={id ? `${id}-bar-fill` : undefined}
                    className="rounded-full absolute transition-all duration-500 ease-out overflow-hidden"
                    style={{
                        height: '4px',
                        width: widthStr,
                        backgroundColor: barColor,
                        boxShadow: isDemon
                            ? `0 0 20px ${color}, 0 0 40px ${color}`
                            : (safeEntropy > 100 ? `0 0 12px ${color}` : 'none'),
                        zIndex: 10,
                        left: '136px',
                        top: '50%',
                        transform: 'translateY(-50%)'
                    }}
                >
                    {/* Helix Effect for Absolute Demon - Gold stripes on black bar */}
                    {isDemon && (
                        <div
                            id={id ? `${id}-helix` : undefined}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: `repeating-linear-gradient(
                                    45deg, 
                                    transparent, 
                                    transparent 12px, 
                                    rgba(255, 215, 0, 0.7) 12px, 
                                    rgba(255, 215, 0, 0.7) 16px
                                )`,
                                animation: 'helixMove 60s linear infinite'
                            }}
                        />
                    )}
                </div>
            </div>

            <style>{`
                @keyframes helixMove {
                    from { background-position: 0 0; }
                    to { background-position: 500px 0; }
                }
            `}</style>
        </div>
    );
}
