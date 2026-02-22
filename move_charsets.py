import sys
path = 'c:/Users/cutep/MyDocs_loc/Projets/UnknownSecret/src/components/generator/GeneratorPanel.jsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

def find_line(pattern, start=0):
    for i in range(start, len(lines)):
        if pattern in lines[i]:
            return i
    return -1

charset_start = find_line('{/* Character Sets with inclusion highlighting */}')
charset_end = find_line('id=\"settings-grid\"', charset_start) - 1

if charset_start == -1 or charset_end == -1:
    print('Failed to find charset start or end')
    sys.exit(1)

charset_block = lines[charset_start:charset_end]

advanced_end = find_line('{/* Character Inspector Button has been moved to main input */}')
if advanced_end == -1:
    print('Failed to find advanced end')
    sys.exit(1)

checkboxes_block = [
    '                    {/* Component-based Checkboxes */}\n',
    '                    <div className=\"grid grid-cols-2 md:grid-cols-3 gap-3 mb-2 mt-2\">\n',
    '                        <CheckboxOption id=\"chk-lower\" label=\"Minuscules (a-z)\" checked={config.lower} onChange={() => handleCheckboxToggle(\'lower\')} />\n',
    '                        <CheckboxOption id=\"chk-upper\" label=\"Majuscules (A-Z)\" checked={config.upper} onChange={() => handleCheckboxToggle(\'upper\')} />\n',
    '                        <CheckboxOption id=\"chk-numbers\" label=\"Chiffres (0-9)\" checked={config.numbers} onChange={() => handleCheckboxToggle(\'numbers\')} />\n',
    '                        <CheckboxOption id=\"chk-basic\" label=\"Symboles basiques\" checked={config.basic} onChange={() => handleCheckboxToggle(\'basic\')} />\n',
    '                        <CheckboxOption id=\"chk-advanced\" label=\"Symboles avancés\" checked={config.advanced} onChange={() => handleCheckboxToggle(\'advanced\')} />\n',
    '                    </div>\n'
]

new_lines = lines[:charset_start] + checkboxes_block + lines[charset_end:advanced_end] + charset_block + lines[advanced_end:]

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print('Moved Character sets and inserted checkboxes successfully')
