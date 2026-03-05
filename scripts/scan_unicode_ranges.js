import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outFile = path.join(__dirname, '../src/data/unicode_denylist.json');

const ranges = [];
let start = null;

function isProblematic(codePoint) {
    // 1. Surrogates (always invalid as scalar values)
    if (codePoint >= 0xD800 && codePoint <= 0xDFFF) return true;

    // 2. Private Use Aread
    if (codePoint >= 0xE000 && codePoint <= 0xF8FF) return true;
    if (codePoint >= 0xF0000 && codePoint <= 0xFFFFD) return true;
    if (codePoint >= 0x100000 && codePoint <= 0x10FFFD) return true;

    // 3. Specials (FFF0-FFFF)
    if (codePoint >= 0xFFF0 && codePoint <= 0xFFFF) return true;

    // 4. Controls (C0 and C1)
    // C0
    if (codePoint >= 0x0000 && codePoint <= 0x001F) return true;
    // C1
    if (codePoint >= 0x007F && codePoint <= 0x009F) return true;

    // 5. Non-characters (ending in FFFE or FFFF to mark byte order etc)
    if ((codePoint & 0xFFFF) === 0xFFFE || (codePoint & 0xFFFF) === 0xFFFF) return true;

    // 6. Unassigned (\p{Cn})
    // Note: Node.js regex supports \p{Cn}
    try {
        const char = String.fromCodePoint(codePoint);
        if (/\p{Cn}/u.test(char)) return true;
    } catch {
        return true;
    }

    return false;
}

// console.log("Scanning Unicode table (0 - 0x10FFFF)...");

for (let i = 0; i <= 0x10FFFF; i++) {
    if (isProblematic(i)) {
        if (start === null) start = i;
    } else {
        if (start !== null) {
            // End of a generated range
            if (start === i - 1) {
                // Single char
                // We can store it as range [x, x] or just "x"
                // User asked for "ranges and unique chars". 
                // We will just store everything as ranges [start, end] for consistency in the DB.
                ranges.push({ start, end: start, type: 'single' });
            } else {
                ranges.push({ start, end: i - 1, type: 'range' });
            }
            start = null;
        }
    }
    // Progress log every 10%
    // eslint-disable-next-line no-undef
    if (i % 0x10000 === 0) process.stdout.write('.');
}
// Close pending range
if (start !== null) ranges.push({ start, end: 0x10FFFF, type: 'range' });

// console.log("\nScan complete.");
// console.log(`Found ${ranges.length} ranges/items.`);

const data = {
    generatedAt: new Date().toISOString(),
    totalRanges: ranges.length,
    denylist: ranges
};

fs.writeFileSync(outFile, JSON.stringify(data, null, 2));
// console.log(`Database written to ${outFile}`);
