import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw, Copy, Check, Eye, EyeOff, Dice5, ShieldAlert, Sparkles, Plus, Trash2, Save, ChevronDown, Sliders } from 'lucide-react';
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
    const DEFAULT_CONFIG = {
        length: 16,
        tokens: ['ascii'],
        exclude: '',
        include: '',
        ensureCommon: true,
        maxPossible: 128,
        onlyPrintable: false
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
        const charset = buildCharset({
            tokens: config.tokens,
            exclude: config.exclude,
            include: config.include,
            onlyPrintable: config.onlyPrintable
        });
        const res = generatePassword({
            // ... (rest of handleGenerate doesn't change usually but let's be careful with chunk)

            length: config.length,
            charset,
            mandatoryChars: config.include,
            ensureRobustness: config.ensureCommon // Mapped to the new logic
        });

        // Detect replacement characters and other anomalies
        const pwd = res.password;
        const indices = new Set();
        const weirdChar = '🩍'; // User provided char

        // 1. Check for Specials Block (U+FFF0 - U+FFFF) specifically
        // 2. Check for Private Use Area (U+E000 - U+F8FF) - often render as boxes/tofu
        // 3. Check for Lone Surrogates (U+D800 - U+DFFF) - caused by splitting multi-byte chars

        for (let i = 0; i < pwd.length; i++) {
            const code = pwd.charCodeAt(i);
            let isProblematic = false;

            // Check for Specials (includes Replacement Char U+FFFD)
            // U+FFF0 - U+FFFF
            if (code >= 0xFFF0 && code <= 0xFFFF) {
                isProblematic = true;
            }

            // Check for Private Use Area (PUA)
            // U+E000 - U+F8FF
            else if (code >= 0xE000 && code <= 0xF8FF) {
                isProblematic = true;
            }

            // Check for Surrogates (Lone Surrogates detection)
            else if (code >= 0xD800 && code <= 0xDFFF) {
                // High Surrogate?
                if (code >= 0xD800 && code <= 0xDBFF) {
                    const nextCode = i + 1 < pwd.length ? pwd.charCodeAt(i + 1) : 0;
                    if (nextCode >= 0xDC00 && nextCode <= 0xDFFF) {
                        // Valid pair, skip next char
                        i++;
                        continue;
                    } else {
                        // High surrogate without low surrogate -> Lone (Replacement Char)
                        isProblematic = true;
                    }
                }
                // Low Surrogate?
                else {
                    // If we are here, it's a Low Surrogate without a preceding High (since we handled pairs above)
                    isProblematic = true;
                }
            }

            // High likelihood of unassigned characters not being caught by simple range checks
            // So let's log everything for the user to debug
            // console.groupCollapsed('Password Character Audit');
            const debugInfo = [];
            for (let k = 0; k < pwd.length; k++) {
                const cp = pwd.codePointAt(k);
                // Handle surrogate pairs for iteration
                if (cp > 0xFFFF) {
                    k++; // skip next unit
                }
                debugInfo.push(`Char: "${String.fromCodePoint(cp)}" U+${cp.toString(16).toUpperCase().padStart(4, '0')}`);
            }
            // console.table(debugInfo);
            // console.groupEnd();

            // Existing detection logic ...
            if (isProblematic) {
                indices.add(i);
            }
        }

        // Check for specific weird char users reported
        let pos = pwd.indexOf(weirdChar);
        while (pos !== -1) {
            indices.add(pos);
            pos = pwd.indexOf(weirdChar, pos + 1);
        }

        if (indices.size > 0) {
            const sortedIndices = Array.from(indices).sort((a, b) => a - b);
            // console.log(`replacement char detected at pos ${sortedIndices.join(',')}`);
            console.warn('Detected problematic characters:', sortedIndices.map(idx => {
                const cp = pwd.codePointAt(idx);
                return `Pos ${idx}: "${String.fromCodePoint(cp)}" (U+${cp.toString(16).toUpperCase().padStart(4, '0')})`;
            }));
        }

        setResult(res);
        setCopied(false);
        setHasBeenCopied(false);
        if (isScrambling) setIsScrambling(false);
    };

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
        setConfig({ ...config, tokens: SETS[setId].tokens });
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
                                    className="ghost-size-input text-primary font-bold"
                                />
                            ) : (
                                <span
                                    className="font-mono font-bold text-primary cursor-pointer hover:underline"
                                    id="current-length-val"
                                    onClick={() => setIsEditingLength(true)}
                                    title="Click to edit length"
                                >
                                    {sliderLength}
                                </span>
                            )}
                            <span className="text-muted" id="length-sep">/</span>
                            {isEditingMax ? (
                                <input
                                    id="max-length-editor"
                                    autoFocus
                                    defaultValue={config.maxPossible}
                                    onKeyDown={handleMaxChange}
                                    onBlur={handleMaxChange}
                                    className="ghost-size-input"
                                />
                            ) : (
                                <span
                                    id="max-length-display"
                                    className="font-mono text-muted cursor-pointer hover:text-primary transition-colors"
                                    onClick={() => setIsEditingMax(true)}
                                    title="Click to edit max"
                                >
                                    {config.maxPossible}
                                </span>
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
                                <h3 className="label-text mb-2" id="options-title">Options</h3>
                                <Toggle
                                    id="opt-bidon"
                                    label="Bidon"
                                    checked={config.tokens.includes('bidon')}
                                    onChange={() => { }}
                                />
                                {(activeSet === 'all_unicode' || activeSet === 'emojis') && (
                                    <Toggle
                                        id="opt-printable"
                                        label="Only Printable"
                                        checked={config.onlyPrintable}
                                        onChange={(v) => setConfig({ ...config, onlyPrintable: v })}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Right Column: Advanced (Collapsible) */}
                        <div className="flex flex-col gap-4" id="settings-col-2">
                            <button
                                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                                className="flex items-center justify-between w-full cursor-pointer"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: 0
                                }}
                            >
                                <h3 className="label-text" id="advanced-title">Advanced</h3>
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
                                    <div
                                        className="p-3 rounded-lg flex flex-col gap-3"
                                        id="compat-area"
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

                                    <Input
                                        id="must-include-input"
                                        label="Must Include Characters"
                                        placeholder="e.g. @ö5"
                                        value={config.include}
                                        onChange={(e) => setConfig({ ...config, include: e.target.value })}
                                        icon={<Sparkles size={14} />}
                                        className="compact-input"
                                        style={{
                                            padding: '0.6rem 1rem',
                                            paddingLeft: '2.2rem',
                                            fontSize: '0.875rem',
                                            borderRadius: '10px',
                                            background: 'rgba(255, 255, 255, 0.03)',
                                            border: '1px solid rgba(255, 255, 255, 0.08)'
                                        }}
                                    />

                                    <Input
                                        id="forbidden-input"
                                        label="Forbidden Characters"
                                        placeholder="e.g. I1l0O"
                                        value={config.exclude}
                                        onChange={(e) => setConfig({ ...config, exclude: e.target.value })}
                                        icon={<ShieldAlert size={14} />}
                                        className="compact-input"
                                        style={{
                                            padding: '0.6rem 1rem',
                                            paddingLeft: '2.2rem',
                                            fontSize: '0.875rem',
                                            borderRadius: '10px',
                                            background: 'rgba(255, 255, 255, 0.03)',
                                            border: '1px solid rgba(255, 255, 255, 0.08)'
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Dotted Divider */}
                <div
                    style={{
                        width: '100%',
                        height: '1px',
                        borderTop: '1px dashed rgba(255, 255, 255, 0.15)',
                        margin: '0.5rem 0'
                    }}
                ></div>

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
