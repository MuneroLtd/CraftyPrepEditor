# Tablet Layout Specification

**Project**: CraftyPrep Image Editor
**Task**: task-023 - UI/UX Audit and Design System
**Viewport**: 768px - 1023px (Tablet)

---

## Overview

The tablet layout adapts the desktop experience for medium-sized touchscreens. Key adaptations:

- **Left sidebar**: Icon-only (64px) by default, expands on hover/tap to overlay
- **Right panel**: Slides in as overlay from right (doesn't reduce canvas width)
- **Canvas**: Maximized width when panels are hidden
- **Touch optimizations**: Larger hit areas, swipe gestures
- **Status bar**: Condensed information

---

## Full Layout Diagram (ASCII Art)

### Default State (Panels Hidden)

```
┌─────────────────────────────────────────────────────────────┐
│ TOOLBAR (56px)                                              │
│ ┌────────────┬──────────────────┬────────────────────────┐ │
│ │ Logo  File │ ↶ ↷ ⟳           │ 🔍 🌙 ❓             │ │
│ └────────────┴──────────────────┴────────────────────────┘ │
├──────┬───────────────────────────────────────────────────────┤
│      │                                                       │
│ SIDE │                                                       │
│ BAR  │                                                       │
│      │                                                       │
│ 64px │                CENTER CANVAS                          │
│      │                (Maximized)                            │
│ ┌──┐ │                                                       │
│ │📤│ │    ┌───────────────────────────────────┐            │
│ │🎨│ │    │                                   │            │
│ │🔲│ │    │         UPLOADED IMAGE            │            │
│ │✂️│ │    │         (Centered, scaled)        │            │
│ │📥│ │    │                                   │            │
│ └──┘ │    └───────────────────────────────────┘            │
│      │                                                       │
│      │                                                       │
│      │                                         [▶] Panel     │
├──────┴───────────────────────────────────────────────────────┤
│ STATUS BAR (32px) - Condensed                               │
│ 1920x1080            Ready                    100%          │
└─────────────────────────────────────────────────────────────┘
```

### Right Panel Open (Overlay)

```
┌─────────────────────────────────────────────────────────────┐
│ TOOLBAR (56px)                                              │
│ [Same as above]                                             │
├──────┬──────────────────────────────────┬───────────────────┤
│ SIDE │                                  │ RIGHT PANEL       │
│ BAR  │                                  │ (320px overlay)   │
│      │                                  │                   │
│ 64px │         CANVAS                   │ ┌───────────────┐ │
│      │      (Partially covered)         │ │▼ Adjustments  │ │
│ ┌──┐ │                                  │ ├───────────────┤ │
│ │📤│ │    ┌─────────────────────┐       │ │ Brightness    │ │
│ │🎨│ │    │                     │       │ │ Contrast      │ │
│ │🔲│ │    │   UPLOADED IMAGE    │       │ │ Threshold     │ │
│ │✂️│ │    │                     │       │ └───────────────┘ │
│ │📥│ │    └─────────────────────┘       │                   │
│ └──┘ │                                  │ ┌───────────────┐ │
│      │                                  │ │▶ Filters      │ │
│      │                                  │ └───────────────┘ │
│      │                                  │                   │
│      │                                  │     [◀ Close]     │
├──────┴──────────────────────────────────┴───────────────────┤
│ STATUS BAR (32px)                                           │
│ 1920x1080            Ready                    100%          │
└─────────────────────────────────────────────────────────────┘
```

### Left Sidebar Expanded (Hover/Tap)

```
┌─────────────────────────────────────────────────────────────┐
│ TOOLBAR (56px)                                              │
│ [Same as above]                                             │
├──────────────────┬──────────────────────────────────────────┤
│ LEFT SIDEBAR     │                                          │
│ (240px overlay)  │         CENTER CANVAS                    │
│                  │         (Partially covered)              │
│ ┌──────────────┐ │                                          │
│ │📤 Upload     │ │    ┌───────────────────────────────┐    │
│ │🎨 Auto Prep  │ │    │                               │    │
│ │🔲 Threshold  │ │    │     UPLOADED IMAGE            │    │
│ │✂️ Crop       │ │    │                               │    │
│ │📥 Download   │ │    └───────────────────────────────┘    │
│ └──────────────┘ │                                          │
│                  │                                          │
│   [Tap outside   │                                          │
│    to collapse]  │                                          │
├──────────────────┴──────────────────────────────────────────┤
│ STATUS BAR (32px)                                           │
│ 1920x1080            Ready                    100%          │
└─────────────────────────────────────────────────────────────┘
```

---

## Responsive Adaptations

### 1. Top Toolbar (56px height)

**Changes from Desktop**:
- **Logo**: Shrinks to icon-only (32px) on narrower tablets
- **File Operations**: "Upload" button text hidden on <900px, icon only
- **Center Section**: Same (Undo, Redo, Reset)
- **Right Section**: Same (Zoom, Theme, Help)

**Breakpoints**:
```css
/* 768px - 899px: Icon-only upload button */
@media (max-width: 899px) {
  .upload-button span { display: none; } /* Hide text */
}

/* 900px - 1023px: Full upload button */
@media (min-width: 900px) {
  .upload-button span { display: inline; } /* Show text */
}
```

---

### 2. Left Sidebar (Icon-Only with Overlay Expansion)

**Default State**:
- **Width**: `64px` (icon-only, always visible)
- **Expansion**: Overlay on hover or tap (expands to 240px)
- **Z-Index**: `z-50` (above canvas, below modals)

**Hover/Tap Behavior**:
1. User hovers over sidebar OR taps any sidebar button
2. Sidebar expands to 240px (overlay, doesn't push canvas)
3. Shows icon + label for all tools
4. Semi-transparent backdrop appears (`bg-black/20`)
5. Tap outside or move mouse away → collapses back to 64px

**Touch Interaction**:
- **Tap Tool**: Opens tool immediately, sidebar stays expanded briefly
- **Tap Outside**: Collapses sidebar
- **Swipe Right**: Expands sidebar (from left edge)
- **Swipe Left**: Collapses sidebar (when expanded)

**Implementation**:
```jsx
// Pseudocode for sidebar expansion
const [sidebarExpanded, setSidebarExpanded] = useState(false);

// On hover (desktop with touch)
<aside
  onMouseEnter={() => setSidebarExpanded(true)}
  onMouseLeave={() => setSidebarExpanded(false)}
  className={cn(
    "fixed left-0 top-14 h-[calc(100vh-56px)]",
    "transition-all duration-300 z-50",
    sidebarExpanded ? "w-60" : "w-16"
  )}
>
  {/* Tools */}
</aside>

// Backdrop (when expanded)
{sidebarExpanded && (
  <div
    className="fixed inset-0 bg-black/20 z-40"
    onClick={() => setSidebarExpanded(false)}
  />
)}
```

---

### 3. Center Canvas (Full Width When Panels Hidden)

**Width Calculation**:
- **Panels Hidden**: `calc(100vw - 64px)` (minus icon-only sidebar)
- **Right Panel Open**: `calc(100vw - 64px)` (panel is overlay, doesn't reduce width)
- **Left Sidebar Expanded**: `calc(100vw - 64px)` (overlay, doesn't reduce width)

**Touch Interactions**:
- **Pinch to Zoom**: Two-finger pinch zooms canvas
- **Pan**: One-finger drag when zoomed in (>100%)
- **Double Tap**: Zoom to 200%, double tap again to return to 100%

**Gesture Implementation**:
```javascript
// Touch gestures for canvas
let initialDistance = 0;
let currentZoom = 100;

function handleTouchStart(e) {
  if (e.touches.length === 2) {
    initialDistance = getDistance(e.touches[0], e.touches[1]);
  }
}

function handleTouchMove(e) {
  if (e.touches.length === 2) {
    const currentDistance = getDistance(e.touches[0], e.touches[1]);
    const scale = currentDistance / initialDistance;
    currentZoom = Math.min(Math.max(currentZoom * scale, 50), 200);
    applyZoom(currentZoom);
  }
}
```

---

### 4. Right Panel (Slide-In Overlay)

**Default State**:
- **Hidden**: Panel completely off-screen (right)
- **Trigger**: Floating `[▶ Panel]` button on right edge

**Open State**:
- **Width**: `320px`
- **Position**: Fixed right, slides in from right
- **Animation**: `transform: translateX(0)` (300ms ease-out)
- **Backdrop**: Semi-transparent backdrop (`bg-black/30`)
- **Z-Index**: `z-50` (above canvas and sidebar)

**Close Interaction**:
- **Close Button**: `[◀ Close]` button at top-right of panel
- **Swipe Right**: Swipe panel to the right to close
- **Tap Backdrop**: Tap outside panel (on backdrop) to close

**Swipe to Close**:
```javascript
// Swipe gesture for closing panel
let touchStartX = 0;
let touchCurrentX = 0;

function handlePanelTouchStart(e) {
  touchStartX = e.touches[0].clientX;
}

function handlePanelTouchMove(e) {
  touchCurrentX = e.touches[0].clientX;
  const deltaX = touchCurrentX - touchStartX;

  if (deltaX > 0) {
    // Swiping right, translate panel
    panel.style.transform = `translateX(${deltaX}px)`;
  }
}

function handlePanelTouchEnd() {
  const deltaX = touchCurrentX - touchStartX;

  if (deltaX > 100) {
    // Swipe threshold met, close panel
    closePanel();
  } else {
    // Snap back to open position
    panel.style.transform = 'translateX(0)';
  }
}
```

**Panel Content**:
- Same collapsible sections as desktop (Adjustments, Filters, Presets)
- No resize handle (fixed 320px width)
- Scrollable if content exceeds viewport height

---

### 5. Bottom Status Bar (32px height)

**Condensed Information**:

| Section | Desktop | Tablet (768-1023px) |
|---------|---------|---------------------|
| **Left** | "1920x1080 • 2.4MB" | "1920x1080" (size hidden) |
| **Center** | "Ready \| Tip: ..." | "Ready" (tips hidden) |
| **Right** | "Zoom: 100% [🔍-] [🔍+]" | "100%" (buttons in toolbar) |

**Tablet Layout**:
```
┌────────────────────────────────────────────────┐
│ 1920x1080        Ready              100%       │
└────────────────────────────────────────────────┘
```

**Rationale**:
- Limited horizontal space on tablet
- Essential info only: dimensions, status, zoom
- Zoom controls moved to toolbar for touch access
- Tips shown in help modal instead

---

## Touch Optimizations

### Larger Hit Areas

All interactive elements meet **minimum 44x44px** touch target:

| Element | Desktop | Tablet |
|---------|---------|--------|
| Toolbar buttons | 40x40px | 48x48px |
| Sidebar icons | 40x40px | 48x48px |
| Slider handles | 20x20px visual, 44x44px hit area | 24x24px visual, 48x48px hit area |
| Panel close button | 32x32px | 44x44px |

**Implementation**:
```css
/* Touch-friendly hit areas */
@media (max-width: 1023px) {
  .toolbar-button {
    @apply h-12 w-12; /* 48px */
  }

  .slider-handle {
    /* Visual: 24px, Hit area: 48px */
    width: 24px;
    height: 24px;
    padding: 12px; /* Extends hit area */
  }
}
```

### Swipe Gestures

| Gesture | Action |
|---------|--------|
| **Swipe Right** (from left edge) | Open left sidebar |
| **Swipe Left** (on expanded sidebar) | Close left sidebar |
| **Swipe Left** (from right edge) | Open right panel |
| **Swipe Right** (on open panel) | Close right panel |
| **Pinch In** (on canvas) | Zoom out |
| **Pinch Out** (on canvas) | Zoom in |
| **Double Tap** (on canvas) | Toggle zoom (100% ↔ 200%) |

**Edge Swipe Detection**:
```javascript
// Detect edge swipes (left edge)
function handleTouchStart(e) {
  const touchX = e.touches[0].clientX;

  if (touchX < 20) {
    // Touch started from left edge
    isEdgeSwipe = true;
  }
}

function handleTouchEnd(e) {
  if (isEdgeSwipe && deltaX > 50) {
    // Swipe right from left edge = open sidebar
    setSidebarExpanded(true);
  }
}
```

### Hover States

On touch devices, hover states are replaced with:
- **Tap to Activate**: First tap activates, second tap executes
- **Tap Highlight**: Temporary highlight on tap (`bg-muted` for 200ms)
- **No Hover**: Tooltips show on long-press (500ms)

---

## Interaction Patterns

### Sidebar Interactions

1. **Open Sidebar**:
   - Tap any sidebar icon → Expands to 240px overlay
   - OR Swipe right from left edge → Expands overlay

2. **Close Sidebar**:
   - Tap outside sidebar (on backdrop) → Collapses to 64px
   - OR Swipe left on expanded sidebar → Collapses
   - OR Auto-collapse after tool selection (optional)

3. **Select Tool**:
   - Tap tool icon → Activates tool, sidebar stays expanded briefly
   - Sidebar auto-collapses after 2 seconds (optional)

### Panel Interactions

1. **Open Panel**:
   - Tap floating `[▶ Panel]` button on right edge
   - OR Swipe left from right edge (optional)

2. **Close Panel**:
   - Tap `[◀ Close]` button in panel header
   - OR Tap backdrop (outside panel)
   - OR Swipe right on panel

3. **Collapsible Sections**:
   - Tap header to expand/collapse section
   - Visual feedback: Chevron rotates, section slides up/down

### Canvas Interactions

1. **Zoom**:
   - Pinch out (two fingers) → Zoom in
   - Pinch in (two fingers) → Zoom out
   - Double tap → Toggle 100% ↔ 200%
   - Toolbar zoom buttons → +/- 25%

2. **Pan** (when zoomed >100%):
   - One-finger drag → Pan canvas
   - Edge bounce when reaching image bounds

3. **Reset**:
   - Double tap with three fingers → Reset zoom to 100%

---

## Panel Persistence (Same as Desktop)

LocalStorage keys remain the same, with additional tablet-specific states:

```javascript
const TABLET_STORAGE_KEYS = {
  ...DESKTOP_STORAGE_KEYS, // Inherit desktop keys
  sidebarAutoCollapse: 'sidebar-auto-collapse', // boolean, default: true
  panelSwipeEnabled: 'panel-swipe-enabled',     // boolean, default: true
  gesturesEnabled: 'gestures-enabled',          // boolean, default: true
};
```

---

## Accessibility Features (Tablet)

### Touch Accessibility

- **Target Size**: All interactive elements ≥44x44px
- **Spacing**: Minimum 8px spacing between touch targets
- **Visual Feedback**: Tap highlights for all buttons
- **Long-Press**: Alternative to hover (tooltips, context menus)

### Keyboard Support (External Keyboard)

When external keyboard connected (iPad with Magic Keyboard):
- All desktop keyboard shortcuts work
- Focus indicators visible (3px ring)
- Tab navigation logical

### Screen Reader (VoiceOver, TalkBack)

- **Gestures Announced**: "Swipe right to open sidebar"
- **Panel States**: "Right panel, hidden" / "Right panel, visible"
- **Canvas Zoom**: "Zoom level: 100%, pinch to adjust"

---

## Breakpoint-Specific Styles

### 768px - 899px (Small Tablet)

```css
@media (min-width: 768px) and (max-width: 899px) {
  /* Condensed toolbar */
  .toolbar-text { display: none; }
  .toolbar-icon { display: block; }

  /* Right panel overlay (320px) */
  .right-panel {
    width: 320px;
    max-width: 90vw; /* Don't exceed 90% of viewport */
  }

  /* Status bar condensed */
  .status-bar-tips { display: none; }
  .status-bar-file-size { display: none; }
}
```

### 900px - 1023px (Large Tablet)

```css
@media (min-width: 900px) and (max-width: 1023px) {
  /* Toolbar shows some text */
  .toolbar-primary-text { display: inline; }

  /* Right panel wider (360px) */
  .right-panel {
    width: 360px;
  }

  /* Status bar shows file size */
  .status-bar-file-size { display: inline; }
}
```

---

## Implementation Checklist

### Layout
- ✅ Left sidebar: Icon-only (64px) with hover/tap expansion to 240px overlay
- ✅ Right panel: Slide-in overlay from right (320px), doesn't reduce canvas width
- ✅ Canvas: Full width when panels hidden, maximizes available space
- ✅ Status bar: Condensed information (dimensions, status, zoom only)

### Touch Optimizations
- ✅ Minimum 44x44px touch targets for all interactive elements
- ✅ Swipe gestures: Open/close sidebar and panel from edges
- ✅ Pinch-to-zoom on canvas
- ✅ Double-tap to toggle zoom (100% ↔ 200%)
- ✅ Tap highlights and visual feedback

### Interactions
- ✅ Sidebar expands on tap or hover (overlay, semi-transparent backdrop)
- ✅ Panel slides in from right, tap backdrop or swipe to close
- ✅ Collapsible sections work with tap (no hover required)
- ✅ Edge swipes for panel controls

### Responsive
- ✅ Breakpoint adjustments: 768-899px (condensed), 900-1023px (expanded)
- ✅ Toolbar adapts: Icon-only buttons on narrow tablets
- ✅ Status bar adapts: Essential info only
- ✅ Panel width adjusts: 320px (small), 360px (large)

### Accessibility
- ✅ Touch target sizes meet WCAG AAA (≥44x44px)
- ✅ Keyboard support for external keyboards
- ✅ Screen reader announces gestures and panel states
- ✅ Focus indicators visible (3px ring, ≥3:1 contrast)

---

**Status**: Complete ✅
**Next**: LAYOUT_MOBILE.md (<768px)
