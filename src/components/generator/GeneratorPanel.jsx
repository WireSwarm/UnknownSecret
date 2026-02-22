import React, { useState, useEffect, useMemo, useRef } from 'react';
import { RefreshCw, Copy, Check, Eye, EyeOff, ShieldAlert, Sparkles, Plus, Trash2, Save, ChevronDown, Sliders, TriangleAlert, Eraser, Edit2, Keyboard, BarChart2, Download, Upload, AlertCircle, X, RotateCcw, Search, ExternalLink } from 'lucide-react';
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

export function GeneratorPanel({ onCopyPassword }) {
    // --- PERSISTENCE CONSTANTS ---
    const STORAGE_KEY_PARAMS = 'usr_gen_params';
    const STORAGE_KEY_PRESETS = 'usr_gen_presets';

    // Default configuration reference
    // A Global Option is an option available for all charsets.
    const DEFAULT_CONFIG = {
        length: 50,
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
        standardCharsetDisabled: false,
        customWeight: 0,
        isPostQuantum: false,
        targetByteSize: 72 // null = length mode, number = byte mode
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
        return 'ascii';
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
    const [showUtf8Warning, setShowUtf8Warning] = useState(() => {
        try {
            return sessionStorage.getItem('hide_utf8_warning') !== 'true';
        } catch (e) {
            return true;
        }
    });

    // Cursor follower for inspect mode
    const cursorFollowerRef = useRef(null);
    const unicodeCheckerRef = useRef(null);
    const inspectScrollRef = useRef(null);

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
    }, []);

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
            description: '+ All the basic symbols (U+0000-00FF)'
        },
        ascii_extended: {
            id: 'ascii_extended',
            name: 'Ascii Extended',
            tokens: ['ascii_extended'],
            description: '+ More symbols (Latin Extended A & B (U+0100-024F))'
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

    // --- EXPANDABLE CHARSETS LOGIC ---
    const [areCharsetsExpanded, setAreCharsetsExpanded] = useState(() => {
        try {
            return sessionStorage.getItem('usr_charsets_expanded') === 'true';
        } catch (e) {
            return false;
        }
    });

    const handleExpandCharsets = () => {
        setAreCharsetsExpanded(true);
        sessionStorage.setItem('usr_charsets_expanded', 'true');
    };

    // Auto-expand if active set is beyond the visible threshold (ascii)
    useEffect(() => {
        const asciiIndex = SETS_ORDER.indexOf('ascii');
        const activeIndex = SETS_ORDER.indexOf(activeSet);
        if (activeIndex > asciiIndex && !areCharsetsExpanded) {
            setAreCharsetsExpanded(true);
            sessionStorage.setItem('usr_charsets_expanded', 'true');
        }
    }, [activeSet, areCharsetsExpanded]);

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
            minAsciiPercent: config.minAsciiPercent,
            targetByteSize: config.targetByteSize
        });

        setResult(res);

        // If in byte mode, sync slider to actual length
        if (config.targetByteSize && res.password) {
            setSliderLength(res.password.length);
        }

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

    const handleResetConfig = () => {
        setConfig(DEFAULT_CONFIG);
        setActiveSet('ascii');
        setActivePresetId(null);
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
                alert("Failed to import presets: Invalid JSON format");
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
    }, []);

    const getClearButtonText = () => {
        if (clearConfirmLevel === 1) return "Sure?";
        if (clearConfirmLevel === 2) return "REALLY?";
        return "Clear";
    };

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
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Duplicate Presets Found</h3>
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
                            The following presets already exist:
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
                                {importConflict.newOnly.length} new preset{importConflict.newOnly.length > 1 ? 's' : ''} will be added regardless.
                            </p>
                        )}

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <Button
                                id="import-overwrite-btn"
                                onClick={handleImportOverwrite}
                                variant="primary"
                                style={{ flex: 1 }}
                            >
                                Overwrite
                            </Button>
                            <Button
                                id="import-skip-btn"
                                onClick={handleImportSkip}
                                variant="ghost"
                                style={{ flex: 1 }}
                            >
                                Skip Duplicates
                            </Button>
                        </div>
                    </div>
                </div>
            )}

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
                                    title="Stop Inspecting"
                                >
                                    <Search size={22} />
                                </button>
                                <button
                                    id="toggle-visibility-btn-inspect"
                                    onClick={(e) => { e.stopPropagation(); setShowPassword(!showPassword); }}
                                    className="icon-btn"
                                    title={showPassword ? "Hide" : "Show"}
                                >
                                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                                </button>
                                <button
                                    id="regen-password-btn-inspect"
                                    onClick={(e) => { e.stopPropagation(); handleGenerate(); }}
                                    className="icon-btn icon-btn-primary"
                                    title="Regenerate"
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
                                        title="Inspect Characters"
                                    >
                                        <Search size={22} />
                                    </button>
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
                                        <DiceIcon size={22} />
                                    </button>
                                </>
                            }
                        />
                    )}
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

                {/* Cond 1: Bcrypt Warning */}
                {/* Only check length match if NOT in byte mode already */}
                {!config.targetByteSize && config.length === 72 && SETS_ORDER.indexOf(activeSet) > SETS_ORDER.indexOf('ascii') && (
                    <div
                        id="bcrypt-warning-container"
                        className="w-full max-w-2xl mt-4 p-3 rounded-lg flex items-start gap-3"
                        style={{
                            background: 'rgba(234, 179, 8, 0.1)',
                            border: '1px solid rgba(234, 179, 8, 0.25)',
                            animation: 'fadeIn 0.3s ease'
                        }}
                    >
                        <TriangleAlert id="bcrypt-warning-icon" size={18} style={{ color: '#FACC15', flexShrink: 0, marginTop: '2px' }} />
                        <div id="bcrypt-warning-text-content" className="flex flex-col gap-2 flex-1">
                            <div>
                                <h4 id="bcrypt-warning-title" className="text-sm font-bold m-0" style={{ color: '#FEF9C3' }}>Possible Bcrypt Truncation</h4>
                                <p id="bcrypt-warning-desc" className="text-xs leading-relaxed m-0" style={{ color: 'rgba(254, 249, 195, 0.8)' }}>
                                    If the site enforces a 72-character limit, it likely uses Bcrypt (72-byte limit).
                                    Since you are using non-ASCII characters (multibyte), a 72-character password will exceed 72 bytes and be truncated.
                                </p>
                            </div>
                            <Button
                                id="bcrypt-fix-btn"
                                onClick={() => handleByteChange(72)}
                                size="sm"
                                variant="ghost"
                                className="self-start h-auto py-1 px-2 text-xs"
                                style={{
                                    background: 'rgba(254, 249, 195, 0.15)',
                                    color: '#FEF9C3',
                                    border: '1px solid rgba(254, 249, 195, 0.3)'
                                }}
                            >
                                Set to 72 Bytes
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Copy Button & Meter & Stats Toggle */}
            <div className="flex flex-col gap-4" id="meter-action-row">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <EntropyMeter
                        entropy={result.entropy}
                        combinations={result.combinations}
                        password={result.password}
                        id="entropy-meter"
                        isPostQuantum={config.isPostQuantum}
                        onByteChange={handleByteChange}
                    />

                    <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                        {/* Stats Toggle Button */}
                        <Button
                            onClick={() => setShowStats(!showStats)}
                            variant="ghost"
                            className={`px-3 transition-all duration-300 ${showStats ? 'bg-white/10 text-primary border-primary/30' : 'bg-white/5 border-white/5 text-muted'}`}
                            title="Toggle Statistics"
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
                            {copied ? 'Copied!' : 'Copy Password'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Collapsible Stats Panel - Outside to handle its own spacing animation */}
            <PasswordStats
                password={result.password}
                isOpen={showStats}
                enableEmojiStats={SETS_ORDER.indexOf(activeSet) >= SETS_ORDER.indexOf('emojis')}
                isPostQuantum={config.isPostQuantum}
            />

            {/* Unified Configuration & Presets Panel */}
            <GlassCard className="p-6 mt-4 flex flex-col gap-6" id="unified-config-card">

                {/* Section 1: Configuration (The Workspace) */}
                <div className="flex flex-col gap-6" id="config-section">

                    {/* Configuration Title */}
                    {/* Configuration Title & Reset */}
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Sliders size={18} className="text-primary" />
                            Configuration
                        </h3>
                        <Button
                            variant="ghost"
                            onClick={handleResetConfig}
                            className="px-2 py-1 text-xs h-7 text-muted hover:text-primary transition-colors"
                            title="Reset to default configuration"
                        >
                            <RotateCcw size={13} className="mr-1.5" />
                            Reset
                        </Button>
                    </div>

                    {/* Character Sets with inclusion highlighting */}
                    <div>
                        <h3 className="label-text mb-4 text-center" id="charset-title">Character Set</h3>
                        <div className="flex flex-wrap gap-3 justify-center" id="charset-selectors">
                            {(areCharsetsExpanded ? SETS_ORDER : SETS_ORDER.slice(0, SETS_ORDER.indexOf('ascii') + 1)).map(key => {
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
                            {!areCharsetsExpanded && (
                                <button
                                    onClick={handleExpandCharsets}
                                    className="charset-selector-btn rounded-full transition-all px-3 py-2 text-sm cursor-pointer flex items-center justify-center"
                                    title="Show more character sets"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        color: 'var(--text-muted)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                        e.currentTarget.style.color = 'var(--primary)';
                                        e.currentTarget.style.borderColor = 'rgba(var(--primary-rgb), 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                        e.currentTarget.style.color = 'var(--text-muted)';
                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                    }}
                                >
                                    <Plus size={16} />
                                </button>
                            )}
                        </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="settings-grid">
                        {/* Left Column: Options */}
                        <div className="flex flex-col gap-6" id="settings-col-1">
                            {/* Cond 2: UTF-8 Compatibility Warning (MOVED HERE) */}
                            {showUtf8Warning && config.standardCharsetDisabled !== true && SETS_ORDER.indexOf(activeSet) > SETS_ORDER.indexOf('ascii_extended') && (
                                <div
                                    id="utf8-warning-alert"
                                    className="rounded-lg overflow-hidden p-3 relative"
                                    style={{
                                        background: 'rgba(234, 179, 8, 0.05)',
                                        border: '1px solid rgba(234, 179, 8, 0.15)',
                                        animation: 'fadeIn 0.3s ease'
                                    }}
                                >
                                    <div className="flex items-start gap-2">
                                        <TriangleAlert size={14} style={{ color: '#FACC15', flexShrink: 0, marginTop: '2px' }} />
                                        <div className="flex flex-col gap-2 pr-4 flex-1">
                                            <div>
                                                <span style={{ fontSize: '0.8rem', color: '#FEF9C3', fontWeight: 600 }}>
                                                    Compatibility Check
                                                </span>
                                                <p style={{ fontSize: '0.75rem', color: 'rgba(254, 249, 195, 0.8)', lineHeight: 1.5, margin: 0 }}>
                                                    Not all backends fully support UTF-8. Legacy systems might replace complex symbols, reducing password strength.
                                                    <br />
                                                    Please follow the steps in the <b>Unicode Compatibility Check</b> card below.
                                                </p>
                                            </div>

                                            <Button
                                                onClick={() => {
                                                    unicodeCheckerRef.current?.open();
                                                    // Small timeout to allow expansion animation to start/layout to update
                                                    setTimeout(() => {
                                                        const el = document.getElementById('unicode-compatibility-section');
                                                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                    }, 100);
                                                }}
                                                size="sm"
                                                variant="ghost"
                                                className="self-start h-auto py-1 px-2 text-xs"
                                                style={{
                                                    background: 'rgba(254, 249, 195, 0.15)',
                                                    color: '#FEF9C3',
                                                    border: '1px solid rgba(254, 249, 195, 0.3)'
                                                }}
                                            >
                                                Go to Compatibility Check
                                            </Button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setShowUtf8Warning(false);
                                            sessionStorage.setItem('hide_utf8_warning', 'true');
                                        }}
                                        className="absolute text-[#FEF9C3] hover:bg-[rgba(255,255,255,0.05)] transition-all rounded px-1.5 py-0.5"
                                        style={{
                                            top: '8px',
                                            right: '8px',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '0.65rem',
                                            opacity: 0.5,
                                            fontWeight: 500
                                        }}
                                        title="Dismiss warning"
                                        onMouseEnter={(e) => e.target.style.opacity = '1'}
                                        onMouseLeave={(e) => e.target.style.opacity = '0.5'}
                                    >
                                        Hide
                                    </button>
                                </div>
                            )}

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
                                            Randomize Length (down to -
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
                                            <HelpPopover
                                                title="Randomize Length"
                                                content="Obfuscates usage patterns by slightly randomizing the password length. Useful against white-box attacks (where the attacker knows you use this tool) or to avoid predictable fixed-length patterns."
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
                                                Enhance Compatibility
                                                <HelpPopover
                                                    title="Enhance Compatibility"
                                                    content="Restricts the character set to standard symbols to ensure acceptance across most services, even legacy ones that might reject complex Unicode characters."
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
                                                    Post-Quantum Strength
                                                    <HelpPopover
                                                        title="Post-Quantum Strength"
                                                        content="Estimates security against future quantum attacks. Since Grover's algorithm effectively halves the bit strength (square root of the search space), we divide the entropy by 2 to measure post-quantum resilience."
                                                    />
                                                </div>
                                            }
                                        />
                                        <p className="text-xs text-muted leading-relaxed ml-7 mt-1">
                                            Simulates Grover's algorithm impact: effective entropy is halved (N/2).
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

                                    <div className="mt-4 pt-0 mb-4">
                                        <Input
                                            id="custom-charset-input"
                                            label={
                                                <div className="flex items-center gap-1">
                                                    {(!config.standardCharsetDisabled && config.customCharset) ? "Add characters to the charset" : "Custom Charset"}
                                                    <HelpPopover
                                                        title={(!config.standardCharsetDisabled && config.customCharset) ? "Add Characters" : "Custom Charset"}
                                                        content={(!config.standardCharsetDisabled && config.customCharset)
                                                            ? "Manually injects specific characters into the generation pool."
                                                            : "Enables precise control over the allowed characters for specific requirements."}
                                                    />
                                                </div>
                                            }
                                            placeholder="Add characters (e.g. ñçµ...)"
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
                                                        <HelpPopover
                                                            title="Boost Custom Probability"
                                                            content="Significantly increases the probability of your custom characters appearing. Useful when the base pool is huge (e.g., Unicode), ensuring your additions aren't statistically drowned out."
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
                                                Must Include Characters
                                                <HelpPopover
                                                    title="Must Include Characters"
                                                    content="Guarantees these specific characters appear in the final password. Can also be used as an 'Allowed List' by selecting Alphanumeric mode and pasting accepted symbols here."
                                                />
                                            </div>
                                        }
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
                                        label={
                                            <div className="flex items-center gap-1">
                                                Forbidden Characters
                                                <HelpPopover
                                                    title="Forbidden Characters"
                                                    content="Removes specific characters from the pool, preventing rejection by services with strict character constraints."
                                                />
                                            </div>
                                        }
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

                                    {/* Character Inspector Button has been moved to main input */}
                                </div>
                            )}
                        </div>
                    </div>
                </div>



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
                                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Drop JSON file to import</span>
                                <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Presets will be added to your list</span>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold flex items-center gap-2" id="custom-configs-title">
                            <Save size={18} className="text-primary" />
                            Custom Configurations
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
                                title="Import Presets"
                            >
                                <Upload size={14} />
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={exportPresets}
                                className="px-2 py-1 text-xs h-8 text-muted hover:text-primary"
                                title="Export Presets"
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
                                className="icon-btn transition-all confirm-save-btn"
                                style={{
                                    height: '2.5rem',
                                    width: '2.5rem',
                                    color: 'var(--text-muted)',
                                }}
                                title="Confirm Save"
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

                {/* Section 3: Default Configurations */}
                {defaultPresets.length > 0 && (
                    <div className="flex flex-col gap-4" id="default-presets-section">
                        <h3 className="text-lg font-bold flex items-center gap-2" id="default-configs-title">
                            <Sliders size={18} className="text-primary" />
                            Default Configurations
                        </h3>

                        <div className="flex flex-wrap gap-6 items-center" id="default-presets-list" style={{ padding: '0.25rem' }}>
                            {defaultPresets.map(preset => {
                                const isActive = activePresetId === preset.id;
                                return (
                                    <div
                                        key={preset.id}
                                        id={`default-preset-${preset.id}`}
                                        onClick={() => loadPreset(preset)}
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
            </GlassCard>

            <div id="unicode-compatibility-section">
                <UnicodeChecker ref={unicodeCheckerRef} />
            </div>
        </div >
    );
}
