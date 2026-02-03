import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw, Copy, Check, Eye, EyeOff, Dice5, ShieldAlert, Sparkles, Plus, Trash2, Save, ChevronDown, Sliders, TriangleAlert, Eraser, Edit2, Keyboard } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Slider } from '../ui/Slider';
import { Toggle } from '../ui/Toggle';
import { generatePassword, PRESETS, buildCharset, getCharsetSizes } from '../../utils/passwordGen';
import { EntropyMeter } from './EntropyMeter';

export function GeneratorPanel({ onCopyPassword }) {
    // --- PERSISTENCE CONSTANTS ---
    const STORAGE_KEY_PARAMS = 'usr_gen_params';
    const STORAGE_KEY_PRESETS = 'usr_gen_presets';

    // Default configuration reference
    // A Global Option is an option available for all charsets.
    const DEFAULT_CONFIG = {
        length: 16,
        tokens: ['ascii'],
        exclude: '',
        include: '',
        ensureCommon: true,
        maxPossible: 128,
        randomLength: false,
        lengthDeviation: 5,
        ensureMinAscii: false,
        minAsciiPercent: 5,
        customCharset: '',
        standardCharsetDisabled: true,
        customWeight: 0
    };

    /**
     * STATE INITIALIZATION WITH PERSISTENCE
     * 
     * NOTE FOR FUTURE DEVELOPERS:
     * When adding or removing options in the `config` object, ensure that:
     * 1. The key is added to the DEFAULT_CONFIG above.
     * 2. The loading logic below merges the saved config with the default (already handled) 
     *    to prevent undefined values for new settings on existing users' machines.
     * 3. No specific action is needed for saving, as the entire `config` object is serialized.
     */

    const [config, setConfig] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_PARAMS);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge saved config with defaults to handle new fields seamlessly
                return { ...DEFAULT_CONFIG, ...parsed.config };
            }
        } catch (error) {
            console.error('Failed to load settings', error);
        }
        return DEFAULT_CONFIG;
    });

    const [activeSet, setActiveSet] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_PARAMS);
            if (saved) {
                const parsed = JSON.parse(saved);
                return parsed.activeSet || 'alphanums';
            }
        } catch (e) { }
        return 'alphanums';
    });

    // Presets State
    const [presets, setPresets] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_PRESETS);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    const [isEditingMax, setIsEditingMax] = useState(false);
    const [isEditingLength, setIsEditingLength] = useState(false);
    const [result, setResult] = useState({ password: '', entropy: 0 });
    const [showPassword, setShowPassword] = useState(false);
    const [copied, setCopied] = useState(false);
    const [hasBeenCopied, setHasBeenCopied] = useState(false); // Track if current password was copied

    // Preset creation UI state
    const [isCreatingPreset, setIsCreatingPreset] = useState(false);
    const [newPresetName, setNewPresetName] = useState('');
    const [activePresetId, setActivePresetId] = useState(null);
    const [clearConfirmLevel, setClearConfirmLevel] = useState(0); // 0: Normal, 1: Sure?, 2: Really?
    const [isShiftPressed, setIsShiftPressed] = useState(false); // Track Shift key for delete buttons
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false); // Advanced section collapsed state
    const [isEditingPercent, setIsEditingPercent] = useState(false); // State for editing random length percent
    const [isEditingAsciiPercent, setIsEditingAsciiPercent] = useState(false); // State for editing min ascii percent
    const [isEditingWeight, setIsEditingWeight] = useState(false); // State for editing custom charset weight

    // Effect to track Shift key globally
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Shift') setIsShiftPressed(true);
        };
        const handleKeyUp = (e) => {
            if (e.key === 'Shift') setIsShiftPressed(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // Local state for slider to prevent regeneration while dragging
    const [sliderLength, setSliderLength] = useState(config.length);

    // Scramble Effect State
    const [isScrambling, setIsScrambling] = useState(false);
    const [scrambleText, setScrambleText] = useState('');

    // Sync sliderLength when config changes (e.g. presets)
    useEffect(() => {
        setSliderLength(config.length);
    }, [config.length]);

    // --- SCRAMBLE EFFECT LOOP ---
    useEffect(() => {
        let animationFrameId;

        const animate = () => {
            if (isScrambling) {
                // Generate fake scramble text based on visibility
                let fakePwd = '';
                const targetLen = sliderLength;

                if (showPassword) {
                    // Matrix Style: Random Alphanums
                    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
                    for (let i = 0; i < targetLen; i++) {
                        fakePwd += chars.charAt(Math.floor(Math.random() * chars.length));
                    }
                } else {
                    // Hidden Style: Dots that adapt in length
                    // We can use a different dot char for effect, but classic bullet is fine
                    fakePwd = '•'.repeat(targetLen);
                }

                setScrambleText(fakePwd);
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        if (isScrambling) {
            animationFrameId = requestAnimationFrame(animate);
        } else {
            setScrambleText('');
        }

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [isScrambling, sliderLength, showPassword]);

    // --- AUTO-SAVE EFFECT ---
    useEffect(() => {
        const payload = {
            config,
            activeSet
        };
        localStorage.setItem(STORAGE_KEY_PARAMS, JSON.stringify(payload));
    }, [config, activeSet]);

    // ... (rest of the file remains, I will target the render blocks separately if needed, but I can do it in one go if I match context carefully)
    // Actually, I can't delete a block AND replace a block far away in one 'replace_file_content' call if they are not contiguous.
    // I must use multi_replace_file_content.


    // --- PRESETS SAVE EFFECT ---
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_PRESETS, JSON.stringify(presets));
    }, [presets]);


    // Predefined Sets with linear inclusion hierarchy (left to right = small to large)
    // Each set includes all sets to its LEFT (like ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ ⊂ ℂ)
    const SETS_ORDER = ['alphanums', 'ascii', 'ascii_extended', 'symbols_set', 'active_languages', 'emojis', 'all_unicode'];

    // Get exact charset sizes (computed once and cached)
    const charsetSizes = useMemo(() => getCharsetSizes(), []);

    const SETS = {
        alphanums: {
            id: 'alphanums',
            name: 'Alphanums',
            tokens: ['alphanums'],
            description: 'a-z, A-Z, 0-9'
        },
        ascii: {
            id: 'ascii',
            name: 'Ascii',
            tokens: ['ascii'],
            description: '+ Full ASCII table (U+0000-00FF)'
        },
        ascii_extended: {
            id: 'ascii_extended',
            name: 'Ascii Extended',
            tokens: ['ascii_extended'],
            description: '+ Latin Extended A & B (U+0100-024F)'
        },
        symbols_set: {
            id: 'symbols_set',
            name: 'With Symbols',
            tokens: ['symbols_set'],
            description: '+ Arrows, Math, Currency (→∑€...)'
        },
        active_languages: {
            id: 'active_languages',
            name: 'Active Languages',
            tokens: ['active_languages'],
            description: '+ Greek, Cyrillic, Hebrew, Arabic (αБא...)'
        },
        emojis: {
            id: 'emojis',
            name: 'With Emojis',
            tokens: ['emojis'],
            description: '+ Emojis (🎉🔥💻...)'
        },
        all_unicode: {
            id: 'all_unicode',
            name: 'All Unicode',
            tokens: ['all_unicode'],
            description: '+ Full BMP (CJK, Technical...)'
        }
    };

    // State for tracking hovered set (for inclusion highlighting)
    const [hoveredSet, setHoveredSet] = useState(null);

    // Helper: Check if a set is included in another based on position (left = included in right)
    const isSetHighlighted = (setKey) => {
        const setIndex = SETS_ORDER.indexOf(setKey);
        const activeIndex = SETS_ORDER.indexOf(activeSet);
        const hoveredIndex = hoveredSet ? SETS_ORDER.indexOf(hoveredSet) : -1;

        // Always highlight the active set
        if (activeSet === setKey) return 'active';

        // Check if this set is to the LEFT of the hovered set (meaning it's included)
        if (hoveredSet && setIndex < hoveredIndex) {
            return 'included';
        }

        // Check if this set is to the LEFT of the active set (meaning it's a child)
        if (setIndex < activeIndex) {
            return 'child';
        }

        return null;
    };

    // Generate function
    const handleGenerate = () => {
        let finalCharset = [];

        // 1. Standard Pool
        if (!config.standardCharsetDisabled) {
            finalCharset = buildCharset({
                tokens: config.tokens,
                exclude: config.exclude,
                include: config.include
            });
        }

        // 2. Custom Pool & Weighting
        if (config.customCharset) {
            const excludeSet = new Set(config.exclude);
            const customPool = Array.from(config.customCharset).filter(c => !excludeSet.has(c));

            if (customPool.length > 0) {
                if (config.standardCharsetDisabled) {
                    finalCharset = customPool;
                } else {
                    // Weighting Logic
                    const S = finalCharset.length;
                    const C = customPool.length;
                    // Cap P at 0.99 to avoid division by zero (infinity) if mixing
                    let P = Math.min(config.customWeight, 99) / 100;

                    if (S > 0 && P > 0) {
                        // Formula: k * C / (S + k * C) = P
                        // k = (P * S) / (C * (1 - P))
                        let k = (P * S) / (C * (1 - P));
                        k = Math.max(1, Math.ceil(k));

                        // Add k copies of custom pool
                        for (let i = 0; i < k; i++) {
                            finalCharset.push(...customPool);
                        }
                    } else {
                        // Just append once if weight is 0
                        finalCharset.push(...customPool);
                    }
                }
            }
        }
        const res = generatePassword({
            length: config.length,
            charset: finalCharset,
            mandatoryChars: config.include,
            ensureRobustness: config.ensureCommon, // Mapped to the new logic
            randomizeLength: config.randomLength,
            lengthDeviation: config.lengthDeviation,
            ensureMinAscii: config.ensureMinAscii,
            minAsciiPercent: config.minAsciiPercent
        });

        setResult(res);
        setCopied(false);
        setHasBeenCopied(false);
        if (isScrambling) setIsScrambling(false);
    };

    // Calculate conflicts between Must Include and Forbidden
    const getConflictChars = () => {
        if (!config.include || !config.exclude) return [];
        const includeSet = new Set(config.include);
        const excludeSet = new Set(config.exclude);
        return [...includeSet].filter(x => excludeSet.has(x));
    };

    const conflictChars = getConflictChars();
    const hasConflict = conflictChars.length > 0;



    // Initial & Watch trigger
    useEffect(() => {
        handleGenerate();
    }, [config]);

    const copyToClipboard = () => {
        if (!result.password) return;
        navigator.clipboard.writeText(result.password);
        setCopied(true);

        // Pass a flag indicating if this exact password instance was already copied
        if (onCopyPassword) {
            onCopyPassword({
                ...result,
                timestamp: Date.now(),
                alreadyCopied: hasBeenCopied
            });
        }

        setHasBeenCopied(true);
        // Reset copied state after 2s
        setTimeout(() => setCopied(false), 2000);
    };

    // Change Set
    const handleSetChange = (setId) => {
        setActiveSet(setId);

        let newConfig = {
            ...config,
            tokens: SETS[setId].tokens,
            standardCharsetDisabled: false // Reactivate standard charset on manual selection
        };

        // Auto-disable min ASCII if not supported by new set
        if (!['emojis', 'all_unicode'].includes(setId)) {
            newConfig.ensureMinAscii = false;
        }

        setConfig(newConfig);
    };

    const handleMaxChange = (e) => {
        if (e.key === 'Enter' || e.type === 'blur') {
            let val = parseInt(e.target.value, 10);
            if (!isNaN(val) && val > 0) {
                // Cap it at something reasonable if needed, or leave it to user
                setConfig(prev => ({ ...prev, maxPossible: val, length: Math.min(prev.length, val) }));
            }
            setIsEditingMax(false);
        }
    };

    const handleLengthChange = (e) => {
        if (e.key === 'Enter' || e.type === 'blur') {
            let val = parseInt(e.target.value, 10);
            if (!isNaN(val) && val > 0) {
                // If new length > max, update max as well
                setConfig(prev => {
                    const newMax = Math.max(prev.maxPossible, val);
                    return { ...prev, length: val, maxPossible: newMax };
                });
            }
            setIsEditingLength(false);
        }
    }


    // Preset handlers
    const saveCurrentAsPreset = () => {
        if (!newPresetName.trim()) return;

        const newPreset = {
            id: Date.now(),
            name: newPresetName.trim(),
            config: { ...config },
            activeSet
        };

        setPresets([...presets, newPreset]);
        setNewPresetName('');
        setIsCreatingPreset(false);
        setActivePresetId(newPreset.id);
    };

    const loadPreset = (preset) => {
        setConfig(preset.config);
        setActiveSet(preset.activeSet);
        setActivePresetId(preset.id);
    };

    const deletePreset = (id, e) => {
        e.stopPropagation();
        setPresets(presets.filter(p => p.id !== id));
        if (activePresetId === id) setActivePresetId(null);
    };

    const handleClearAllPresets = () => {
        if (clearConfirmLevel === 0) {
            setClearConfirmLevel(1);
            // Auto reset after 3s if not confirmed
            setTimeout(() => setClearConfirmLevel(prev => prev === 1 ? 0 : prev), 3000);
        } else if (clearConfirmLevel === 1) {
            setClearConfirmLevel(2);
            setTimeout(() => setClearConfirmLevel(prev => prev === 2 ? 0 : prev), 3000);
        } else {
            setPresets([]);
            setActivePresetId(null);
            setClearConfirmLevel(0);
        }
    };

    const getClearButtonText = () => {
        if (clearConfirmLevel === 1) return "Sure?";
        if (clearConfirmLevel === 2) return "REALLY?";
        return "Clear";
    };

    return (
        <div className="flex flex-col gap-6" id="generator-panel">
            {/* Centered Output Section */}
            <div className="flex flex-col items-center w-full" id="output-section">
                <div className="w-full max-w-2xl relative" id="password-input-area">
                    <Input
                        id="main-password-input"
                        value={isScrambling ? scrambleText : result.password}
                        readOnly
                        type={showPassword || (isScrambling && showPassword) ? "text" : "password"}
                        className={`keeper-ignore text-center text-2xl font-bold tracking-wider radiant-text input-rounded pr-24 ${isScrambling ? 'text-primary/70 animate-pulse' : ''}`}
                        wrapperClassName="mb-1"
                        onClick={copyToClipboard}
                        style={{ cursor: 'pointer', paddingRight: '8.4rem' }}
                        rightElement={
                            <>
                                <button
                                    id="toggle-visibility-btn"
                                    onClick={(e) => { e.stopPropagation(); setShowPassword(!showPassword); }}
                                    className="icon-btn"
                                    title={showPassword ? "Hide" : "Show"}
                                >
                                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                                </button>
                                <button
                                    id="regen-password-btn"
                                    onClick={(e) => { e.stopPropagation(); handleGenerate(); }}
                                    className="icon-btn icon-btn-primary"
                                    title="Regenerate"
                                >
                                    <Dice5 size={22} />
                                </button>
                            </>
                        }
                    />
                </div>

                {/* Password Length Slider: directly below the input */}
                <div className="w-full max-w-2xl mt-4" id="length-slider-area">
                    <div className="flex justify-between items-center mb-1" id="length-label-row">
                        <label className="label-text" id="length-label">Password Length</label>
                        <div className="flex items-center gap-2" id="length-value-container">
                            {isEditingLength ? (
                                <input
                                    id="length-editor"
                                    autoFocus
                                    defaultValue={config.length}
                                    onKeyDown={handleLengthChange}
                                    onBlur={handleLengthChange}
                                    onFocus={(e) => e.target.select()}
                                    className="ghost-size-input text-primary font-bold"
                                />
                            ) : (
                                <div
                                    className="font-mono font-bold text-primary cursor-pointer hover:underline flex items-center gap-1"
                                    id="current-length-val"
                                    onClick={() => setIsEditingLength(true)}
                                    title="Click to edit length"
                                >
                                    {config.randomLength ? (
                                        <>
                                            ~{sliderLength} <span className="text-[0.8em] font-normal">({result?.password ? [...result.password].length : 0})</span>
                                        </>
                                    ) : (
                                        sliderLength
                                    )}
                                    <Edit2 size={10} className="opacity-50" />
                                </div>
                            )}
                            <span className="text-muted" id="length-sep">/</span>
                            {isEditingMax ? (
                                <input
                                    id="max-length-editor"
                                    autoFocus
                                    defaultValue={config.maxPossible}
                                    onKeyDown={handleMaxChange}
                                    onBlur={handleMaxChange}
                                    onFocus={(e) => e.target.select()}
                                    className="ghost-size-input"
                                />
                            ) : (
                                <div
                                    id="max-length-display"
                                    className="font-mono text-muted cursor-pointer hover:text-primary transition-colors flex items-center gap-1"
                                    onClick={() => setIsEditingMax(true)}
                                    title="Click to edit max limit"
                                >
                                    {config.maxPossible}
                                    <Edit2 size={10} className="opacity-50" />
                                </div>
                            )}
                        </div>
                    </div>
                    <Slider
                        id="length-slider"
                        value={sliderLength}
                        min={1}
                        max={config.maxPossible}
                        onChange={(val) => {
                            setSliderLength(val);
                            if (!isScrambling) setIsScrambling(true);
                        }}
                        onAfterChange={(val) => {
                            setConfig({ ...config, length: val });
                        }}
                    />
                </div>
            </div>

            {/* Copy Button & Meter */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between" id="meter-action-row">
                <EntropyMeter entropy={result.entropy} combinations={result.combinations} id="entropy-meter" />

                <Button
                    id="main-copy-btn"
                    onClick={copyToClipboard}
                    className={`w-full md:w-auto mt-4 md:mt-0 ${copied ? 'bg-green-500' : ''}`}
                    variant={copied ? 'ghost' : 'primary'}
                    style={copied ? { borderColor: '#10B981', color: '#10B981' } : {}}
                >
                    {copied ? <Check size={20} id="copied-icon" /> : <Copy size={20} id="copy-icon" />}
                    {copied ? 'Copied!' : 'Copy Password'}
                </Button>
            </div>

            {/* Unified Configuration & Presets Panel */}
            <GlassCard className="p-6 mt-4 flex flex-col gap-6" id="unified-config-card">

                {/* Section 1: Configuration (The Workspace) */}
                <div className="flex flex-col gap-6" id="config-section">

                    {/* Configuration Title */}
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Sliders size={18} className="text-primary" />
                        Configuration
                    </h3>

                    {/* Character Sets with inclusion highlighting */}
                    <div>
                        <h3 className="label-text mb-4 text-center" id="charset-title">Character Set</h3>
                        <div className="flex flex-wrap gap-3 justify-center" id="charset-selectors">
                            {SETS_ORDER.map(key => {
                                const highlightState = isSetHighlighted(key);
                                const isActive = highlightState === 'active';
                                const isIncluded = highlightState === 'included';
                                const isChild = highlightState === 'child';
                                const isHovered = hoveredSet === key;

                                return (
                                    <button
                                        id={`charset-btn-${key}`}
                                        key={key}
                                        onClick={() => handleSetChange(key)}
                                        onMouseEnter={() => setHoveredSet(key)}
                                        onMouseLeave={() => setHoveredSet(null)}
                                        className="charset-selector-btn rounded-full transition-all px-4 py-2 text-sm cursor-pointer"
                                        title={`${SETS[key].description}\n${charsetSizes[key]?.toLocaleString() || '?'} characters`}
                                        style={{
                                            background: isActive
                                                ? 'var(--primary)'
                                                : isHovered
                                                    ? 'rgba(var(--primary-rgb), 0.35)'
                                                    : isIncluded
                                                        ? 'rgba(var(--primary-rgb), 0.2)'
                                                        : isChild
                                                            ? 'rgba(var(--primary-rgb), 0.15)'
                                                            : 'rgba(0, 0, 0, 0.2)',
                                            color: isActive
                                                ? 'white'
                                                : isHovered
                                                    ? 'white'
                                                    : isIncluded
                                                        ? 'rgba(255, 255, 255, 0.9)'
                                                        : isChild
                                                            ? 'rgba(255, 255, 255, 0.8)'
                                                            : 'var(--text-muted)',
                                            border: isActive
                                                ? '1px solid var(--primary)'
                                                : isHovered
                                                    ? '1px solid rgba(var(--primary-rgb), 0.7)'
                                                    : isIncluded
                                                        ? '1px solid rgba(var(--primary-rgb), 0.4)'
                                                        : isChild
                                                            ? '1px solid rgba(var(--primary-rgb), 0.3)'
                                                            : '1px solid rgba(255, 255, 255, 0.1)',
                                            boxShadow: isActive
                                                ? '0 0 15px rgba(var(--primary-rgb), 0.4)'
                                                : isHovered
                                                    ? '0 0 12px rgba(var(--primary-rgb), 0.35)'
                                                    : isIncluded
                                                        ? '0 0 8px rgba(var(--primary-rgb), 0.25)'
                                                        : 'none',
                                            transform: isHovered
                                                ? 'scale(1.08)'
                                                : isIncluded
                                                    ? 'scale(1.02)'
                                                    : 'scale(1)',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {SETS[key].name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="settings-grid">
                        {/* Left Column: Options */}
                        <div className="flex flex-col gap-6" id="settings-col-1">
                            <div className="flex flex-col gap-3" id="options-group">
                                <h3
                                    className="label-text mb-4"
                                    id="options-title"
                                    style={{
                                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                                        paddingBottom: '0.5rem',
                                        textTransform: 'uppercase',
                                        fontSize: '0.85rem',
                                        letterSpacing: '0.05em',
                                        color: 'rgba(255,255,255,0.5)',
                                        fontWeight: 600
                                    }}
                                >
                                    Options
                                </h3>
                                <Toggle
                                    id="opt-random-length"
                                    checked={config.randomLength}
                                    onChange={(v) => {
                                        setConfig({ ...config, randomLength: v });
                                    }}
                                    label={
                                        <span className="flex items-center gap-1">
                                            Fuzz Length (~
                                            {isEditingPercent ? (
                                                <input
                                                    autoFocus
                                                    className="ghost-size-input mx-1"
                                                    style={{ width: '2rem', textAlign: 'center' }}
                                                    defaultValue={config.lengthDeviation}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            setIsEditingPercent(false);
                                                            const val = parseInt(e.target.value, 10);
                                                            if (!isNaN(val) && val >= 0 && val <= 100) setConfig({ ...config, lengthDeviation: val });
                                                        }
                                                    }}
                                                    onBlur={(e) => {
                                                        setIsEditingPercent(false);
                                                        const val = parseInt(e.target.value, 10);
                                                        if (!isNaN(val) && val >= 0 && val <= 100) setConfig({ ...config, lengthDeviation: val });
                                                    }}
                                                    onClick={(e) => e.stopPropagation()} // Prevent toggle click
                                                    onFocus={(e) => e.target.select()}
                                                />
                                            ) : (
                                                <span
                                                    className="font-bold cursor-pointer hover:underline mx-1"
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsEditingPercent(true); }}
                                                    title="Click to change deviation %"
                                                >
                                                    {config.lengthDeviation}%
                                                </span>
                                            )}
                                            )
                                        </span>
                                    }
                                />


                                <div
                                    className="p-3 rounded-lg flex flex-col gap-3 mt-4"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)'
                                    }}
                                >
                                    <Toggle
                                        id="compat-toggle"
                                        label="Enhance Compatibility"
                                        checked={config.ensureCommon}
                                        onChange={(v) => setConfig({ ...config, ensureCommon: v })}
                                        className="w-full"
                                    />
                                    <p className="text-xs text-muted leading-relaxed" id="compat-desc">
                                        Guarantees at least one lowercase, uppercase, number, and symbol.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Advanced (Collapsible) */}
                        <div className="flex flex-col gap-4" id="settings-col-2">
                            <button
                                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                                className="flex items-center justify-between w-full cursor-pointer mb-2"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    borderBottom: '1px dashed rgba(255,255,255,0.1)',
                                    padding: 0,
                                    paddingBottom: '0.5rem'
                                }}
                            >
                                <h3
                                    className="label-text"
                                    id="advanced-title"
                                    style={{
                                        textTransform: 'uppercase',
                                        fontSize: '0.85rem',
                                        letterSpacing: '0.05em',
                                        color: 'rgba(255,255,255,0.5)',
                                        fontWeight: 600
                                    }}
                                >
                                    Advanced
                                </h3>
                                <ChevronDown
                                    size={18}
                                    className="text-muted"
                                    style={{
                                        transform: isAdvancedOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.2s ease'
                                    }}
                                />
                            </button>

                            {isAdvancedOpen && (
                                <div
                                    className="flex flex-col gap-3"
                                    style={{
                                        animation: 'fadeIn 0.2s ease'
                                    }}
                                >
                                    {['emojis', 'all_unicode'].includes(activeSet) && (
                                        <Toggle
                                            id="opt-min-ascii"
                                            checked={config.ensureMinAscii}
                                            onChange={(v) => {
                                                setConfig({ ...config, ensureMinAscii: v });
                                            }}
                                            label={
                                                <span className="flex items-center gap-1">
                                                    Guarantee ASCII ({'>='}
                                                    {isEditingAsciiPercent ? (
                                                        <input
                                                            autoFocus
                                                            className="ghost-size-input mx-1"
                                                            style={{ width: '2rem', textAlign: 'center' }}
                                                            defaultValue={config.minAsciiPercent}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    setIsEditingAsciiPercent(false);
                                                                    const val = parseInt(e.target.value, 10);
                                                                    if (!isNaN(val) && val >= 0 && val <= 100) setConfig({ ...config, minAsciiPercent: val });
                                                                }
                                                            }}
                                                            onBlur={(e) => {
                                                                setIsEditingAsciiPercent(false);
                                                                const val = parseInt(e.target.value, 10);
                                                                if (!isNaN(val) && val >= 0 && val <= 100) setConfig({ ...config, minAsciiPercent: val });
                                                            }}
                                                            onClick={(e) => e.stopPropagation()}
                                                            onFocus={(e) => e.target.select()}
                                                        />
                                                    ) : (
                                                        <span
                                                            className="font-bold cursor-pointer hover:underline mx-1"
                                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsEditingAsciiPercent(true); }}
                                                            title="Click to change min ASCII %"
                                                        >
                                                            {config.minAsciiPercent}%
                                                        </span>
                                                    )}
                                                    )
                                                </span>
                                            }
                                        />
                                    )}

                                    <div className="mt-0 pt-0 mb-4">
                                        <Input
                                            id="custom-charset-input"
                                            label={(!config.standardCharsetDisabled && config.customCharset) ? "Add characters to the charset" : "Custom Charset"}
                                            placeholder="Add characters (e.g. ñçµ...)"
                                            value={config.customCharset}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (!val) {
                                                    setConfig({
                                                        ...config,
                                                        customCharset: '',
                                                        standardCharsetDisabled: true,
                                                        customWeight: 0
                                                    });
                                                } else {
                                                    setConfig({
                                                        ...config,
                                                        customCharset: val
                                                    });
                                                }
                                            }}
                                            icon={<Keyboard size={14} />}
                                            className="compact-input mb-3"
                                            style={{
                                                padding: '0.6rem 1rem',
                                                paddingLeft: '2.2rem',
                                                fontSize: '0.875rem',
                                                borderRadius: '10px',
                                                background: 'rgba(255, 255, 255, 0.03)',
                                                border: '1px solid rgba(255, 255, 255, 0.08)'
                                            }}
                                        />

                                        {config.customCharset && (
                                            <Toggle
                                                id="opt-enable-std"
                                                label="Enable Standard Charset"
                                                checked={!config.standardCharsetDisabled}
                                                onChange={(v) => {
                                                    setConfig({ ...config, standardCharsetDisabled: !v });
                                                    if (!v) setActiveSet(null);
                                                }}
                                                className="mb-2 mt-4"
                                            />
                                        )}

                                        {/* Weight Option (Option B) */}
                                        {!config.standardCharsetDisabled && config.customCharset && (
                                            <Toggle
                                                id="opt-custom-weight"
                                                onChange={(v) => {
                                                    setConfig({ ...config, customWeight: v ? 5 : 0 });
                                                }}
                                                checked={config.customWeight > 0}
                                                label={
                                                    <span className="flex items-center gap-1">
                                                        Boost Custom Prob. (~
                                                        {isEditingWeight ? (
                                                            <input
                                                                autoFocus
                                                                className="ghost-size-input mx-1"
                                                                style={{ width: '2rem', textAlign: 'center' }}
                                                                defaultValue={config.customWeight || 5}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        setIsEditingWeight(false);
                                                                        const val = parseInt(e.target.value, 10);
                                                                        if (!isNaN(val) && val >= 0 && val <= 100) setConfig({ ...config, customWeight: val });
                                                                    }
                                                                }}
                                                                onBlur={(e) => {
                                                                    setIsEditingWeight(false);
                                                                    const val = parseInt(e.target.value, 10);
                                                                    if (!isNaN(val) && val >= 0 && val <= 100) setConfig({ ...config, customWeight: val });
                                                                }}
                                                                onClick={(e) => e.stopPropagation()}
                                                                onFocus={(e) => e.target.select()}
                                                            />
                                                        ) : (
                                                            <span
                                                                className="font-bold cursor-pointer hover:underline mx-1"
                                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsEditingWeight(true); }}
                                                                title="Click to change weight %"
                                                            >
                                                                {config.customWeight || 5}%
                                                            </span>
                                                        )}
                                                        )
                                                    </span>
                                                }
                                            />
                                        )}
                                    </div>

                                    <Input
                                        id="must-include-input"
                                        label="Must Include Characters"
                                        placeholder="e.g. @ö5"
                                        value={config.include}
                                        onChange={(e) => setConfig({ ...config, include: e.target.value })}
                                        icon={<Sparkles size={14} />}
                                        rightElement={hasConflict && (
                                            <button
                                                onClick={() => {
                                                    const excludeSet = new Set(config.exclude);
                                                    const newInclude = config.include.split('').filter(c => !excludeSet.has(c)).join('');
                                                    setConfig({ ...config, include: newInclude });
                                                }}
                                                style={{
                                                    fontSize: '10px',
                                                    background: 'rgba(239, 68, 68, 0.15)',
                                                    color: 'rgba(252, 165, 165, 1)',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'}
                                                title="Remove characters that are also in 'Forbidden'"
                                            >
                                                <Eraser size={10} />
                                                Remove Duplicate
                                            </button>
                                        )}
                                        className="compact-input"
                                        style={{
                                            padding: '0.6rem 1rem',
                                            paddingLeft: '2.2rem',
                                            paddingRight: hasConflict ? '8rem' : undefined, // Make space for the button
                                            fontSize: '0.875rem',
                                            borderRadius: '10px',
                                            background: hasConflict ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255, 255, 255, 0.03)',
                                            border: hasConflict ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)'
                                        }}
                                    />



                                    <Input
                                        id="forbidden-input"
                                        label="Forbidden Characters"
                                        placeholder="e.g. I1l0O"
                                        value={config.exclude}
                                        onChange={(e) => setConfig({ ...config, exclude: e.target.value })}
                                        icon={<ShieldAlert size={14} />}
                                        rightElement={hasConflict && (
                                            <button
                                                onClick={() => {
                                                    const includeSet = new Set(config.include);
                                                    const newExclude = config.exclude.split('').filter(c => !includeSet.has(c)).join('');
                                                    setConfig({ ...config, exclude: newExclude });
                                                }}
                                                style={{
                                                    fontSize: '10px',
                                                    background: 'rgba(239, 68, 68, 0.15)',
                                                    color: 'rgba(252, 165, 165, 1)',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'}
                                                title="Remove characters that are also in 'Must Include'"
                                            >
                                                <Eraser size={10} />
                                                Remove Duplicate
                                            </button>
                                        )}
                                        className="compact-input"
                                        style={{
                                            padding: '0.6rem 1rem',
                                            paddingLeft: '2.2rem',
                                            paddingRight: hasConflict ? '8rem' : undefined, // Make space for the button
                                            fontSize: '0.875rem',
                                            borderRadius: '10px',
                                            background: hasConflict ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255, 255, 255, 0.03)',
                                            border: hasConflict ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)'
                                        }}
                                    />

                                    {hasConflict && (
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: '12px',
                                                padding: '12px',
                                                borderRadius: '8px',
                                                marginTop: '4px',
                                                background: 'rgba(234, 179, 8, 0.1)', // Yellow background
                                                border: '1px solid rgba(234, 179, 8, 0.3)', // Yellow border
                                                boxShadow: '0 0 10px rgba(234, 179, 8, 0.05)'
                                            }}
                                        >
                                            <TriangleAlert size={18} style={{ color: '#FACC15', flexShrink: 0, marginTop: '2px' }} />
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FEF9C3', margin: 0 }}>Conflict Detected</h4>
                                                <p style={{ fontSize: '0.75rem', color: 'rgba(254, 240, 138, 0.8)', lineHeight: 1.625, margin: 0 }}>
                                                    Some characters appear in both "Must Include" and "Forbidden" fields.
                                                    This is impossible to satisfy (<b>{conflictChars.join(' ')}</b>).
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>



                {/* Section 2: Saved Configurations */}
                <div className="flex flex-col gap-4" id="presets-section">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Save size={18} className="text-primary" />
                                Saved Configurations
                            </h3>
                            {/* 
                             * ⚠️ STYLE NOTE: This project uses vanilla CSS, not Tailwind.
                             * Use inline styles or classes defined in index.css.
                             * See .agent/agents.md for guidelines.
                             */}
                            {presets.length > 0 &&
                                <Button
                                    variant="ghost"
                                    onClick={handleClearAllPresets}
                                    className="px-3 py-1 text-xs h-8"
                                    style={{
                                        color: clearConfirmLevel > 0 ? 'rgba(239, 68, 68, 1)' : undefined,
                                        borderColor: clearConfirmLevel > 0 ? 'rgba(239, 68, 68, 0.5)' : undefined
                                    }}
                                >
                                    {getClearButtonText()}
                                </Button>
                            }
                        </div>
                    </div>

                    {isCreatingPreset && (
                        <div className="flex gap-2 items-center w-full animate-in fade-in slide-in-from-top-2 mb-3">
                            <div className="flex-1 relative group">
                                <input
                                    autoFocus
                                    placeholder="Configuration name..."
                                    value={newPresetName}
                                    onChange={(e) => setNewPresetName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && saveCurrentAsPreset()}
                                    className="w-full transition-all"
                                    style={{
                                        height: '2.5rem',
                                        padding: '0 1rem',
                                        borderRadius: '9999px',
                                        background: 'rgba(0, 0, 0, 0.4)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        outline: 'none',
                                        fontSize: '0.875rem',
                                        color: 'white',
                                        backdropFilter: 'blur(4px)'
                                    }}
                                />
                            </div>

                            <button
                                onClick={saveCurrentAsPreset}
                                className="icon-btn transition-all"
                                style={{
                                    height: '2.5rem',
                                    width: '2.5rem',
                                    borderRadius: '9999px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    color: 'var(--text-muted)',
                                    backdropFilter: 'blur(4px)'
                                }}
                                title="Confirm Save"
                            >
                                <Check size={18} />
                            </button>

                            <button
                                onClick={() => setIsCreatingPreset(false)}
                                className="icon-btn transition-colors"
                                style={{
                                    height: '2.5rem',
                                    width: '2.5rem',
                                    borderRadius: '9999px',
                                    color: 'rgba(239, 68, 68, 0.7)'
                                }}
                                title="Cancel"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-6 items-center" style={{ padding: '0.25rem' }}>
                        {presets.map(preset => {
                            const isActive = activePresetId === preset.id;
                            return (
                                <div
                                    key={preset.id}
                                    onClick={() => !isShiftPressed && loadPreset(preset)}
                                    className="group relative flex items-center gap-4 rounded-lg cursor-pointer select-none overflow-hidden preset-item"
                                    style={{
                                        paddingLeft: '1rem',
                                        paddingRight: '0.5rem',
                                        height: '2.5rem',
                                        background: isActive
                                            ? 'linear-gradient(90deg, rgba(var(--primary-rgb), 0.15), rgba(var(--secondary-rgb), 0.05))'
                                            : 'rgba(0, 0, 0, 0.2)',
                                        border: isActive
                                            ? '1px solid rgba(var(--primary-rgb), 0.5)'
                                            : '1px solid rgba(255, 255, 255, 0.05)',
                                        boxShadow: isActive
                                            ? '0 0 20px rgba(var(--primary-rgb), 0.15), inset 0 0 10px rgba(var(--primary-rgb), 0.05)'
                                            : 'none',
                                        transform: isActive ? 'scale(1.05)' : 'scale(1)',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.transform = 'scale(1.1)';
                                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                                        }
                                    }}
                                >
                                    {isActive && (
                                        <div style={{
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            bottom: 0,
                                            width: '2px',
                                            background: 'var(--primary)',
                                            boxShadow: '0 0 8px var(--primary)'
                                        }}></div>
                                    )}

                                    {/* Preset name - always visible */}
                                    <span
                                        className="text-xs font-bold tracking-wider uppercase"
                                        style={{
                                            color: isActive ? 'white' : 'var(--text-muted)',
                                            textShadow: isActive ? '0 0 10px rgba(255,255,255,0.3)' : 'none',
                                            opacity: isShiftPressed ? 0.3 : 1,
                                            transition: 'opacity 0.2s ease'
                                        }}
                                    >
                                        {preset.name}
                                    </span>

                                    {/* Delete overlay - centered, only visible when Shift is pressed */}
                                    {isShiftPressed && (
                                        <button
                                            onClick={(e) => deletePreset(preset.id, e)}
                                            className="preset-delete-overlay"
                                            style={{
                                                position: 'absolute',
                                                inset: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: 'rgba(239, 68, 68, 0.05)',
                                                border: 'none',
                                                borderRadius: 'inherit',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
                                                e.currentTarget.querySelector('svg').style.transform = 'scale(1.15) rotate(-8deg)';
                                                e.currentTarget.querySelector('svg').style.color = 'rgba(239, 68, 68, 0.7)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)';
                                                e.currentTarget.querySelector('svg').style.transform = 'scale(1) rotate(0deg)';
                                                e.currentTarget.querySelector('svg').style.color = 'rgba(239, 68, 68, 0.4)';
                                            }}
                                            title="Delete preset"
                                        >
                                            <Trash2
                                                size={16}
                                                style={{
                                                    color: 'rgba(239, 68, 68, 0.4)',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            />
                                        </button>
                                    )}
                                </div>
                            );
                        })}

                        {/* Save Current Config Button - Tech Style */}
                        {!isCreatingPreset && (
                            <button
                                onClick={() => setIsCreatingPreset(true)}
                                className="flex items-center gap-2 px-4 h-10 rounded-lg cursor-pointer transition-all text-muted"
                                style={{
                                    background: 'rgba(0, 0, 0, 0.2)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                }}
                            >
                                <Plus size={16} />
                                <span className="font-semibold text-xs uppercase tracking-wider">Save Current</span>
                            </button>
                        )}
                    </div>

                    {/* Hint message for delete functionality - always rendered, visibility controlled */}
                    {presets.length > 0 && (
                        <p
                            className="text-xs text-muted"
                            style={{
                                opacity: 0.5,
                                marginTop: '0.5rem',
                                visibility: isShiftPressed ? 'hidden' : 'visible',
                                transition: 'visibility 0s, opacity 0.2s ease',
                                opacity: isShiftPressed ? 0 : 0.5
                            }}
                        >
                            Hold <kbd style={{
                                background: 'rgba(255,255,255,0.1)',
                                padding: '0.1rem 0.4rem',
                                borderRadius: '4px',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.7rem'
                            }}>Shift</kbd> to delete individual presets
                        </p>
                    )}
                </div>
            </GlassCard>
        </div>
    );
}
