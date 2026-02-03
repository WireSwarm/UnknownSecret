import React, { useMemo } from 'react';
import { Type, ArrowUpCircle, Hash, Smile, Zap, Check } from 'lucide-react';

export function PasswordStats({ password, isOpen }) {

    // Calculate stats ensuring we handle surrogate pairs (emojis) correctly
    const stats = useMemo(() => {
        if (!password) return { lower: 0, upper: 0, number: 0, emoji: 0, symbol: 0 };

        const chars = Array.from(password);
        const total = chars.length;

        const lowerRegex = /^[a-z]$/;
        const upperRegex = /^[A-Z]$/;
        const numberRegex = /^[0-9]$/;
        const emojiRegex = /\p{Extended_Pictographic}|\p{Emoji_Presentation}/u;

        let lower = 0, upper = 0, number = 0, emoji = 0;

        chars.forEach(char => {
            if (lowerRegex.test(char)) lower++;
            else if (upperRegex.test(char)) upper++;
            else if (numberRegex.test(char)) number++;
            else if (emojiRegex.test(char)) emoji++;
        });

        const symbol = total - (lower + upper + number + emoji);
        return { lower, upper, number, emoji, symbol };
    }, [password]);

    const statItems = [
        { label: 'Lowercase', count: stats.lower, icon: Type },
        { label: 'Uppercase', count: stats.upper, icon: ArrowUpCircle },
        { label: 'Numbers', count: stats.number, icon: Hash },
        { label: 'Emojis', count: stats.emoji, icon: Smile },
        { label: 'Symbols', count: stats.symbol, icon: Zap }
    ];

    // Container style - handles the collapse/expand animation
    const containerStyle = {
        display: 'grid',
        gridTemplateRows: isOpen ? '1fr' : '0fr',
        opacity: isOpen ? 1 : 0,
        marginTop: isOpen ? '1.5rem' : '0',
        marginBottom: isOpen ? '0.5rem' : '0',
        overflow: 'hidden',
        transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
    };

    // Inner wrapper to allow height animation
    const innerStyle = {
        minHeight: 0
    };

    // Grid layout for stats
    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '0.75rem'
    };

    return (
        <div style={containerStyle} id="password-stats-container">
            <div style={innerStyle}>
                <div style={gridStyle} id="password-stats-grid">
                    {statItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = item.count > 0;

                        const cardStyle = {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.5rem 0.6rem',
                            borderRadius: '0.6rem',
                            border: isActive ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                            background: isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(12px)',
                            color: isActive ? '#34D399' : 'rgba(255, 255, 255, 0.5)',
                            boxShadow: isActive ? '0 0 12px rgba(16, 185, 129, 0.15)' : 'none',
                            opacity: isOpen ? 1 : 0,
                            transform: isOpen ? 'translateY(0)' : 'translateY(1rem)',
                            transition: `all 0.5s ease ${index * 50}ms`
                        };

                        const iconBoxStyle = {
                            padding: '0.35rem',
                            borderRadius: '0.4rem',
                            background: isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        };

                        const checkCircleStyle = {
                            width: '1.2rem',
                            height: '1.2rem',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: isActive ? '1px solid #34D399' : '1px solid rgba(255, 255, 255, 0.1)',
                            background: isActive ? '#10B981' : 'transparent',
                            color: isActive ? 'white' : 'rgba(255, 255, 255, 0.1)',
                            flexShrink: 0
                        };

                        return (
                            <div key={item.label} style={cardStyle} id={`stat-${item.label.toLowerCase()}`}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                                    <div style={iconBoxStyle}>
                                        <Icon size={14} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                                        <span style={{
                                            fontSize: '0.6rem',
                                            fontWeight: 500,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.03em',
                                            opacity: 0.8,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {item.label}
                                        </span>
                                        <span style={{
                                            fontSize: '0.95rem',
                                            fontWeight: 700,
                                            fontFamily: 'monospace',
                                            lineHeight: 1
                                        }}>
                                            {item.count}
                                        </span>
                                    </div>
                                </div>

                                <div style={checkCircleStyle}>
                                    {isActive ? <Check size={10} strokeWidth={3} /> : null}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
