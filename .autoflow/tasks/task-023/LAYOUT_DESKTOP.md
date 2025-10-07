# Desktop Layout Specification

**Project**: CraftyPrep Image Editor
**Task**: task-023 - UI/UX Audit and Design System
**Viewport**: ≥1024px (Desktop)

---

## Overview

The desktop layout provides a professional, multi-panel workspace optimized for precise image editing. Inspired by industry-standard tools (Photoshop, Figma, Canva), it offers:

- **Top toolbar**: Quick access to file operations and global actions
- **Left sidebar**: Vertical tool selection with tooltips
- **Center canvas**: Primary workspace with image display
- **Right panel**: Adjustments and filters with collapsible sections
- **Bottom status bar**: Image info and zoom controls

---

## Full Layout Diagram (ASCII Art)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ TOOLBAR (56px height)                                                           │
│ ┌───────────────┬─────────────────────┬──────────────────────────────────────┐ │
│ │ Logo  File... │ ↶ ↷ ⟳ Reset        │ 🔍 🌙 ❓                            │ │
│ └───────────────┴─────────────────────┴──────────────────────────────────────┘ │
├───────┬──────────────────────────────────────────────────────────┬─────────────┤
│       │                                                            │             │
│       │                                                            │ RIGHT PANEL │
│ LEFT  │                                                            │ (320px)     │
│ SIDE  │                    CENTER CANVAS                          │             │
│ BAR   │                    (Flexible width)                       │ ┌─────────┐ │
│       │                                                            │ │▼ Adjust │ │
│ (64px │   ┌─────────────────────────────────────────────┐        │ ├─────────┤ │
│ coll  │   │                                               │        │ │Bright   │ │
│ 240px │   │                                               │        │ │Contrast │ │
│ exp)  │   │          UPLOADED IMAGE                       │        │ │Thresh   │ │
│       │   │          (Centered, scaled to fit)           │        │ └─────────┘ │
│       │   │                                               │        │             │
│ ┌───┐ │   │                                               │        │ ┌─────────┐ │
│ │📤 │ │   │                                               │        │ │▼ Filters│ │
│ │🎨 │ │   │                                               │        │ └─────────┘ │
│ │🔲 │ │   │                                               │        │             │
│ │✂️ │ │   └─────────────────────────────────────────────┘        │ ┌─────────┐ │
│ │📥 │ │                                                            │ │▼ Presets│ │
│ └───┘ │                                                            │ └─────────┘ │
│       │                                                            │             │
│       │                                                            │   [◀ Hide]  │
│       │                                                            │             │
├───────┴──────────────────────────────────────────────────────────┴─────────────┤
│ STATUS BAR (32px height)                                                        │
│ 1920x1080 • 2.4MB                     Ready                        Zoom: 100%   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Zone Definitions

### 1. Top Toolbar (56px height)

**Dimensions**:
- **Height**: `56px` (h-14)
- **Width**: Full viewport width
- **Position**: Fixed top

**Structure** (3 sections):

#### Left Section (Logo + File Operations)
```
┌────────────────────────────┐
│ [Logo] Upload   Save   ... │
└────────────────────────────┘
```

**Components**:
- **Logo**: 32px height, clickable (home/reset)
- **Upload Button**: Primary variant, "Upload Image" text + icon
- **Save Button**: Secondary variant, "Download" text + icon
- **More Menu**: Dropdown (Open, Save As, Clear, etc.)

**Spacing**: `gap-2` (8px between items)

#### Center Section (History Controls)
```
┌──────────────────────────┐
│ ↶ Undo  ↷ Redo  ⟳ Reset │
└──────────────────────────┘
```

**Components**:
- **Undo**: Icon button, `Ctrl/Cmd+Z` shortcut
- **Redo**: Icon button, `Ctrl/Cmd+Y` shortcut
- **Reset**: Ghost button, "Reset All" text

**Spacing**: `gap-1` (4px between icons)

#### Right Section (Global Tools)
```
┌──────────────────────┐
│ 🔍+ 🔍- 🌙 ❓ │
└──────────────────────┘
```

**Components**:
- **Zoom In**: Icon button, `Ctrl/Cmd++` shortcut
- **Zoom Out**: Icon button, `Ctrl/Cmd+-` shortcut
- **Theme Toggle**: Switch (Sun ☀️ / Moon 🌙)
- **Help**: Icon button, opens help modal

**Styling**:
- **Background**: `bg-toolbar-bg` (white light, #1f2937 dark)
- **Border**: `border-b border-border`
- **Shadow**: `shadow-sm` (subtle elevation)

---

### 2. Left Sidebar (64px collapsed, 240px expanded)

**Dimensions**:
- **Width (Collapsed)**: `64px` (icon-only, default)
- **Width (Expanded)**: `240px` (icon + label)
- **Height**: Full viewport minus toolbar (`h-[calc(100vh-56px)]`)
- **Position**: Fixed left

**Toggle Mechanism**:
- **Trigger**: Chevron button at bottom
- **Animation**: `transition-width duration-300 ease-in-out`
- **Persist**: State saved to localStorage (`sidebar-expanded: true/false`)

**Tools (Vertical Stack)**:
```
Collapsed (64px):       Expanded (240px):
┌──────┐                ┌─────────────────────┐
│  📤  │                │ 📤  Upload Image    │
├──────┤                ├─────────────────────┤
│  🎨  │                │ 🎨  Auto Prep       │
├──────┤                ├─────────────────────┤
│  🔲  │                │ 🔲  Threshold       │
├──────┤                ├─────────────────────┤
│  ✂️  │                │ ✂️  Crop            │
├──────┤                ├─────────────────────┤
│  📥  │                │ 📥  Download        │
└──────┘                └─────────────────────┘
```

**Tool Button States**:
- **Default**: `bg-transparent text-muted-foreground`
- **Hover**: `bg-muted text-foreground`
- **Active**: `bg-primary text-primary-foreground`
- **Focus**: `ring-2 ring-ring ring-offset-2`

**Tooltips (Collapsed Mode)**:
- Position: Right of icon (`placement="right"`)
- Delay: 500ms on hover
- Content: Tool name + keyboard shortcut

**Styling**:
- **Background**: `bg-background`
- **Border**: `border-r border-border`
- **Spacing**: `gap-1 py-2` (4px gap, 8px top/bottom padding)

---

### 3. Center Canvas (Flexible Width)

**Dimensions**:
- **Width**: `calc(100vw - sidebarWidth - rightPanelWidth)`
  - Sidebar collapsed (64px) + Panel open (320px): `calc(100vw - 384px)`
  - Sidebar expanded (240px) + Panel open (320px): `calc(100vw - 560px)`
  - Sidebar collapsed + Panel closed: `calc(100vw - 64px)`
- **Height**: `calc(100vh - 56px - 32px)` (minus toolbar and status bar)

**Canvas Area**:
```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│      ┌─────────────────────┐           │
│      │                     │           │
│      │   UPLOADED IMAGE    │           │
│      │   (Centered,        │           │
│      │    Scaled to fit)   │           │
│      │                     │           │
│      └─────────────────────┘           │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

**Features**:

1. **Image Display**:
   - **Centering**: `flex items-center justify-center`
   - **Scaling**: `object-contain` (maintains aspect ratio)
   - **Max Size**: 90% of canvas width/height
   - **Zoom**: Controlled by zoom buttons (50%, 100%, 150%, 200%)

2. **Background Pattern**:
   - **Empty State**: Checkerboard pattern (`bg-pattern-checkerboard`)
   - **With Image**: Transparent areas show checkerboard
   - **Color**: `bg-canvas-bg` (light slate)

3. **Scrolling**:
   - **Overflow**: `overflow-auto` (scrollbars if image exceeds viewport)
   - **Scrollbar**: Custom thin scrollbar (`scrollbar-thin`)

4. **Interactions**:
   - **Pan**: Hold `Space` + drag to pan (when zoomed)
   - **Zoom**: `Ctrl/Cmd` + scroll wheel
   - **Select**: Click to select image (if multiple layers in future)

**Styling**:
- **Background**: `bg-canvas-bg` (hsl(210 17% 98%))
- **Border**: None
- **Shadow**: Inset shadow for depth (`shadow-inner`)

---

### 4. Right Panel (320px width)

**Dimensions**:
- **Width**: `320px` (fixed)
- **Height**: Full viewport minus toolbar (`h-[calc(100vh-56px)]`)
- **Position**: Fixed right

**Resize Feature**:
- **Handle**: Vertical drag handle on left edge (8px wide)
- **Min Width**: `280px`
- **Max Width**: `480px`
- **Persist**: Width saved to localStorage (`right-panel-width: 320`)

**Collapse Feature**:
- **Trigger**: Hide button at top-right (`[◀ Hide]`)
- **Animation**: Slide out to right (`transition-transform duration-300`)
- **Collapsed State**: Panel hidden, canvas expands
- **Restore**: Click floating `[▶]` button on right edge

**Content Structure** (3 collapsible sections):

#### Section 1: Adjustments (Expanded by default)
```
┌─────────────────────────────────┐
│ ▼ Adjustments              [↻] │
├─────────────────────────────────┤
│                                 │
│  Brightness                 +25 │
│  [-] ━━━━━●━━━━━━━━━━━━━ [+]   │
│      -100        0        100   │
│                                 │
│  Contrast                    +5 │
│  [-] ━━━━━━━●━━━━━━━━━━━━ [+]   │
│      -100        0        100   │
│                                 │
│  Threshold                  128 │
│  [-] ━━━●━━━━━━━━━━━━━━━━ [+]   │
│       0        128        255   │
│                                 │
└─────────────────────────────────┘
```

**Features**:
- Reset button (`[↻]`) resets all sliders to default
- Real-time preview (debounced 100ms)
- Value persistence (localStorage)

#### Section 2: Filters (Collapsed by default)
```
┌─────────────────────────────────┐
│ ▶ Filters                       │
└─────────────────────────────────┘
```

**Expanded**:
- Grayscale toggle
- Histogram equalization toggle
- Sharpen/blur controls (future)

#### Section 3: Presets (Collapsed by default)
```
┌─────────────────────────────────┐
│ ▶ Presets                       │
└─────────────────────────────────┘
```

**Expanded**:
- "High Contrast" preset button
- "Soft Engraving" preset button
- "Fine Detail" preset button
- "Save Current" button (custom presets)

**Styling**:
- **Background**: `bg-panel-bg` (hsl(210 20% 96%))
- **Border**: `border-l border-border`
- **Padding**: `p-4` (16px)
- **Scrolling**: `overflow-y-auto` (if content exceeds height)
- **Scrollbar**: Custom thin scrollbar

**Collapsible Header**:
- **Height**: `48px`
- **Padding**: `px-4 py-3`
- **Icon**: Chevron-down (rotates 90° when collapsed)
- **Font**: `text-base font-medium`
- **Hover**: `bg-muted` (slight highlight)

---

### 5. Bottom Status Bar (32px height)

**Dimensions**:
- **Height**: `32px` (h-8)
- **Width**: Full viewport width
- **Position**: Fixed bottom

**Structure** (3 sections):

#### Left Section (Image Info)
```
1920x1080 • 2.4MB
```

**Content**:
- Image dimensions (e.g., "1920x1080")
- File size (e.g., "2.4MB")
- Separator: `•` (bullet point)

#### Center Section (Status/Tips)
```
Ready  |  Tip: Press Ctrl+Z to undo
```

**Content**:
- Current status ("Ready", "Processing...", "Upload image to start")
- Contextual tips (rotates every 10 seconds)

**Tips Examples**:
- "Press Ctrl+Z to undo"
- "Hold Space to pan"
- "Use Auto Prep for quick optimization"
- "Download as PNG for lossless quality"

#### Right Section (Zoom Controls)
```
Zoom: 100%  [🔍-] [🔍+]
```

**Components**:
- Zoom percentage display (e.g., "100%")
- Zoom out button (`[🔍-]`)
- Zoom in button (`[🔍+]`)
- Dropdown: Zoom presets (50%, 75%, 100%, 150%, 200%, Fit)

**Styling**:
- **Background**: `bg-background`
- **Border**: `border-t border-border`
- **Text**: `text-sm text-muted-foreground` (12px, secondary color)
- **Spacing**: `px-4` (16px left/right padding)

---

## Responsive Behavior (Desktop Only)

While this is the desktop layout (≥1024px), there are minor adjustments at different desktop widths:

### Large Desktop (≥1440px)
- Right panel can expand to 480px max width
- Canvas has more breathing room
- Toolbar buttons show more text labels

### Standard Desktop (1024px - 1439px)
- Right panel max width 320px (default)
- Canvas is narrower but functional
- Toolbar may abbreviate some text labels

### Resizing Logic
```javascript
// Pseudocode for panel resizing
const minCanvasWidth = 600; // Minimum viable canvas width

function onPanelResize(newPanelWidth) {
  const sidebarWidth = isSidebarExpanded ? 240 : 64;
  const canvasWidth = viewportWidth - sidebarWidth - newPanelWidth;

  if (canvasWidth < minCanvasWidth) {
    // Prevent resize, show warning
    return false;
  }

  // Allow resize
  rightPanelWidth = newPanelWidth;
  localStorage.setItem('right-panel-width', newPanelWidth);
}
```

---

## Panel Persistence (LocalStorage)

All panel states persist across sessions:

```javascript
// LocalStorage keys and defaults
const STORAGE_KEYS = {
  sidebarExpanded: 'sidebar-expanded',      // boolean, default: false
  rightPanelWidth: 'right-panel-width',     // number (px), default: 320
  rightPanelVisible: 'right-panel-visible', // boolean, default: true
  lastActiveTool: 'last-active-tool',       // string, default: 'upload'
  themePreference: 'theme-preference',      // 'light' | 'dark', default: 'light'
  adjustmentsPanelOpen: 'adjustments-panel-open', // boolean, default: true
  filtersPanelOpen: 'filters-panel-open',         // boolean, default: false
  presetsPanelOpen: 'presets-panel-open',         // boolean, default: false
  zoomLevel: 'zoom-level',                  // number (%), default: 100
};
```

**Restoration Logic**:
```javascript
// On app mount
function restoreLayout() {
  const sidebarExpanded = localStorage.getItem('sidebar-expanded') === 'true';
  const rightPanelWidth = parseInt(localStorage.getItem('right-panel-width') || '320');
  const rightPanelVisible = localStorage.getItem('right-panel-visible') !== 'false';

  setSidebarExpanded(sidebarExpanded);
  setRightPanelWidth(rightPanelWidth);
  setRightPanelVisible(rightPanelVisible);

  // Restore other states...
}
```

---

## Keyboard Shortcuts (Desktop)

| Shortcut | Action | Zone |
|----------|--------|------|
| `Ctrl/Cmd + O` | Open file | Toolbar |
| `Ctrl/Cmd + S` | Save/Download | Toolbar |
| `Ctrl/Cmd + Z` | Undo | Toolbar |
| `Ctrl/Cmd + Y` | Redo | Toolbar |
| `Ctrl/Cmd + Shift + Z` | Redo (alt) | Toolbar |
| `Ctrl/Cmd + +` | Zoom in | Canvas |
| `Ctrl/Cmd + -` | Zoom out | Canvas |
| `Ctrl/Cmd + 0` | Zoom to 100% | Canvas |
| `Space + Drag` | Pan canvas | Canvas |
| `Ctrl/Cmd + R` | Reset adjustments | Right Panel |
| `B` | Toggle left sidebar | Sidebar |
| `P` | Toggle right panel | Right Panel |
| `?` | Show shortcuts | Help |
| `Escape` | Close modals | Global |

**Accessibility**:
- All shortcuts announced to screen readers
- Shortcuts modal (`?` key) shows full list
- Shortcuts work when focus is anywhere in app

---

## Accessibility Features

### Keyboard Navigation
- **Tab Order**: Toolbar → Sidebar → Canvas → Right Panel → Status Bar
- **Focus Trap**: Modals trap focus (Tab cycles within modal)
- **Skip Link**: "Skip to canvas" link (hidden, shows on focus)

### Screen Reader Support
- **Landmarks**: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`
- **ARIA Labels**: All icon buttons have `aria-label`
- **ARIA Live**: Status bar has `aria-live="polite"`
- **Panel States**: `aria-expanded` on collapsible headers

### Focus Indicators
- **Ring**: `ring-2 ring-ring ring-offset-2` (3px, ≥3:1 contrast)
- **Visible**: On all interactive elements
- **Color**: Blue 500 (light), Blue 400 (dark)

### Color Contrast
- **Toolbar**: ≥7:1 (AAA) for all text
- **Sidebar**: ≥7:1 (AAA) for icons and labels
- **Status Bar**: ≥7:1 (AAA) for all info text
- **Panels**: ≥7:1 (AAA) for all content

---

## Implementation Notes

1. **Layout Structure**:
   - Use CSS Grid for main layout zones
   - Flexbox for internal component layout
   - Fixed positioning for panels and bars

2. **Responsiveness**:
   - `@media (min-width: 1024px)` for desktop layout
   - Transition to tablet layout at 1023px
   - Use Tailwind breakpoints (`lg:`, `xl:`, `2xl:`)

3. **State Management**:
   - React Context for global layout state
   - LocalStorage for persistence
   - Zustand or Jotai for complex state (optional)

4. **Performance**:
   - Debounce slider updates (100ms)
   - Virtualize long lists (presets in future)
   - Lazy load panels (code splitting)

5. **Testing**:
   - Responsive tests at 1024px, 1280px, 1920px
   - Keyboard navigation tests
   - Screen reader tests (NVDA, VoiceOver)
   - LocalStorage persistence tests

---

**Status**: Complete ✅
**Next**: LAYOUT_TABLET.md (768px - 1023px)
