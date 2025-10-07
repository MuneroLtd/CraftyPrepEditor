# Dependencies: Modern Image Editor Layout

**Task ID**: task-024
**Task**: Modern Image Editor Layout (Toolbar, Canvas, Panels)

---

## Upstream Dependencies

### ✅ task-023: UI/UX Audit and Design System (COMMITTED)

**Status**: COMMITTED (Tue 7 Oct 00:06:14 UTC 2025)

**Provides**:
- Design tokens (colors, spacing, typography)
- Theme system (CSS custom properties)
- Component patterns (buttons, inputs, panels)
- Accessibility standards (WCAG 2.2 AAA guidelines)
- shadcn/ui component library integration
- Tailwind CSS 4 configuration

**Why Required**:
- Layout components must use established design tokens
- Toolbar buttons use standardized button component
- Panel sections use theme colors and spacing
- Accessibility patterns already defined
- Consistent styling across all panels

**Risk if Missing**: Layout would have inconsistent styling and would need refactoring when design system is introduced

---

## Downstream Dependencies

### task-025: Professional Control Panel Redesign (PENDING)

**Status**: PENDING (Blocked by task-024)

**Requires from task-024**:
- RightPanel component with collapsible sections
- CollapsibleSection component for grouping controls
- Section expansion state persistence
- Panel scrolling behavior
- Responsive panel behavior

**Impact**:
- Control panels will be placed inside RightPanel sections
- Grouping (Adjustments, Filters, Export) uses CollapsibleSection
- Panel width affects control layout
- Mobile behavior depends on panel collapse logic

**Blocker**: task-025 cannot start until RightPanel structure is complete

---

### task-026: Enhanced Slider and Input Components (PENDING)

**Status**: PENDING (Blocked by task-024)

**Requires from task-024**:
- RightPanel width constraints (sliders must fit)
- Section padding and spacing standards
- Responsive behavior (sliders adapt to panel width)
- Panel scrolling (sliders must be accessible)
- Touch-friendly layout on mobile

**Impact**:
- Slider width must respect panel min/max width
- Slider labels must fit in constrained space
- Mobile sliders use full panel width
- Slider keyboard shortcuts must not conflict with panel shortcuts

**Blocker**: task-026 depends on panel dimensions and responsive behavior

---

### task-027: Dark/Light Theme System (PENDING)

**Status**: PENDING (Can run in parallel, minor dependency)

**Requires from task-024**:
- Layout components structure
- CSS custom properties usage
- Theme context (if implemented)

**Impact**:
- All layout components must support theming
- Panel borders/backgrounds use theme colors
- Toolbar uses theme background
- Status bar uses theme colors

**Blocker**: Minor dependency - theme system can wrap layout components after implementation

---

## External Dependencies

### React 19
**Status**: ✅ Installed (package.json)

**Used For**:
- Component structure (all layout components)
- useState for panel visibility
- useEffect for localStorage
- useRef for resize drag handlers
- useCallback for event handlers
- Custom hooks (useLayoutPreferences, useKeyboardShortcuts)

**Version**: 19.0.0
**Risk**: None (already in use throughout app)

---

### Tailwind CSS 4
**Status**: ✅ Configured (tailwind.config.js)

**Used For**:
- Layout classes (flex, grid)
- Responsive breakpoints (md:, lg:)
- Spacing utilities (p-, m-, gap-)
- Border utilities (border, rounded)
- Background utilities (bg-)
- Custom utilities (defined in theme)

**Version**: 4.x
**Risk**: None (already configured with design tokens from task-023)

---

### shadcn/ui Components
**Status**: ✅ Installed (components/ui/)

**Used Components**:
- Button (toolbar buttons, tool buttons)
- DropdownMenu (File, Edit, View menus)
- Separator (panel dividers)
- Collapsible (panel sections - may need to install)
- Tooltip (button tooltips)

**Version**: Latest (from shadcn/ui registry)
**Risk**: Low (Collapsible may need installation if not already present)

---

### localStorage API
**Status**: ✅ Browser Native

**Used For**:
- Panel visibility persistence
- Panel width persistence
- Section expanded state persistence
- Layout preferences storage

**Browser Support**: All modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
**Risk**: Low (fallback to defaults if unavailable)

**Error Handling Required**:
- Quota exceeded (5-10MB limit)
- Private browsing mode (some browsers disable)
- Corrupted data (JSON parse errors)

---

### ResizeObserver API
**Status**: ✅ Browser Native

**Used For**:
- Detecting window resize for responsive layout
- Panel resize feedback

**Browser Support**: All modern browsers (Chrome 64+, Firefox 69+, Safari 13+, Edge 79+)
**Risk**: Low (polyfill available if needed)

---

### Lucide Icons (or similar)
**Status**: ⚠️ TO BE INSTALLED (task-028 planned)

**Used For**:
- Toolbar icons (Upload, Download, Undo, Redo, etc.)
- Tool icons (Auto-Prep, Crop, Text, Filters)
- Expand/collapse icons (chevron-down, chevron-right)
- Menu icons (hamburger, close)

**Workaround**: Use text labels or Unicode symbols temporarily
**Risk**: Medium (icons critical for professional look)
**Mitigation**: Install Lucide React early in Phase 2

**Installation**:
```bash
npm install lucide-react
```

---

## Internal Dependencies (CraftyPrep Codebase)

### ImageCanvas Component
**Status**: ✅ EXISTS (src/components/ImageCanvas.tsx)

**Used In**: CanvasArea component

**Why Required**:
- Canvas rendering must integrate with new layout
- Zoom controls must work with new CanvasArea
- Canvas must be scrollable within CanvasArea container

**Risk**: Low (existing component, minimal changes needed)

---

### ZoomControls Component
**Status**: ✅ EXISTS (src/components/ZoomControls.tsx)

**Used In**: CanvasArea component (bottom-right corner)

**Why Required**:
- Zoom controls must be positioned in new layout
- Zoom level state must integrate with toolbar zoom display

**Risk**: Low (existing component, position change only)

---

### RefinementControls Component
**Status**: ✅ EXISTS (src/components/RefinementControls.tsx)

**Used In**: RightPanel > AdjustmentsSection

**Why Required**:
- Refinement sliders must fit in RightPanel
- Panel width affects slider layout

**Risk**: Medium (may need responsive adjustments for narrower panel)
**Mitigation**: Test with min/max panel widths

---

### MaterialPresetSelector Component
**Status**: ✅ EXISTS (src/components/MaterialPresetSelector.tsx)

**Used In**: RightPanel > AdjustmentsSection

**Why Required**:
- Preset dropdown must fit in panel
- Dropdown must not be cut off by panel boundaries

**Risk**: Low (dropdown should overlay, not be constrained)

---

### UndoRedoButtons Component
**Status**: ✅ EXISTS (src/components/UndoRedoButtons.tsx)

**Used In**: TopToolbar > Edit menu OR standalone in toolbar

**Why Required**:
- Undo/Redo must integrate with toolbar
- Keyboard shortcuts must not conflict

**Risk**: Low (existing shortcuts already defined)

---

### AutoPrepButton Component
**Status**: ✅ EXISTS (src/components/AutoPrepButton.tsx)

**Used In**: LeftSidebar OR TopToolbar

**Why Required**:
- Auto-Prep must be accessible from tools
- Button may need icon variant for sidebar

**Risk**: Low (may need icon-only variant)

---

### FileUploadComponent Component
**Status**: ✅ EXISTS (src/components/FileUploadComponent.tsx)

**Used In**: Initial welcome screen OR File menu

**Why Required**:
- Upload must integrate with new layout
- May need to move to modal dialog triggered by File > Upload

**Risk**: Medium (significant integration change)
**Mitigation**: Plan upload flow early (Phase 2)

---

### DownloadButton Component
**Status**: ✅ EXISTS (src/components/DownloadButton.tsx)

**Used In**: File menu OR RightPanel export section

**Why Required**:
- Download must be accessible from toolbar
- May need icon variant for menu item

**Risk**: Low (minimal changes needed)

---

## Data Dependencies

### App State
**Status**: ✅ EXISTS (App.tsx)

**Required State**:
- `uploadedImage` - for showing/hiding canvas
- `processedImage` - for canvas rendering
- `canUndo` / `canRedo` - for toolbar buttons
- `zoomLevel` - for toolbar zoom display
- `isProcessing` - for status bar

**Risk**: Low (state already exists, just needs to be passed to layout components)

---

### Layout Preferences State (NEW)
**Status**: ⚠️ TO BE CREATED

**Schema**:
```typescript
interface LayoutPreferences {
  leftSidebarVisible: boolean;
  rightPanelVisible: boolean;
  rightPanelWidth: number; // 200-600px
  statusBarVisible: boolean;
  expandedSections: {
    properties: boolean;
    adjustments: boolean;
    layers: boolean;
  };
}
```

**Storage Key**: `craftyprep-layout-preferences`
**Managed By**: useLayoutPreferences hook (to be created)

---

## Configuration Dependencies

### TypeScript Configuration
**Status**: ✅ CONFIGURED (tsconfig.json)

**Required Features**:
- JSX support (react-jsx)
- Path aliases (@/ for src/)
- Strict mode enabled

**Risk**: None (already configured)

---

### Vite Configuration
**Status**: ✅ CONFIGURED (vite.config.ts)

**Required Features**:
- React plugin
- Path alias resolution
- CSS modules support

**Risk**: None (already configured)

---

### ESLint Configuration
**Status**: ✅ CONFIGURED (.eslintrc.json)

**Required Rules**:
- React hooks rules
- TypeScript rules
- Accessibility rules (jsx-a11y)

**Risk**: None (already configured)

---

## Test Dependencies

### Vitest
**Status**: ✅ INSTALLED

**Used For**:
- Unit tests (all components)
- Integration tests (layout + app state)
- Coverage reporting

**Version**: Latest
**Risk**: None (already in use)

---

### React Testing Library
**Status**: ✅ INSTALLED

**Used For**:
- Component rendering tests
- User interaction simulation
- Accessibility queries

**Version**: Latest
**Risk**: None (already in use)

---

### Playwright
**Status**: ✅ INSTALLED

**Used For**:
- E2E tests (layout interactions)
- Responsive testing (viewport changes)
- Keyboard shortcut testing
- Accessibility testing (axe-core)

**Version**: Latest
**Risk**: None (already in use)

**Test Target**: https://craftyprep.demosrv.uk

---

### axe-core (Playwright plugin)
**Status**: ⚠️ TO BE VERIFIED

**Used For**:
- Automated accessibility testing
- WCAG 2.2 AAA compliance

**Installation** (if not present):
```bash
npm install --save-dev @axe-core/playwright
```

**Risk**: Low (standard accessibility testing tool)

---

## Dependency Installation Plan

### Phase 0: Pre-Implementation (Before Phase 1)

**Required Installations**:
1. ✅ Verify shadcn/ui Collapsible installed
   ```bash
   npx shadcn-ui@latest add collapsible
   ```

2. ✅ Install Lucide React icons
   ```bash
   npm install lucide-react
   ```

3. ✅ Verify axe-core Playwright plugin
   ```bash
   npm install --save-dev @axe-core/playwright
   ```

**Estimated Time**: 15 minutes

---

## Dependency Risk Matrix

| Dependency | Status | Risk Level | Mitigation |
|------------|--------|------------|------------|
| React 19 | ✅ Installed | None | N/A |
| Tailwind CSS 4 | ✅ Configured | None | N/A |
| shadcn/ui Button | ✅ Installed | None | N/A |
| shadcn/ui DropdownMenu | ✅ Installed | None | N/A |
| shadcn/ui Collapsible | ⚠️ Verify | Low | Install if missing |
| Lucide Icons | ⚠️ Install | Medium | Install early in Phase 2 |
| localStorage API | ✅ Native | Low | Graceful fallback |
| ResizeObserver API | ✅ Native | Low | Polyfill if needed |
| axe-core | ⚠️ Verify | Low | Install if missing |
| ImageCanvas | ✅ Exists | Low | Minimal changes |
| ZoomControls | ✅ Exists | Low | Position change only |
| RefinementControls | ✅ Exists | Medium | Test responsive behavior |
| task-023 Design System | ✅ Complete | None | N/A |

**Overall Risk**: LOW - Most dependencies already in place

---

## Dependency Graph

```
task-024 (Modern Image Editor Layout)
│
├── UPSTREAM (Required before starting)
│   └── ✅ task-023 (Design System)
│
├── EXTERNAL (Install before implementation)
│   ├── ✅ React 19
│   ├── ✅ Tailwind CSS 4
│   ├── ✅ shadcn/ui (Button, DropdownMenu, Separator, Tooltip)
│   ├── ⚠️ shadcn/ui Collapsible (verify/install)
│   ├── ⚠️ Lucide React (install)
│   ├── ✅ localStorage API (browser)
│   ├── ✅ ResizeObserver API (browser)
│   └── ⚠️ axe-core Playwright (verify/install)
│
├── INTERNAL (Existing components)
│   ├── ✅ ImageCanvas
│   ├── ✅ ZoomControls
│   ├── ✅ RefinementControls
│   ├── ✅ MaterialPresetSelector
│   ├── ✅ UndoRedoButtons
│   ├── ✅ AutoPrepButton
│   ├── ✅ FileUploadComponent
│   └── ✅ DownloadButton
│
└── DOWNSTREAM (Blocked until task-024 complete)
    ├── ⏳ task-025 (Control Panel Redesign)
    ├── ⏳ task-026 (Enhanced Sliders)
    └── ⏳ task-027 (Theme System - minor dependency)
```

---

## Critical Path

1. **MUST COMPLETE FIRST**: task-023 (Design System) ✅ DONE
2. **INSTALL BEFORE CODING**: Lucide icons, verify Collapsible, verify axe-core
3. **IMPLEMENT**: task-024 (this task)
4. **BLOCKED UNTIL COMPLETE**: task-025, task-026

**Estimated Setup Time**: 15 minutes (installations)
**Estimated Implementation Time**: 14 hours (as per plan)

---

## Dependency Checklist

**Before Starting Phase 1**:
- [x] task-023 committed
- [ ] Lucide React installed
- [ ] shadcn/ui Collapsible verified/installed
- [ ] axe-core Playwright verified/installed
- [ ] All existing components reviewed
- [ ] localStorage API tested in browser
- [ ] ResizeObserver API tested in browser

**Before Starting Phase 9 (E2E Testing)**:
- [ ] Playwright configured
- [ ] Test environment (https://craftyprep.demosrv.uk) accessible
- [ ] axe-core integrated with Playwright

---

**Status**: DOCUMENTED
**Ready for**: Pre-implementation setup
