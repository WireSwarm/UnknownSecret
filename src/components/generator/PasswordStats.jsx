import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Type, ArrowUpCircle, Hash, Smile, Zap, Check, Shield, Info, X, Activity, Clock, BookOpen, TriangleAlert } from 'lucide-react';
import { HelpPopover } from '../ui/HelpPopover';

export function PasswordStats({ password, isOpen, enableEmojiStats = true, isPostQuantum = false, onFixBcrypt }) {
    const [showBcryptInfo, setShowBcryptInfo] = useState(false);
    const [debouncedResult, setDebouncedResult] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const workerRef = useRef(null);

    useEffect(() => {
        workerRef.current = new Worker(new URL('../../utils/zxcvbnWorker.js', import.meta.url), { type: 'module' });
        return () => {
            if (workerRef.current) workerRef.current.terminate();
        };
    }, []);

    // Debounce zxcvbn calculation with scramble effect & smart bypass
    useEffect(() => {
        if (!password) {
            setDebouncedResult(null);
            setIsCalculating(false);
            return;
        }

        setIsCalculating(true);
        const handler = setTimeout(() => {
            // Let the browser draw a final Scramble animation frame before doing heavy math
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    const uniqueChars = new Set(password).size;
                    const estimatedEntropy = password.length * Math.log2(uniqueChars || 1);

                    // If entropy is mathematically colossal or string very long, 
                    // the computation will take too long (freeze) for a guaranteed "Age of the Universe" result.
                    if (estimatedEntropy > 130 || password.length >= 40) {
                        setDebouncedResult({
                            score: 4,
                            crack_times_seconds: {
                                online_throttling_100_per_hour: 1e25,
                                online_no_throttling_10_per_second: 1e25,
                                offline_fast_hashing_1e10_per_second: 1e25,
                                offline_slow_hashing_1e4_per_second: 1e25
                            },
                            feedback: { warning: '', suggestions: [] }
                        });
                        setIsCalculating(false);
                    } else if (workerRef.current) {
                        workerRef.current.onmessage = (e) => {
                            setDebouncedResult(e.data);
                            setIsCalculating(false);
                        };
                        workerRef.current.postMessage(password);
                    } else {
                        setIsCalculating(false);
                    }
                });
            });
        }, 600); // Reduced for a "snappy" feel while leaving time for the animation

        return () => clearTimeout(handler);
    }, [password]);

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
    }, [password, enableEmojiStats]);

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
            isCaution: (password && stats.bytes > 72),
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

    // Helper for staggered animations
    const getSlideInStyle = (delay, isMountingAnimation = true) => ({
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'translateY(0)' : 'translateY(10px)',
        transition: `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`,
        animation: isMountingAnimation ? `spectacularEntrance 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms backwards` : 'none'
    });

    return (
        <div style={containerStyle} id="password-stats-container">
            <style>
                {`
                    @keyframes spectacularEntrance {
                        0% { 
                            opacity: 0; 
                            transform: translateY(30px) scale(0.9); 
                            filter: blur(10px);
                        }
                        50% { 
                            opacity: 1; 
                            transform: translateY(-5px) scale(1.03); 
                            filter: blur(0px);
                        }
                        75% {
                            transform: translateY(3px) scale(0.98);
                        }
                        100% { 
                            opacity: 1; 
                            transform: translateY(0) scale(1); 
                        }
                    }
                `}
            </style>
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
                            border: isActive ? '1px solid rgba(16, 185, 129, 0.3)' : (item.isCaution ? '1px solid rgba(234, 179, 8, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)'),
                            background: isActive ? 'rgba(16, 185, 129, 0.1)' : (item.isCaution ? 'rgba(234, 179, 8, 0.1)' : 'rgba(255, 255, 255, 0.05)'),
                            backdropFilter: 'blur(12px)',
                            color: isActive ? '#34D399' : (item.isCaution ? '#FACC15' : 'rgba(255, 255, 255, 0.5)'),
                            boxShadow: isActive ? '0 0 12px rgba(16, 185, 129, 0.15)' : (item.isCaution ? '0 0 12px rgba(234, 179, 8, 0.15)' : 'none'),
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
                            border: isActive ? '1px solid #34D399' : (item.isCaution ? '1px solid #FACC15' : '1px solid rgba(255, 255, 255, 0.1)'),
                            background: isActive ? '#10B981' : (item.isCaution ? '#EAB308' : 'transparent'),
                            color: isActive || item.isCaution ? 'white' : 'rgba(255, 255, 255, 0.1)',
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
                                    {isActive ? <Check size={10} strokeWidth={3} /> : (item.isCaution ? <TriangleAlert size={10} strokeWidth={3} /> : null)}
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
                                Bcrypt is a common password hashing algorithm with a strict technical limit: it ignores any input beyond 72 bytes.
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

                {showBcryptInfo && stats.bytes > 72 && (
                    <div
                        id="bcrypt-warning-container"
                        style={{
                            marginTop: '0.5rem',
                            padding: '0.65rem 0.75rem',
                            background: 'rgba(234, 179, 8, 0.1)',
                            border: '1px solid rgba(234, 179, 8, 0.25)',
                            borderRadius: '0.4rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.4rem',
                            animation: 'fadeIn 0.3s ease'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <TriangleAlert id="bcrypt-warning-icon" size={14} color="#FACC15" />
                            <h5 id="bcrypt-warning-title" style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: '#FEF9C3' }}>
                                Byte-Size Exceeded
                            </h5>
                        </div>
                        <p id="bcrypt-warning-desc" style={{ margin: 0, fontSize: '0.7rem', lineHeight: 1.4, color: 'rgba(254, 249, 195, 0.8)' }}>
                            Because you are using complex multi-byte characters (like emojis or symbols), your generated password has exceeded this 72-byte limit. It may be silently truncated by the target website.
                        </p>
                        <button
                            id="bcrypt-fix-btn"
                            onClick={() => {
                                if (onFixBcrypt) onFixBcrypt();
                                setShowBcryptInfo(false);
                            }}
                            style={{
                                alignSelf: 'flex-start',
                                marginTop: '0.25rem',
                                background: 'rgba(254, 249, 195, 0.15)',
                                color: '#FEF9C3',
                                border: '1px solid rgba(254, 249, 195, 0.3)',
                                padding: '0.25rem 0.6rem',
                                borderRadius: '0.25rem',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            className="hover:bg-yellow-500/20"
                        >
                            Set to 72 Bytes
                        </button>
                    </div>
                )}

                {/* ZXCVBN Section */}
                {(debouncedResult || isCalculating) && (
                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }} id="zxcvbn-stats">
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '1rem',
                            color: 'rgba(255,255,255,0.8)',
                            ...getSlideInStyle(350)
                        }}>
                            <Activity size={16} />
                            <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Security Analysis</h3>
                        </div>

                        <div style={getSlideInStyle(450)}>
                            <CrackTimeDisplay
                                times={debouncedResult ? debouncedResult.crack_times_seconds : {
                                    online_throttling_100_per_hour: 0,
                                    online_no_throttling_10_per_second: 0,
                                    offline_fast_hashing_1e10_per_second: 0,
                                    offline_slow_hashing_1e4_per_second: 0
                                }}
                                isPostQuantum={isPostQuantum}
                                isLoading={isCalculating}
                            />
                        </div>

                        {/* Algorithm Info */}
                        <div style={{
                            padding: '0.75rem',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '0.5rem',
                            marginBottom: '1rem',
                            display: 'flex',
                            gap: '0.75rem',
                            fontSize: '0.8rem',
                            color: 'rgba(255,255,255,0.7)',
                            ...getSlideInStyle(550)
                        }}>
                            <BookOpen size={16} style={{ flexShrink: 0, marginTop: '2px', opacity: 0.7 }} />
                            <div>
                                <strong style={{ color: 'rgba(255,255,255,0.9)', display: 'block', marginBottom: '0.2rem' }}>Algorithm: zxcvbn</strong>
                                Specifically designed to detect human-friendly passwords by analyzing dictionary words, repetitions, and common patterns often missed by traditional entropy calculators.
                                <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', opacity: 0.6, fontStyle: 'italic', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.4rem' }}>
                                    Note: This analysis is less relevant for purely random passwords generated by this tool.
                                </div>
                            </div>
                        </div>

                        {!isCalculating && debouncedResult && (
                            <div style={getSlideInStyle(650)}>
                                {debouncedResult.feedback?.warning && (
                                    <div
                                        id="zxcvbn-warning"
                                        style={{
                                            padding: '0.75rem',
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            border: '1px solid rgba(239, 68, 68, 0.2)',
                                            borderRadius: '0.5rem',
                                            marginBottom: '0.75rem'
                                        }}
                                    >
                                        <strong id="zxcvbn-warning-title" style={{ color: '#FCA5A5', fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem' }}>Warning</strong>
                                        <span id="zxcvbn-warning-text" style={{ color: '#FECACA', fontSize: '0.8rem' }}>{debouncedResult.feedback.warning}</span>
                                    </div>
                                )}

                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function ScrambleText({ length = 8 }) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    const [text, setText] = useState('');

    useEffect(() => {
        let frame;
        const update = () => {
            let str = '';
            for (let i = 0; i < length; i++) {
                str += chars[Math.floor(Math.random() * chars.length)];
            }
            setText(str);
            frame = requestAnimationFrame(update);
        };
        update();
        return () => cancelAnimationFrame(frame);
    }, [length]);

    return <span style={{ fontFamily: 'monospace', opacity: 0.7 }}>{text}</span>;
}

function CrackTimeDisplay({ times, isPostQuantum, isLoading }) {
    const [scrambleLength] = React.useState(() => 10 + Math.floor(Math.random() * 5));
    if (!times) return null;

    const formatTime = (seconds) => {
        let val = seconds;
        if (isPostQuantum) {
            val = Math.sqrt(seconds);
        }

        if (val < 1) return 'Instantly';
        if (val < 60) return `${Math.round(val)} seconds`;
        if (val < 3600) return `${Math.round(val / 60)} minutes`;
        if (val < 86400) return `${Math.round(val / 3600)} hours`;
        if (val < 31536000) return `${Math.round(val / 86400)} days`;
        if (val < 31536000 * 100) return `${Math.round(val / 31536000)} years`;
        if (val < 31536000 * 1000) return 'Centuries';
        if (val < 31536000 * 1e6) return 'Millennia';
        if (val < 31536000 * 1e9) return 'Millions of years';
        if (val < 31536000 * 14e9) return 'Billions of years';
        return 'Age of the Universe';
    };

    const items = [
        { label: 'Data Breach (Weak Security)', tooltip: 'The database leaked and the hashing algorithm (e.g., MD5) is very fast to compute. The attacker uses hardware to test 10 billion combinations per second.', value: formatTime(times.offline_fast_hashing_1e10_per_second), sub: '10B/sec', id: 'crack-time-offline-fast' },
        { label: 'Data Breach (Strong Security)', tooltip: 'The database leaked, but the password is defended by a slow algorithm (e.g., Bcrypt, Argon2). The attacker is limited to about 10,000 tests per second.', value: formatTime(times.offline_slow_hashing_1e4_per_second), sub: '10k/sec', id: 'crack-time-offline-slow' },
        { label: 'Login Attempts (Unlimited)', tooltip: 'Online attack: the login form has no protection against bots. The attacker tests passwords as fast as the network allows.', value: formatTime(times.online_no_throttling_10_per_second), sub: '10/sec', id: 'crack-time-unthrottled' },
        { label: 'Login Attempts (With Max Attempts)', tooltip: 'Online attack: the login page has a security system that blocks or slows down the attacker after a few failed tries (rate limiting, max attempts).', value: formatTime(times.online_throttling_100_per_hour), sub: '100/hour', id: 'crack-time-throttled' }
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }} id="crack-times">
            {items.map((item, i) => (
                <div key={i} id={item.id} style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '0.5rem',
                    padding: '0.5rem',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <span id={`${item.id}-label`} style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center' }}>
                        {item.label} <span style={{ opacity: 0.5, marginLeft: '0.2rem' }}>({item.sub})</span>
                        <HelpPopover title={item.label} content={item.tooltip} />
                    </span>
                    <span id={`${item.id}-value`} style={{ fontSize: '0.85rem', fontWeight: 600, color: '#E5E7EB', minHeight: '1.2rem' }}>
                        {isLoading ? <ScrambleText length={scrambleLength} /> : item.value}
                    </span>
                    {isPostQuantum && (
                        <span style={{ fontSize: '0.6rem', color: '#60A5FA', marginTop: '2px' }}>
                            (PQ: √Time)
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}
