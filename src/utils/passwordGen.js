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

// Pre-process denylist for O(log N) lookup instead of O(N)
function isInDenyList(codePoint) {
    let low = 0;
    let high = DENYLIST_RANGES.length - 1;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const entry = DENYLIST_RANGES[mid];

        if (codePoint >= entry.start && codePoint <= entry.end) {
            return true;
        } else if (codePoint < entry.start) {
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return false;
}

// Global cache for expensive chunks
const rangeCache = {};

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

    // Helper to safely add ranges excluding denied chars (with caching for large ranges)
    const addSafeRange = (start, end) => {
        const cacheKey = `${start}-${end}`;
        if (rangeCache[cacheKey]) return rangeCache[cacheKey];

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

        // Cache if the loop range is large to prevent UI freezes on subsequent generations
        if (end - start > 1000) {
            rangeCache[cacheKey] = localPool;
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

    // Add explicit individual toggles
    if (tokens.includes('lowercase')) pool += CHAR_SETS.lowercase;
    if (tokens.includes('uppercase')) pool += CHAR_SETS.uppercase;
    if (tokens.includes('numbers')) pool += CHAR_SETS.numbers;
    if (tokens.includes('basic_symbols')) pool += CHAR_SETS.commonSymbols; // the most common ascii symbols
    if (tokens.includes('advanced_symbols')) {
        const exclude = new Set(CHAR_SETS.lowercase + CHAR_SETS.uppercase + CHAR_SETS.numbers + CHAR_SETS.commonSymbols);
        const asciiRest = addSafeRange(0x0000, 0x007F);
        pool += Array.from(asciiRest).filter(c => !exclude.has(c)).join('');
    }

    // Level 0: alphanums (a-z, A-Z, 0-9) = 62 chars
    if (maxLevel >= 0) {
        pool += CHAR_SETS.lowercase + CHAR_SETS.uppercase + CHAR_SETS.numbers;
    }

    // Level 1: ascii - Standard 7-bit ASCII table
    // U+0000 to U+007F = 128 code points (includes control chars filtered by denylist)
    if (maxLevel >= 1) {
        pool += addSafeRange(0x0000, 0x007F);
    }

    // Level 2: ascii_extended - Adds Latin-1 Supplement, Latin Extended-A and Latin Extended-B
    // Latin-1 Supplement: U+0080 to U+00FF (128 chars)
    // Latin Extended-A: U+0100 to U+017F (128 chars)
    // Latin Extended-B: U+0180 to U+024F (208 chars)
    if (maxLevel >= 2) {
        pool += addSafeRange(0x0080, 0x00FF); // Latin-1 Supplement
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
        // Emojis are already added in level 5, so we don't need to add them again since all_unicode includes it
    }

    // Add custom includes
    if (includeChars) {
        pool += includeChars;
    }

    // Remove exclusions
    if (excludeChars) {
        const excludeSet = new Set(Array.from(excludeChars));
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
 * Returns the UTF-8 byte size of a single character (code point)
 */
function getCharByteSize(char) {
    const code = char.codePointAt(0);
    if (code <= 0x7f) return 1;
    if (code <= 0x7ff) return 2;
    if (code <= 0xffff) return 3;
    return 4;
}

/**
 * Main Generator Function
 */
export function generatePassword({
    length = 16,
    charset = [],
    mandatoryChars = '',
    ensureRobustness = false,
    randomizeLength = false,
    lengthDeviation = 5,
    ensureMinAscii = false,
    minAsciiPercent = 5,
    targetByteSize = null, // Opt-in for byte-based generation
    activeGroups = { lower: true, upper: true, numbers: true, symbols: true } // Selected checkbox states
}) {
    // Safety check if charset is passed as string by legacy code, convert to array
    if (typeof charset === 'string') {
        charset = Array.from(charset);
    }

    // Check if we can proceed
    if (!charset || charset.length === 0) return { password: '', entropy: 0 };

    // --- BYTE BASED GENERATION MODE ---
    if (targetByteSize !== null && targetByteSize > 0) {
        let currentBytes = 0;
        let buffer = [];

        // Pre-calculate sizes for performance (Smart Classification)
        // Grouping is implicit via filter during fill to save lines

        // 1. Mandatory Constraints (Robustness / Min Ascii)
        // We generate them first to ensure they fit, assuming they are usually 1-byte (ASCII)
        // If they are multi-byte, we just add them and count bytes.
        let requiredChars = [];

        if (mandatoryChars) {
            requiredChars.push(...Array.from(mandatoryChars));
        }

        if (ensureRobustness) {
            const constraints = [];
            if (activeGroups.lower) constraints.push({ set: Array.from(CHAR_SETS.lowercase) });
            if (activeGroups.upper) constraints.push({ set: Array.from(CHAR_SETS.uppercase) });
            if (activeGroups.numbers) constraints.push({ set: Array.from(CHAR_SETS.numbers) });
            if (activeGroups.symbols) {
                const useBasic = Array.isArray(activeGroups.symbols) ? activeGroups.symbols.includes('basic') : activeGroups.symbols;
                const pool = useBasic ? CHAR_SETS.commonSymbols : CHAR_SETS.symbols;
                constraints.push({ set: Array.from(pool) });
            }

            constraints.forEach(c => requiredChars.push(c.set[getRandomInt(c.set.length)]));
        }

        // Deduplicate and trim required if they exceed target immediately (rare edge case)
        // We pick random subset if too many
        // (Skipping complex reduction for brevity, assuming reasonable targets)

        // Add required chars to buffer
        for (const char of requiredChars) {
            const size = getCharByteSize(char);
            if (currentBytes + size <= targetByteSize) {
                buffer.push(char);
                currentBytes += size;
            }
        }

        // 2. Smart Fill Loop
        // We pre-scan charset sizes only if we get into tight spots, 
        // OR we just use rejection sampling for speed if charset is large.
        // Given constraint "not perturb randomness", filtering the pool is cleaner than rejection.

        while (currentBytes < targetByteSize) {
            const remaining = targetByteSize - currentBytes;

            // Optimization: If remaining >= 4, ANY char fits. O(1).
            let validPool = charset;
            if (remaining < 4) {
                validPool = charset.filter(c => getCharByteSize(c) <= remaining);
            }

            if (validPool.length === 0) break; // Should not happen if 1-byte chars exist

            const char = validPool[getRandomInt(validPool.length)];
            buffer.push(char);
            currentBytes += getCharByteSize(char);
        }

        // 3. Shuffle (Fisher-Yates)
        for (let i = buffer.length - 1; i > 0; i--) {
            const j = getRandomInt(i + 1);
            [buffer[i], buffer[j]] = [buffer[j], buffer[i]];
        }

        const password = buffer.join('');
        // Calc entropy based on effective length (approx) or combinations
        const combinations = BigInt(charset.length) ** BigInt(buffer.length);
        const entropy = combinations.toString(2).length;

        return { password, entropy, combinations };
    }

    // --- STANDARD LENGTH BASED GENERATION ---
    // Ensure length is a number
    length = Number(length);

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
        // Enforce: Lowercase, Uppercase, Number, Symbol (only if selected)
        const constraints = [];
        if (activeGroups.lower) constraints.push({ set: Array.from(CHAR_SETS.lowercase) });
        if (activeGroups.upper) constraints.push({ set: Array.from(CHAR_SETS.uppercase) });
        if (activeGroups.numbers) constraints.push({ set: Array.from(CHAR_SETS.numbers) });
        if (activeGroups.symbols) {
            const useBasic = Array.isArray(activeGroups.symbols) ? activeGroups.symbols.includes('basic') : activeGroups.symbols;
            const pool = useBasic ? CHAR_SETS.commonSymbols : CHAR_SETS.symbols;
            constraints.push({ set: Array.from(pool) });
        }

        constraints.forEach(constraint => {
            const charToInject = constraint.set[getRandomInt(constraint.set.length)];
            requiredChars.push(charToInject);
        });
    }

    // 4. Handle Minimum ASCII Ratio (Anti-tofu protection)
    if (ensureMinAscii && minAsciiPercent > 0) {
        const targetAsciiCount = Math.ceil(actualLength * (minAsciiPercent / 100));

        // Construct a fast ASCII pool (Alphanums + Standard Symbols)
        // avoiding reconstruction if possible, but string concat is fast enough here
        const asciiPool = CHAR_SETS.lowercase + CHAR_SETS.uppercase + CHAR_SETS.numbers + CHAR_SETS.symbols;
        const poolLen = asciiPool.length;

        // Current estimation of ASCII chars already in requiredChars (from ensureRobustness or mandatory)
        // This is a micro-optimization to avoid over-replacing, though replacing is cheap.
        // Let's just force inject to be safe and simple.

        for (let i = 0; i < targetAsciiCount; i++) {
            requiredChars.push(asciiPool[getRandomInt(poolLen)]);
        }
    }

    // Inject required chars
    if (requiredChars.length > actualLength) {
        requiredChars = requiredChars.slice(0, actualLength);
    }

    for (let i = 0; i < requiredChars.length; i++) {
        buffer[positions[i]] = requiredChars[i];
    }

    const password = buffer.join('');

    const combinations = BigInt(charsetLen) ** BigInt(actualLength);
    // Entropy: round(log2(N^L))
    // We approximate log2 of a BigInt by taking the length of its binary string representation.
    const entropy = combinations.toString(2).length;

    return { password, entropy, combinations };
}
