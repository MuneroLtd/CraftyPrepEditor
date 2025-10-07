# Acceptance Criteria: Modern Image Editor Layout

**Task ID**: task-024
**Feature**: Professional multi-panel image editor layout

---

## Functional Criteria

### 1. Top Toolbar
**Acceptance**:
- [ ] Top toolbar visible at all times (not scrollable)
- [ ] File menu contains: Upload, Download, Clear actions
- [ ] Edit menu contains: Undo, Redo, Reset actions
- [ ] View menu contains: Toggle Left Sidebar, Toggle Right Panel, Toggle Status Bar
- [ ] Zoom control displays current zoom level (e.g., "100%")
- [ ] Zoom dropdown has presets: 25%, 50%, 75%, 100%, 150%, 200%
- [ ] All toolbar buttons have tooltips on hover (200ms delay)
- [ ] Undo/Redo buttons visually disabled when unavailable
- [ ] Toolbar background uses theme background color

**Verification Method**: Manual testing + E2E test + Screenshot comparison

---

### 2. Left Sidebar
**Acceptance**:
- [ ] Left sidebar vertical, positioned on left edge
- [ ] Contains tool buttons stacked vertically with 8px gap
- [ ] Auto-Prep tool button visible and functional
- [ ] Tool buttons are ≥44px × 44px (touch-friendly)
- [ ] Active tool has highlighted background (primary color)
- [ ] Tool buttons have icons and tooltips
- [ ] Sidebar can be toggled via View menu
- [ ] Sidebar can be toggled via Ctrl+B keyboard shortcut
- [ ] Sidebar visibility persists to localStorage
- [ ] Width: 60px (icon-only) or 200px (icon+label) based on screen size

**Verification Method**: Unit test + Integration test + E2E test

---

### 3. Center Canvas Area
**Acceptance**:
- [ ] Canvas area takes all available space between sidebars
- [ ] Canvas container has scrollbars when image larger than viewport
- [ ] Canvas content centered when image smaller than viewport
- [ ] Checkerboard pattern background for transparency areas
- [ ] Zoom controls positioned at bottom-right corner
- [ ] Space+drag pans canvas (keyboard shortcut)
- [ ] Middle-click+drag pans canvas (mouse shortcut)
- [ ] Two-finger pan works on touch devices
- [ ] Canvas container fills vertical space (no fixed height)
- [ ] ImageCanvas component renders inside CanvasArea

**Verification Method**: Unit test + Visual test + E2E test

---

### 4. Right Panel
**Acceptance**:
- [ ] Right panel visible by default on desktop (≥1024px)
- [ ] Default width: 400px
- [ ] Can be resized by dragging left edge (resize handle)
- [ ] Min width: 200px, Max width: 600px
- [ ] Panel width persists to localStorage
- [ ] Contains collapsible sections (Properties, Adjustments, Layers)
- [ ] Section headers have expand/collapse icons
- [ ] Clicking header toggles section (smooth animation, 200ms)
- [ ] Expanded state persists per section in localStorage
- [ ] Panel can be toggled via View menu
- [ ] Panel can be toggled via Ctrl+1 keyboard shortcut
- [ ] Panel visibility persists to localStorage
- [ ] Scrollable when content exceeds height

**Verification Method**: Unit test + Integration test + E2E test

---

### 5. Resizable Panel
**Acceptance**:
- [ ] Resize handle visible on panel edge (4px wide)
- [ ] Resize handle has hover state (changes cursor to col-resize)
- [ ] Resize handle is ≥44px tall at multiple points (touch-friendly)
- [ ] Dragging handle resizes panel smoothly (no lag)
- [ ] Resize respects min/max width constraints
- [ ] Resize updates in real-time (not just on mouse up)
- [ ] Final width saved to localStorage on drag end
- [ ] Keyboard: Left/Right arrows resize panel (10px increments)
- [ ] Resize handle has ARIA label "Resize panel"
- [ ] Resize handle announces current width to screen readers

**Verification Method**: Unit test + E2E test + Manual testing

---

### 6. Bottom Status Bar
**Acceptance**:
- [ ] Status bar visible at bottom, always in viewport (sticky)
- [ ] Displays status message: "Ready", "Processing...", or error message
- [ ] Shows image dimensions when image loaded (e.g., "1920 × 1080px")
- [ ] Shows current zoom level (e.g., "Zoom: 100%")
- [ ] Shows contextual tip based on current state:
  - No image: "Upload an image to get started"
  - Image uploaded: "Click Auto-Prep to process your image"
  - Processing: "Processing... this may take a few moments"
  - Processed: "Adjust sliders to refine your image"
- [ ] Status updates are announced to screen readers (aria-live="polite")
- [ ] Error messages have red styling
- [ ] Processing status has loading spinner
- [ ] Status bar can be toggled via View menu
- [ ] Status bar visibility persists to localStorage

**Verification Method**: Unit test + Integration test + E2E test

---

### 7. Responsive Behavior
**Acceptance**:
- [ ] **Desktop (≥1024px)**: Full layout with all panels visible
- [ ] **Tablet (768px - 1023px)**:
  - Top toolbar visible
  - Left sidebar collapses to icon-only (60px)
  - Right panel hidden by default (can be toggled)
  - Canvas takes remaining space
  - Status bar visible
- [ ] **Mobile (<768px)**:
  - Top toolbar replaced by hamburger menu
  - Left sidebar hidden (accessible via hamburger)
  - Right panel hidden (accessible via floating button)
  - Canvas takes full width
  - Status bar shows minimal info (status + dimensions only)
- [ ] Layout switches smoothly at breakpoints (no flash/jump)
- [ ] Touch targets ≥44px × 44px on mobile
- [ ] No horizontal scrolling at any breakpoint

**Verification Method**: Responsive testing + E2E test with viewport changes

---

### 8. Layout Persistence
**Acceptance**:
- [ ] Left sidebar visibility persists across page reloads
- [ ] Right panel visibility persists across page reloads
- [ ] Right panel width persists across page reloads
- [ ] Status bar visibility persists across page reloads
- [ ] Expanded section states persist across page reloads
- [ ] localStorage key: `craftyprep-layout-preferences`
- [ ] Invalid data in localStorage ignored (fallback to defaults)
- [ ] localStorage quota exceeded handled gracefully (no crash)
- [ ] Preferences can be reset via "Clear Settings" button

**Verification Method**: Integration test + E2E test + Manual testing

---

## Keyboard Navigation Criteria

### 1. Keyboard Shortcuts
**Acceptance**:
- [ ] Ctrl+B (Cmd+B on Mac) toggles left sidebar
- [ ] Ctrl+1 (Cmd+1 on Mac) toggles right panel
- [ ] Ctrl+H (Cmd+H on Mac) toggles status bar
- [ ] Alt+F opens File menu
- [ ] Alt+E opens Edit menu
- [ ] Alt+V opens View menu
- [ ] Ctrl+Z (Cmd+Z on Mac) triggers undo
- [ ] Ctrl+Y (Cmd+Y on Mac) triggers redo
- [ ] Space+drag pans canvas
- [ ] Escape closes open menus/dialogs
- [ ] Arrow keys (↑↓) navigate menu items when menu open
- [ ] Arrow keys (←→) resize panel when handle focused (+10px/-10px)
- [ ] Enter/Space activates focused button
- [ ] Enter/Space toggles section when header focused

**Verification Method**: E2E test + Manual keyboard testing

---

### 2. Focus Management
**Acceptance**:
- [ ] Tab order: Skip link → Toolbar → Left sidebar → Canvas → Right panel → Status bar
- [ ] Focus visible on all interactive elements (3px outline)
- [ ] Focus outline has ≥3:1 contrast with background
- [ ] Focus doesn't leave viewport (no off-screen focus)
- [ ] Modal dialogs trap focus until closed
- [ ] Closing modal returns focus to trigger element
- [ ] Skip link "Skip to main content" visible on focus
- [ ] Skip link jumps to canvas area

**Verification Method**: Manual keyboard testing + Accessibility audit

---

## Accessibility Criteria (WCAG 2.2 AAA)

### 1. ARIA and Semantics
**Acceptance**:
- [ ] TopToolbar has role="toolbar" and aria-label="Main toolbar"
- [ ] LeftSidebar has role="toolbar" and aria-label="Tools"
- [ ] CanvasArea has role="main" and aria-label="Canvas workspace"
- [ ] RightPanel has role="complementary" and aria-label="Properties panel"
- [ ] StatusBar has role="status" and aria-live="polite"
- [ ] All menu buttons have aria-haspopup="menu"
- [ ] All menus have role="menu" and aria-labelledby
- [ ] All menu items have role="menuitem"
- [ ] Panel sections have aria-expanded (true/false)
- [ ] Resize handle has role="separator" and aria-valuenow/min/max
- [ ] Disabled buttons have aria-disabled="true"

**Verification Method**: Accessibility audit (axe-core) + Screen reader testing

---

### 2. Color Contrast
**Acceptance**:
- [ ] All text has ≥7:1 contrast ratio (AAA)
- [ ] Large text (≥24px) has ≥4.5:1 contrast ratio (AAA)
- [ ] Interactive elements have ≥3:1 contrast for boundaries
- [ ] Focus indicators have ≥3:1 contrast with background
- [ ] Disabled state text has ≥4.5:1 contrast (readable but muted)
- [ ] Status bar error text (red) has ≥7:1 contrast

**Verification Method**: Automated contrast checker + Manual verification

---

### 3. Screen Reader Support
**Acceptance**:
- [ ] Status bar updates announced to screen readers
- [ ] Panel toggle announced (e.g., "Left sidebar hidden")
- [ ] Section expand/collapse announced (e.g., "Adjustments section expanded")
- [ ] Menu open/close announced
- [ ] Undo/Redo actions announced
- [ ] All icons have accessible text alternatives
- [ ] Image dimensions announced when image loaded
- [ ] Zoom level changes announced
- [ ] Processing state announced with progress

**Verification Method**: Screen reader testing (NVDA/VoiceOver) + Manual testing

---

### 4. Touch and Mobile
**Acceptance**:
- [ ] All touch targets ≥44px × 44px
- [ ] Resize handle has enlarged hit area on mobile (≥44px tall)
- [ ] Toolbar buttons ≥44px × 44px
- [ ] Tool buttons ≥44px × 44px
- [ ] Section headers ≥44px tall
- [ ] No hover-dependent functionality
- [ ] Touch gestures documented
- [ ] Two-finger pan works for canvas
- [ ] Pinch-to-zoom disabled (conflicts with canvas zoom)

**Verification Method**: Mobile device testing + Touch target audit

---

## Performance Criteria

### 1. Rendering Performance
**Acceptance**:
- [ ] Panel toggle completes in <100ms
- [ ] Panel resize runs at 60fps (no frame drops)
- [ ] Smooth expand/collapse animation (200ms, ease-in-out)
- [ ] No layout shift during panel resize
- [ ] Canvas area reflows without flicker
- [ ] Status bar updates don't cause re-render of entire app
- [ ] Lighthouse Performance score ≥90

**Verification Method**: Performance profiling + Lighthouse audit

---

### 2. localStorage Performance
**Acceptance**:
- [ ] Preferences save debounced to 300ms (avoid excessive writes)
- [ ] localStorage read on mount <10ms
- [ ] localStorage write <50ms
- [ ] Total localStorage usage <5KB for layout preferences
- [ ] No blocking of UI during localStorage operations

**Verification Method**: Performance profiling + Unit tests

---

### 3. Memory and Resource Usage
**Acceptance**:
- [ ] No memory leaks when toggling panels repeatedly
- [ ] Event listeners cleaned up on unmount
- [ ] ResizeObserver cleaned up properly
- [ ] No excessive re-renders (use React DevTools Profiler)
- [ ] Memoization used for expensive calculations

**Verification Method**: React DevTools Profiler + Memory profiling

---

## Visual Design Criteria

### 1. Spacing and Layout
**Acceptance**:
- [ ] Consistent spacing: 8px, 16px, 24px grid
- [ ] Panel borders: 1px solid border-color
- [ ] Toolbar height: 48px
- [ ] Status bar height: 32px
- [ ] Left sidebar width (desktop): 60px (icon-only) or 200px (icon+label)
- [ ] Right panel default width: 400px
- [ ] Resize handle width: 4px (hover area: 8px)
- [ ] Section header height: 40px
- [ ] Tool button size: 48px × 48px (desktop), 44px × 44px (mobile)

**Verification Method**: Visual inspection + Screenshot comparison

---

### 2. Visual Feedback
**Acceptance**:
- [ ] Hover state on all interactive elements (background opacity change)
- [ ] Active state on tool buttons (primary background)
- [ ] Disabled state visually distinct (50% opacity + muted color)
- [ ] Focus state visible (3px outline)
- [ ] Resize handle cursor changes to col-resize on hover
- [ ] Panel transition smooth (transform + width)
- [ ] Loading states have spinner animation
- [ ] Error states have red accent

**Verification Method**: Visual inspection + Manual testing

---

### 3. Icons and Typography
**Acceptance**:
- [ ] All icons from Lucide icon library (consistency)
- [ ] Icon size: 20px in toolbar, 24px in sidebar
- [ ] Font size: 14px body text, 12px status bar
- [ ] Font weight: 500 for headings, 400 for body
- [ ] Line height: 1.5 for text, 1 for buttons
- [ ] Icons have consistent stroke width (2px)

**Verification Method**: Visual inspection + Design review

---

## Integration Criteria

### 1. Integration with Existing Features
**Acceptance**:
- [ ] ImageCanvas renders inside CanvasArea without breaking
- [ ] ZoomControls work in new layout
- [ ] RefinementControls render in RightPanel without breaking
- [ ] UndoRedoButtons integrated into toolbar
- [ ] MaterialPresetSelector works in RightPanel
- [ ] AutoPrepButton works in LeftSidebar
- [ ] FileUploadComponent integrates with File menu
- [ ] DownloadButton integrates with File menu
- [ ] No regression in existing functionality

**Verification Method**: Integration tests + E2E tests

---

### 2. State Management
**Acceptance**:
- [ ] Layout state doesn't interfere with app state
- [ ] Panel visibility doesn't reset when image changes
- [ ] Section expanded state independent of other state
- [ ] Layout preferences load before first render (no flash)
- [ ] useLayoutPreferences hook doesn't cause excessive re-renders

**Verification Method**: Integration tests + State debugging

---

## Browser Compatibility Criteria

**Acceptance**:
- [ ] Works on Chrome 90+ (latest features like grid, flexbox)
- [ ] Works on Firefox 88+
- [ ] Works on Safari 14+
- [ ] Works on Edge 90+
- [ ] localStorage API supported and functional
- [ ] ResizeObserver API supported
- [ ] CSS Grid supported
- [ ] CSS Flexbox supported

**Verification Method**: Cross-browser manual testing + BrowserStack

---

## Testing Criteria

### 1. Test Coverage
**Acceptance**:
- [ ] Unit test coverage ≥80% for all layout components
- [ ] All user interactions have E2E tests
- [ ] All keyboard shortcuts have E2E tests
- [ ] Responsive behavior tested at all breakpoints
- [ ] localStorage persistence tested
- [ ] Accessibility tested with axe-core

**Verification Method**: Coverage report + Test execution

---

### 2. Regression Prevention
**Acceptance**:
- [ ] All existing tests still pass
- [ ] No new console errors
- [ ] No new TypeScript errors
- [ ] No new ESLint warnings
- [ ] Lighthouse scores don't decrease

**Verification Method**: CI/CD pipeline + Manual verification

---

## Documentation Criteria

**Acceptance**:
- [ ] All components have JSDoc comments
- [ ] Complex logic has inline comments
- [ ] Keyboard shortcuts documented in help panel
- [ ] Layout customization guide in README
- [ ] Props interfaces fully documented
- [ ] Accessibility features documented

**Verification Method**: Code review + Documentation review

---

## Definition of Done Checklist

- [ ] All functional acceptance criteria met
- [ ] All keyboard navigation criteria met
- [ ] All accessibility criteria met (WCAG 2.2 AAA)
- [ ] All performance criteria met
- [ ] All visual design criteria met
- [ ] All integration criteria met
- [ ] All browser compatibility verified
- [ ] Test coverage ≥80%
- [ ] All tests passing (unit + integration + E2E)
- [ ] Lighthouse accessibility score ≥95
- [ ] Lighthouse performance score ≥90
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Code reviewed and approved
- [ ] Documentation complete
- [ ] Deployed to development environment
- [ ] Manual QA passed
- [ ] Screen reader testing passed (NVDA/VoiceOver)
- [ ] Cross-browser testing passed

---

**Total Acceptance Criteria**: 165+
**Verification Methods**: Unit tests, Integration tests, E2E tests, Manual testing, Accessibility audit, Performance profiling, Cross-browser testing

---

## Notes

- This is a foundational task - all subsequent UI/UX tasks depend on this layout structure
- Panel collapse/resize is critical for professional feel
- Keyboard shortcuts must not conflict with browser shortcuts
- localStorage is essential for user preference persistence
- Responsive design is non-negotiable for tablet/mobile support
- Accessibility is not optional - WCAG 2.2 AAA compliance required

---

**Status**: DOCUMENTED
**Ready for**: Implementation (Phase 1)
