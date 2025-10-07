# Research: Modern Image Editor Layout

**Task ID**: task-024
**Research Focus**: Professional image editor layout patterns, panel systems, keyboard shortcuts

---

## Executive Summary

This research covers industry-standard patterns for image editor layouts, focusing on:
1. **Multi-panel layout architectures** (Photoshop, Figma, Canva, GIMP)
2. **Resizable and collapsible panel systems**
3. **Keyboard shortcut conventions**
4. **Responsive design for professional tools**
5. **Accessibility in complex layouts**

**Key Findings**:
- Professional editors use 3-5 distinct areas (toolbar, tools, canvas, properties, status)
- Panel visibility toggles are essential (not all panels visible simultaneously)
- Keyboard shortcuts follow industry conventions (Ctrl+B for sidebar, etc.)
- Resizable panels have min/max constraints (typically 200px-600px)
- localStorage persistence is expected behavior
- Touch-friendly adaptations required for tablet/mobile

---

## Industry Analysis: Professional Image Editors

### 1. Adobe Photoshop

**Layout Structure**:
```
┌───────────────────────────────────────────────────────┐
│  Menu Bar (File, Edit, Image, Layer, Select, ...)     │
├───────────────────────────────────────────────────────┤
│  Options Bar (context-sensitive tool options)         │
├────┬──────────────────────────────────────────┬───────┤
│    │                                          │       │
│ T  │           Canvas (artboard)             │ Panel │
│ o  │                                          │ Dock  │
│ o  │      [Image with handles/guides]        │       │
│ l  │                                          │ Color │
│ s  │                                          │ Layer │
│    │                                          │ Props │
│    │                                          │       │
└────┴──────────────────────────────────────────┴───────┘
```

**Key Features**:
- **Panels** are dockable and collapsible
- **Keyboard shortcuts**: F7 (Layers panel), Tab (hide all panels), Ctrl+H (hide extras)
- **Workspace presets**: Save panel configurations
- **Min/max widths**: ~200px - ~600px for panels
- **localStorage equivalent**: Workspace preferences saved in app data

**Lessons Learned**:
- Panel toggle keyboard shortcuts essential (F-keys or Ctrl+number)
- Tab key to hide all panels (focus on canvas)
- Collapsible panel groups (Color + Swatches in one dock)
- Panel icons visible even when collapsed (for quick access)

---

### 2. Figma

**Layout Structure**:
```
┌───────────────────────────────────────────────────────┐
│  Toolbar (tools + actions)                             │
├────┬──────────────────────────────────────────┬───────┤
│    │                                          │       │
│ L  │           Canvas (infinite)             │ Right │
│ a  │                                          │ Panel │
│ y  │      [Frames, components, etc.]         │       │
│ e  │                                          │ Props │
│ r  │                                          │ Style │
│ s  │                                          │       │
│    │                                          │       │
└────┴──────────────────────────────────────────┴───────┘
```

**Key Features**:
- **Panels** are resizable with drag handles
- **Keyboard shortcuts**: Ctrl+\ (show/hide UI), Ctrl+Alt+1 (layers), Ctrl+Alt+3 (properties)
- **Smart resize**: Panels remember width per project
- **Responsive**: Mobile app uses floating panels
- **Real-time collaboration** sidebar (optional)

**Lessons Learned**:
- Ctrl+\ to hide entire UI (canvas-focused mode)
- Properties panel context-sensitive (changes based on selection)
- Layers panel separate from properties (different concerns)
- Floating panels on mobile (don't obstruct canvas)

---

### 3. Canva

**Layout Structure**:
```
┌───────────────────────────────────────────────────────┐
│  Top Bar (logo, share, publish, account)              │
├────┬──────────────────────────────────────────┬───────┤
│    │                                          │       │
│ S  │           Canvas (centered)             │  None │
│ i  │                                          │       │
│ d  │      [Design with elements]             │       │
│ e  │                                          │       │
│    │                                          │       │
│    │                                          │       │
└────┴──────────────────────────────────────────┴───────┘
```

**Key Features**:
- **No right panel** in default view (cleaner, less overwhelming)
- **Left sidebar**: Template browser + element picker
- **Context toolbar**: Appears when element selected
- **Floating panels**: Color picker, text formatting overlay canvas
- **Mobile-first**: Works well on small screens

**Lessons Learned**:
- Simpler layout for casual users (no right panel clutter)
- Context-sensitive toolbars reduce always-visible UI
- Floating panels for occasional actions (better than fixed panel)
- Clear visual hierarchy (main action buttons prominent)

---

### 4. GIMP

**Layout Structure**:
```
┌────────────────────────────────────┐  ┌───────────────┐
│  Toolbox (tools + foreground/bg)   │  │  Docks        │
├────────────────────────────────────┤  │  (Layers,     │
│  Tool Options (context)            │  │   Brushes,    │
└────────────────────────────────────┘  │   Patterns)   │
┌───────────────────────────────────────┴───────────────┐
│  Canvas Window (separate)                             │
│                                                        │
│      [Image with scrollbars]                          │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Key Features**:
- **Multi-window** (toolbox, canvas, docks separate)
- **Dockable dialogs**: Any panel can be docked or floated
- **Keyboard shortcuts**: Tab (hide docks), Shift+Ctrl+B (dockable dialogs)
- **Window management**: GIMP 2.8+ supports single-window mode
- **Highly customizable**: Save window positions

**Lessons Learned**:
- Multi-window flexibility (but confusing for new users)
- Single-window mode now standard (users prefer)
- Dockable panels better than floating (less window management)
- Tab to hide all docks (universal pattern)

---

## Resizable Panel Systems

### Best Practices from Research

**1. Resize Handle Design**:
- **Width**: 4-8px (visible but not intrusive)
- **Hit area**: Larger than visual (8-12px) for easier dragging
- **Cursor**: `col-resize` (vertical bar with arrows)
- **Visual feedback**: Darker/lighter on hover
- **Touch-friendly**: ≥44px tall hit areas at regular intervals

**2. Resize Constraints**:
- **Min width**: 200-250px (fits controls without wrapping)
- **Max width**: 500-600px (prevents panel dominating screen)
- **Default width**: 300-400px (balanced)
- **Step size**: 1px (smooth drag) or 10px (keyboard resize)

**3. Resize Persistence**:
- **localStorage**: Save width on drag end (not during drag)
- **Per-panel**: Each panel remembers its width
- **Per-workspace**: Optional workspace presets
- **Debounce**: Save 300ms after drag stops (avoid excessive writes)

**4. Keyboard Resize**:
- **Arrow keys**: ←/→ resize by 10px
- **Shift+Arrow**: Resize by 50px (faster)
- **Focus indicator**: Resize handle has visible focus state

**Example Code Pattern** (from React RND library):
```typescript
<Rnd
  size={{ width, height }}
  onResizeStop={(e, direction, ref, delta, position) => {
    const newWidth = width + delta.width;
    setWidth(clamp(newWidth, MIN_WIDTH, MAX_WIDTH));
    saveToLocalStorage(newWidth);
  }}
  minWidth={MIN_WIDTH}
  maxWidth={MAX_WIDTH}
  enableResizing={{ left: true, right: false }}
/>
```

---

## Collapsible Panel Sections

### Patterns from Professional Tools

**1. Accordion Pattern** (Photoshop, Figma):
- Multiple sections, only one expanded at a time
- Click header to toggle
- Smooth animation (200-300ms)
- Chevron icon rotates (→ when collapsed, ↓ when expanded)

**2. Independent Sections** (Canva):
- Each section expands/collapses independently
- Multiple can be open simultaneously
- Better for related controls (brightness + contrast both visible)

**3. Sticky Headers** (GIMP):
- Section headers remain visible when scrolling
- Useful for long panels with many sections

**Recommendation**: Use **independent sections** pattern for CraftyPrep
- Adjustments section (brightness, contrast, threshold)
- Filters section (background removal, future filters)
- Export section (format, quality)

**Implementation** (using shadcn/ui Collapsible):
```typescript
<Collapsible open={isOpen} onOpenChange={setIsOpen}>
  <CollapsibleTrigger className="flex items-center justify-between w-full p-3">
    <span className="font-medium">Adjustments</span>
    <ChevronDown className={cn("transition-transform", isOpen && "rotate-180")} />
  </CollapsibleTrigger>
  <CollapsibleContent className="p-3 space-y-4">
    {/* Controls go here */}
  </CollapsibleContent>
</Collapsible>
```

---

## Keyboard Shortcuts: Industry Conventions

### Panel Toggle Shortcuts

| Shortcut | Action | Used By |
|----------|--------|---------|
| **Ctrl+B** | Toggle sidebar/brushes | Photoshop, VS Code |
| **Ctrl+1** | Toggle properties panel | Figma, VS Code |
| **Ctrl+H** | Hide/show UI elements | Photoshop, Figma |
| **Tab** | Hide all panels | Photoshop, GIMP, Figma |
| **F7** | Layers panel | Photoshop |
| **Ctrl+Alt+1** | Specific panel (layers) | Figma |

**Recommendation for CraftyPrep**:
- **Ctrl+B**: Toggle left sidebar (tools)
- **Ctrl+1**: Toggle right panel (properties)
- **Ctrl+H**: Toggle status bar
- **Tab**: Hide all panels (canvas-focused mode)
- **Alt+F, Alt+E, Alt+V**: Open toolbar menus (File, Edit, View)

### Canvas Navigation Shortcuts

| Shortcut | Action | Used By |
|----------|--------|---------|
| **Space+Drag** | Pan canvas | Photoshop, Figma, GIMP |
| **Ctrl+0** | Fit to screen | Photoshop, Figma |
| **Ctrl++** | Zoom in | Universal |
| **Ctrl+-** | Zoom out | Universal |
| **Ctrl+1** | Zoom to 100% | Photoshop (conflicts with panel toggle in Figma) |

**Recommendation for CraftyPrep**:
- **Space+Drag**: Pan canvas
- **Ctrl+0**: Fit to screen
- **Ctrl++**: Zoom in
- **Ctrl+-**: Zoom out
- **Ctrl+Alt+0**: Zoom to 100% (avoid Ctrl+1 conflict)

---

## Responsive Design for Professional Tools

### Desktop (≥1024px)
**Pattern**: Full layout with all panels
- Top toolbar: 48-60px height
- Left sidebar: 60-80px width (icon-only) or 200-250px (icon+label)
- Right panel: 300-400px width (resizable)
- Status bar: 24-32px height
- Canvas: Remaining space

**Example** (Figma desktop):
```
┌─────────────────────────────────────────┐
│  Toolbar (60px height)                  │
├────┬──────────────────────┬─────────────┤
│ L  │      Canvas          │   Right     │
│ 60 │   (flex-grow)        │   Panel     │
│ px │                      │   320px     │
└────┴──────────────────────┴─────────────┘
```

---

### Tablet (768px - 1023px)
**Pattern**: Reduced panels, more canvas space
- Top toolbar: Full width, 48px height
- Left sidebar: Icon-only (60px) OR hidden
- Right panel: Hidden by default (toggle with button)
- Canvas: Maximum space
- Status bar: Full width, 24px height

**Example** (Photoshop on tablet):
```
┌──────────────────────────────────┐
│  Toolbar (48px)                  │
├────┬─────────────────────────────┤
│ 60 │      Canvas                 │
│ px │   (full width)              │
│    │                             │
└────┴─────────────────────────────┘
[Floating panel button in corner]
```

---

### Mobile (<768px)
**Pattern**: Minimal UI, focus on canvas
- Hamburger menu (top-left)
- Canvas (full screen)
- Floating action buttons (bottom-right)
- Context toolbar (appears when needed)

**Example** (Canva mobile):
```
┌──────────────────────────────────┐
│ ☰  Title             [User]     │
├──────────────────────────────────┤
│                                  │
│         Canvas                   │
│      (full screen)               │
│                                  │
│                          [+] [✓] │
└──────────────────────────────────┘
```

**Mobile Adaptations**:
- **No right panel**: Too narrow
- **Floating panels**: Overlay canvas (dismissible)
- **Bottom sheet**: Slide up from bottom (Material Design pattern)
- **Touch targets**: ≥44px × 44px
- **Gestures**: Pinch-zoom, two-finger pan

---

## localStorage and State Persistence

### What to Persist

**Layout Preferences**:
- Panel visibility (left sidebar, right panel, status bar)
- Panel widths (right panel)
- Section expanded states (adjustments, filters, export)
- Toolbar visibility (for canvas-focused mode)

**User Preferences**:
- Zoom level (optional - some editors reset on reload)
- Canvas pan position (optional - usually reset)
- Last opened file (optional - privacy consideration)

**What NOT to Persist**:
- Current image data (too large, privacy concern)
- Processing state (should reset on reload)
- Error messages (should clear on reload)
- Temporary UI state (tooltips, focus)

### Storage Schema

**Recommended Schema**:
```json
{
  "layout": {
    "version": 1,
    "leftSidebarVisible": true,
    "rightPanelVisible": true,
    "rightPanelWidth": 400,
    "statusBarVisible": true,
    "expandedSections": {
      "adjustments": true,
      "filters": false,
      "export": false
    }
  }
}
```

**Storage Key**: `craftyprep-layout-v1`
**Size**: ~200 bytes (well within 5-10MB quota)

**Error Handling**:
- **Parse errors**: Log and use defaults
- **Quota exceeded**: Log, continue without persistence
- **Private browsing**: Graceful fallback (some browsers disable localStorage)
- **Data migration**: Version field allows schema changes

---

## Accessibility in Complex Layouts

### ARIA Landmarks

**Required Landmarks**:
- `<header role="banner">` - Top toolbar
- `<nav role="navigation">` - Left sidebar (tools)
- `<main role="main">` - Canvas area
- `<aside role="complementary">` - Right panel (properties)
- `<footer role="contentinfo">` - Status bar

**ARIA Roles for Panels**:
- Toolbar: `role="toolbar"` + `aria-label="Main toolbar"`
- Tool buttons: `role="button"` + `aria-pressed="true/false"` for toggles
- Panel sections: `aria-expanded="true/false"` for collapsible
- Resize handle: `role="separator"` + `aria-valuenow/min/max`

### Keyboard Navigation

**Focus Order**:
1. Skip link ("Skip to main content")
2. Top toolbar (left to right)
3. Left sidebar (top to bottom)
4. Canvas area
5. Right panel (top to bottom)
6. Status bar (left to right)

**Focus Traps**:
- Modal dialogs (if any) trap focus until dismissed
- Dropdown menus trap focus while open
- Escape key closes menus and returns focus to trigger

**Focus Indicators**:
- **Visible on all elements**: 3px solid outline
- **Color**: High contrast (≥3:1 with background)
- **No outline-none**: Never remove focus indicators
- **Custom focus styles**: Acceptable if contrast maintained

### Screen Reader Announcements

**Status Updates** (aria-live="polite"):
- "Panel expanded"
- "Panel collapsed"
- "Left sidebar hidden"
- "Zoom level 150%"
- "Image dimensions: 1920 by 1080 pixels"

**Errors** (aria-live="assertive"):
- "File upload failed"
- "Processing error"

**Avoid Over-Announcing**:
- Don't announce every slider value change (use debounce)
- Don't announce resize drag (only final width)

---

## Performance Optimization

### Panel Resize Performance

**60fps Target**:
- Use `transform` instead of `width` for smooth resize
- Use `will-change: transform` for GPU acceleration
- Throttle resize events to 16ms (60fps)
- Use `requestAnimationFrame` for updates

**Example** (optimized resize):
```typescript
const handleResize = useCallback(
  throttle((delta: number) => {
    requestAnimationFrame(() => {
      const newWidth = clamp(width + delta, MIN, MAX);
      setWidth(newWidth);
    });
  }, 16), // 60fps
  [width]
);
```

### Lazy Loading Panels

**Optimization**: Don't render hidden panels
```typescript
{leftSidebarVisible && <LeftSidebar />}
{rightPanelVisible && <RightPanel />}
{statusBarVisible && <StatusBar />}
```

**Trade-off**: Slight delay when toggling (acceptable)
**Benefit**: Faster initial render, less memory

### localStorage Debouncing

**Optimization**: Debounce saves to avoid excessive writes
```typescript
const debouncedSave = useMemo(
  () => debounce((prefs: LayoutPreferences) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  }, 300),
  []
);
```

**Benefit**: Fewer localStorage operations (faster)
**Trade-off**: 300ms delay before save (acceptable)

---

## Technology Recommendations

### Panel Resize Library

**Option 1: react-rnd**
- **Pros**: Full-featured (resize + drag), 100k+ downloads/week, active maintenance
- **Cons**: 50KB gzipped, more features than needed
- **Use case**: If adding draggable panels (future)

**Option 2: re-resizable**
- **Pros**: Focused on resize only, 28KB gzipped, same author as react-rnd
- **Cons**: Less flexible than react-rnd
- **Use case**: If only resizing (current scope)

**Option 3: Custom implementation**
- **Pros**: Lightweight (<5KB), full control, no dependencies
- **Cons**: More code to maintain, need to handle edge cases
- **Use case**: If minimizing bundle size

**Recommendation**: **Custom implementation** for CraftyPrep
- Simple use case (resize right panel only)
- Full control over UX (touch-friendly, keyboard, etc.)
- No extra dependencies
- Educational value (learn resize mechanics)

---

### Icon Library

**Option 1: Lucide React**
- **Pros**: 1000+ icons, tree-shakeable, modern design, active maintenance
- **Cons**: 400KB total (but only import used icons)
- **Use case**: Professional look, consistent style

**Option 2: React Icons**
- **Pros**: Multiple icon sets (Font Awesome, Material, etc.), 10k+ downloads/week
- **Cons**: Larger bundle if using multiple sets
- **Use case**: Need specific icons from different sets

**Option 3: Heroicons**
- **Pros**: Official Tailwind CSS icons, clean design, 200+ icons
- **Cons**: Fewer icons than Lucide
- **Use case**: Minimalist design, Tailwind ecosystem

**Recommendation**: **Lucide React** for CraftyPrep
- Modern, clean design
- Comprehensive icon set (all needed icons available)
- Tree-shakeable (only import what you use)
- Active maintenance and updates
- Already planned for task-028

---

## Security Considerations

### localStorage Security

**Risks**:
- **XSS attacks**: Malicious scripts can read localStorage
- **Data tampering**: Users can modify localStorage directly

**Mitigations**:
- **No sensitive data**: Only UI preferences (no credentials, API keys)
- **Input validation**: Validate all loaded data before use
- **Schema versioning**: Detect and reject malformed data
- **Graceful fallback**: Use defaults if validation fails

**Example Validation**:
```typescript
const loadPreferences = (): LayoutPreferences => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_PREFERENCES;

    const parsed = JSON.parse(stored);

    // Validate structure
    if (typeof parsed.leftSidebarVisible !== 'boolean') {
      throw new Error('Invalid data');
    }

    // Validate ranges
    if (parsed.rightPanelWidth < MIN_WIDTH || parsed.rightPanelWidth > MAX_WIDTH) {
      parsed.rightPanelWidth = DEFAULT_WIDTH;
    }

    return parsed;
  } catch (error) {
    console.error('Failed to load preferences:', error);
    return DEFAULT_PREFERENCES;
  }
};
```

### Content Security Policy (CSP)

**Recommended CSP Headers**:
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
```

**Why**:
- Prevents external scripts from accessing localStorage
- Allows inline styles (Tailwind)
- Allows data URLs for images (Canvas export)

---

## Open Questions and Decisions

### 1. Panel Resize: Drag vs. Click-to-Size
**Question**: Should panel resize be drag-only or also support click presets (Small/Medium/Large)?

**Research**:
- **Photoshop**: Drag only
- **Figma**: Drag only
- **VS Code**: Drag + double-click to reset

**Decision**: **Drag only** (simpler, more precise)
- Double-click handle to reset to default width (optional nice-to-have)

---

### 2. Mobile Layout: Bottom Sheet vs. Floating Panels
**Question**: On mobile, should controls appear as bottom sheet or floating panels?

**Research**:
- **Canva**: Bottom sheet (Material Design)
- **Figma**: Floating panels (can be dismissed)
- **Photoshop**: No mobile version

**Decision**: **Floating panels** (Phase 7)
- More flexible (can position anywhere)
- Dismissible by tapping outside
- Less intrusive than bottom sheet

---

### 3. Panel Persistence: Per-User or Per-Device
**Question**: Should layout preferences sync across devices (future) or stay local?

**Research**:
- **Figma**: Syncs with account (requires login)
- **Photoshop**: Syncs with Creative Cloud
- **GIMP**: Local only (no account system)

**Decision**: **Local only** (current scope)
- No user accounts in MVP
- localStorage is device-specific
- Future: Add sync when authentication implemented

---

### 4. Keyboard Shortcuts: Customizable or Fixed
**Question**: Should users be able to customize keyboard shortcuts?

**Research**:
- **Photoshop**: Customizable (Edit > Keyboard Shortcuts)
- **Figma**: Fixed (no customization)
- **VS Code**: Highly customizable

**Decision**: **Fixed** (current scope)
- Simpler implementation
- Fewer edge cases (conflict detection, reset, etc.)
- Future: Add customization in settings

---

## Implementation Recommendations

### Phase 1: Start Simple
1. Fixed panels (no resize) - get layout structure working
2. Toggle visibility - ensure localStorage works
3. Responsive breakpoints - verify mobile layout

### Phase 2: Add Interactions
4. Panel resize - custom implementation
5. Keyboard shortcuts - fixed set
6. Collapsible sections - shadcn/ui Collapsible

### Phase 3: Polish
7. Smooth animations - CSS transitions
8. Accessibility audit - WCAG 2.2 AAA
9. Performance optimization - debounce, memoization

**Why**: Incremental approach reduces risk, each phase delivers value

---

## Conclusion

**Key Takeaways**:
1. **Multi-panel layout** is industry standard for professional tools
2. **Panel resize** requires careful UX (handles, constraints, feedback)
3. **Keyboard shortcuts** follow established conventions (Ctrl+B, Tab, etc.)
4. **Responsive design** essential (tablet/mobile adaptations)
5. **localStorage persistence** expected by users (saves preferences)
6. **Accessibility** critical (ARIA landmarks, keyboard nav, screen readers)
7. **Performance** matters (60fps resize, debounced saves)

**Confidence Level**: HIGH
- Clear patterns from industry leaders
- Proven implementations (Photoshop, Figma, GIMP)
- Comprehensive accessibility research
- Performance optimizations documented

**Ready for**: Implementation (Phase 1)

---

## References

### Industry Tools Analyzed
- Adobe Photoshop CC 2024
- Figma (web version)
- Canva (web + mobile)
- GIMP 2.10
- VS Code (for panel patterns)

### Libraries Evaluated
- react-rnd (https://github.com/bokuweb/react-rnd)
- re-resizable (https://github.com/bokuweb/re-resizable)
- Lucide React (https://lucide.dev)
- shadcn/ui Collapsible (https://ui.shadcn.com/docs/components/collapsible)

### Standards Referenced
- WCAG 2.2 AAA (https://www.w3.org/WAI/WCAG22/quickref/)
- ARIA Authoring Practices (https://www.w3.org/WAI/ARIA/apg/)
- Material Design (https://m3.material.io/)

---

**Research Status**: COMPLETE
**Next Step**: Begin implementation (Phase 1)
