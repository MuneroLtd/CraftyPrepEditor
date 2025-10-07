# Mobile Layout Specification

**Project**: CraftyPrep Image Editor
**Task**: task-023 - UI/UX Audit and Design System
**Viewport**: <768px (Mobile)

---

## Overview

The mobile layout provides a streamlined, full-screen editing experience optimized for smartphones. Key features:

- **Full-screen canvas**: Maximized workspace, panels hidden by default
- **Bottom sheet modals**: Tools and adjustments slide up from bottom
- **Hamburger menu**: Top toolbar collapsed to compact menu
- **Touch-first**: All interactions designed for fingers, not mouse
- **Auto-hide status**: Status bar hides on scroll for more space
- **Gesture navigation**: Swipes, taps, and pinch for all actions

---

## Full Layout Diagram (ASCII Art)

### Default State (Full-Screen Canvas)

```
┌─────────────────────────┐
│ TOOLBAR (48px)          │
│ ☰  CraftyPrep      ⋮   │
├─────────────────────────┤
│                         │
│                         │
│                         │
│    ┌───────────────┐    │
│    │               │    │
│    │   UPLOADED    │    │
│    │     IMAGE     │    │
│    │   (Centered)  │    │
│    │               │    │
│    └───────────────┘    │
│                         │
│                         │
│                         │
│                         │
│                         │
│    [Tap for tools ⬆️]    │
└─────────────────────────┘
```

### Tools Bottom Sheet (Opened)

```
┌─────────────────────────┐
│ TOOLBAR (48px)          │
│ ☰  CraftyPrep      ⋮   │
├─────────────────────────┤
│                         │
│                         │
│    ┌───────────────┐    │
│    │   IMAGE       │    │
│    │   (Partially  │    │
│    │   Visible)    │    │
│    └───────────────┘    │
│                         │
├─────────────────────────┤
│ TOOLS BOTTOM SHEET      │
│ ══                      │ ← Drag handle
│                         │
│  📤 Upload Image        │
│  🎨 Auto Prep           │
│  ☀️  Adjustments        │
│  🔲 Threshold           │
│  📥 Download            │
│                         │
│    [Swipe down to close]│
└─────────────────────────┘
```

### Adjustments Bottom Sheet (Opened)

```
┌─────────────────────────┐
│ TOOLBAR (48px)          │
│ ☰  CraftyPrep      ⋮   │
├─────────────────────────┤
│                         │
│    ┌───────────────┐    │
│    │   IMAGE       │    │
│    └───────────────┘    │
│                         │
├─────────────────────────┤
│ ADJUSTMENTS             │
│ ══              [✕]     │ ← Drag handle + Close
│                         │
│ Brightness         +25  │
│ ━━━━━●━━━━━━━━━━━      │
│                         │
│ Contrast            +5  │
│ ━━━━━━●━━━━━━━━━━      │
│                         │
│ Threshold          128  │
│ ━━●━━━━━━━━━━━━━━      │
│                         │
│  [Reset]     [Apply]    │
└─────────────────────────┘
```

---

## Zone Definitions

### 1. Top Toolbar (48px height)

**Compact Design** (Mobile-optimized):

```
┌──────────────────────────────────┐
│ ☰  CraftyPrep            ⋮      │
└──────────────────────────────────┘
```

**Components**:

#### Left: Hamburger Menu (☰)
- **Size**: 48x48px touch target
- **Action**: Opens slide-in menu from left
- **Contents** (menu):
  - Upload Image
  - Download
  - Reset All
  - Help
  - About
  - Settings

#### Center: Logo/Title
- **Text**: "CraftyPrep" (or icon on very narrow screens <360px)
- **Font**: `text-base font-semibold` (16px)
- **Centered**: `text-center`

#### Right: More Menu (⋮)
- **Size**: 48x48px touch target
- **Action**: Opens context menu
- **Contents**:
  - Zoom controls
  - Theme toggle
  - Share (future)

**Styling**:
- **Height**: `48px` (reduced from 56px desktop)
- **Background**: `bg-toolbar-bg`
- **Border**: `border-b border-border`
- **Shadow**: `shadow-sm`
- **Fixed**: `fixed top-0 z-50` (stays on top)

---

### 2. Main Menu (Slide-In from Left)

**Hamburger Menu Contents**:

```
┌────────────────────────┐
│ ✕  Menu                │
├────────────────────────┤
│                        │
│  📤 Upload Image       │
│  🎨 Auto Prep          │
│  ☀️  Adjustments       │
│  🔲 Threshold          │
│  📥 Download           │
│                        │
│  ──────────────────    │
│                        │
│  🔄 Reset All          │
│  ❓ Help               │
│  ℹ️  About             │
│  ⚙️  Settings          │
│                        │
└────────────────────────┘
```

**Behavior**:
- **Width**: `280px` (or 80% of viewport if <350px)
- **Animation**: Slide from left (300ms ease-out)
- **Backdrop**: Semi-transparent overlay (`bg-black/40`)
- **Close**: Tap backdrop, tap ✕, or swipe left

**Menu Items**:
- **Height**: `56px` each (large touch target)
- **Icon**: 24px on left
- **Label**: `text-base` (16px)
- **Spacing**: `px-4 py-3` (16px horizontal, 12px vertical)

---

### 3. Center Canvas (Full-Screen)

**Dimensions**:
- **Width**: Full viewport width (`100vw`)
- **Height**: `calc(100vh - 48px)` (viewport minus toolbar)
- **Position**: Below toolbar

**Canvas Behavior**:

1. **Image Display**:
   - Centered horizontally and vertically
   - Scaled to fit (maintains aspect ratio)
   - Max 90% of available space
   - Checkerboard pattern for transparency

2. **Touch Interactions**:
   - **Pinch to Zoom**: Two-finger pinch (50% - 200% zoom)
   - **Pan**: One-finger drag when zoomed >100%
   - **Double Tap**: Toggle zoom (100% ↔ 150%)
   - **Triple Tap**: Reset zoom to 100%

3. **Floating Tools Button**:
   - **Position**: Bottom center, fixed
   - **Size**: `64x64px` circular button
   - **Label**: "Tools ⬆️" or just "⬆️" icon
   - **Action**: Opens tools bottom sheet
   - **Visibility**: Fades out on scroll, reappears when scroll stops

**Empty State** (No Image Uploaded):
```
┌─────────────────────────┐
│                         │
│                         │
│      📤                 │
│                         │
│  Tap to Upload Image    │
│                         │
│  or                     │
│                         │
│  [Upload Image]         │
│                         │
│                         │
└─────────────────────────┘
```

---

### 4. Tools Bottom Sheet

**Default State**: Hidden, accessible via floating "Tools ⬆️" button

**Opened State**:
- **Height**: `auto` (content-based, max 60% of viewport)
- **Position**: Fixed bottom
- **Animation**: Slide up from bottom (300ms ease-out)
- **Backdrop**: Dim canvas slightly (`bg-black/20`)

**Drag Handle**:
```
┌─────────────────────────┐
│ ══                      │ ← Drag handle (centered)
│                         │
```
- **Width**: `48px` bar, centered
- **Action**: Drag down to close, drag up to expand

**Tool List**:

| Icon | Label | Action |
|------|-------|--------|
| 📤 | Upload Image | Opens file picker |
| 🎨 | Auto Prep | Applies auto-engraving preset |
| ☀️ | Adjustments | Opens adjustments bottom sheet |
| 🔲 | Threshold | Opens threshold quick adjuster |
| 📥 | Download | Downloads processed image |

**Tool Button Design**:
- **Height**: `64px` (large touch target)
- **Layout**: Icon (left) + Label (center)
- **Spacing**: `gap-4` (16px between icon and label)
- **Hover/Tap**: `bg-muted` background on tap

**Scroll Behavior**:
- If tools exceed 60% viewport, enable vertical scroll
- Scrollbar: Thin custom scrollbar
- Overscroll: Bounce effect at top/bottom

---

### 5. Adjustments Bottom Sheet

**Triggered By**: Tap "☀️ Adjustments" in tools bottom sheet

**Layout**:

```
┌─────────────────────────┐
│ Adjustments       [✕]   │ ← Header
│ ══                      │ ← Drag handle
│                         │
│ Brightness         +25  │
│ [-] ━━━●━━━━━━━━━ [+]  │
│                         │
│ Contrast            +5  │
│ [-] ━━━━●━━━━━━━━ [+]  │
│                         │
│ Threshold          128  │
│ [-] ━●━━━━━━━━━━━ [+]  │
│                         │
│  [Reset]     [Apply]    │
│                         │
└─────────────────────────┘
```

**Header**:
- **Title**: "Adjustments" (left)
- **Close Button**: ✕ (right, 48x48px)
- **Height**: `56px`
- **Border**: `border-b border-border`

**Sliders**:
- **Label**: `text-sm font-medium` (14px)
- **Value**: `text-sm font-mono` (14px, monospace)
- **Track**: Full width minus padding
- **Handle**: 32px (visual 24px, hit area 48px)
- **+/- Buttons**: 44x44px each side
- **Spacing**: `gap-6` (24px between sliders)

**Footer Buttons**:
- **Reset**: Secondary variant, left side
- **Apply**: Primary variant, right side
- **Height**: `48px` each
- **Spacing**: `gap-2` (8px between)

**Real-Time Preview**:
- Changes apply immediately (debounced 100ms)
- "Apply" button is optional (just closes sheet)
- "Reset" button reverts all values to defaults

---

### 6. Status Bar (Auto-Hide)

**Default State** (Visible):
```
┌────────────────────────────┐
│ 1920x1080         100%     │
└────────────────────────────┘
```

**Content**:
- **Left**: Image dimensions (e.g., "1920x1080")
- **Right**: Zoom percentage (e.g., "100%")
- **Height**: `32px`

**Auto-Hide Behavior**:
1. Visible when page loads
2. Fades out when user scrolls down (after 200px scroll)
3. Slides back in when user scrolls up OR stops scrolling
4. Always visible when bottom sheets are open

**Styling**:
- **Background**: `bg-background/80` (semi-transparent)
- **Backdrop Filter**: `backdrop-blur-sm` (frosted glass effect)
- **Border**: `border-t border-border`
- **Text**: `text-xs text-muted-foreground` (12px)
- **Position**: Fixed bottom, `z-30`

---

## Touch Optimizations

### Minimum Touch Target Sizes

| Element | Size | Notes |
|---------|------|-------|
| Toolbar buttons | 48x48px | Hamburger, More menu |
| Menu items | 56px height | Full-width tappable |
| Tool buttons | 64px height | Large for easy access |
| Slider handles | 32px visual, 48px hit area | Easy to grab |
| +/- Buttons | 44x44px | Increment/decrement |
| Floating Tools button | 64x64px | Prominent, circular |
| Close buttons | 48x48px | Top-right of sheets |

### Gesture Support

| Gesture | Action | Context |
|---------|--------|---------|
| **Swipe Right** (from left edge) | Open hamburger menu | Global |
| **Swipe Left** (on menu) | Close hamburger menu | Menu open |
| **Swipe Up** (from bottom) | Open tools bottom sheet | Canvas |
| **Swipe Down** (on sheet) | Close bottom sheet | Sheet open |
| **Pinch Out** | Zoom in (canvas) | Canvas |
| **Pinch In** | Zoom out (canvas) | Canvas |
| **Double Tap** | Toggle zoom (100% ↔ 150%) | Canvas |
| **Triple Tap** | Reset zoom to 100% | Canvas |
| **Long Press** (1s) | Show context menu | Tool buttons |

### Haptic Feedback (iOS/Android)

```javascript
// Provide tactile feedback for key interactions
function triggerHaptic(type) {
  if ('vibrate' in navigator) {
    switch (type) {
      case 'light':
        navigator.vibrate(10); // Tap, button press
        break;
      case 'medium':
        navigator.vibrate(20); // Sheet open/close
        break;
      case 'heavy':
        navigator.vibrate(30); // Action complete (download)
        break;
      case 'success':
        navigator.vibrate([10, 50, 10]); // Success pattern
        break;
    }
  }
}

// Example usage
function handleToolTap(tool) {
  triggerHaptic('light');
  executeTool(tool);
}

function handleDownloadComplete() {
  triggerHaptic('success');
  showToast('Image downloaded!');
}
```

---

## Bottom Sheet Implementation

### Sheet States

1. **Hidden**: `translateY(100%)` (off-screen bottom)
2. **Peek**: `translateY(60%)` (partial view, 40% visible)
3. **Open**: `translateY(0)` (fully visible)

### Drag Behavior

```javascript
// Bottom sheet drag implementation
let startY = 0;
let currentY = 0;
let sheetHeight = 0;

function handleSheetTouchStart(e) {
  startY = e.touches[0].clientY;
  sheetHeight = sheet.offsetHeight;
}

function handleSheetTouchMove(e) {
  currentY = e.touches[0].clientY;
  const deltaY = currentY - startY;

  if (deltaY > 0) {
    // Dragging down
    sheet.style.transform = `translateY(${deltaY}px)`;
  }
}

function handleSheetTouchEnd() {
  const deltaY = currentY - startY;
  const threshold = sheetHeight * 0.3; // 30% threshold

  if (deltaY > threshold) {
    // Close sheet
    closeSheet();
  } else {
    // Snap back to open
    sheet.style.transform = 'translateY(0)';
  }
}
```

### Backdrop Interaction

- **Tap Backdrop**: Closes bottom sheet
- **Swipe Down on Backdrop**: No action (only sheet drag works)
- **Dim Level**: `bg-black/30` (30% opacity)

---

## Responsive Breakpoints (Mobile)

### Extra Small Mobile (<360px)

```css
@media (max-width: 359px) {
  /* Ultra compact */
  .toolbar-title { display: none; } /* Hide "CraftyPrep", show icon only */
  .tool-label { font-size: 14px; } /* Smaller labels */
  .slider-value { display: none; } /* Hide slider values, show on tap */
  .menu-width { width: 90vw; } /* Wider menu (90% of viewport) */
}
```

### Small Mobile (360px - 479px)

```css
@media (min-width: 360px) and (max-width: 479px) {
  .toolbar-title { display: inline; } /* Show "CraftyPrep" */
  .tool-label { font-size: 16px; }
  .menu-width { width: 280px; }
}
```

### Standard Mobile (480px - 767px)

```css
@media (min-width: 480px) and (max-width: 767px) {
  /* Slightly more spacious */
  .bottom-sheet { max-height: 70vh; } /* Taller sheets */
  .slider-handle { width: 32px; height: 32px; } /* Larger handles */
}
```

---

## Accessibility Features (Mobile)

### Touch Accessibility

- **Target Sizes**: All ≥44x44px (WCAG AAA on mobile ≥48x48px preferred)
- **Spacing**: Minimum 8px spacing between targets
- **Visual Feedback**: Tap highlights (`active:bg-muted`) on all buttons
- **Large Fonts**: Respect system font size settings (up to 200%)

### Screen Reader Support (TalkBack, VoiceOver)

- **Landmarks**: `<header>`, `<main>`, `<nav role="menu">`
- **Sheet States**: "Tools menu, collapsed" / "Tools menu, expanded"
- **Gestures**: "Swipe up with two fingers to open tools"
- **Focus Management**: Focus moves to sheet when opened

### Voice Control (Siri, Google Assistant)

- **Labels**: All buttons have clear `aria-label` attributes
- **Actions**: "Hey Siri, upload image" (requires voice shortcuts setup)

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable sheet animations */
  .bottom-sheet {
    transition: none !important;
  }

  /* Disable zoom animations */
  .canvas-zoom {
    transition: none !important;
  }

  /* Disable scroll effects */
  .status-bar-hide {
    transition: none !important;
  }
}
```

---

## Layout Persistence (LocalStorage)

Mobile-specific storage keys:

```javascript
const MOBILE_STORAGE_KEYS = {
  lastToolSelected: 'last-tool-selected',       // string, default: 'auto-prep'
  toolsSheetPeekMode: 'tools-sheet-peek-mode',  // boolean, default: false
  statusBarAutoHide: 'status-bar-auto-hide',    // boolean, default: true
  hapticsEnabled: 'haptics-enabled',            // boolean, default: true
  gesturesEnabled: 'gestures-enabled',          // boolean, default: true
  zoomLevel: 'zoom-level',                      // number (%), default: 100
  canvasPanX: 'canvas-pan-x',                   // number (px), default: 0
  canvasPanY: 'canvas-pan-y',                   // number (px), default: 0
};
```

---

## Mobile-Specific Features

### 1. Orientation Support

**Portrait (Default)**:
- Layout as described above
- Tools button at bottom center
- Bottom sheets slide from bottom

**Landscape**:
- Toolbar height: 48px (same)
- Tools button moves to right edge (vertical)
- Bottom sheets become side sheets (slide from right)
- Adjustments shown as sidebar overlay (320px width)

```javascript
// Detect orientation change
window.addEventListener('orientationchange', () => {
  const isLandscape = window.orientation === 90 || window.orientation === -90;

  if (isLandscape) {
    switchToLandscapeLayout();
  } else {
    switchToPortraitLayout();
  }
});
```

### 2. Share Functionality (Mobile-Only)

**Share Button** (in More menu):
- Uses Web Share API (`navigator.share`)
- Shares processed image + caption
- Fallback: Copy image URL to clipboard

```javascript
// Share processed image
async function shareImage(imageBlob) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'CraftyPrep - Processed Image',
        text: 'Check out my laser engraving prep!',
        files: [new File([imageBlob], 'craftyprep-image.png', { type: 'image/png' })]
      });
      triggerHaptic('success');
    } catch (err) {
      console.error('Share failed:', err);
    }
  } else {
    // Fallback: Copy to clipboard
    copyImageToClipboard(imageBlob);
  }
}
```

### 3. Install Prompt (PWA)

**Add to Home Screen**:
- Prompt appears after first successful edit
- Shows bottom toast: "Install CraftyPrep for quick access"
- Dismissible (don't show again)

```javascript
// PWA install prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // Show custom install button/toast
  showInstallPrompt();
});

async function handleInstall() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      triggerHaptic('success');
    }

    deferredPrompt = null;
  }
}
```

---

## Implementation Checklist

### Layout
- ✅ Top toolbar: Compact 48px, hamburger menu, context menu
- ✅ Full-screen canvas: Maximized workspace, auto-hide status bar
- ✅ Hamburger menu: Slide from left, 280px width
- ✅ Tools bottom sheet: Slide from bottom, drag handle, swipe to close
- ✅ Adjustments bottom sheet: Slide from bottom, real-time sliders
- ✅ Status bar: Auto-hide on scroll, semi-transparent

### Touch Optimizations
- ✅ All touch targets ≥48x48px (mobile preference over 44px)
- ✅ Swipe gestures: Open/close menus and sheets
- ✅ Pinch-to-zoom on canvas (50% - 200%)
- ✅ Double/triple tap zoom controls
- ✅ Haptic feedback on key interactions
- ✅ Tap highlights for all buttons

### Interactions
- ✅ Hamburger menu: Swipe right from left edge or tap ☰
- ✅ Tools sheet: Tap floating button or swipe up
- ✅ Sheet drag: Drag handle or swipe down to close
- ✅ Backdrop tap: Closes sheet or menu
- ✅ Long press: Context menu for tools (future)

### Responsive
- ✅ Breakpoints: <360px (ultra compact), 360-479px (small), 480-767px (standard)
- ✅ Orientation support: Portrait (default), Landscape (side sheets)
- ✅ Dynamic font sizing: Respects system settings up to 200%

### Mobile Features
- ✅ Web Share API for sharing processed images
- ✅ PWA install prompt (Add to Home Screen)
- ✅ Offline support (service worker, future)
- ✅ Haptic feedback (iOS/Android vibration)

### Accessibility
- ✅ Touch target sizes meet WCAG AAA (≥48x48px on mobile)
- ✅ Screen reader support (TalkBack, VoiceOver)
- ✅ Voice control labels (Siri, Google Assistant)
- ✅ Reduced motion support (disable animations)
- ✅ Large font support (up to 200% system scaling)

---

**Status**: Complete ✅
**Next**: ACCESSIBILITY_REQUIREMENTS.md (WCAG 2.2 AAA)
