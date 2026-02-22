import sys

path = 'c:/Users/cutep/MyDocs_loc/Projets/UnknownSecret/src/components/generator/GeneratorPanel.jsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

def find_line(pattern, start=0):
    for i in range(start, len(lines)):
        if pattern in lines[i]:
            return i
    return -1

config_start = find_line('{/* Section 1: Configuration (The Workspace) */}')
presets_start = find_line('{/* Section 2: Saved Configurations */}')
presets_end = find_line('</GlassCard>', presets_start)

if config_start != -1 and presets_start != -1 and presets_end != -1:
    presets_block = lines[presets_start:presets_end]
    new_lines = lines[:config_start] + presets_block + ['\n'] + lines[config_start:presets_start] + lines[presets_end:]
    
    with open(path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print('Moved Presets successfully')
else:
    print('Failed to find indices:', config_start, presets_start, presets_end)
