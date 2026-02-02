import unicodeDenylistData from '../data/unicode_denylist.json';
import recentUnstableData from '../data/recent_unstable.json';

export const CHAR_SETS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!\"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~', // Standard ASCII symbols
    commonSymbols: '!@#$%^&*?',
};

// Helper: Generate char codes from range
const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => String.fromCharCode(start + i));

const DENYLIST_RANGES = unicodeDenylistData.denylist;
const UNSTABLE_RANGES = recentUnstableData.unstable;

function isInDenyList(codePoint, enforcePrintable = false) {
    // 1. Hard deny list (Technical invalidity)
    for (const entry of DENYLIST_RANGES) {
        if (codePoint >= entry.start && codePoint <= entry.end) {
            return true;
        }
    }

    // 2. Unstable/Recent list (Visual invalidity) -> Only if "Only Printable" is requested
    if (enforcePrintable) {
        for (const entry of UNSTABLE_RANGES) {
            if (codePoint >= entry.start && codePoint <= entry.end) {
                return true;
            }
        }
    }

    return false;
}

export const PRESETS = {
    alphanums: { id: 'alphanums', name: 'Alphanums', tokens: ['alphanums'] },
    ascii: { id: 'ascii', name: 'Ascii', tokens: ['ascii'] },
    ascii_extended: { id: 'ascii_extended', name: 'Ascii Extended', tokens: ['ascii_extended'] },
    active_languages: { id: 'active_languages', name: 'Active Languages', tokens: ['active_languages'] },
    symbols_set: { id: 'symbols_set', name: 'With Symbols', tokens: ['symbols_set'] },
    emojis: { id: 'emojis', name: 'With Emojis', tokens: ['emojis'] },
    all_unicode: { id: 'all_unicode', name: 'All Unicode', tokens: ['all_unicode'] }
};

/**
 * Generates a charset string based on configuration
 */
export function buildCharset({ tokens = [], excludeChars = '', includeChars = '', onlyPrintable = false }) {
    let pool = '';

    // Helper to safely add ranges excluding denied chars
    const addSafeRange = (start, end) => {
        let localPool = '';
        for (let i = start; i <= end; i++) {
            if (!isInDenyList(i, onlyPrintable)) {
                // Ensure we don't add surrogates individually if they were somehow missed by denylist (though denylist covers them)
                // String.fromCodePoint handles creating the char
                try {
                    localPool += String.fromCodePoint(i);
                } catch (e) {
                    // Ignore valid invalid code points
                }
            }
        }
        return localPool;
    };

    // Alphanums (a-z, A-Z, 0-9) - Safe by definition usually, but good to be consistent
    if (tokens.includes('alphanums')) {
        pool += CHAR_SETS.lowercase + CHAR_SETS.uppercase + CHAR_SETS.numbers;
    }

    // Basic Ascii (U+0021 – U+007E)
    if (tokens.includes('ascii')) {
        pool += addSafeRange(0x0021, 0x007E);
    }

    // Ascii Extended (U+0020 – U+00FF, U+0100 – U+017F, U+0180 – U+024F)
    if (tokens.includes('ascii_extended')) {
        pool += addSafeRange(0x0020, 0x00FF);
        pool += addSafeRange(0x0100, 0x017F);
        pool += addSafeRange(0x0180, 0x024F);
    }

    // Active Languages (Greek, Cyrillic, Armenian, Hebrew, Arabic)
    if (tokens.includes('active_languages')) {
        pool += addSafeRange(0x0370, 0x03FF); // Greek
        pool += addSafeRange(0x0400, 0x04FF); // Cyrillic
        pool += addSafeRange(0x0530, 0x058F); // Armenian
        pool += addSafeRange(0x0590, 0x05FF); // Hebrew
        pool += addSafeRange(0x0600, 0x06FF); // Arabic
    }

    // Symbols (Punctuation, Currency, LetterLike, Arrows, Math)
    if (tokens.includes('symbols_set')) {
        pool += addSafeRange(0x2000, 0x206F); // Punctuation
        pool += addSafeRange(0x20A0, 0x20CF); // Currency
        pool += addSafeRange(0x2100, 0x214F); // LetterLike
        pool += addSafeRange(0x2190, 0x21FF); // Arrows
        pool += addSafeRange(0x2200, 0x22FF); // Math
    }

    // Emojis (U+1F300 – U+1FAFF)
    if (tokens.includes('emojis')) {
        // Emojis are outside BMP (surrogate pairs in JS strings), but String.fromCodePoint works
        pool += addSafeRange(0x1F300, 0x1FAFF);
    }

    // All Unicode
    if (tokens.includes('all_unicode')) {
        if (onlyPrintable) {
            // Approximation of "Printable" across Unicode is complex. 
            // We will take standard blocks avoiding controls.
            // Re-using defined blocks + typical ranges.
            // Simple approach: standard sets above + CJK + others?
            // User asked for "All Unicode" then "Only Printable" option.
            // We'll define "All Unicode" as a massive range, and "Only Printable" as filtering out Control Chars.
            // BUT generating ALL unicode is huge (1M+ chars). We should probably pick a large sampling or specific blocks.
            // Given constraints, let's include all BMP (0-FFFF) except surrogates/private/control.

            let ranges = [
                [0x0020, 0x007E], [0x00A0, 0xD7FF], [0xE000, 0xFFFD],
                [0x10000, 0x10FFFF] // Astral planes
            ];

            // Too expensive to generate string. We need a generator or sampling approach if "All" is active.
            // For now, let's bundle a very wide set of safe ranges if specific logic isn't changed.
            // However, "pool" string approach crashes with 1M chars.
            // We will handle this in the Generation Step if "all_unicode" is active.
            // Just return a flag or special marker?
            // For compatibility with current logic, let's add BMP reasonable ranges (~50k chars).
            pool += addSafeRange(0x0020, 0xD7FF);
            pool += addSafeRange(0xE000, 0xFFFD); // Some of this is Private Use, but checkDenyList handles it
        } else {
            // "Truly ALL" - inverted deny list logic basically
            // We iterate safely through large chunks? 
            // 1M chars is too big for a string. We need a different strategy for 'all_unicode' 
            // if we want to be performant, OR we stick to the reduced set.
            // The user requested "All Unicode" be the "Inverted Deny List".
            // Since we can't theoretically put 1,114,112 chars in a string efficiently every time,
            // we will stick to a reasonable subset (BMP) + some astral planes, FILTERED by denylist.

            // For stability, let's just do BMP + Emojis for now, as full 1M chars crashes browsers.
            pool += addSafeRange(0x0001, 0xD7FF);
            pool += addSafeRange(0xE000, 0xFFFD);
            pool += addSafeRange(0x1F300, 0x1FAFF); // Include emojis in All Unicode
        }
    }

    // Add custom includes
    if (includeChars) {
        pool += includeChars;
    }

    // Remove exclusions
    if (excludeChars) {
        const excludeSet = new Set(excludeChars.split(''));
        // Splitting a huge string is slow. 
        // If pool is massive (Unicode), this is bad. 
        // Optimization: If pool > 10000, maybe do regex? 
        // For now, standard filter.
        const tempArr = Array.from(pool); // Correctly handles surrogate pairs (emojis)
        pool = tempArr.filter(c => !excludeSet.has(c)).join('');
    }

    // Deduplicate
    // large set -> Set() is expensive but necessary for uniform distribution
    // NOTE: This now returns an Array of Strings (where each string is one full character/codepoint)
    // instead of a single string, to support proper indexing of emojis.
    return Array.from(new Set(Array.from(pool)));
}

/**
 * Cryptographically strong random integer
 */
function getRandomInt(max) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
}

/**
 * Main Generator Function
 */
export function generatePassword({
    length = 16,
    charset = [], // EXPLICITLY EXPECTING AN ARRAY NOW
    mandatoryChars = '', // String of chars that MUST appear
    ensureRobustness = false,
}) {
    // Safety check if charset is passed as string by legacy code, convert to array
    if (typeof charset === 'string') {
        charset = Array.from(charset);
    }

    if (!charset || charset.length === 0) return { password: '', entropy: 0 };

    const buffer = new Array(length);
    const charsetLen = charset.length;

    // 1. Fill linearly with random
    for (let i = 0; i < length; i++) {
        // charset is an array of strings (chars), so [i] works correctly for emojis
        buffer[i] = charset[getRandomInt(charsetLen)];
    }

    // 2. Handle Mandatory Constraints
    // Collect positions to overwrite (randomly picked)
    let positions = Array.from({ length }, (_, i) => i);
    // Shuffle positions to avoid bias (Fisher-Yates)
    for (let i = positions.length - 1; i > 0; i--) {
        const j = getRandomInt(i + 1);
        [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    let requiredChars = [];

    if (mandatoryChars) {
        // Using Array.from to correctly split mandatory chars if they contain emojis
        requiredChars.push(...Array.from(mandatoryChars));
    }

    if (ensureRobustness) {
        // Enforce: Lowercase, Uppercase, Number, Symbol
        // We still use strings for raw sets definitions, so we must array-ify them to pick from them
        const constraints = [
            { set: Array.from(CHAR_SETS.lowercase), name: 'lower' },
            { set: Array.from(CHAR_SETS.uppercase), name: 'upper' },
            { set: Array.from(CHAR_SETS.numbers), name: 'digit' },
            { set: Array.from(CHAR_SETS.symbols), name: 'symbol' }
        ];

        constraints.forEach(constraint => {
            const charToInject = constraint.set[getRandomInt(constraint.set.length)];
            requiredChars.push(charToInject);
        });
    }

    // Inject required chars
    if (requiredChars.length > length) {
        requiredChars = requiredChars.slice(0, length);
    }

    for (let i = 0; i < requiredChars.length; i++) {
        buffer[positions[i]] = requiredChars[i];
    }

    const password = buffer.join('');

    // Entropy: H = L * log2(N)
    const entropy = Math.round(length * Math.log2(charsetLen));

    return { password, entropy, combinations: BigInt(charsetLen) ** BigInt(length) };
}
