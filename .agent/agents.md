# Agent Guidelines for UnknownSecret Project

## ⚠️ CRITICAL: CSS Styling Warning

### The Problem: Tailwind-style Classes Without Tailwind

This project uses **vanilla CSS** (see `src/index.css`), but some components contain **Tailwind CSS class syntax** that will NOT work.

**Examples of problematic classes:**
```jsx
// ❌ WILL NOT WORK - Tailwind opacity modifiers
className="bg-black/40 hover:bg-white/5 text-red-400"

// ❌ WILL NOT WORK - Tailwind arbitrary values  
className="focus:shadow-[0_0_15px_rgba(...)]"

// ❌ WILL NOT WORK - Tailwind pseudo-class variants (unless defined in index.css)
className="hover:text-primary placeholder-muted/40"
```

### The Solution

Always use one of these approaches:

#### Option 1: Use inline styles (PREFERRED for complex styling)
```jsx
// ✅ WORKS - Inline styles
<button 
    className="icon-btn"
    style={{ 
        color: 'rgba(239, 68, 68, 0.7)',
        background: 'rgba(0, 0, 0, 0.4)'
    }}
>
```

#### Option 2: Use classes defined in `src/index.css`
```jsx
// ✅ WORKS - Pre-defined CSS classes
className="icon-btn text-muted bg-black-20 hover:bg-white-10"
```

### Available Custom Classes (from index.css)

**Backgrounds:**
- `.bg-white-5` → `rgba(255, 255, 255, 0.05)`
- `.bg-white-10` → `rgba(255, 255, 255, 0.1)`
- `.bg-black-20` → `rgba(0, 0, 0, 0.2)`
- `.bg-primary` → `var(--primary)`

**Text colors:**
- `.text-primary` → `var(--primary)`
- `.text-muted` → `var(--text-muted)`
- `.text-red-500` → `#EF4444`

**Hover states (with escaped syntax):**
- `.hover\:bg-white\/5:hover`
- `.hover\:bg-white\/10:hover`
- `.hover\:text-primary:hover`

### Trash/Delete Button Standard

For consistency, ALL delete buttons should follow the HistoryPanel style:
```jsx
<button 
    onClick={handleDelete} 
    className="icon-btn" 
    style={{ color: 'rgba(239, 68, 68, 0.7)' }}
>
    <Trash2 size={18} />
</button>
```

### Input Field Standard

For transparent inputs in dark theme:
```jsx
<input
    className="w-full bg-transparent border-none outline-none text-sm"
    style={{
        background: 'transparent',
        border: 'none',
        color: 'var(--text-main)'
    }}
/>
```

For styled inputs with visible borders:
```jsx
<input
    style={{
        width: '100%',
        height: '2.5rem',
        padding: '0 1rem',
        borderRadius: '9999px',
        background: 'rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: 'white',
        outline: 'none'
    }}
/>
```

---

## Design System Reference

### Color Palette (CSS Variables)
```css
--primary: rgb(79, 70, 229);    /* Indigo */
--secondary: rgb(79, 216, 255); /* Cyan */
--tertiary: rgb(249, 115, 22);  /* Orange */
--text-main: #f4f6ff;
--text-muted: rgba(244, 246, 255, 0.6);
--md-background: #050612;
--md-surface: #141626;
```

### Standard Red for Delete Actions
```
rgba(239, 68, 68, 0.7) /* ~70% opacity red */
```
