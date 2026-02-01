export const CHAR_SETS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!\"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~', // Standard ASCII symbols
    commonSymbols: '!@#$%^&*?',
};

// Helper: Generate char codes from range
// Helper: Generate char codes from range
// Helper: Generate char codes from range
const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => String.fromCharCode(start + i));

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

    // Alphanums (a-z, A-Z, 0-9)
    if (tokens.includes('alphanums')) {
        pool += CHAR_SETS.lowercase + CHAR_SETS.uppercase + CHAR_SETS.numbers;
    }

    // Basic Ascii (U+0021 – U+007E)
    if (tokens.includes('ascii')) {
        pool += range(0x0021, 0x007E).join('');
    }

    // Ascii Extended (U+0020 – U+00FF, U+0100 – U+017F, U+0180 – U+024F)
    if (tokens.includes('ascii_extended')) {
        pool += range(0x0020, 0x00FF).join('');
        pool += range(0x0100, 0x017F).join('');
        pool += range(0x0180, 0x024F).join('');
    }

    // Active Languages (Greek, Cyrillic, Armenian, Hebrew, Arabic)
    if (tokens.includes('active_languages')) {
        pool += range(0x0370, 0x03FF).join(''); // Greek
        pool += range(0x0400, 0x04FF).join(''); // Cyrillic
        pool += range(0x0530, 0x058F).join(''); // Armenian
        pool += range(0x0590, 0x05FF).join(''); // Hebrew
        pool += range(0x0600, 0x06FF).join(''); // Arabic
    }

    // Symbols (Punctuation, Currency, LetterLike, Arrows, Math)
    if (tokens.includes('symbols_set')) {
        pool += range(0x2000, 0x206F).join(''); // Punctuation
        pool += range(0x20A0, 0x20CF).join(''); // Currency
        pool += range(0x2100, 0x214F).join(''); // LetterLike
        pool += range(0x2190, 0x21FF).join(''); // Arrows
        pool += range(0x2200, 0x22FF).join(''); // Math
    }

    // Emojis (U+1F300 – U+1FAFF)
    if (tokens.includes('emojis')) {
        // Emojis are outside BMP (surrogate pairs in JS strings), but String.fromCodePoint works
        const emojiStart = 0x1F300;
        const emojiEnd = 0x1FAFF;
        let emojis = [];
        for (let i = emojiStart; i <= emojiEnd; i++) {
            emojis.push(String.fromCodePoint(i));
        }
        pool += emojis.join('');
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
            pool += range(0x0020, 0xD7FF).join('');
            pool += range(0xE000, 0xFFFD).join('');
        } else {
            // Truly ALL?
            // We will simulate this by adding a special token check in generation, 
            // but here we can add at least 0-FFFF.
            pool += range(0x0001, 0xD7FF).join('');
            pool += range(0xE000, 0xFFFD).join('');
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
    return Array.from(new Set(Array.from(pool))).join(''); // Array.from(string) handles surrogates correctly
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
    charset = '', // The actual string pool
    mandatoryChars = '', // String of chars that MUST appear
    ensureRobustness = false, // New toggle for robustness (1 Lower, 1 Upper, 1 Digit, 1 Symbol)
}) {
    if (!charset) return { password: '', entropy: 0 };

    const buffer = new Array(length);
    const charsetLen = charset.length;

    // 1. Fill linearly with random
    for (let i = 0; i < length; i++) {
        buffer[i] = charset[getRandomInt(charsetLen)];
    }

    // 2. Handle Mandatory Constraints
    // We need to inject mandatory chars if they are missing.
    // "Must Include": User typed specific chars.
    // "Common Symbol": Ensure at least one (!@#$%^&*?) if requested.

    // Collect positions to overwrite (randomly picked)
    let positions = Array.from({ length }, (_, i) => i);
    // Shuffle positions to avoid bias (Fisher-Yates)
    for (let i = positions.length - 1; i > 0; i--) {
        const j = getRandomInt(i + 1);
        [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    let requiredChars = [];

    if (mandatoryChars) {
        requiredChars.push(...mandatoryChars.split(''));
    }

    if (ensureRobustness) {
        // Enforce: Lowercase, Uppercase, Number, Symbol
        const constraints = [
            { set: CHAR_SETS.lowercase, name: 'lower' },
            { set: CHAR_SETS.uppercase, name: 'upper' },
            { set: CHAR_SETS.numbers, name: 'digit' },
            { set: CHAR_SETS.symbols, name: 'symbol' } // Use full ASCII symbols
        ];

        constraints.forEach(constraint => {
            // Check if already present in the currently generated buffer
            // NOTE: 'charset' might not include these chars, but we must inject them if robustness is ON.
            // We check the BUFFER, effectively.
            // Actually, checking buffer is hard if we just have random chars.
            // Simpler: Just force injection.
            const charToInject = constraint.set[getRandomInt(constraint.set.length)];
            requiredChars.push(charToInject);
        });
    }

    // Inject required chars
    // Note: This replaces random characters.
    // We should only replace if the password doesn't already satisfy (optimized), 
    // but "Must Includes" usually implies "Make sure these exist".
    // For "User Typed" mandatory, we assume they MUST exist.
    // If the user typed "ABC", we inject A, B, C.

    // We need to validite if distinct required chars fit in length
    if (requiredChars.length > length) {
        // Truncate or warn? We'll prioritize the first ones.
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
