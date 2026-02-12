import React, { useMemo, useState } from 'react';
import { Type, ArrowUpCircle, Hash, Smile, Zap, Check, Shield, Info, X } from 'lucide-react';

export function PasswordStats({ password, isOpen, enableEmojiStats = true }) {
    const [showBcryptInfo, setShowBcryptInfo] = useState(false);

    // Calculate stats ensuring we handle surrogate pairs (emojis) correctly
    const stats = useMemo(() => {
        if (!password) return { lower: 0, upper: 0, number: 0, emoji: 0, symbol: 0, bytes: 0 };

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
            else if (enableEmojiStats && emojiRegex.test(char)) emoji++;
        });

        const symbol = total - (lower + upper + number + emoji);
        const bytes = new TextEncoder().encode(password).length;
        return { lower, upper, number, emoji, symbol, bytes };
    }, [password]);

    const statItems = [
        { label: 'Lowercase', count: stats.lower, icon: Type },
        { label: 'Uppercase', count: stats.upper, icon: ArrowUpCircle },
        { label: 'Numbers', count: stats.number, icon: Hash },
        { label: 'Emojis', count: stats.emoji, icon: Smile },
        { label: 'Symbols', count: stats.symbol, icon: Zap },
        {
            label: 'Bcrypt',
            count: (password && stats.bytes <= 72) ? 1 : 0,
            icon: Shield,
            hideCount: true,
            onClick: () => setShowBcryptInfo(prev => !prev),
            isInteractive: true
        }
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
        gridTemplateColumns: 'repeat(6, 1fr)',
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
                            transition: `all 0.5s ease ${index * 50}ms`,
                            cursor: item.isInteractive ? 'pointer' : 'default'
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
                            <div
                                key={item.label}
                                style={cardStyle}
                                id={`stat-${item.label.toLowerCase()}`}
                                onClick={item.onClick}
                            >
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
                                        {!item.hideCount && (
                                            <span style={{
                                                fontSize: '0.95rem',
                                                fontWeight: 700,
                                                fontFamily: 'monospace',
                                                lineHeight: 1
                                            }}>
                                                {item.count}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div style={checkCircleStyle}>
                                    {isActive ? <Check size={10} strokeWidth={3} /> : null}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {showBcryptInfo && (
                    <div
                        style={{
                            marginTop: '1rem',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            background: 'rgba(59, 130, 246, 0.1)', // Blue tint
                            border: '1px solid rgba(59, 130, 246, 0.25)',
                            display: 'flex',
                            alignItems: 'start',
                            gap: '0.75rem',
                            animation: 'fadeIn 0.3s ease',
                            position: 'relative'
                        }}
                    >
                        <Info size={18} style={{ color: '#60A5FA', flexShrink: 0, marginTop: '2px' }} />
                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#DBEAFE' }}>
                                Bcrypt Compatibility
                            </h4>
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', lineHeight: 1.5, color: '#BFDBFE' }}>
                                Ensures your password is not truncated by systems using Bcrypt.
                                The checked status means your password size is <b>≤ 72 bytes</b>.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowBcryptInfo(false)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'rgba(255,255,255,0.4)',
                                cursor: 'pointer',
                                padding: '2px'
                            }}
                            className="hover:text-white transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
