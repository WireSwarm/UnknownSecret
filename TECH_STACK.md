# UnknownSecret - Tech Stack & Development Guide

> 🔐 **Password Generator Application**  
> Last updated: February 2026

---

## 🏗️ Technology Stack

### Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI Framework |
| **Vite** | 7.2.4 | Build tool & Dev server |
| **ES Modules** | native | Module system (`"type": "module"`) |

### Styling

| Technology | Notes |
|------------|-------|
| **Vanilla CSS** | ⚠️ **NOT Tailwind** - Custom design system |
| **CSS Variables** | Theme tokens in `:root` |
| **Glassmorphism** | Blur effects, translucent cards |

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `lucide-react` | 0.563.0 | Icon library (Trash2, Eye, Copy, etc.) |
| `framer-motion` | 12.29.2 | Animations |
| `react-dom` | 19.2.0 | React DOM bindings |

### Dev Dependencies

| Package | Purpose |
|---------|---------|
| `@vitejs/plugin-react` | React plugin for Vite (Babel/HMR) |
| `vite-plugin-singlefile` | Bundle to single HTML file |
| `eslint` + plugins | Code linting |
| `@types/react` | TypeScript types (for IDE support) |

---

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--primary: rgb(79, 70, 229);     /* Indigo */
--secondary: rgb(79, 216, 255);  /* Cyan */
--tertiary: rgb(249, 115, 22);   /* Orange */

/* Text */
--text-main: #f4f6ff;
--text-muted: rgba(244, 246, 255, 0.6);

/* Backgrounds */
--md-background: #050612;        /* Deep dark blue */
--md-surface: #141626;           /* Card surfaces */
```

### Typography

- **Sans**: Inter, system fonts fallback
- **Mono**: Noto Sans, Fira Code, system emoji fonts

### UI Components (in `src/components/ui/`)

- `GlassCard` - Glassmorphism container
- `Button` - Primary/Ghost variants
- `Input` - Styled text input
- `Slider` - Range slider
- `Toggle` - Switch component

---

## ⚠️ Critical Styling Rules

### ❌ DO NOT USE Tailwind Syntax

This project uses **vanilla CSS**. Tailwind classes will NOT work:

```jsx
// ❌ WRONG - Will show browser defaults (gray backgrounds, etc.)
className="bg-black/40 hover:bg-white/5 text-red-400"
className="focus:shadow-[0_0_15px_rgba(...)]"
```

### ✅ USE Inline Styles or Defined Classes

```jsx
// ✅ CORRECT - Inline styles
style={{
    background: 'rgba(0, 0, 0, 0.4)',
    color: 'rgba(239, 68, 68, 0.7)'
}}

// ✅ CORRECT - Classes from index.css
className="icon-btn text-muted bg-black-20"
```

### Available Utility Classes

See `src/index.css` for all defined classes. Key ones:

| Class | Effect |
|-------|--------|
| `.icon-btn` | Transparent button for icons |
| `.bg-black-20` | `rgba(0, 0, 0, 0.2)` |
| `.bg-white-5` | `rgba(255, 255, 255, 0.05)` |
| `.text-primary` | Indigo color |
| `.text-muted` | Muted text color |
| `.glass-card` | Glassmorphism card |

### Delete Button Standard

All delete/trash buttons should use:
```jsx
<button 
    className="icon-btn" 
    style={{ color: 'rgba(239, 68, 68, 0.7)' }}
>
    <Trash2 size={18} />
</button>
```

---

## 📁 Project Structure

```
UnknownSecret/
├── .agent/
│   └── agents.md          # AI/Agent guidelines
├── src/
│   ├── components/
│   │   ├── generator/     # Password generator UI
│   │   ├── history/       # History panel
│   │   ├── presets/       # Saved configurations
│   │   └── ui/            # Reusable UI components
│   ├── data/              # Static data (unicode ranges, etc.)
│   ├── utils/             # Password generation logic
│   ├── hooks/             # Custom React hooks
│   ├── App.jsx            # Main app component
│   ├── App.css            # App-specific styles
│   └── index.css          # Global styles & design system
├── scripts/               # Build/utility scripts
├── public/                # Static assets
├── vite.config.js         # Vite configuration
└── package.json           # Dependencies
```

---

## 🚀 Commands

```bash
# Development
npm run dev          # Start dev server (Vite HMR)

# Production
npm run build        # Build to /dist (single HTML file)
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

---

## 🔧 Build Configuration

The project uses `vite-plugin-singlefile` to bundle everything into a single HTML file. This is useful for:
- Portable distribution
- Offline usage
- Simple deployment

```js
// vite.config.js
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  base: './'  // Relative paths for assets
})
```

---

## 📝 For AI Agents & Contributors

1. **Read `.agent/agents.md`** before making styling changes
2. **Never assume Tailwind is installed** - check `package.json`
3. **Use inline styles** for dynamic/complex styling
4. **Follow existing patterns** - look at similar components first
5. **Test visually** - CSS issues often don't show errors in console
