import unicodeDenylistData from '../data/unicode_denylist.json';

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

function isInDenyList(codePoint) {
    for (const entry of DENYLIST_RANGES) {
        if (codePoint >= entry.start && codePoint <= entry.end) {
            return true;
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

// Cache for charset sizes (computed once)
let charsetSizesCache = null;

/**
 * Computes the exact size of each charset level
 * Returns an object with charset id -> character count
 */
export function getCharsetSizes() {
    if (charsetSizesCache) return charsetSizesCache;

    const HIERARCHY = ['alphanums', 'ascii', 'ascii_extended', 'symbols_set', 'active_languages', 'emojis', 'all_unicode'];
    const sizes = {};

    for (const token of HIERARCHY) {
        const charset = buildCharset({ tokens: [token] });
        sizes[token] = charset.length;
    }

    charsetSizesCache = sizes;
    return sizes;
}

/**
 * Generates a charset string based on configuration
 * Sets are INCLUSIVE: each set includes all characters from sets to its "left" in the hierarchy
 * Hierarchy: alphanums ⊂ ascii ⊂ ascii_extended ⊂ symbols_set ⊂ active_languages ⊂ emojis ⊂ all_unicode
 */
export function buildCharset({ tokens = [], excludeChars = '', includeChars = '' }) {
    let pool = '';

    // Helper to safely add ranges excluding denied chars
    const addSafeRange = (start, end) => {
        let localPool = '';
        for (let i = start; i <= end; i++) {
            if (!isInDenyList(i)) {
                try {
                    localPool += String.fromCodePoint(i);
                } catch (e) {
                    // Ignore invalid code points
                }
            }
        }
        return localPool;
    };

    // Define the hierarchy order (left = smaller, right = larger/includes all before)
    const HIERARCHY = ['alphanums', 'ascii', 'ascii_extended', 'symbols_set', 'active_languages', 'emojis', 'all_unicode'];

    // Find the "highest" (rightmost) token in the hierarchy
    let maxLevel = -1;
    for (const token of tokens) {
        const level = HIERARCHY.indexOf(token);
        if (level > maxLevel) {
            maxLevel = level;
        }
    }

    // Build pool by including all sets up to and including maxLevel
    // Level 0: alphanums (a-z, A-Z, 0-9) = 62 chars
    if (maxLevel >= 0) {
        pool += CHAR_SETS.lowercase + CHAR_SETS.uppercase + CHAR_SETS.numbers;
    }

    // Level 1: ascii - Full 8-bit ASCII table (ISO 8859-1 / Latin-1)
    // U+0000 to U+00FF = 256 code points (includes control chars filtered by denylist)
    if (maxLevel >= 1) {
        pool += addSafeRange(0x0000, 0x00FF);
    }

    // Level 2: ascii_extended - Adds Latin Extended-A and Latin Extended-B
    // Latin Extended-A: U+0100 to U+017F (128 chars)
    // Latin Extended-B: U+0180 to U+024F (208 chars)
    if (maxLevel >= 2) {
        pool += addSafeRange(0x0100, 0x017F); // Latin Extended-A
        pool += addSafeRange(0x0180, 0x024F); // Latin Extended-B
    }

    // Level 3: symbols_set (includes ascii_extended)
    if (maxLevel >= 3) {
        pool += addSafeRange(0x2000, 0x206F); // Punctuation
        pool += addSafeRange(0x20A0, 0x20CF); // Currency
        pool += addSafeRange(0x2100, 0x214F); // LetterLike
        pool += addSafeRange(0x2190, 0x21FF); // Arrows
        pool += addSafeRange(0x2200, 0x22FF); // Math
    }

    // Level 4: active_languages (includes symbols_set)
    if (maxLevel >= 4) {
        pool += addSafeRange(0x0370, 0x03FF); // Greek
        pool += addSafeRange(0x0400, 0x04FF); // Cyrillic
        pool += addSafeRange(0x0530, 0x058F); // Armenian
        pool += addSafeRange(0x0590, 0x05FF); // Hebrew
        pool += addSafeRange(0x0600, 0x06FF); // Arabic
    }

    // Level 5: emojis (includes active_languages)
    if (maxLevel >= 5) {
        pool += addSafeRange(0x1F300, 0x1FAFF);
    }

    // Level 6: all_unicode (includes emojis)
    if (maxLevel >= 6) {
        pool += addSafeRange(0x0001, 0xD7FF);
        pool += addSafeRange(0xE000, 0xFFFD);
        pool += addSafeRange(0x1F300, 0x1FAFF);
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
    randomizeLength = false,
    lengthDeviation = 5 // Percentage (0-100)
}) {
    // Safety check if charset is passed as string by legacy code, convert to array
    if (typeof charset === 'string') {
        charset = Array.from(charset);
    }

    if (!charset || charset.length === 0) return { password: '', entropy: 0 };

    // Calculate actual length if randomize is enabled
    let actualLength = length;
    if (randomizeLength && lengthDeviation > 0) {
        // Example: length=100, deviation=5 -> min=95. Range [95, 100]
        const minLen = Math.floor(length * (1 - lengthDeviation / 100));
        // Ensure minLen is at least 1 if length > 0
        const safeMin = Math.max(1, minLen);
        const range = length - safeMin + 1;
        if (range > 0) {
            actualLength = safeMin + getRandomInt(range);
        }
    }

    const buffer = new Array(actualLength);
    const charsetLen = charset.length;

    // 1. Fill linearly with random
    for (let i = 0; i < actualLength; i++) {
        // charset is an array of strings (chars), so [i] works correctly for emojis
        buffer[i] = charset[getRandomInt(charsetLen)];
    }

    // 2. Handle Mandatory Constraints
    // Collect positions to overwrite (randomly picked)
    let positions = Array.from({ length: actualLength }, (_, i) => i);
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
    if (requiredChars.length > actualLength) {
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
