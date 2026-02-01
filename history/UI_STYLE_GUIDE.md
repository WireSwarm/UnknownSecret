# 🎨 UI Style Guide - MasqIP

## 1. Aesthetic Philosophy
The interface is built on a "Deep Dark" immersion using semi-transparent overlays (**Glassmorphism**) to create depth. Unlike "flat" interfaces, MasqIP utilizes light, soft drop shadows, and background blurs to prioritize information hierarchy.

**Keywords:** *Premium, Dark Mode, Translucent, Fluid, Reactive.*

---

## 2. Color Palette (Token System)
The project uses a highly structured CSS variable system (Tokens), based on RGB values to enable opacity management (alpha channels).

### Backgrounds
The interface is not pure black, but composed of deep night blue and very dark violet shades.
*   **Main Background (`--md-background`)**: `#050612` (Almost black, indigo tint)
*   **Surfaces (`--md-surface`)**: `#141626` (Desaturated night blue)
*   **Cards/Tools**: Subtle linear gradients on dark bases.

### Accents (Primary Colors)
Used for actions, active states, and highlights.
*   **Primary (Indigo)**: `RGB(79, 70, 229)` / `#4f46e5` → Used for main buttons, focus borders.
*   **Secondary (Cyan)**: `RGB(79, 216, 255)` / `#4fd8ff` → Used for gradients and secondary elements.
*   **Tertiary (Orange)**: `RGB(249, 115, 22)` / `#f97316` → Used for warm contrasts or subtle warnings.

### Signature Gradients
The page background (`body`) uses a fixed 3-point **Mesh Gradient** to add life without distraction:
```css
background:
  radial-gradient(circle at 18% 22%, rgba(var(--md-sys-color-primary-rgb), 0.22), transparent 58%),
  radial-gradient(circle at 82% 18%, rgba(var(--md-sys-color-secondary-rgb), 0.18), transparent 55%),
  radial-gradient(circle at 15% 85%, rgba(var(--md-sys-color-tertiary-rgb), 0.12), transparent 60%),
  var(--md-background);
```

---

## 3. Key UI Components

### A. Glass Cards
This is the central element of the design.
*   **Shape**: Highly rounded corners (`border-radius: 24px` to `28px`).
*   **Material**:
    *   Semi-transparent background with blur (`backdrop-filter: blur(22px)`).
    *   Very fine, subtle border (`1px solid rgba(255,255,255, 0.12)`).
    *   Deep drop shadow (`box-shadow: 0 28px 60px -24px ...`).
*   **Interaction**: On hover, the card "levitates" (`transform: translateY(-8px)`) and the shadow intensifies.

### B. Input Fields
*   **Style**: "Filled" rather than just bordered.
*   **Background**: Dark and slightly transparent (`rgba(13, 16, 29, 0.78)`).
*   **Border**: Fine and colored (`1px solid rgba(primary, 0.28)`), becomes bright/glowing on focus.
*   **Typography**: Large font, light text color (`#f4f6ff`).

### C. Buttons
1.  **Accent Button (Primary)**:
    *   Shape: "Pill" or softened rectangle (`border-radius: 14px`).
    *   Background: Diagonal Linear Gradient (Indigo to Cyan).
    *   Shadow: Luminous, colored like the button (Glow effect).
2.  **Ghost Button (Secondary)**:
    *   Background: Very dark and transparent.
    *   Text: Gray/White.
    *   Border: Very fine.

### D. Badges and Tags
*   **Shape**: "Capsule" (`border-radius: 999px`).
*   **Background**: Status color with 20-40% opacity.
*   **Text**: Vivid, solid status color.

---

## 4. Typography
The project uses modern system fonts (`-apple-system`, `Roboto`, `Segoe UI`) for performance and neutrality, but with specific treatments:
*   **Headings**: Often feature a text gradient (`background-clip: text`) and tight spacing (`letter-spacing: -0.02em`).
*   **Labels / Subtitles**: All caps (`text-transform: uppercase`), small size (`0.75rem`), bold (`font-weight: 600`), and spaced out (`letter-spacing: 0.08em`).
*   **Code / Data**: Monospace fonts (`Fira Code`, `Roboto Mono`) for IP addresses and masks.

---

## 5. Effects & Animations (Micro-interactions)
The design feels "alive" thanks to constant but subtle animations.
*   **Ambient Float**: The logo or main elements float gently up and down continuously (`animation: ambient-float 6s ...`).
*   **Hover Lifts**: Almost every interactive element rises a few pixels on hover.
*   **Colored Shadows**: Shadows are not black; they are tinted blue or violet to enrich the dark background.

---

## Technical Summary for Replication
To replicate this style on a new project, start by creating a CSS variables file (like `materialTheme.css`) defining your colors in RGB triplets (e.g., `--primary-rgb: 79, 70, 229`).

This allows you to use the `rgba(var(--primary-rgb), 0.5)` syntax everywhere to create the transparency and glow effects that are the signature of this design.
