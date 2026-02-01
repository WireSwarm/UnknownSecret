export const CHAR_SETS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!\"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~', // Standard ASCII symbols
    commonSymbols: '!@#$%^&*?',
};

// Helper: Generate char codes from range
const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => String.fromCharCode(start + i));

export const PRESETS = {
    ALPHANUMERIC: {
        id: 'alphanumeric',
        name: 'Alphanumeric Only',
        tokens: ['uppercase', 'lowercase', 'numbers'],
    },
    ASCII_STANDARD: {
        id: 'ascii',
        name: 'Standard ASCII (Most Compatible)',
        tokens: ['uppercase', 'lowercase', 'numbers', 'symbols'],
    },
    ASCII_EXTENDED: {
        id: 'ascii_extended',
        name: 'ASCII Extended',
        tokens: ['uppercase', 'lowercase', 'numbers', 'symbols', 'extended'],
    },
};

/**
 * Generates a charset string based on configuration
 */
export function buildCharset({ tokens = [], excludeChars = '', includeChars = '' }) {
    let pool = '';

    // Add standard sets
    if (tokens.includes('uppercase')) pool += CHAR_SETS.uppercase;
    if (tokens.includes('lowercase')) pool += CHAR_SETS.lowercase;
    if (tokens.includes('numbers')) pool += CHAR_SETS.numbers;
    if (tokens.includes('symbols')) pool += CHAR_SETS.symbols;

    if (tokens.includes('extended')) {
        pool += range(128, 255).join('');
    }

    // Add custom includes
    if (includeChars) {
        // We add distinct chars from includeChars that might not be in the pool?
        // Usually "includeChars" in generators means "ensure these are part of the pool"
        // But if they are mandatory, they are handled separately.
        // If user explicitly adds chars to the pool:
        pool += includeChars;
    }

    // Remove exclusions
    if (excludeChars) {
        const excludeSet = new Set(excludeChars.split(''));
        pool = pool.split('').filter(c => !excludeSet.has(c)).join('');
    }

    // Deduplicate
    return Array.from(new Set(pool.split(''))).join('');
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
    ensureCommonSymbols = false, // Toggle to force at least one common symbol
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

    if (ensureCommonSymbols) {
        // Check if we already have one
        const hasCommon = buffer.some(c => CHAR_SETS.commonSymbols.includes(c));
        if (!hasCommon) {
            // Pick one random common symbol
            const sym = CHAR_SETS.commonSymbols[getRandomInt(CHAR_SETS.commonSymbols.length)];
            requiredChars.push(sym);
        }
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
