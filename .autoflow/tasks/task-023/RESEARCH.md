# Research: UI/UX Audit and Design System

**Task ID**: task-023
**Task**: UI/UX Audit and Design System

---

## Table of Contents

1. [Professional Image Editor Analysis](#professional-image-editor-analysis)
2. [Design System Best Practices](#design-system-best-practices)
3. [Component Pattern Research](#component-pattern-research)
4. [Accessibility Standards (WCAG 2.2 AAA)](#accessibility-standards-wcag-22-aaa)
5. [Responsive Layout Patterns](#responsive-layout-patterns)
6. [Technology Stack Capabilities](#technology-stack-capabilities)
7. [Color Theory & Contrast](#color-theory--contrast)
8. [Typography Best Practices](#typography-best-practices)
9. [Animation & Interaction Design](#animation--interaction-design)
10. [References & Resources](#references--resources)

---

## Professional Image Editor Analysis

### Industry-Standard Tools Studied

#### 1. **Photoshop** (Adobe)

**Layout Architecture**:
- **Top Menu Bar**: File, Edit, Image, Layer, Select, Filter, View, Window, Help
- **Toolbar** (Left): Vertical icon-only toolbar with tool selection (Move, Select, Crop, Eyedropper, etc.)
- **Canvas** (Center): Main workspace with zoom/pan, rulers optional, guides, grids
- **Panels** (Right): Floating, dockable, collapsible panels (Layers, Adjustments, History, etc.)
- **Options Bar** (Top, below menu): Context-aware options for selected tool

**Key UX Patterns**:
- Icon-only tools with tooltips showing name + keyboard shortcut
- Panels can be minimized to icons or expanded with full content
- All panels draggable, dockable, and can be arranged in custom layouts
- Workspace presets save panel layouts
- Dark theme by default (dark gray #2C2C2C background)
- Clear visual hierarchy: canvas is brightest, panels are muted

**Color Scheme**:
- Background: Dark gray (#2C2C2C to #1F1F1F)
- Canvas: Light gray (#3C3C3C) with checkerboard for transparency
- Text: White (#E8E8E8) for high contrast
- Accent: Blue (#0078D4) for selected tools, active states
- Borders: Subtle dark gray (#1A1A1A) for visual separation

**Takeaways**:
- Professional tools prioritize dark themes (reduce eye strain, make canvas stand out)
- Vertical toolbars with icon-only design save horizontal space
- Context-aware options bar adapts to selected tool (not all options visible at once)
- Floating/dockable panels provide flexibility without clutter

---

#### 2. **Figma** (Figma, Inc.)

**Layout Architecture**:
- **Top Toolbar**: File menu, tool selection, zoom, view options, share
- **Left Sidebar**: Layers panel (hierarchical tree view), Assets panel
- **Canvas** (Center): Infinite canvas with zoom/pan, grid overlay, rulers
- **Right Panel**: Properties panel with context-aware controls (Fill, Stroke, Effects, etc.)
- **Bottom Bar**: Zoom controls, view mode, comments, version history

**Key UX Patterns**:
- Minimalist design: Only essential UI visible, panels auto-hide when not in use
- Properties panel adapts to selected object (show relevant controls only)
- Floating inspector for quick edits (color picker, dimension inputs)
- Keyboard shortcuts prominent (shown in tooltips, help menu)
- Modern, clean design with generous whitespace

**Color Scheme**:
- Background: White (#FFFFFF) or Dark (#1E1E1E) based on theme
- Canvas: Light gray (#F5F5F5) in light mode, dark gray (#2C2C2C) in dark mode
- Text: Black (#000000) or white (#FFFFFF) for maximum contrast
- Accent: Blue (#0D99FF) for primary actions, selected states
- Borders: Light gray (#E5E5E5) in light mode, dark gray (#3C3C3C) in dark mode

**Takeaways**:
- Adaptive UI: Panels show/hide based on context (reduces cognitive load)
- Floating inspectors provide quick access without opening full panels
- Generous whitespace improves readability and reduces visual clutter
- Keyboard shortcuts are first-class citizens (shown everywhere)

---

#### 3. **Canva** (Canva Pty Ltd)

**Layout Architecture**:
- **Top Toolbar**: Logo, design title, share button, publish button
- **Left Sidebar**: Templates, Elements, Text, Uploads, Brand (vertical tabs)
- **Canvas** (Center): Main design area with zoom/pan, grid guides
- **Right Panel**: Properties panel (context-aware: Text formatting, Image adjustments, etc.)
- **Bottom Bar**: Page navigation (for multi-page designs), zoom controls

**Key UX Patterns**:
- Consumer-friendly: Simplified UI with clear labels, less jargon
- Visual hierarchy: Large, colorful icons in left sidebar (easy to scan)
- Drag-and-drop everywhere (elements, templates, uploads)
- Real-time collaboration indicators (cursors, comments)
- Onboarding tutorials and empty state guidance

**Color Scheme**:
- Background: White (#FFFFFF) for clean, approachable look
- Canvas: White (#FFFFFF) with light gray (#F0F0F0) workspace border
- Text: Dark gray (#202020) for readability
- Accent: Teal (#00C4CC) for brand, primary actions
- Borders: Light gray (#DADADA) for subtle separation

**Takeaways**:
- Approachable design: Consumer-friendly with clear labels, less jargon
- Colorful, visual UI: Icons and elements use colors to aid recognition
- Onboarding is crucial: Tutorials, empty states, tooltips guide new users
- Real-time feedback: Drag-and-drop shows instant previews

---

#### 4. **Photopea** (Ivan Kutskir)

**Layout Architecture**:
- **Top Menu Bar**: File, Edit, Image, Layer, Select, Filter, View, Window, Help (mimics Photoshop)
- **Toolbar** (Left): Vertical icon-only toolbar (Photoshop-like)
- **Canvas** (Center): Main workspace with zoom/pan
- **Panels** (Right): Dockable panels (Layers, Adjustments, History, Navigator)
- **Options Bar** (Top): Tool-specific options

**Key UX Patterns**:
- Photoshop clone: Familiar layout for Photoshop users (low learning curve)
- Dark theme default (dark gray background)
- Floating panels can be docked or minimized
- Web-based: All client-side processing (privacy-focused, like CraftyPrep)

**Color Scheme**:
- Background: Dark gray (#2C2C2C) matching Photoshop
- Canvas: Medium gray (#3E3E3E)
- Text: Light gray (#E0E0E0)
- Accent: Blue (#0078D4) for selected tools
- Borders: Dark gray (#1E1E1E)

**Takeaways**:
- Familiarity breeds adoption: Mimicking Photoshop reduces learning curve
- Dark themes are industry standard for professional image editors
- Web-based can be professional: Photopea proves browser-based apps can rival desktop
- Privacy-focused: Client-side processing is a selling point (like CraftyPrep)

---

### Common Patterns Across Professional Tools

**Layout**:
- ✅ Top toolbar or menu bar (file operations, global actions)
- ✅ Left sidebar or toolbar (tool selection, vertical layout)
- ✅ Center canvas (main workspace, flexible size)
- ✅ Right panel (properties, adjustments, context-aware)
- ✅ Bottom status bar (zoom, dimensions, tips)

**UX Principles**:
- ✅ **Context-aware UI**: Show relevant controls only (reduce clutter)
- ✅ **Keyboard shortcuts**: Prominent, shown in tooltips, documented
- ✅ **Dark themes**: Reduce eye strain, make canvas stand out
- ✅ **Collapsible panels**: User control over workspace layout
- ✅ **Visual hierarchy**: Canvas is brightest, UI is muted
- ✅ **Icon-only tools**: Save space, use tooltips for clarity
- ✅ **Floating panels**: Draggable, dockable, customizable
- ✅ **Real-time feedback**: Instant previews, live adjustments
- ✅ **Undo/Redo**: Always accessible, keyboard shortcuts (Ctrl+Z/Ctrl+Y)

**Color Schemes**:
- **Dark themes**: Gray backgrounds (#1E1E1E to #3C3C3C), white text (#E8E8E8)
- **Accent colors**: Blue (#0078D4, #0D99FF) or brand color (teal #00C4CC)
- **Canvas distinction**: Canvas slightly lighter than UI background
- **High contrast**: 7:1 or better for text readability

**Component Patterns**:
- **Buttons**: Small, icon-only or icon+text, subtle backgrounds
- **Sliders**: Gradient tracks, large handles, inline value display
- **Panels**: Collapsible sections (accordions), scroll if content overflows
- **Inputs**: Minimal borders, inline labels, focus rings
- **Icons**: 20px-24px, consistent stroke width, tooltips

---

## Design System Best Practices

### Modern Design System References

#### 1. **Material Design 3** (Google)

**Color System**:
- **Primary**: Main brand color (used for primary actions, accents)
- **Secondary**: Complementary color (used for less prominent actions)
- **Tertiary**: Additional accent (used sparingly for highlights)
- **Error**: Red (#B00020) for errors, destructive actions
- **Neutral**: Gray scale (10 shades from white to black)
- **Surface**: Background colors for cards, panels, dialogs

**Typography**:
- **Type scale**: 13 predefined sizes (from 11px to 57px)
- **Line height**: 1.5 for body text, 1.25 for headings
- **Font families**: Roboto (sans-serif), Roboto Mono (monospace)

**Spacing**:
- **8px grid**: All spacing is multiples of 8px (or 4px for tight spacing)
- **Padding**: 8px, 16px, 24px (common values)
- **Gaps**: 8px (tight), 16px (default), 24px (loose)

**Takeaways**:
- Semantic color naming (primary, secondary, error) is clearer than abstract names (blue, red)
- 8px grid creates visual rhythm and consistency
- Predefined type scale prevents font size chaos

---

#### 2. **Tailwind CSS** (Tailwind Labs)

**Philosophy**: Utility-first CSS framework with comprehensive design system

**Color System**:
- **Color scales**: 10 shades per color (50, 100, 200, ..., 900)
- **Semantic colors**: Slate (neutral), Blue (primary), Red (error), Green (success), Amber (warning)
- **HSL format**: Easy to adjust lightness/saturation programmatically

**Spacing System**:
- **Numeric scale**: 0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72, 80, 96
- **4px base**: All values are multiples of 4px (0.25rem = 4px)
- **Responsive**: Same spacing values work across breakpoints

**Typography**:
- **Font sizes**: xs (12px), sm (14px), base (16px), lg (18px), xl (20px), 2xl (24px), 3xl (30px), 4xl (36px), 5xl (48px), 6xl (60px), 7xl (72px), 8xl (96px), 9xl (128px)
- **Font weights**: 100 (thin), 200 (extralight), 300 (light), 400 (normal), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold), 900 (black)

**Takeaways**:
- Numeric scales are easy to remember and use
- Color shades (50-900) provide flexibility for light/dark themes
- 4px base unit is fine-grained enough for precise control

---

#### 3. **Radix UI** (WorkOS)

**Philosophy**: Unstyled, accessible component primitives

**Component Patterns**:
- **Compound components**: Parent component with child components (e.g., `Dialog.Root`, `Dialog.Trigger`, `Dialog.Content`)
- **Accessibility built-in**: ARIA attributes, keyboard navigation, focus management
- **Headless**: No styling, full control over appearance

**Accessibility**:
- **Keyboard navigation**: All components fully keyboard accessible
- **ARIA attributes**: Proper roles, states, properties
- **Focus management**: Focus trapped in modals, restored on close
- **Screen reader support**: Semantic HTML, ARIA labels, live regions

**Takeaways**:
- Compound components provide flexibility and composability
- Accessibility should be built-in, not added later
- Headless components allow full styling control (perfect for custom design systems)

---

### Design System Principles

1. **Consistency**: Use the same design tokens everywhere (don't create one-off values)
2. **Scalability**: Design system should grow with the application (don't hard-code values)
3. **Accessibility**: WCAG compliance from the start (not an afterthought)
4. **Documentation**: Every token, component, pattern should be documented
5. **Type Safety**: TypeScript for design tokens (autocomplete, validation)
6. **Performance**: Minimize CSS, use utility classes, avoid runtime styles

---

## Component Pattern Research

### Button Component Patterns

**Best Practices**:
- **Variants**: Primary, Secondary, Ghost, Destructive, Icon, Link (6 common variants)
- **Sizes**: Small (32px), Medium (40px), Large (48px) heights
- **States**: Default, Hover, Active, Focus, Disabled, Loading (6 states minimum)
- **Icons**: Support leading/trailing icons (icon + text)
- **Loading state**: Spinner icon, disabled interaction, "Loading..." text

**Example (Radix UI + Tailwind)**:
```tsx
<Button variant="primary" size="base" icon={<Download />}>
  Download
</Button>
```

**Accessibility**:
- Use `<button>` element (not `<div>` with click handler)
- Include `aria-label` for icon-only buttons
- Show focus ring (3px outline, 3:1 contrast)
- Disabled buttons have `aria-disabled="true"` and 50% opacity

---

### Slider Component Patterns

**Best Practices**:
- **Track**: Full width, rounded, gradient fill showing current value
- **Handle**: Large (20-24px), circular, shadow on hover, draggable
- **Value display**: Inline (right side), monospace font, real-time update
- **Min/Max labels**: Small text (12px), muted color, below track
- **Keyboard support**: Arrow keys (±1), Page Up/Down (±10), Home/End (min/max)

**Radix UI Slider**:
- Provides unstyled `<Slider.Root>`, `<Slider.Track>`, `<Slider.Range>`, `<Slider.Thumb>`
- Built-in keyboard navigation, ARIA attributes, touch support
- Custom styling via Tailwind CSS classes

**Accessibility**:
- `role="slider"` on handle element
- `aria-valuemin`, `aria-valuemax`, `aria-valuenow` attributes
- `aria-label` or `aria-labelledby` for slider purpose
- Focus ring on handle (keyboard navigation)

---

### Panel Component Patterns

**Types**:
1. **Card**: Elevated surface (box-shadow), rounded corners, padding
2. **Collapsible**: Accordion with header (title + expand/collapse icon), smooth transition
3. **Floating**: Draggable, repositionable, higher shadow, optional close button
4. **Sidebar**: Fixed width, collapsible, vertical layout
5. **Toolbar**: Horizontal, compact height, no shadow

**Collapsible Pattern** (Radix UI):
```tsx
<Collapsible.Root>
  <Collapsible.Trigger>
    <h3>Adjustments</h3>
    <ChevronDownIcon />
  </Collapsible.Trigger>
  <Collapsible.Content>
    <BrightnessSlider />
    <ContrastSlider />
  </Collapsible.Content>
</Collapsible.Root>
```

**Accessibility**:
- `aria-expanded` state on trigger (true/false)
- `aria-controls` linking trigger to content
- Smooth transition (300ms ease-in-out)
- Keyboard support (Enter/Space to toggle)

---

### Input Component Patterns

**Best Practices**:
- **Label association**: Use `<label for="input-id">` or `aria-labelledby`
- **Help text**: Small text (14px), muted color, below input
- **Error state**: Red border, error icon, error message below
- **Focus ring**: 3px outline, primary color, 3:1 contrast
- **Disabled state**: Gray background, reduced opacity, no interaction

**Number Input with +/- Buttons**:
```tsx
<div className="flex items-center gap-2">
  <button onClick={decrement}>-</button>
  <input type="number" value={value} onChange={handleChange} />
  <button onClick={increment}>+</button>
</div>
```

**Accessibility**:
- `aria-invalid="true"` on error state
- `aria-describedby` linking to help text or error message
- `aria-required="true"` for required fields
- Label always visible (not placeholder-only)

---

## Accessibility Standards (WCAG 2.2 AAA)

### Color Contrast Requirements

**WCAG 2.2 Level AAA (1.4.6)**:
- **Normal text**: ≥7:1 contrast ratio (16px or smaller)
- **Large text**: ≥4.5:1 contrast ratio (18pt+ or 14pt bold)
- **UI components**: ≥3:1 contrast ratio (borders, icons, controls)

**Testing Tools**:
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
  - Input foreground and background colors (hex or RGB)
  - Shows contrast ratio and WCAG compliance (AA, AAA)
- **Chrome DevTools**:
  - Inspect element → Styles panel → Color picker
  - Shows contrast ratio and WCAG compliance badges

**Example Verification**:
- White text (#FFFFFF) on dark gray (#1F1F1F): 19.1:1 ✅ (AAA)
- White text (#FFFFFF) on medium gray (#666666): 5.7:1 ❌ (fails AAA, passes AA)
- Dark gray text (#0F172A) on white (#FFFFFF): 19.1:1 ✅ (AAA)

---

### Keyboard Navigation Requirements

**WCAG 2.1.1 (Level A)**: All functionality available via keyboard

**Essential Patterns**:
- **Tab**: Move to next focusable element
- **Shift + Tab**: Move to previous focusable element
- **Enter/Space**: Activate button, toggle checkbox
- **Arrow keys**: Navigate within component (slider, select, tabs)
- **Escape**: Close modal, cancel operation
- **Home/End**: Jump to first/last element

**Focus Indicator (WCAG 2.4.7, Level AA)**:
- Visible focus ring (3px outline)
- High contrast (≥3:1 with background)
- Never remove `:focus` styles with `outline: none` without replacement

**No Keyboard Traps (WCAG 2.1.2, Level A)**:
- User can escape from all components (modals, popups)
- Modals trap focus (Tab cycles within modal)
- Escape key closes modals and restores focus

---

### Screen Reader Support

**Semantic HTML (WCAG 4.1.2, Level A)**:
- Use `<button>`, `<input>`, `<select>` instead of `<div>` with event handlers
- Use `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>` for landmarks
- Use `<h1>` to `<h6>` for heading hierarchy

**ARIA Attributes**:
- `aria-label`: Label for elements without visible text (icon-only buttons)
- `aria-labelledby`: Link to visible label element
- `aria-describedby`: Link to help text or error message
- `aria-expanded`: Indicate collapsible state (true/false)
- `aria-live`: Announce dynamic content changes (polite/assertive)
- `aria-invalid`: Indicate error state on form fields

**Live Regions (WCAG 4.1.3, Level AA)**:
- Use `aria-live="polite"` for status messages (non-urgent)
- Use `aria-live="assertive"` for error messages (urgent)
- Announce form validation errors immediately

---

### Motion & Animation

**WCAG 2.3.1 (Level A)**: No flashing content (≤3 flashes per second)

**WCAG 2.2.2 (Level A)**: Pause, stop, hide for moving content

**prefers-reduced-motion (Best Practice)**:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**When to disable animations**:
- User has enabled "Reduce motion" in OS settings
- User has vestibular disorders (motion sickness from animations)
- User prefers faster, less distracting interface

---

## Responsive Layout Patterns

### Breakpoint System

**Tailwind CSS Breakpoints** (default):
- **sm**: 640px (small tablets, large phones landscape)
- **md**: 768px (tablets, small laptops)
- **lg**: 1024px (laptops, desktops)
- **xl**: 1280px (large desktops)
- **2xl**: 1536px (extra large desktops)

**CraftyPrep Breakpoints** (custom):
- **Mobile**: <768px (phones, small tablets portrait)
- **Tablet**: 768px - 1023px (tablets, small laptops)
- **Desktop**: ≥1024px (laptops, desktops, large monitors)

---

### Mobile-First Design

**Philosophy**: Start with mobile constraints, enhance for larger screens

**Example**:
```css
/* Mobile first (default) */
.container {
  padding: 16px;
  width: 100%;
}

/* Tablet (≥768px) */
@media (min-width: 768px) {
  .container {
    padding: 24px;
    max-width: 768px;
    margin: 0 auto;
  }
}

/* Desktop (≥1024px) */
@media (min-width: 1024px) {
  .container {
    padding: 32px;
    max-width: 1200px;
  }
}
```

**Benefits**:
- Forces prioritization of content (what's essential?)
- Ensures mobile performance (smaller bundle, faster load)
- Progressive enhancement (add features for larger screens)

---

### Responsive Panel Patterns

**Desktop (≥1024px)**:
- Sidebar: Fixed width (64px icons or 240px expanded)
- Right panel: Fixed width (320px), resizable
- Canvas: Flexible width (fill remaining space)

**Tablet (768px - 1023px)**:
- Sidebar: Icon-only (64px), expands on hover/tap as overlay
- Right panel: Hidden by default, slides over canvas when opened
- Canvas: Full width when panels hidden

**Mobile (<768px)**:
- Sidebar: Hidden, accessible via hamburger menu
- Right panel: Bottom sheet modal (slides up from bottom)
- Canvas: Full screen (no side panels)
- Status bar: Auto-hide on scroll down, show on scroll up

---

## Technology Stack Capabilities

### Tailwind CSS 4.1.14

**Custom Properties (CSS Variables)**:
```css
:root {
  --color-primary: 221 83% 53%;
  --spacing-base: 1rem;
}

.button {
  background-color: hsl(var(--color-primary));
  padding: var(--spacing-base);
}
```

**Dark Mode**:
```html
<html class="dark">
  <!-- All elements with dark: prefix apply -->
</html>
```

**Arbitrary Values**:
```html
<div class="w-[137px] h-[calc(100vh-64px)]">
  <!-- Custom width and calculated height -->
</div>
```

**Takeaways**:
- CSS custom properties enable runtime theme switching (no rebuild needed)
- Dark mode class-based (not media query) for user control
- Arbitrary values allow custom sizes when design system doesn't cover

---

### Radix UI Primitives

**Available Primitives**:
- ✅ **Slider**: @radix-ui/react-slider (installed)
- ✅ **Select**: @radix-ui/react-select (installed)
- ✅ **Slot**: @radix-ui/react-slot (installed, for composition)
- 🔄 **Collapsible**: @radix-ui/react-collapsible (not installed, can add)
- 🔄 **Dialog**: @radix-ui/react-dialog (not installed, can add)
- 🔄 **Tooltip**: @radix-ui/react-tooltip (not installed, can add)

**Example (Slider)**:
```tsx
import * as Slider from '@radix-ui/react-slider';

<Slider.Root className="relative flex items-center w-full h-5">
  <Slider.Track className="bg-gray-200 relative h-1 w-full rounded-full">
    <Slider.Range className="absolute bg-blue-500 h-full rounded-full" />
  </Slider.Track>
  <Slider.Thumb className="block w-5 h-5 bg-white rounded-full shadow" />
</Slider.Root>
```

**Takeaways**:
- Radix provides accessible, unstyled primitives
- Full control over styling with Tailwind CSS
- Built-in keyboard navigation, ARIA attributes, focus management
- Compound components pattern (Root, Trigger, Content, etc.)

---

### Lucide React + Heroicons

**Icon Libraries**:
- **Lucide React 0.544.0**: Modern, consistent 24x24 icons (primary)
- **Heroicons 2.2.0**: Additional options, solid and outline variants

**Usage**:
```tsx
import { Download, Upload, Settings } from 'lucide-react';

<button>
  <Download className="w-5 h-5 mr-2" />
  Download
</button>
```

**Icon Sizes**:
- 16px (w-4 h-4): Small, inline with text
- 20px (w-5 h-5): Default, buttons, controls
- 24px (w-6 h-6): Large, primary actions, headers
- 32px (w-8 h-8): Extra large, feature icons, empty states

**Accessibility**:
```tsx
<button aria-label="Download image">
  <Download className="w-5 h-5" aria-hidden="true" />
</button>
```
- Icon has `aria-hidden="true"` (decorative, not read by screen reader)
- Button has `aria-label` (descriptive text for screen reader)

---

## Color Theory & Contrast

### HSL Color Format

**Advantages**:
- **Hue (0-360)**: Color (red=0, green=120, blue=240)
- **Saturation (0-100%)**: Intensity (0%=gray, 100%=vivid)
- **Lightness (0-100%)**: Brightness (0%=black, 50%=pure color, 100%=white)

**Easy to adjust**:
- Darken: Decrease lightness (50% → 40%)
- Lighten: Increase lightness (50% → 60%)
- Desaturate: Decrease saturation (100% → 50%)
- Hue shift: Change hue (blue=240 → purple=280)

**Example**:
```css
/* Base color: Blue */
--color-blue-500: 221 83% 53%;  /* hsl(221, 83%, 53%) = #3b82f6 */

/* Darker shades (reduce lightness) */
--color-blue-600: 221 83% 45%;  /* hsl(221, 83%, 45%) = #2563eb */
--color-blue-700: 221 83% 38%;  /* hsl(221, 83%, 38%) = #1d4ed8 */

/* Lighter shades (increase lightness) */
--color-blue-400: 221 83% 61%;  /* hsl(221, 83%, 61%) = #60a5fa */
--color-blue-300: 221 83% 70%;  /* hsl(221, 83%, 70%) = #93bbfb */
```

---

### Generating Color Palettes

**Tailwind CSS Color Generator**:
- Tool: https://uicolors.app/create
- Input base color (hue, saturation)
- Generates 10 shades (50, 100, ..., 900)
- Ensures accessible contrast ratios

**Manual Color Palette** (Slate Gray):
```css
--slate-50: 210 40% 98%;   /* #f8fafc - Lightest */
--slate-100: 210 40% 96%;  /* #f1f5f9 */
--slate-200: 214 32% 91%;  /* #e2e8f0 */
--slate-300: 213 27% 84%;  /* #cbd5e1 */
--slate-400: 215 20% 65%;  /* #94a3b8 */
--slate-500: 215 16% 47%;  /* #64748b - Mid */
--slate-600: 215 19% 35%;  /* #475569 */
--slate-700: 215 25% 27%;  /* #334155 */
--slate-800: 217 33% 17%;  /* #1e293b */
--slate-900: 222 47% 11%;  /* #0f172a - Darkest */
```

---

### Dark Theme Color Inversion

**Principle**: In dark themes, invert lightness values while keeping hue/saturation

**Example (Background colors)**:
```css
/* Light theme */
--background: 0 0% 100%;   /* White */
--foreground: 222 47% 11%; /* Dark gray (Slate 900) */

/* Dark theme (inverted) */
--background: 222 47% 11%; /* Dark gray (Slate 900) */
--foreground: 210 40% 98%; /* Light gray (Slate 50) */
```

**Contrast preservation**:
- Light theme: Dark text on white background (19:1 contrast)
- Dark theme: Light text on dark background (19:1 contrast)
- Contrast ratio maintained, just inverted

---

## Typography Best Practices

### Readable Type Scale

**Perfect Fourth Scale** (ratio 1.333):
```
12px (0.75rem)   - Captions, labels
16px (1rem)      - Body text (base)
21px (1.3125rem) - Subheadings
28px (1.75rem)   - Headings
37px (2.3125rem) - Large headings
49px (3.0625rem) - Hero text
```

**Major Third Scale** (ratio 1.25) - CraftyPrep uses this:
```
12px (0.75rem)   - Captions, labels
14px (0.875rem)  - Secondary text
16px (1rem)      - Body text (base)
18px (1.125rem)  - Section headers
20px (1.25rem)   - Panel titles
24px (1.5rem)    - Page titles
30px (1.875rem)  - Hero text
```

**Why Major Third?**:
- Smaller jumps between sizes (more sizes available)
- Better for UI with many text hierarchies
- Common sizes: 12px, 14px, 16px, 18px, 20px, 24px

---

### Line Height

**Golden Ratio**: Line height = 1.5 × font size (for body text)

**CraftyPrep Line Heights**:
- **1** (none): Icons, headings with single line
- **1.25** (tight): Tight headings, labels
- **1.375** (snug): Subheadings
- **1.5** (normal): Body text, paragraphs (default)
- **1.625** (relaxed): Loose paragraphs, help text
- **2** (loose): Very loose, educational content

**Why 1.5 for body?**:
- Improves readability (easier to scan lines)
- Reduces line collision (descenders don't touch next line)
- WCAG recommends 1.5 minimum for body text

---

### Font Weights

**Weights for UI**:
- **400 (Normal)**: Body text, paragraph content
- **500 (Medium)**: Emphasized text, button labels
- **600 (Semibold)**: Headings, section titles
- **700 (Bold)**: Strong emphasis, alerts

**Avoid**:
- 100-300 (Too thin, low contrast on screens)
- 800-900 (Too heavy, overpowering)

---

## Animation & Interaction Design

### Animation Principles

**12 Principles of Animation** (Disney, adapted for UI):
1. **Timing**: Fast animations (100ms) for immediate feedback, slow (300ms) for state changes
2. **Easing**: Natural motion with ease-in-out (not linear)
3. **Anticipation**: Slight scale-down before scale-up (button press)
4. **Squash and Stretch**: Subtle scale changes add life
5. **Follow Through**: Overshoot then settle (elastic easing)

**UI Animation Types**:
- **Hover feedback**: 100ms ease-out (instant response)
- **Click feedback**: 100ms ease-in (press down)
- **State transitions**: 200ms ease-in-out (default)
- **Panel collapse/expand**: 300ms ease-in-out (smooth reveal)
- **Modal open/close**: 300ms ease-in-out (fade + scale)
- **Loading spinners**: Linear (continuous rotation)

---

### Easing Functions

**Cubic Bezier Curves**:
```css
--ease-linear: linear;                                /* No easing */
--ease-in: cubic-bezier(0.4, 0, 1, 1);                /* Slow start, fast end */
--ease-out: cubic-bezier(0, 0, 0.2, 1);               /* Fast start, slow end */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);          /* Slow start and end */
--ease-elastic: cubic-bezier(0.68, -0.55, 0.265, 1.55); /* Bounce */
```

**When to use**:
- **ease-out**: Hover states (element appears)
- **ease-in**: Click states (element disappears)
- **ease-in-out**: State transitions (smooth motion)
- **elastic**: Playful interactions (success animations)

---

### Performance Targets

**60fps Rule**: All animations must run at 60fps (16.67ms per frame)

**GPU-Accelerated Properties** (fast):
- `transform` (translate, scale, rotate)
- `opacity`
- `filter` (blur, brightness, contrast)

**CPU-Bound Properties** (slow, avoid animating):
- `width`, `height` (triggers layout)
- `margin`, `padding` (triggers layout)
- `color`, `background-color` (repaints)

**Best Practice**: Use `transform: scale()` instead of animating `width/height`

---

## References & Resources

### Design Systems
- **Material Design 3**: https://m3.material.io/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Radix UI**: https://www.radix-ui.com/primitives/docs
- **shadcn/ui**: https://ui.shadcn.com/ (Tailwind + Radix examples)

### Accessibility
- **WCAG 2.2 Guidelines**: https://www.w3.org/WAI/WCAG22/quickref/
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **A11y Project**: https://www.a11yproject.com/
- **Inclusive Components**: https://inclusive-components.design/

### Color & Typography
- **UI Colors (Tailwind generator)**: https://uicolors.app/create
- **Type Scale Generator**: https://typescale.com/
- **Coolors (Palette generator)**: https://coolors.co/
- **Adobe Color**: https://color.adobe.com/create/color-wheel

### Icons
- **Lucide Icons**: https://lucide.dev/icons
- **Heroicons**: https://heroicons.com/
- **ARIA Authoring Practices**: https://www.w3.org/WAI/ARIA/apg/

### Animation
- **Cubic Bezier Generator**: https://cubic-bezier.com/
- **Easing Functions**: https://easings.net/
- **Animation Principles**: https://www.interaction-design.org/literature/article/the-12-principles-of-animation

### Tools
- **Chrome DevTools**: Built-in browser tool for inspecting, debugging
- **Lighthouse**: Automated accessibility, performance, SEO audits
- **axe DevTools**: Accessibility testing browser extension
- **Figma**: Design tool for mockups, prototypes (https://www.figma.com/)

---

## Key Takeaways

1. **Professional image editors** use:
   - Dark themes by default
   - Vertical toolbars (left) with icon-only design
   - Context-aware panels (right) that adapt to selection
   - Canvas-centric layout (brightest element)
   - Keyboard shortcuts everywhere

2. **Design systems** should:
   - Use semantic color names (primary, secondary, error)
   - Follow 8px grid for spacing
   - Provide type scale with harmonious sizes
   - Support light and dark themes
   - Be type-safe (TypeScript design tokens)

3. **Accessibility** requires:
   - WCAG 2.2 AAA contrast (≥7:1 for normal text)
   - Keyboard navigation for all interactions
   - Screen reader support (semantic HTML, ARIA)
   - Focus indicators visible (≥3:1 contrast)
   - prefers-reduced-motion support

4. **Responsive design** should:
   - Start mobile-first (constraints force prioritization)
   - Use adaptive panels (overlay on tablet, hidden on mobile)
   - Preserve user preferences (localStorage)
   - Provide touch-friendly targets (≥44px on mobile)

5. **Component design** should:
   - Support multiple variants (primary, secondary, ghost, etc.)
   - Define all states (default, hover, active, focus, disabled)
   - Use Radix UI primitives for accessibility
   - Style with Tailwind CSS for consistency
   - Include keyboard shortcuts and tooltips

---

**Research Completed**: 2025-10-06
**Next Step**: Apply these findings to create comprehensive design system and component library for CraftyPrep
