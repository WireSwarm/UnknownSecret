import React, { useState, useEffect, useMemo, useRef } from 'react';
import { RefreshCw, Settings, Copy, Check, Eye, EyeOff, ShieldAlert, Sparkles, Plus, Trash2, Save, ChevronDown, Sliders, TriangleAlert, Eraser, Edit2, Keyboard, BarChart2, Download, Upload, AlertCircle, X, RotateCcw, Search, ExternalLink, Lock } from 'lucide-react';
import { createPortal } from 'react-dom';
const DiceIcon = ({ size = 22, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        className={className}
        style={{ fill: 'currentColor' }}
    >
        <path d="M449.532,105.602L288.463,8.989C278.474,2.994,267.235,0,256.011,0c-11.239,0-22.483,2.994-32.467,8.989 L62.475,105.602c-19.012,11.406-30.647,31.95-30.647,54.117v192.562c0,22.168,11.635,42.711,30.647,54.117l161.069,96.613 c9.984,5.988,21.228,8.989,32.467,8.989c11.225,0,22.463-3.001,32.452-8.989l161.069-96.613 c19.012-11.406,30.64-31.949,30.64-54.117V159.719C480.172,137.552,468.544,117.008,449.532,105.602z M250.599,492.733 c-6.029-0.745-11.93-2.719-17.32-5.948L72.21,390.172c-13.306-7.989-21.456-22.369-21.456-37.891V159.719 c0-6.022,1.236-11.862,3.518-17.233l196.328,117.76V492.733z M59.669,133.114c3.364-4.464,7.593-8.318,12.541-11.285 l161.069-96.613c6.995-4.196,14.85-6.291,22.732-6.291c7.868,0,15.723,2.095,22.718,6.291l161.069,96.613 c4.941,2.967,9.184,6.821,12.54,11.285L256.011,250.881L59.669,133.114z M461.254,352.281c0,15.522-8.15,29.902-21.456,37.891 l-161.069,96.613c-5.398,3.229-11.292,5.203-17.321,5.948V260.246l196.328-117.76c2.283,5.37,3.518,11.211,3.518,17.233V352.281z" />
        <path d="M160.209,119.875c-9.828-7.278-26.021-7.465-36.165-0.41c-10.144,7.056-10.399,18.67-0.57,25.947 c9.828,7.277,26.022,7.459,36.159,0.41C169.783,138.766,170.038,127.152,160.209,119.875z" />
        <path d="M279.159,48.686c-9.829-7.277-26.022-7.458-36.172-0.403c-10.137,7.049-10.393,18.664-0.564,25.941 c9.829,7.284,26.022,7.458,36.159,0.416C288.732,67.578,288.987,55.963,279.159,48.686z" />
        <path d="M220.59,82.024c-9.834-7.27-26.028-7.458-36.172-0.403c-10.15,7.049-10.406,18.664-0.571,25.941 c9.829,7.284,26.022,7.458,36.166,0.416C230.151,100.916,230.412,89.302,220.59,82.024z" />
        <path d="M267.437,184.754c-9.828-7.277-26.015-7.459-36.159-0.41c-10.15,7.056-10.405,18.671-0.577,25.947 c9.828,7.284,26.021,7.459,36.172,0.41C277.01,203.645,277.265,192.031,267.437,184.754z" />
        <path d="M386.385,113.564c-9.828-7.271-26.021-7.458-36.158-0.403c-10.151,7.049-10.406,18.664-0.577,25.941 c9.828,7.284,26.02,7.458,36.172,0.416C395.959,132.456,396.214,120.842,386.385,113.564z" />
        <path d="M327.817,146.903c-9.829-7.27-26.022-7.458-36.172-0.403c-10.137,7.049-10.392,18.664-0.564,25.941 c9.828,7.284,26.021,7.465,36.158,0.416C337.391,165.795,337.646,154.188,327.817,146.903z" />
        <path d="M89.289,248.303c11.158,6.083,20.194,1.961,20.194-9.19c0-11.158-9.036-25.128-20.194-31.21 c-11.157-6.083-20.207-1.967-20.207,9.19C69.081,228.244,78.131,242.221,89.289,248.303z" />
        <path d="M202.061,309.771c11.158,6.082,20.208,1.967,20.208-9.184c0-11.157-9.05-25.135-20.208-31.217 c-11.15-6.076-20.194-1.961-20.194,9.198C181.867,289.719,190.911,303.689,202.061,309.771z" />
        <path d="M89.289,361.082c11.158,6.076,20.194,1.967,20.194-9.19c0-11.158-9.036-25.129-20.194-31.21 c-11.157-6.083-20.207-1.968-20.207,9.19C69.081,341.029,78.131,355,89.289,361.082z" />
        <path d="M202.061,422.55c11.158,6.082,20.208,1.967,20.208-9.191c0-11.151-9.05-25.128-20.208-31.21 c-11.15-6.076-20.194-1.961-20.194,9.19C181.867,402.497,190.911,416.468,202.061,422.55z" />
        <path d="M145.675,335.424c11.158,6.082,20.201,1.967,20.201-9.191c0-11.151-9.044-25.128-20.201-31.204 c-11.158-6.082-20.201-1.967-20.201,9.185C125.474,315.37,134.517,329.341,145.675,335.424z" />
        <path d="M418.341,207.902c-11.158,6.082-20.208,20.053-20.208,31.21c0,11.151,9.05,15.273,20.208,9.19 c11.144-6.082,20.194-20.059,20.194-31.21C438.535,205.935,429.486,201.819,418.341,207.902z" />
        <path d="M305.555,382.149c-11.158,6.082-20.194,20.059-20.194,31.21c0,11.158,9.036,15.273,20.194,9.191 c11.158-6.082,20.194-20.053,20.194-31.211C325.749,380.188,316.714,376.074,305.555,382.149z" />
        <path d="M361.948,295.028c-11.158,6.076-20.207,20.053-20.207,31.204c0,11.158,9.05,15.273,20.207,9.191 c11.158-6.083,20.194-20.053,20.194-31.21C382.142,293.062,373.106,288.947,361.948,295.028z" />
    </svg>
);

const AppleIcon = ({ stage = 4, size = 16, className = "", color }) => {
    let appPath = "";
    if (stage === 0) { // Tronçon
        appPath = "M 12,8 C 10,6 8,7 8,8 C 11,10 11,16 8,18 C 8,19 10,22 12,21 C 14,22 16,19 16,18 C 13,16 13,10 16,8 C 16,7 14,6 12,8 Z";
    } else if (stage === 1) { // 80% mangé
        appPath = "M 12,8 C 10,6 8,7 8,8 A 3,4 0 0,1 8,18 C 8,19 10,22 12,21 C 14,22 16,19 16,18 A 3,4 0 0,1 16,8 C 16,7 14,6 12,8 Z";
    } else if (stage === 2) { // 30% mangé
        appPath = "M 12,8 C 10,6 6,6 5,11 C 4,16 8,22 12,21 C 15,22 17,20 18,17 A 4,4 0 0,1 18,9 C 16,7 14,6 12,8 Z";
    } else { // 3 ou 4: Complète
        appPath = "M 12,8 C 10,6 6,6 5,11 C 4,16 8,22 12,21 C 16,22 20,16 19,11 C 18,6 14,6 12,8 Z";
    }

    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color || "currentColor"} className={className} style={stage === 4 ? { filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))' } : {}}>
            <path d={appPath} />
            <path d="M 12,7 C 12,3 16,2 16,2 C 16,6 13,8 12,7 Z" />
            {stage === 4 && (
                <path d="M 7.5,12 C 7,9 9,7 12,8.5 C 9.5,8.8 8.5,10 8.5,13 C 8.5,12 7.5,12 7.5,12 Z" fill="rgba(255,255,255,0.7)" />
            )}
        </svg>
    );
};
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Slider } from '../ui/Slider';
import { Toggle } from '../ui/Toggle';
import { HelpPopover } from '../ui/HelpPopover';
import { generatePassword, PRESETS, buildCharset, getCharsetSizes } from '../../utils/passwordGen';
import { EntropyMeter } from './EntropyMeter';
import { PasswordStats } from './PasswordStats';
import { UnicodeChecker } from './UnicodeChecker';
import { useLanguage } from '../../i18n';
const CheckboxOption = ({ id, label, checked, onChange, disabled, tooltip, includedBy }) => (
    <label htmlFor={id} title={tooltip} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${checked ? 'bg-primary/10 hover:bg-primary/20' : 'bg-white/5 hover:bg-white/10'}`} style={{ border: '1px solid', borderColor: checked ? (includedBy ? 'rgba(255,255,255,0.1)' : 'rgba(var(--primary-rgb), 0.3)') : 'rgba(255,255,255,0.1)', opacity: disabled ? 0.5 : includedBy ? 0.4 : 1, boxSizing: 'border-box' }}>
        <div style={{ width: '16px', height: '16px', minWidth: '16px', flexShrink: 0, border: includedBy ? '2px solid rgba(255,255,255,0.15)' : checked ? '2px solid var(--primary)' : '2px solid rgba(255,255,255,0.2)', backgroundColor: includedBy ? 'rgba(167,139,250,0.15)' : checked ? 'var(--primary)' : 'rgba(0,0,0,0.2)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease', boxSizing: 'border-box' }}>
            {checked && <Check size={12} strokeWidth={3} style={{ color: includedBy ? 'rgba(167,139,250,0.7)' : 'white' }} />}
        </div>
        <input type="checkbox" id={id} style={{ display: 'none' }} checked={checked} onChange={onChange} disabled={disabled} />
        <span className="text-xs font-semibold tracking-wide select-none flex-1" style={{ color: 'rgba(255,255,255,0.9)' }}>{label}</span>
    </label>
);
export function GeneratorPanel({ onCopyPassword }) {
    // --- PERSISTENCE CONSTANTS ---
    const STORAGE_KEY_PARAMS = 'usr_gen_params';
    const STORAGE_KEY_PRESETS = 'usr_gen_presets';
    // Default configuration reference
    // A Global Option is an option available for all charsets.
    const DEFAULT_CONFIG = {
        length: 50,
        tokens: ['lowercase', 'uppercase', 'numbers', 'basic_symbols', 'advanced_symbols'],
        exclude: '',
        include: '',
        ensureCommon: true,
        maxPossible: 128,
        randomLength: false,
        lengthDeviation: 5,
        ensureMinAscii: false,
        minAsciiPercent: 5,
        customCharset: '',
        standardCharsetDisabled: false,
        customWeight: 0,
        isPostQuantum: false,
        targetByteSize: 72, // null = length mode, number = byte mode
        lower: true,
        upper: true,
        numbers: true,
        basic: true,
        advanced: true
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
                return parsed.activeSet || null;
            }
        } catch { /* ignore: localStorage may not be available */ }
        return null;
    });
    // Presets State
    const [presets, setPresets] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_PRESETS);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [isEditingMax, setIsEditingMax] = useState(false);
    const [isEditingLength, setIsEditingLength] = useState(false);
    const [result, setResult] = useState({ password: '', entropy: 0 });
    const [showPassword, setShowPassword] = useState(false);
    const [copied, setCopied] = useState(false);
    const [hasBeenCopied, setHasBeenCopied] = useState(false); // Track if current password was copied
    const [showStats, setShowStats] = useState(false); // Toggle for stats panel
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
    const [isDraggingOver, setIsDraggingOver] = useState(false); // Track drag state for import drop zone
    const [importConflict, setImportConflict] = useState(null); // { duplicates: [...], newOnly: [...], all: [...] }
    const [defaultPresets, setDefaultPresets] = useState([]); // Default presets loaded from JSON
    const [isInspecting, setIsInspecting] = useState(false); // Character Inspection Mode
    const { t } = useLanguage();

    // Cursor follower for inspect mode
    const cursorFollowerRef = useRef(null);
    const unicodeCheckerRef = useRef(null);
    const inspectScrollRef = useRef(null);

    // Watch for config changes: auto-select matching preset, or deselect if none match
    useEffect(() => {
        const allPresets = [...defaultPresets, ...presets];
        const matchingPreset = allPresets.find(p =>
            p.activeSet === activeSet &&
            JSON.stringify(p.config) === JSON.stringify(config)
        );
        setActivePresetId(matchingPreset ? matchingPreset.id : null);
    }, [config, activeSet, presets, defaultPresets]);
    useEffect(() => {
        let animationFrameId;
        let pX = 0;
        let pY = 0;
        const handleMouseMove = (e) => {
            pX = e.clientX;
            pY = e.clientY;
            if (cursorFollowerRef.current && isInspecting) {
                // Position 15px to right and 15px up from cursor
                cursorFollowerRef.current.style.transform = `translate(${pX + 12}px, ${pY - 12}px)`;
            }
        };
        const checkScroll = () => {
            if (isInspecting && inspectScrollRef.current) {
                const el = inspectScrollRef.current;
                const rect = el.getBoundingClientRect();
                // Only consider scrolling if mouse is horizontally within the window bounds
                // And vertically roughly over the element. 
                if (pY >= rect.top - 20 && pY <= rect.bottom + 20) {
                    const leftEdge = rect.left;
                    const rightEdge = rect.right;
                    const EDGE_SIZE = 60; // Zone in px that triggers scrolling
                    const MAX_SPEED = 6;
                    let speed = 0;
                    if (pX >= leftEdge && pX <= leftEdge + EDGE_SIZE) {
                        const intensity = 1 - ((pX - leftEdge) / EDGE_SIZE);
                        speed = -(MAX_SPEED * intensity);
                    } else if (pX <= rightEdge && pX >= rightEdge - EDGE_SIZE) {
                        const intensity = 1 - ((rightEdge - pX) / EDGE_SIZE);
                        speed = (MAX_SPEED * intensity);
                    }
                    if (speed !== 0) {
                        el.scrollLeft += speed;
                    }
                }
            }
            if (isInspecting) {
                animationFrameId = requestAnimationFrame(checkScroll);
            }
        };
        if (isInspecting) {
            window.addEventListener('mousemove', handleMouseMove);
            animationFrameId = requestAnimationFrame(checkScroll);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [isInspecting]);
    // Effect to track Shift key globally
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Shift') setIsShiftPressed(true);
        };
        const handleKeyUp = (e) => {
            if (e.key === 'Shift') setIsShiftPressed(false);
        };
        // Reset shift state when window loses focus (prevents stuck state)
        const handleBlur = () => {
            setIsShiftPressed(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('blur', handleBlur);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('blur', handleBlur);
        };
    }, []);
    // Local state for slider to prevent regeneration while dragging
    const [sliderLength, setSliderLength] = useState(config.length);
    // Scramble Effect State
    const [isScrambling, setIsScrambling] = useState(false);
    const [scrambleText, setScrambleText] = useState('');
    // isInspecting moved up
    // Sync sliderLength when config changes (e.g. presets)
    useEffect(() => {
        setSliderLength(config.length);
    }, [config.length]);
    // Load default presets from bundled JSON files in src/data/default_presets/
    useEffect(() => {
        // Use Vite's glob import to find all JSON files in the folder at build time
        const presetModules = import.meta.glob('../../data/default_presets/*.json', { eager: true });
        const allPresets = [];
        Object.keys(presetModules).forEach(path => {
            const presets = presetModules[path].default || presetModules[path];
            if (Array.isArray(presets)) {
                const processedPresets = presets.map(p => ({
                    id: `def_${p.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
                    name: p.name,
                    activeSet: p.activeSet,
                    config: { ...DEFAULT_CONFIG, ...p.configDiff }
                }));
                allPresets.push(...processedPresets);
            }
        });
        setDefaultPresets(allPresets);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
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
    const SETS_ORDER = ['ascii_extended', 'symbols_set', 'active_languages', 'emojis', 'all_unicode'];
    // Get exact charset sizes (computed once and cached)
    const charsetSizes = useMemo(() => getCharsetSizes(), []);
    const SETS = useMemo(() => ({
        ascii_extended: {
            id: 'ascii_extended',
            name: t('set_title_ascii_extended'),
            tokens: ['ascii_extended'],
            description: t('set_desc_ascii_extended')
        },
        symbols_set: {
            id: 'symbols_set',
            name: t('set_title_symbols_set'),
            tokens: ['symbols_set'],
            description: t('set_desc_symbols_set')
        },
        active_languages: {
            id: 'active_languages',
            name: t('set_title_active_languages'),
            tokens: ['active_languages'],
            description: t('set_desc_active_languages')
        },
        emojis: {
            id: 'emojis',
            name: t('set_title_emojis'),
            tokens: ['emojis'],
            description: t('set_desc_emojis')
        },
        all_unicode: {
            id: 'all_unicode',
            name: t('set_title_all_unicode'),
            tokens: ['all_unicode'],
            description: t('set_desc_all_unicode')
        }
    }), [t]);
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
    const generationIdRef = useRef(0);

    // Generate function
    const handleGenerate = async () => {
        const currentGenId = ++generationIdRef.current;

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
        const res = await generatePassword({
            length: config.length,
            charset: finalCharset,
            mandatoryChars: config.include,
            ensureRobustness: config.ensureCommon, // Mapped to the new logic
            activeGroups: {
                lower: config.lower,
                upper: config.upper,
                numbers: config.numbers,
                symbols: config.basic ? ['basic'] : (config.advanced ? ['advanced'] : false)
            },
            randomizeLength: config.randomLength,
            lengthDeviation: config.lengthDeviation,
            ensureMinAscii: config.ensureMinAscii,
            minAsciiPercent: config.minAsciiPercent,
            targetByteSize: config.targetByteSize
        });

        // Prevent race conditions 
        if (currentGenId !== generationIdRef.current) return;

        setResult(res);
        // If in byte mode, sync slider to actual length
        if (config.targetByteSize && res.password) {
            setSliderLength(res.password.length);
        }
        setCopied(false);
        setHasBeenCopied(false);
        if (isScrambling) setIsScrambling(false);

        //console.log("Password generated:", res.password.length, "characters");
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
    }, [config]); // eslint-disable-line react-hooks/exhaustive-deps
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
        // Deselect if clicking the already-active set
        if (setId === activeSet) {
            setActiveSet(null);
            setConfig({
                ...config,
                lower: true,
                upper: true,
                numbers: true,
                basic: true,
                advanced: true,
                tokens: ['lowercase', 'uppercase', 'numbers', 'basic_symbols', 'advanced_symbols'],
                standardCharsetDisabled: false,
                ensureMinAscii: false,
            });
            return;
        }
        setActiveSet(setId);
        let newConfig = {
            ...config,
            tokens: SETS[setId] ? SETS[setId].tokens : config.tokens,
            standardCharsetDisabled: false // Reactivate standard charset on manual selection
        };
        // Auto-disable min ASCII if not supported by new set
        if (!['emojis', 'all_unicode'].includes(setId)) {
            newConfig.ensureMinAscii = false;
        }
        if (setId && SETS_ORDER.includes(setId)) {
            newConfig.lower = true;
            newConfig.upper = true;
            newConfig.numbers = true;
            newConfig.basic = true;
            newConfig.advanced = true;
        }
        setConfig(newConfig);
    };
    const handleCheckboxToggle = (field) => {
        let newActiveSet = null;
        setConfig(prev => {
            const next = { ...prev, [field]: !prev[field] };
            // Auto-detect `activeSet` based on checkbox combination so preset highlight is bidirectional.
            // "Extended" preset has activeSet:"ascii" and all 5 individual tokens selected.
            const isAsciiConfig = next.lower && next.upper && next.numbers && next.basic && next.advanced;
            if (isAsciiConfig) {
                newActiveSet = 'ascii';
            } else {
                newActiveSet = null;
            }
            // Always build individual tokens from checkbox state
            const customTokens = [];
            if (next.lower) customTokens.push('lowercase');
            if (next.upper) customTokens.push('uppercase');
            if (next.numbers) customTokens.push('numbers');
            if (next.basic) customTokens.push('basic_symbols');
            if (next.advanced) customTokens.push('advanced_symbols');
            next.tokens = customTokens;
            return next;
        });
        // Timeout to update active set without breaking setConfig queue
        setTimeout(() => setActiveSet(newActiveSet), 0);
    };
    const handleMaxChange = (e) => {
        if (e.key === 'Enter' || e.type === 'blur') {
            let val = parseInt(e.target.value, 10);
            if (!isNaN(val) && val > 0) {
                if (config.ensureCommon && val < 4) val = 4;
                // Cap it at something reasonable if needed, or leave it to user
                setConfig(prev => {
                    let newLen = Math.min(prev.length, val);
                    if (prev.ensureCommon && newLen < 4) newLen = 4;
                    return { ...prev, maxPossible: val, length: newLen, targetByteSize: null };
                });
            }
            setIsEditingMax(false);
        }
    };
    const handleLengthChange = (e) => {
        if (e.key === 'Enter' || e.type === 'blur') {
            let val = parseInt(e.target.value, 10);
            if (!isNaN(val) && val > 0) {
                if (config.ensureCommon && val < 4) val = 4;
                // If new length > max, update max as well
                setConfig(prev => {
                    const newMax = Math.max(prev.maxPossible, val);
                    return { ...prev, length: val, maxPossible: newMax, targetByteSize: null };
                });
            }
            setIsEditingLength(false);
        }
    }
    const handleByteChange = (bytes) => {
        // Switch to Byte Mode
        setConfig({ ...config, targetByteSize: bytes });
    };
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
        // Ensure the config object loaded contains all updated checkbox booleans
        const newConfig = { ...preset.config };
        // Sync checkboxes if tokens exist
        if (newConfig.tokens) {
            const hasHighSet = newConfig.tokens.some(t => ['ascii', 'ascii_extended', 'symbols_set', 'active_languages', 'emojis', 'all_unicode'].includes(t));
            const hasAlphanum = newConfig.tokens.includes('alphanums');

            newConfig.lower = hasHighSet || hasAlphanum || newConfig.tokens.includes('lowercase');
            newConfig.upper = hasHighSet || hasAlphanum || newConfig.tokens.includes('uppercase');
            newConfig.numbers = hasHighSet || hasAlphanum || newConfig.tokens.includes('numbers');
            newConfig.basic = hasHighSet || newConfig.tokens.includes('basic_symbols');
            newConfig.advanced = hasHighSet || newConfig.tokens.includes('advanced_symbols');
        }

        setConfig(newConfig);
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
    const handleResetConfig = () => {
        setConfig(DEFAULT_CONFIG);
        // 'ascii' matches the 'Extended' default preset (activeSet: 'ascii', configDiff: {})
        // The useEffect will auto-detect the matching preset and set activePresetId
        setActiveSet('ascii');
    };
    const fileInputRef = useRef(null);
    const dragCounterRef = useRef(0);
    const exportPresets = () => {
        const dataToExport = presets.map(p => {
            const configDiff = {};
            Object.keys(p.config).forEach(key => {
                // Use JSON stringify for array comparison to avoid reference issues, strict equality for primitives
                const isArray = Array.isArray(p.config[key]) && Array.isArray(DEFAULT_CONFIG[key]);
                const areValuesDifferent = isArray
                    ? JSON.stringify(p.config[key]) !== JSON.stringify(DEFAULT_CONFIG[key])
                    : p.config[key] !== DEFAULT_CONFIG[key];
                if (areValuesDifferent) {
                    configDiff[key] = p.config[key];
                }
            });
            return {
                name: p.name,
                activeSet: p.activeSet,
                configDiff
            };
        });
        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'unknown_secret_presets.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    const processImportFile = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target.result);
                if (!Array.isArray(importedData)) throw new Error("Invalid format");
                const newPresets = importedData.map(item => ({
                    id: Date.now() + Math.random(),
                    name: item.name,
                    activeSet: item.activeSet,
                    config: { ...DEFAULT_CONFIG, ...item.configDiff }
                }));
                // Check for duplicates by name
                const existingNames = new Set(presets.map(p => p.name.toLowerCase()));
                const duplicates = newPresets.filter(p => existingNames.has(p.name.toLowerCase()));
                const newOnly = newPresets.filter(p => !existingNames.has(p.name.toLowerCase()));
                if (duplicates.length > 0) {
                    // Show conflict modal
                    setImportConflict({ duplicates, newOnly, all: newPresets });
                } else {
                    // No conflicts, import directly
                    setPresets(prev => [...prev, ...newPresets]);
                }
            } catch (err) {
                console.error("Import failed", err);
                alert(t('import_failed'));
            }
        };
        reader.readAsText(file);
    };
    const handleImportOverwrite = () => {
        if (!importConflict) return;
        const { duplicates, newOnly } = importConflict;
        setPresets(prev => {
            // Remove existing presets that have the same name as duplicates
            const duplicateNames = new Set(duplicates.map(d => d.name.toLowerCase()));
            const filtered = prev.filter(p => !duplicateNames.has(p.name.toLowerCase()));
            // Add all new presets (both new and the ones that replace)
            return [...filtered, ...duplicates, ...newOnly];
        });
        setImportConflict(null);
    };
    const handleImportSkip = () => {
        if (!importConflict) return;
        const { newOnly } = importConflict;
        // Only add presets that don't conflict
        if (newOnly.length > 0) {
            setPresets(prev => [...prev, ...newOnly]);
        }
        setImportConflict(null);
    };
    const handleImportCancel = () => {
        setImportConflict(null);
    };
    const importPresets = (e) => {
        const file = e.target.files[0];
        processImportFile(file);
        e.target.value = ''; // Reset input
    };
    const handleDragEnter = (e) => {
        e.preventDefault();
        dragCounterRef.current++;
        if (dragCounterRef.current === 1) {
            setIsDraggingOver(true);
        }
    };
    const handleDragOver = (e) => {
        e.preventDefault();
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        dragCounterRef.current--;
        if (dragCounterRef.current === 0) {
            setIsDraggingOver(false);
        }
    };
    const handleDrop = (e) => {
        e.preventDefault();
        dragCounterRef.current = 0;
        setIsDraggingOver(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/json') {
            processImportFile(file);
        }
        // Don't alert for non-JSON, user might drop elsewhere by accident
    };
    // Global drag-and-drop listeners
    useEffect(() => {
        document.addEventListener('dragenter', handleDragEnter);
        document.addEventListener('dragover', handleDragOver);
        document.addEventListener('dragleave', handleDragLeave);
        document.addEventListener('drop', handleDrop);
        return () => {
            document.removeEventListener('dragenter', handleDragEnter);
            document.removeEventListener('dragover', handleDragOver);
            document.removeEventListener('dragleave', handleDragLeave);
            document.removeEventListener('drop', handleDrop);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    const getClearButtonText = () => {
        if (clearConfirmLevel === 1) return t('sure');
        if (clearConfirmLevel === 2) return t('really');
        return t('clear');
    };
    // Portal target for the config panel (mounted in the right aside)
    const [portalTarget, setPortalTarget] = useState(null);
    useEffect(() => {
        // The #config-panel-portal div is created by App.jsx in the aside
        const el = document.getElementById('config-panel-portal');
        if (el) {
            setPortalTarget(el);
        } else {
            // Retry after a tick if DOM is not ready yet
            const t = setTimeout(() => {
                setPortalTarget(document.getElementById('config-panel-portal'));
            }, 50);
            return () => clearTimeout(t);
        }
    }, []);

    return (
        <div className="flex flex-col gap-6" id="generator-panel">
            {/* Import Conflict Modal */}
            {importConflict && (
                <div
                    id="import-conflict-overlay"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.7)',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        animation: 'fadeIn 0.15s ease'
                    }}
                    onClick={handleImportCancel}
                >
                    <div
                        id="import-conflict-modal"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'linear-gradient(135deg, rgba(30, 30, 40, 0.95), rgba(20, 20, 30, 0.98))',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            maxWidth: '400px',
                            width: '90%',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(var(--primary-rgb), 0.1)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <AlertCircle size={24} style={{ color: '#FACC15' }} />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{t('duplicate_presets_title')}</h3>
                            <button
                                onClick={handleImportCancel}
                                style={{
                                    marginLeft: 'auto',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    padding: '4px'
                                }}
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
                            {t('duplicate_presets_exist')}
                        </p>
                        <div
                            id="import-conflict-list"
                            style={{
                                background: 'rgba(0, 0, 0, 0.3)',
                                borderRadius: '8px',
                                padding: '0.75rem',
                                marginBottom: '1.25rem',
                                maxHeight: '120px',
                                overflowY: 'auto'
                            }}
                        >
                            {importConflict.duplicates.map((p, i) => (
                                <div
                                    key={i}
                                    style={{
                                        fontSize: '0.8rem',
                                        padding: '0.35rem 0.5rem',
                                        color: '#FACC15',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <span style={{ opacity: 0.6 }}>•</span>
                                    <span style={{ fontWeight: 500 }}>{p.name}</span>
                                </div>
                            ))}
                        </div>
                        {importConflict.newOnly.length > 0 && (
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.8 }}>
                                {t('new_presets_added_n', importConflict.newOnly.length)}
                            </p>
                        )}
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <Button
                                id="import-overwrite-btn"
                                onClick={handleImportOverwrite}
                                variant="primary"
                                style={{ flex: 1 }}
                            >
                                {t('overwrite')}
                            </Button>
                            <Button
                                id="import-skip-btn"
                                onClick={handleImportSkip}
                                variant="ghost"
                                style={{ flex: 1 }}
                            >
                                {t('skip_duplicates')}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {/* Password Output Card — glassmorphism wrapper */}
            <GlassCard className="p-6 flex flex-col gap-4" id="password-output-card" style={{ transform: 'none', background: 'rgba(255, 255, 255, 0.04)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)', border: '1px solid rgba(255, 255, 255, 0.10)' }}>
            {/* Centered Output Section */}
            <div className="flex flex-col items-center w-full" id="output-section">
                <div className="w-full max-w-2xl relative" id="password-input-area">
                    {isInspecting ? (
                        <div className="input-wrapper relative mb-1" id="inspection-wrapper">
                            <div
                                className={`input-field keeper-ignore text-2xl font-bold tracking-wider radiant-text input-rounded pr-32 ${isScrambling ? 'text-primary/70 animate-pulse' : ''}`}
                                style={{
                                    paddingRight: '11rem',
                                    cursor: 'crosshair',
                                    userSelect: 'none',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <div
                                    ref={inspectScrollRef}
                                    style={{
                                        width: '100%',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textAlign: 'center'
                                    }}
                                >
                                    {Array.from(isScrambling ? scrambleText : result.password).map((char, idx) => (
                                        <span
                                            key={idx}
                                            className="char-inspect-item radiant-text"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const hex = char.codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
                                                window.open(`https://www.compart.com/en/unicode/U+${hex}`, '_blank');
                                                setIsInspecting(false);
                                            }}
                                            onMouseEnter={() => {
                                                if (cursorFollowerRef.current) cursorFollowerRef.current.style.opacity = '1';
                                            }}
                                            onMouseLeave={() => {
                                                if (cursorFollowerRef.current) cursorFollowerRef.current.style.opacity = '0';
                                            }}
                                            title={showPassword ? `U+${char.codePointAt(0).toString(16).toUpperCase()} - Click to inspect` : 'Click to reveal Unicode info'}
                                        >
                                            {showPassword ? (char === ' ' ? '\u00A0' : char) : '•'}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            {/* Cursor Follower */}
                            {isInspecting && createPortal(
                                <div
                                    ref={cursorFollowerRef}
                                    style={{
                                        position: 'fixed',
                                        top: 0,
                                        left: 0,
                                        pointerEvents: 'none',
                                        zIndex: 9999,
                                        opacity: 0,
                                        transition: 'opacity 0.15s ease',
                                        willChange: 'transform, opacity'
                                    }}
                                >
                                    <div
                                        className="flex items-center justify-center p-1.5 rounded-full"
                                        style={{
                                            background: 'rgba(79, 70, 229, 0.9)', // Primary color with opacity
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            color: 'white'
                                        }}
                                    >
                                        <ExternalLink size={14} strokeWidth={2.5} />
                                    </div>
                                </div>,
                                document.body
                            )}
                            <div className="absolute right-3 flex items-center h-full gap-2" id="inspection-right-content">
                                <button
                                    id="toggle-inspect-btn-active"
                                    onClick={(e) => { e.stopPropagation(); setIsInspecting(false); }}
                                    className="icon-btn"
                                    style={{ color: 'var(--primary)', textShadow: '0 0 10px rgba(var(--primary-rgb), 0.5)' }}
                                    title={t('stop_inspecting')}
                                >
                                    <Search size={22} />
                                </button>
                                <button
                                    id="toggle-visibility-btn-inspect"
                                    onClick={(e) => { e.stopPropagation(); setShowPassword(!showPassword); }}
                                    className="icon-btn"
                                    title={showPassword ? t('hide') : t('show')}
                                >
                                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                                </button>
                                <button
                                    id="regen-password-btn-inspect"
                                    onClick={(e) => { e.stopPropagation(); handleGenerate(); }}
                                    className="icon-btn icon-btn-primary"
                                    title={t('regenerate')}
                                >
                                    <DiceIcon size={22} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Input
                            id="main-password-input"
                            value={isScrambling ? scrambleText : result.password}
                            readOnly
                            type={showPassword || (isScrambling && showPassword) ? "text" : "password"}
                            className={`keeper-ignore text-center text-2xl font-bold tracking-wider radiant-text input-rounded pr-32 ${isScrambling ? 'text-primary/70 animate-pulse' : ''}`}
                            wrapperClassName="mb-1"
                            onClick={copyToClipboard}
                            style={{ cursor: 'pointer', paddingRight: '11rem' }}
                            rightElement={
                                <>
                                    <button
                                        id="toggle-inspect-btn"
                                        onClick={(e) => { e.stopPropagation(); setIsInspecting(true); setShowPassword(true); }}
                                        className="icon-btn"
                                        title={t('inspect_characters')}
                                    >
                                        <Search size={22} />
                                    </button>
                                    <button
                                        id="toggle-visibility-btn"
                                        onClick={(e) => { e.stopPropagation(); setShowPassword(!showPassword); }}
                                        className="icon-btn"
                                        title={showPassword ? t('hide') : t('show')}
                                    >
                                        {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                                    </button>
                                    <button
                                        id="regen-password-btn"
                                        onClick={(e) => { e.stopPropagation(); handleGenerate(); }}
                                        className="icon-btn icon-btn-primary"
                                        title={t('regenerate')}
                                    >
                                        <DiceIcon size={22} />
                                    </button>
                                </>
                            }
                        />
                    )}
                </div>

            </div>
            {/* Copy Button & Meter & Stats Toggle */}
            <div className="flex flex-col gap-4" id="meter-action-row">
                <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                    {/* Stats Toggle Button */}
                    <Button
                        onClick={() => setShowStats(!showStats)}
                        variant="ghost"
                        className={`px-3 transition-all duration-300 ${showStats ? 'bg-white/10 text-primary border-primary/30' : 'bg-white/5 border-white/5 text-muted'}`}
                        title={t('toggle_statistics')}
                        style={showStats ? { boxShadow: '0 0 15px rgba(var(--primary-rgb), 0.15)' } : {}}
                    >
                        <BarChart2 size={20} className={showStats ? 'text-primary' : ''} />
                    </Button>
                    <Button
                        id="main-copy-btn"
                        onClick={copyToClipboard}
                        className={`flex-1 md:flex-none ${copied ? 'bg-green-500' : ''}`}
                        variant={copied ? 'ghost' : 'primary'}
                        style={copied ? { borderColor: '#10B981', color: '#10B981' } : {}}
                    >
                        {copied ? <Check size={20} id="copied-icon" /> : <Copy size={20} id="copy-icon" />}
                        {copied ? t('copied') : t('copy_password')}
                    </Button>
                </div>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <EntropyMeter
                        entropy={result.entropy}
                        combinations={result.combinations}
                        password={result.password}
                        id="entropy-meter"
                        isPostQuantum={config.isPostQuantum}
                        onByteChange={handleByteChange}
                    />

                </div>
            </div>
            {/* Collapsible Stats Panel - Outside to handle its own spacing animation */}
            <PasswordStats
                password={result.password}
                isOpen={showStats}
                enableEmojiStats={SETS_ORDER.indexOf(activeSet) >= SETS_ORDER.indexOf('emojis')}
                isPostQuantum={config.isPostQuantum}
                onFixBcrypt={() => handleByteChange(72)}
                hasUnicodeCompat={config.standardCharsetDisabled !== true && SETS_ORDER.indexOf(activeSet) > SETS_ORDER.indexOf('ascii_extended')}
                onGoToCompatCheck={() => {
                    unicodeCheckerRef.current?.open();
                    setTimeout(() => {
                        const el = document.getElementById('unicode-compatibility-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                }}
            />
            </GlassCard>
            {/* Presets and Default Configs Card — stays in the left column */}
            <GlassCard className="p-6 mt-4 flex flex-col gap-6" id="presets-glass-card">
                {/* Section 2: Saved Configurations */}
                <div
                    className="flex flex-col gap-4"
                    id="presets-section"
                    style={{ position: 'relative' }}
                >
                    {/* Drop Zone Overlay */}
                    {isDraggingOver && (
                        <div
                            id="preset-drop-overlay"
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'rgba(var(--primary-rgb), 0.1)',
                                border: '2px dashed var(--primary)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 50,
                                backdropFilter: 'blur(4px)',
                                animation: 'fadeIn 0.15s ease'
                            }}
                        >
                            <div
                                id="preset-drop-content"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    color: 'var(--primary)',
                                    textAlign: 'center'
                                }}
                            >
                                <Upload size={32} style={{ opacity: 0.8 }} />
                                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{t('drop_json_import')}</span>
                                <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{t('presets_added_to_list')}</span>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold flex items-center gap-2" id="custom-configs-title">
                            <Save size={18} className="text-primary" />
                            {t('custom_configurations')}
                        </h3>
                        <div className="flex items-center gap-2">
                            <input
                                type="file"
                                id="preset-import-input"
                                ref={fileInputRef}
                                onChange={importPresets}
                                accept="application/json"
                                style={{ display: 'none' }}
                            />
                            <Button
                                variant="ghost"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-2 py-1 text-xs h-8 text-muted hover:text-primary"
                                title={t('import_presets_title')}
                            >
                                <Upload size={14} />
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={exportPresets}
                                className="px-2 py-1 text-xs h-8 text-muted hover:text-primary"
                                title={t('export_presets_title')}
                                disabled={presets.length === 0}
                            >
                                <Download size={14} />
                            </Button>
                            {presets.length > 0 &&
                                <Button
                                    variant="ghost"
                                    onClick={handleClearAllPresets}
                                    className="px-3 py-1 text-xs h-8 ml-1"
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
                                    placeholder={t('preset_name_placeholder')}
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
                                className="icon-btn transition-all confirm-save-btn"
                                style={{
                                    height: '2.5rem',
                                    width: '2.5rem',
                                    color: 'var(--text-muted)',
                                }}
                                title={t('confirm_save')}
                            >
                                <Check size={24} />
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
                                title={t('cancel_save')}
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
                                            title={t('delete_preset_title')}
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
                                <span className="font-semibold text-xs uppercase tracking-wider">{t('save_current')}</span>
                            </button>
                        )}
                    </div>
                    {/* Hint message for delete functionality - always rendered, visibility controlled */}
                    {presets.length > 0 && (
                        <p
                            className="text-xs text-muted"
                            style={{
                                marginTop: '0.5rem',
                                visibility: isShiftPressed ? 'hidden' : 'visible',
                                transition: 'visibility 0s, opacity 0.2s ease',
                                opacity: isShiftPressed ? 0 : 0.5
                            }}
                        >
                            {t('hold_shift_pre')}<kbd style={{
                                background: 'rgba(255,255,255,0.1)',
                                padding: '0.1rem 0.4rem',
                                borderRadius: '4px',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.7rem'
                            }}>Shift</kbd>{t('hold_shift_post')}
                        </p>
                    )}
                </div>
                {/* Section 3: Default Configurations */}
                {defaultPresets.length > 0 && (
                    <div className="flex flex-col gap-4" id="default-presets-section">
                        <h3 className="text-lg font-bold flex items-center gap-2" id="default-configs-title">
                            <Sliders size={18} className="text-primary" />
                            {t('default_configurations')}
                        </h3>
                        <div className="flex flex-wrap gap-6 items-center" id="default-presets-list" style={{ padding: '0.25rem' }}>
                            {defaultPresets.map(preset => {
                                const isActive = activePresetId === preset.id;
                                return (
                                    <div
                                        key={preset.id}
                                        id={`default-preset-${preset.id}`}
                                        onClick={() => loadPreset(preset)}
                                        className="group relative flex items-center justify-center gap-4 rounded-lg cursor-pointer select-none overflow-hidden preset-item"
                                        style={{
                                            paddingLeft: '1rem',
                                            paddingRight: '1rem',
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
                                        <span
                                            className="text-xs font-bold tracking-wider uppercase"
                                            style={{
                                                color: isActive ? 'white' : 'var(--text-muted)',
                                                textShadow: isActive ? '0 0 10px rgba(255,255,255,0.3)' : 'none'
                                            }}
                                        >
                                            {preset.name}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                {/* Section 1: Configuration (The Workspace) */}
            </GlassCard>
            <div id="unicode-compatibility-section">
                <UnicodeChecker ref={unicodeCheckerRef} />
            </div>
            {/* Config portal: config content rendered into right aside */}
            {portalTarget && createPortal(
                <div id="config-portal-content" style={{ display: 'flex', flexDirection: 'column', gap: '0', height: '100%', overflowY: 'auto', padding: '1.25rem' }}>
                    <div className="flex flex-col gap-6" id="config-section">
                        {/* Configuration Title */}
                        {/* Configuration Title & Reset */}
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Settings size={18} className="text-primary" />
                                {t('configuration')}
                            </h3>
                            <Button
                                variant="ghost"
                                onClick={handleResetConfig}
                                className="px-2 py-1 text-xs h-7 text-muted hover:text-primary transition-colors"
                                title={t('reset_config_title')}
                            >
                                <RotateCcw size={13} className="mr-1.5" />
                                {t('reset_config')}
                            </Button>
                        </div>
                        {/* Password Length Slider: moved here */}
                        <div className="w-full max-w-2xl mt-4" id="length-slider-area">
                            <div className="flex justify-between items-center mb-1" id="length-label-row">
                                <label className="label-text" id="length-label">{t('password_length')}</label>
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
                                            title={t('click_edit_length')}
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
                                            title={t('click_edit_max')}
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
                                min={config.ensureCommon ? 4 : 1}
                                max={config.maxPossible}
                                onChange={(val) => {
                                    setSliderLength(val);
                                    // If dragging slider, switch back to Length Mode
                                    if (config.targetByteSize !== null) {
                                        setConfig(prev => ({ ...prev, length: val, targetByteSize: null }));
                                    }
                                    if (!isScrambling) setIsScrambling(true);
                                }}
                                onAfterChange={(val) => {
                                    setConfig({ ...config, length: val, targetByteSize: null });
                                }}
                            />
                        </div>
                        {/* Component-based Checkboxes */}
                        <div
                            id="ascii-checkbox-group-wrapper"
                            className="flex flex-col items-center gap-2 mb-2 mt-2 relative w-full"
                            style={{
                                background: 'rgba(var(--primary-rgb), 0.03)',
                                border: '1px dashed rgba(var(--primary-rgb), 0.25)',
                                borderRadius: '8px',
                                padding: '1.25rem 0.5rem 1rem 0.5rem'
                            }}
                        >
                            <span
                                id="ascii-group-label"
                                className="font-bold uppercase tracking-widest absolute select-none cursor-help flex items-center gap-1.5"
                                title={`All the basic symbols (U+0000-00FF)\n${charsetSizes['ascii']?.toLocaleString() || '?'} ${t('charset_characters')}`}
                                style={{
                                    top: '4px',
                                    right: '8px',
                                    fontSize: '0.65rem',
                                    color: '#10B981',
                                    textShadow: '0 0 8px rgba(16, 185, 129, 0.4)'
                                }}
                            >
                                ASCII
                                <AppleIcon stage={1} size={14} />
                            </span>
                            <div style={{ position: 'relative' }}>
                                <div className="flex flex-wrap gap-2 justify-center" id="ascii-checkboxes-container">
                                    <CheckboxOption id="chk-lower" label={t('lowercase')} tooltip="26 characters" checked={config.lower} onChange={() => handleCheckboxToggle('lower')} includedBy={!!activeSet} />
                                    <CheckboxOption id="chk-upper" label={t('uppercase')} tooltip="26 characters" checked={config.upper} onChange={() => handleCheckboxToggle('upper')} includedBy={!!activeSet} />
                                    <CheckboxOption id="chk-numbers" label={t('numbers')} tooltip="10 characters" checked={config.numbers} onChange={() => handleCheckboxToggle('numbers')} includedBy={!!activeSet} />
                                    <CheckboxOption id="chk-basic" label={t('basic_symbols')} tooltip="9 characters" checked={config.basic} onChange={() => handleCheckboxToggle('basic')} includedBy={!!activeSet} />
                                    <CheckboxOption id="chk-advanced" label={t('advanced_symbols')} tooltip="24 characters" checked={config.advanced} onChange={() => handleCheckboxToggle('advanced')} includedBy={!!activeSet} />
                                </div>
                                {activeSet && (
                                    <span id="ascii-included-by-msg" style={{ position: 'absolute', top: '-10px', left: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#a78bfa', background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap', zIndex: 1, fontStyle: 'italic', lineHeight: 1.4 }}>
                                        <Lock size={10} strokeWidth={2.5} style={{ flexShrink: 0 }} />
                                        {t('included_by')} <strong style={{ fontStyle: 'normal', fontWeight: 600 }}>{SETS[activeSet].name}</strong>
                                    </span>
                                )}
                            </div>
                        </div>
                        {/* Character Sets with inclusion highlighting */}
                        <div>
                            <h3 className="label-text mb-4 text-center" id="charset-title">{t('charset_title')}</h3>
                            <div className="flex flex-wrap gap-3 justify-center" id="charset-selectors">
                                {[...SETS_ORDER].reverse().map(key => {
                                    const highlightState = isSetHighlighted(key);
                                    const isActive = highlightState === 'active';
                                    const isIncluded = highlightState === 'included';
                                    const isChild = highlightState === 'child';
                                    const isHovered = hoveredSet === key;
                                    const allUnicodeSize = charsetSizes['all_unicode'] || 1;
                                    const keySize = charsetSizes[key] || 0;
                                    const pct = allUnicodeSize > 0 ? ((keySize / allUnicodeSize) * 100) : 0;
                                    const pctStr = pct < 0.01 ? '<0.01%' : pct >= 99.99 ? '100%' : `${pct.toFixed(2)}%`;
                                    return (
                                        <button
                                            id={`charset-btn-${key}`}
                                            key={key}
                                            onClick={() => handleSetChange(key)}
                                            onMouseEnter={() => setHoveredSet(key)}
                                            onMouseLeave={() => setHoveredSet(null)}
                                            className="charset-selector-btn rounded-full transition-all px-4 py-2 text-sm cursor-pointer"
                                            title={`${SETS[key].description}\n${charsetSizes[key]?.toLocaleString() || '?'} ${t('charset_characters')}`}
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
                                            <span className="flex items-center gap-1.5">
                                                {SETS[key].name}
                                                <AppleIcon
                                                    stage={
                                                        key === 'ascii_extended' ? 0
                                                            : key === 'symbols_set' ? 2
                                                                : key === 'active_languages' ? 2
                                                                    : key === 'emojis' ? 3
                                                                        : 4
                                                    }
                                                    size={16}
                                                />
                                                <span style={{ fontSize: '0.7em', opacity: 0.75 }}>{pctStr}</span>
                                            </span>
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
                                        {t('options_title')}
                                    </h3>
                                    <Toggle
                                        id="opt-random-length"
                                        className="secondary-toggle"
                                        checked={config.randomLength}
                                        onChange={(v) => {
                                            setConfig({ ...config, randomLength: v });
                                        }}
                                        label={
                                            <span className="flex items-center gap-1">
                                                {t('randomize_length_label')}
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
                                                        title={t('click_change_deviation')}
                                                    >
                                                        {config.lengthDeviation}%
                                                    </span>
                                                )}
                                                )
                                                <HelpPopover
                                                    title={t('randomize_length_help_title')}
                                                    content={t('randomize_length_help')}
                                                />
                                            </span>
                                        }
                                    />
                                    <div
                                        id="compatibility-section"
                                        className="p-3 rounded-lg flex flex-col gap-3 mt-4"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.03)',
                                            border: '1px solid rgba(255, 255, 255, 0.08)'
                                        }}
                                    >
                                        <Toggle
                                            id="compat-toggle"
                                            label={
                                                <div className="flex items-center">
                                                    {t('ensure_compat_label')}
                                                    <HelpPopover
                                                        title={t('ensure_compat_help_title')}
                                                        content={t('ensure_compat_help')}
                                                    />
                                                </div>
                                            }
                                            checked={config.ensureCommon}
                                            onChange={(v) => {
                                                setConfig(prev => ({
                                                    ...prev,
                                                    ensureCommon: v,
                                                    length: (v && prev.length < 4) ? 4 : prev.length
                                                }));
                                            }}
                                            className="w-full"
                                        />
                                        <p className="text-xs text-muted leading-relaxed" id="compat-desc">
                                            {t('compat_desc')}
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
                                        {t('advanced_title')}
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
                                        {/* Post-Quantum Toggle */}
                                        <div
                                            className="p-3 rounded-lg flex flex-col gap-2 mb-2"
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.03)',
                                                border: '1px solid rgba(255, 255, 255, 0.08)'
                                            }}
                                        >
                                            <Toggle
                                                id="opt-post-quantum"
                                                checked={config.isPostQuantum}
                                                onChange={(v) => setConfig({ ...config, isPostQuantum: v })}
                                                label={
                                                    <div className="flex items-center">
                                                        {t('post_quantum_label')}
                                                        <HelpPopover
                                                            title={t('post_quantum_help_title')}
                                                            content={t('post_quantum_help')}
                                                        />
                                                    </div>
                                                }
                                            />
                                            <p className="text-xs text-muted leading-relaxed ml-7 mt-1">
                                                {t('post_quantum_desc')}
                                            </p>
                                        </div>
                                        {['emojis', 'all_unicode'].includes(activeSet) && (
                                            <Toggle
                                                id="opt-min-ascii"
                                                checked={config.ensureMinAscii}
                                                onChange={(v) => {
                                                    setConfig({ ...config, ensureMinAscii: v });
                                                }}
                                                label={
                                                    <span className="flex items-center gap-1">
                                                        {t('guarantee_ascii_label')}
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
                                                                title={t('click_change_ascii')}
                                                            >
                                                                {config.minAsciiPercent}%
                                                            </span>
                                                        )}
                                                        )
                                                    </span>
                                                }
                                            />
                                        )}
                                        <div className="mt-4 pt-0 mb-4">
                                            <Input
                                                id="custom-charset-input"
                                                label={
                                                    <div>
                                                        <div className="flex items-center gap-1">
                                                            {(!config.standardCharsetDisabled && config.customCharset) ? t('add_chars_label') : t('custom_charset_label')}
                                                            <HelpPopover
                                                                title={(!config.standardCharsetDisabled && config.customCharset) ? t('add_chars_help_title') : t('custom_charset_help_title')}
                                                                content={(!config.standardCharsetDisabled && config.customCharset) ? t('add_chars_help') : t('custom_charset_help')}
                                                            />
                                                        </div>
                                                        <span id="custom-charset-desc" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 'normal', marginTop: '3px', fontStyle: 'italic' }}>
                                                            {(!config.standardCharsetDisabled && config.customCharset) ? t('add_chars_desc') : t('custom_charset_desc')}
                                                        </span>
                                                    </div>
                                                }
                                                placeholder={t('custom_charset_placeholder')}
                                                value={config.customCharset}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (!val) {
                                                        setConfig({
                                                            ...config,
                                                            customCharset: '',
                                                            standardCharsetDisabled: false,
                                                            customWeight: 0
                                                        });
                                                    } else {
                                                        setConfig({
                                                            ...config,
                                                            customCharset: val,
                                                            standardCharsetDisabled: true
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
                                                    label={t('enable_std_charset')}
                                                    checked={!config.standardCharsetDisabled}
                                                    onChange={(v) => {
                                                        setConfig({ ...config, standardCharsetDisabled: !v });
                                                        if (!v) setActiveSet(null);
                                                    }}
                                                    className="secondary-toggle mb-2 mt-4"
                                                />
                                            )}
                                            {/* Weight Option (Option B) */}
                                            {!config.standardCharsetDisabled && config.customCharset && (
                                                <Toggle
                                                    id="opt-custom-weight"
                                                    className="secondary-toggle"
                                                    onChange={(v) => {
                                                        setConfig({ ...config, customWeight: v ? 5 : 0 });
                                                    }}
                                                    checked={config.customWeight > 0}
                                                    label={
                                                        <span className="flex items-center gap-1">
                                                            {t('boost_custom_label')}
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
                                                                    title={t('click_change_weight')}
                                                                >
                                                                    {config.customWeight || 5}%
                                                                </span>
                                                            )}
                                                            )
                                                            <HelpPopover
                                                                title={t('boost_custom_help_title')}
                                                                content={t('boost_custom_help')}
                                                            />
                                                        </span>
                                                    }
                                                />
                                            )}
                                        </div>
                                        <Input
                                            id="must-include-input"
                                            label={
                                                <div className="flex items-center gap-1">
                                                    {t('must_include_label')}
                                                    <HelpPopover
                                                        title={t('must_include_help_title')}
                                                        content={t('must_include_help')}
                                                    />
                                                </div>
                                            }
                                            placeholder={t('must_include_placeholder')}
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
                                                    title={t('remove_forbidden_dupe')}
                                                >
                                                    <Eraser size={10} />
                                                    {t('remove_duplicate')}
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
                                            label={
                                                <div className="flex items-center gap-1">
                                                    {t('forbidden_label')}
                                                    <HelpPopover
                                                        title={t('forbidden_help_title')}
                                                        content={t('forbidden_help')}
                                                    />
                                                </div>
                                            }
                                            placeholder={t('forbidden_placeholder')}
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
                                                    title={t('remove_include_dupe')}
                                                >
                                                    <Eraser size={10} />
                                                    {t('remove_duplicate')}
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
                                                    <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FEF9C3', margin: 0 }}>{t('conflict_title')}</h4>
                                                    <p style={{ fontSize: '0.75rem', color: 'rgba(254, 240, 138, 0.8)', lineHeight: 1.625, margin: 0 }}>
                                                        {t('conflict_desc_pre')}<b>{conflictChars.join(' ')}</b>{t('conflict_desc_post')}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {/* Character Inspector Button has been moved to main input */}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>, portalTarget)}
        </div>
    );
}