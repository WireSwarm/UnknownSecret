import sys

path = 'c:/Users/cutep/MyDocs_loc/Projets/UnknownSecret/src/components/generator/GeneratorPanel.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix CheckboxOption
old_checkbox = """const CheckboxOption = ({ id, label, checked, onChange, disabled }) => (
    <label htmlFor={id} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${checked ? 'bg-primary/10 border-primary/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`} style={{ border: '1px solid', borderColor: checked ? 'rgba(var(--primary-rgb), 0.3)' : 'rgba(255,255,255,0.1)', opacity: disabled ? 0.5 : 1 }}>
        <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${checked ? 'bg-primary border-primary text-white' : 'border-2 border-white/20 bg-black/20'}`}>
            {checked && <Check size={14} strokeWidth={3} />}
        </div>
        <input type="checkbox" id={id} className="hidden" checked={checked} onChange={onChange} disabled={disabled} />
        <span className="text-sm font-semibold tracking-wide text-white/90 select-none flex-1">{label}</span>
    </label>
);"""

# The file might have blank lines added, let's clean them up using regex or string replace.
import re
# Remove all blank lines with just spaces/newlines to make matching easier
lines = content.split('\n')
clean_lines = []
for line in lines:
    if line.strip() != '':
        clean_lines.append(line)
content = '\n'.join(clean_lines)

new_checkbox = """const CheckboxOption = ({ id, label, checked, onChange, disabled }) => (
    <label htmlFor={id} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${checked ? 'bg-primary/10 border-primary/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`} style={{ border: '1px solid', borderColor: checked ? 'rgba(var(--primary-rgb), 0.3)' : 'rgba(255,255,255,0.1)', opacity: disabled ? 0.5 : 1 }}>
        <div className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${checked ? 'bg-primary border-primary text-white' : 'border-2 border-white/20 bg-black/20'}`}>
            {checked && <Check size={12} strokeWidth={3} />}
        </div>
        <input type="checkbox" id={id} style={{ display: 'none' }} checked={checked} onChange={onChange} disabled={disabled} />
        <span className="text-xs font-semibold tracking-wide text-white/90 select-none flex-1">{label}</span>
    </label>
);"""

# Try to find exactly where CheckboxOption is
cb_start = content.find("const CheckboxOption =")
if cb_start != -1:
    cb_end = content.find(");", cb_start) + 2
    content = content[:cb_start] + new_checkbox + content[cb_end:]
else:
    print("CheckboxOption not found")

# 2. Change Default Configurations Icon (to `Settings` instead of `Sliders`)
# First, let's make sure `Settings` is imported from lucide-react. 
if 'Settings,' not in content and 'Settings }' not in content:
    content = content.replace("import { RefreshCw,", "import { RefreshCw, Settings,")

# Second, replace `Sliders` in `Default Configurations` title
content = content.replace('<Sliders size={18} className="text-primary" />\n<h3 className="text-lg font-bold flex items-center gap-2" id="default-configs-title">\nDefault Configurations\n</h3>', 
                          '<Settings size={18} className="text-primary" />\nDefault Configurations') # Wait, the original has h3 wrapper

# Let's use regex to replace it
content = re.sub(
    r'<h3 class.*?id="default-configs-title".*?>.*?<Sliders size={18} className="text-primary" />.*?Default Configurations.*?</h3>',
    r'<h3 className="text-lg font-bold flex items-center gap-2" id="default-configs-title">\n<Settings size={18} className="text-primary" />\nDefault Configurations\n</h3>',
    content, flags=re.DOTALL
)

# 3. Create a separate GlassCard for the Presets and Default Configurations
# They are currently inside `<GlassCard className="p-6 mt-4 flex flex-col gap-6" id="unified-config-card">`
# And start with `<div className="flex flex-col gap-4" id="presets-section" style={{ position: 'relative' }}>`
# The main configuration section starts with `<div className="flex flex-col gap-6" id="config-section">`

# Let's do:
content = content.replace(
    '<GlassCard className="p-6 mt-4 flex flex-col gap-6" id="unified-config-card">',
    '''<!-- Presets and Default Configs Card -->
<GlassCard className="p-6 mt-4 flex flex-col gap-6" id="presets-glass-card">'''
)

content = content.replace(
    '</GlassCard>\n<div id="unicode-compatibility-section">',
    '</GlassCard>\n<div id="unicode-compatibility-section">'
)

content = content.replace(
    '<div className="flex flex-col gap-6" id="config-section">',
    '''</GlassCard>
<GlassCard className="p-6 mt-4 flex flex-col gap-6" id="unified-config-card">
<div className="flex flex-col gap-6" id="config-section">'''
)


with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixes applied successfully.")
