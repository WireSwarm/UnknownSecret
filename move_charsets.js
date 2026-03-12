const fs = require('fs');
const file = 'c:/Users/cutep/MyDocs_loc/Projets/UnknownSecret/src/components/generator/GeneratorPanel.jsx';
let content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

const chunkStart = lines.findIndex(l => l.includes('Character Sets with inclusion highlighting'));
const chunkEnd = lines.findIndex((l, idx) => idx > chunkStart && l.includes('</div>') && lines[idx+1].includes('Character Inspector Button has been moved'));

if (chunkStart === -1 || chunkEnd === -1) {
    console.error('Could not find chunk bounds');
    process.exit(1);
}

const chunkLines = lines.slice(chunkStart, chunkEnd + 1);

// remove the original chunk
lines.splice(chunkStart, chunkEnd - chunkStart + 1);

// reindent for upper location: difference is 40 - 24 = 16 spaces
const reindented = chunkLines.map(line => line.startsWith('                ') ? line.substring(16) : line);

// Before we insert, let's put a nice margin class into the top div
const divIndex = reindented.findIndex(l => l === '                        <div>');
if (divIndex !== -1) {
    reindented[divIndex] = '                        <div className="mb-4 mt-2">';
}

// target insertion line index: after the checkboxes
const insertLineIdx = lines.findIndex(l => l.includes('chk-advanced')) + 2;

lines.splice(insertLineIdx, 0, ...reindented);
fs.writeFileSync(file, lines.join('\n'));
console.log('done!');
