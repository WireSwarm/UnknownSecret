import React, { useState, useEffect } from 'react';
import { RefreshCw, Copy, Check, Eye, EyeOff, Dice5, ShieldAlert, Sparkles, Plus, Trash2, Save } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Slider } from '../ui/Slider';
import { Toggle } from '../ui/Toggle';
import { generatePassword, PRESETS, buildCharset } from '../../utils/passwordGen';
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

    // Preset creation UI state
    const [isCreatingPreset, setIsCreatingPreset] = useState(false);
    const [newPresetName, setNewPresetName] = useState('');
    const [activePresetId, setActivePresetId] = useState(null);
    const [clearConfirmLevel, setClearConfirmLevel] = useState(0); // 0: Normal, 1: Sure?, 2: Really?

    // --- AUTO-SAVE EFFECT ---
    useEffect(() => {
        const payload = {
            config,
            activeSet
        };
        localStorage.setItem(STORAGE_KEY_PARAMS, JSON.stringify(payload));
    }, [config, activeSet]);

    // --- PRESETS SAVE EFFECT ---
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_PRESETS, JSON.stringify(presets));
    }, [presets]);


    // Predefined Sets
    const SETS = {
        alphanums: { id: 'alphanums', name: 'Alphanums', tokens: ['alphanums'] },
        ascii: { id: 'ascii', name: 'Ascii', tokens: ['ascii'] },
        ascii_extended: { id: 'ascii_extended', name: 'Ascii Extended', tokens: ['ascii_extended'] },
        active_languages: { id: 'active_languages', name: 'Active Languages', tokens: ['active_languages'] },
        symbols_set: { id: 'symbols_set', name: 'With Symbols', tokens: ['symbols_set'] },
        emojis: { id: 'emojis', name: 'With Emojis', tokens: ['emojis'] },
        all_unicode: { id: 'all_unicode', name: 'All Unicode', tokens: ['all_unicode'] }
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
            console.groupCollapsed('Password Character Audit');
            const debugInfo = [];
            for (let k = 0; k < pwd.length; k++) {
                const cp = pwd.codePointAt(k);
                // Handle surrogate pairs for iteration
                if (cp > 0xFFFF) {
                    k++; // skip next unit
                }
                debugInfo.push(`Char: "${String.fromCodePoint(cp)}" U+${cp.toString(16).toUpperCase().padStart(4, '0')}`);
            }
            console.table(debugInfo);
            console.groupEnd();

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
            console.log(`replacement char detected at pos ${sortedIndices.join(',')}`);
            console.warn('Detected problematic characters:', sortedIndices.map(idx => {
                const cp = pwd.codePointAt(idx);
                return `Pos ${idx}: "${String.fromCodePoint(cp)}" (U+${cp.toString(16).toUpperCase().padStart(4, '0')})`;
            }));
        }

        setResult(res);
        setCopied(false);
    };

    // Initial & Watch trigger
    useEffect(() => {
        handleGenerate();
    }, [config]);

    const copyToClipboard = () => {
        if (!result.password) return;
        navigator.clipboard.writeText(result.password);
        setCopied(true);
        if (onCopyPassword) onCopyPassword({ ...result, timestamp: Date.now() });
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
        if (clearConfirmLevel === 2) return "REALLY Sure?";
        return <Trash2 size={16} />;
    };

    return (
        <div className="flex flex-col gap-6" id="generator-panel">
            {/* Centered Output Section */}
            <div className="flex flex-col items-center w-full" id="output-section">
                <div className="w-full max-w-2xl relative" id="password-input-area">
                    <Input
                        id="main-password-input"
                        value={result.password}
                        readOnly
                        type={showPassword ? "text" : "password"}
                        className="keeper-ignore text-center text-2xl font-bold tracking-wider radiant-text input-rounded pr-24" // Added pr-24 for padding
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
                                    {config.length}
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
                        value={config.length}
                        min={1}
                        max={config.maxPossible}
                        onChange={(val) => setConfig({ ...config, length: val })}
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

            {/* Options / Character Sets */}
            <GlassCard className="p-6 mt-4" id="config-card">
                <h3 className="label-text mb-4" id="charset-title">Character set</h3>
                <div className="flex flex-wrap gap-3 mb-6 justify-center" id="charset-selectors">
                    {Object.keys(SETS).map(key => (
                        <button
                            id={`charset-btn-${key}`}
                            key={key}
                            onClick={() => handleSetChange(key)}
                            className={`
                    charset-selector-btn rounded-full transition-all
                    ${activeSet === key
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'bg-black-20 hover:bg-white-5 text-muted'}
                 `}
                            style={{
                                border: activeSet === key ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                        >
                            {SETS[key].name}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md-grid-cols-2 gap-8" id="settings-grid">
                    {/* Left Column: Sliders & Checks */}
                    <div className="flex flex-col gap-6" id="settings-col-1">
                        <div className="flex flex-col gap-3" id="options-group">
                            <h3 className="label-text mb-2" id="options-title">Option</h3>
                            <Toggle
                                id="opt-bidon"
                                label="Bidon"
                                checked={config.tokens.includes('bidon')}
                                onChange={() => { }} // No effect as requested
                            />
                            {activeSet === 'all_unicode' && (
                                <Toggle
                                    id="opt-printable"
                                    label="Only Imprimable"
                                    checked={config.onlyPrintable}
                                    onChange={(v) => setConfig({ ...config, onlyPrintable: v })}
                                />
                            )}
                        </div>
                    </div>

                    {/* Right Column: Advanced */}
                    <div className="flex flex-col gap-6" id="settings-col-2">
                        <h3 className="label-text" id="advanced-title">Advanced Options</h3>

                        <div className="p-4 rounded-xl bg-black-20 border border-white-5 flex flex-col gap-4" id="compat-area">
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
                            icon={<Sparkles size={16} />}
                        />

                        <Input
                            id="forbidden-input"
                            label="Forbidden Characters"
                            placeholder="e.g. I1l0O"
                            value={config.exclude}
                            onChange={(e) => setConfig({ ...config, exclude: e.target.value })}
                            icon={<ShieldAlert size={16} />}
                        />
                    </div>
                </div>
            </GlassCard>

            {/* Presets Section */}
            <GlassCard className="p-6" id="presets-card">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <h3 className="label-text" id="presets-title">Presets</h3>
                        {presets.length > 0 && (
                            <button
                                onClick={handleClearAllPresets}
                                className={`
                                    text-xs px-2 py-1 rounded transition-all font-bold tracking-wider
                                    ${clearConfirmLevel > 0 ? 'bg-red-500 text-white animate-pulse' : 'text-muted hover:text-red-400 bg-white-5 hover:bg-white-10'}
                                `}
                                title="Clear all presets"
                            >
                                {getClearButtonText()}
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => setIsCreatingPreset(!isCreatingPreset)}
                        className="icon-btn text-primary hover:bg-primary/20"
                        title="Add current configuration as preset"
                    >
                        <Plus size={24} />
                    </button>
                </div>

                {isCreatingPreset && (
                    <div className="flex gap-2 mb-4 items-center bg-black-20 p-2 rounded-lg animate-in fade-in slide-in-from-top-2">
                        <Input
                            autoFocus
                            placeholder="Preset Name (e.g. Microsoft Legacy)"
                            value={newPresetName}
                            onChange={(e) => setNewPresetName(e.target.value)}
                            wrapperClassName="flex-1 mb-0"
                            className="h-10"
                            onKeyDown={(e) => e.key === 'Enter' && saveCurrentAsPreset()}
                        />
                        <button
                            onClick={() => setIsCreatingPreset(false)}
                            className="bg-black-20 text-muted p-2 rounded-md hover:bg-red-500/20 hover:text-red-500 transition-colors"
                            title="Cancel"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                )}

                <div className="flex flex-wrap gap-3">
                    {presets.length === 0 ? (
                        <p className="text-muted text-sm italic w-full text-center py-2">No presets saved yet.</p>
                    ) : (
                        presets.map(preset => {
                            const isActive = activePresetId === preset.id;
                            return (
                                <div
                                    key={preset.id}
                                    onClick={() => loadPreset(preset)}
                                    className={`
                                        group relative flex items-center justify-between gap-3 px-5 h-12 rounded-full cursor-pointer transition-all min-w-[130px]
                                        ${isActive
                                            ? 'bg-primary text-white shadow-lg border-primary'
                                            : 'bg-black-20 hover:bg-white-5 text-muted border-white-5 hover:border-white-10'}
                                    `}
                                    style={{
                                        border: isActive ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.1)'
                                    }}
                                >
                                    <span className={`text-sm font-bold tracking-wider ${isActive ? 'text-white' : 'text-muted'}`}>
                                        {preset.name}
                                    </span>

                                    <button
                                        onClick={(e) => deletePreset(preset.id, e)}
                                        className="p-1 rounded-full transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                        style={{ color: 'rgba(239, 68, 68, 0.9)' }}
                                        title="Delete preset"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </GlassCard>
        </div>
    );
}
