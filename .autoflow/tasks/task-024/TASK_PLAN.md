# Task Plan: Modern Image Editor Layout (Toolbar, Canvas, Panels)

**Task ID**: task-024
**Status**: PLANNED
**Priority**: HIGH
**Estimated Hours**: 14
**Sprint**: Sprint 4 (Professional UI/UX Polish)

---

## Overview

Transform CraftyPrep from a basic single-column layout into a professional image editor with dedicated areas for tools, canvas, properties, and status information. This task establishes the foundational layout structure that subsequent UI/UX tasks will build upon.

**Current State**: Basic vertical stack layout with all controls in a single column
**Target State**: Professional multi-panel layout with toolbar, sidebar, canvas area, properties panel, and status bar

---

## Dependencies

### Upstream Dependencies
- ✅ task-023: UI/UX Audit and Design System (COMMITTED)
  - Design tokens and theme system established
  - Component patterns defined
  - Accessibility standards documented

### Downstream Dependencies
- task-025: Professional Control Panel Redesign (depends on right panel structure)
- task-026: Enhanced Slider and Input Components (depends on panel layout)
- task-027: Dark/Light Theme System (depends on layout components)

### External Dependencies
- React 19 (already installed)
- Tailwind CSS 4 (already configured)
- shadcn/ui components (already installed)
- localStorage API (browser native)

---

## Architecture

### Layout Structure

```
┌───────────────────────────────────────────────────────────────┐
│                        Top Toolbar                             │
│  [File] [Edit] [View] | [Undo] [Redo] | [Zoom] [100%] [▼]    │
├────┬──────────────────────────────────────────────────┬────────┤
│    │                                                  │        │
│ L  │              Center Canvas Area                 │  Right │
│ e  │                                                  │  Panel │
│ f  │         ┌────────────────────────┐              │        │
│ t  │         │                        │              │  Props │
│    │         │   Image Canvas         │              │        │
│ S  │         │   (scrollable)         │              │  Adj.  │
│ i  │         │                        │              │        │
│ d  │         └────────────────────────┘              │  Layer │
│ e  │                                                  │        │
│    │              [Canvas Controls]                  │        │
│    │                                                  │        │
├────┴──────────────────────────────────────────────────┴────────┤
│  Status: Ready | Dimensions: 1920×1080 | Zoom: 100% | Tips    │
└───────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
EditorLayout
├── TopToolbar
│   ├── FileMenu (Upload, Download, Clear)
│   ├── EditMenu (Undo, Redo, Reset)
│   ├── ViewMenu (Show/Hide panels, Zoom)
│   └── ZoomControl
├── LeftSidebar
│   ├── ToolButton (Auto-Prep)
│   ├── ToolButton (Crop - future)
│   ├── ToolButton (Text - future)
│   └── ToolButton (Filters)
├── CenterCanvas
│   ├── CanvasContainer (scrollable)
│   │   └── ImageCanvas (existing component)
│   └── CanvasControls
│       └── ZoomControls (existing component)
├── RightPanel
│   ├── PropertiesSection (collapsible)
│   ├── AdjustmentsSection (collapsible)
│   │   ├── MaterialPresetSelector
│   │   ├── BrightnessSlider
│   │   ├── ContrastSlider
│   │   ├── ThresholdSlider
│   │   └── BackgroundRemovalControl
│   └── LayersSection (collapsible - future)
└── StatusBar
    ├── StatusMessage
    ├── ImageDimensions
    ├── ZoomLevel
    └── ContextualTips
```

### Responsive Breakpoints

- **Mobile (< 768px)**: Stacked layout, collapsible panels
- **Tablet (768px - 1023px)**: Top toolbar, main content, floating panels
- **Desktop (≥ 1024px)**: Full multi-panel layout as shown above

### State Management

**Layout State (localStorage)**:
```typescript
interface LayoutPreferences {
  leftSidebarVisible: boolean;
  rightPanelVisible: boolean;
  rightPanelWidth: number; // 300-600px, default 400px
  statusBarVisible: boolean;
  expandedSections: {
    properties: boolean;
    adjustments: boolean;
    layers: boolean;
  };
}
```

---

## Implementation Plan

### Phase 1: Layout Infrastructure (TDD)

**Goal**: Create layout shell with panel visibility and resize

#### 1.1 EditorLayout Component
**Test First** (`EditorLayout.test.tsx`):
- ✅ Renders with all panels visible by default
- ✅ Top toolbar is always visible
- ✅ Left sidebar can be toggled
- ✅ Right panel can be toggled
- ✅ Status bar can be toggled
- ✅ Layout preferences persist to localStorage
- ✅ Restores layout preferences on mount
- ✅ Responsive: switches to mobile layout at <768px
- ✅ Keyboard shortcut: Ctrl+B toggles left sidebar
- ✅ Keyboard shortcut: Ctrl+1 toggles right panel

**Implementation** (`EditorLayout.tsx`):
```typescript
interface EditorLayoutProps {
  children: {
    toolbar: ReactNode;
    leftSidebar: ReactNode;
    canvas: ReactNode;
    rightPanel: ReactNode;
    statusBar: ReactNode;
  };
}

export function EditorLayout({ children }: EditorLayoutProps) {
  const [leftVisible, setLeftVisible] = useState(true);
  const [rightVisible, setRightVisible] = useState(true);
  const [statusVisible, setStatusVisible] = useState(true);

  // Load from localStorage
  // Setup keyboard shortcuts
  // Save to localStorage on change

  return (
    <div className="h-screen flex flex-col">
      {/* Toolbar */}
      {/* Main content with grid */}
      {/* Status bar */}
    </div>
  );
}
```

**Files Created**:
- `src/components/layout/EditorLayout.tsx`
- `src/tests/unit/components/layout/EditorLayout.test.tsx`

---

#### 1.2 ResizablePanel Component
**Test First** (`ResizablePanel.test.tsx`):
- ✅ Renders with default width
- ✅ Can be resized by dragging handle
- ✅ Respects min/max width constraints (min: 200px, max: 600px)
- ✅ Saves width to localStorage on resize complete
- ✅ Restores width from localStorage on mount
- ✅ Accessible: handle has proper ARIA labels
- ✅ Keyboard: Left/Right arrows resize panel (10px increments)
- ✅ Touch-friendly: handle is ≥44px wide

**Implementation** (`ResizablePanel.tsx`):
```typescript
interface ResizablePanelProps {
  children: ReactNode;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  storageKey: string;
  position: 'left' | 'right';
}

export function ResizablePanel({
  children,
  defaultWidth = 400,
  minWidth = 200,
  maxWidth = 600,
  storageKey,
  position
}: ResizablePanelProps) {
  const [width, setWidth] = useState(defaultWidth);

  // Mouse/touch drag handlers
  // Keyboard resize handlers
  // localStorage persistence

  return (
    <div style={{ width }}>
      {children}
      <div
        className="resize-handle"
        role="separator"
        aria-valuenow={width}
        aria-valuemin={minWidth}
        aria-valuemax={maxWidth}
      />
    </div>
  );
}
```

**Files Created**:
- `src/components/layout/ResizablePanel.tsx`
- `src/tests/unit/components/layout/ResizablePanel.test.tsx`

---

### Phase 2: Toolbar Components (TDD)

#### 2.1 TopToolbar Component
**Test First** (`TopToolbar.test.tsx`):
- ✅ Renders all menu groups (File, Edit, View, Zoom)
- ✅ File menu contains: Upload, Download, Clear
- ✅ Edit menu contains: Undo, Redo, Reset
- ✅ View menu contains: Toggle panels, Zoom options
- ✅ Zoom control displays current zoom level
- ✅ Zoom dropdown has presets: 25%, 50%, 75%, 100%, 150%, 200%
- ✅ Undo/Redo buttons disabled when unavailable
- ✅ All buttons have tooltips on hover
- ✅ Keyboard: Alt+F opens File menu, Alt+E opens Edit, Alt+V opens View
- ✅ Mobile: Collapses to hamburger menu at <768px

**Implementation** (`TopToolbar.tsx`):
```typescript
interface TopToolbarProps {
  onUpload: () => void;
  onDownload: () => void;
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onToggleLeftSidebar: () => void;
  onToggleRightPanel: () => void;
  onToggleStatusBar: () => void;
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
}

export function TopToolbar(props: TopToolbarProps) {
  return (
    <div className="border-b bg-background">
      <div className="flex items-center justify-between px-4 py-2">
        {/* File menu */}
        {/* Edit menu */}
        {/* View menu */}
        {/* Zoom control */}
      </div>
    </div>
  );
}
```

**Files Created**:
- `src/components/layout/TopToolbar.tsx`
- `src/tests/unit/components/layout/TopToolbar.test.tsx`

---

#### 2.2 ToolbarMenu Component (Reusable)
**Test First** (`ToolbarMenu.test.tsx`):
- ✅ Renders trigger button with label
- ✅ Opens dropdown on click
- ✅ Closes on item click
- ✅ Closes on Escape key
- ✅ Keyboard navigation: Arrow keys move between items
- ✅ Keyboard: Enter activates item
- ✅ Items can have icons
- ✅ Items can be disabled
- ✅ Dividers supported between item groups
- ✅ Accessible: Proper ARIA roles and labels

**Implementation**: Use shadcn/ui `DropdownMenu` component with custom styling

**Files Created**:
- `src/components/layout/ToolbarMenu.tsx`
- `src/tests/unit/components/layout/ToolbarMenu.test.tsx`

---

### Phase 3: Sidebar and Canvas (TDD)

#### 3.1 LeftSidebar Component
**Test First** (`LeftSidebar.test.tsx`):
- ✅ Renders tool buttons vertically
- ✅ Auto-Prep tool button visible
- ✅ Tool buttons have icons and tooltips
- ✅ Active tool highlighted
- ✅ Disabled tools grayed out
- ✅ Keyboard: Tab navigation between tools
- ✅ Keyboard: Enter/Space activates tool
- ✅ Touch-friendly: Buttons ≥44px × 44px
- ✅ Mobile: Full width at <768px

**Implementation** (`LeftSidebar.tsx`):
```typescript
interface Tool {
  id: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  tooltip?: string;
}

interface LeftSidebarProps {
  tools: Tool[];
  activeTool?: string;
}

export function LeftSidebar({ tools, activeTool }: LeftSidebarProps) {
  return (
    <div className="flex flex-col gap-2 p-2 border-r bg-background">
      {tools.map(tool => (
        <ToolButton key={tool.id} {...tool} active={tool.id === activeTool} />
      ))}
    </div>
  );
}
```

**Files Created**:
- `src/components/layout/LeftSidebar.tsx`
- `src/tests/unit/components/layout/LeftSidebar.test.tsx`

---

#### 3.2 CanvasArea Component
**Test First** (`CanvasArea.test.tsx`):
- ✅ Renders canvas container with scrollbars
- ✅ Centers canvas content when smaller than container
- ✅ Shows scrollbars when canvas larger than container
- ✅ Zoom controls positioned at bottom-right
- ✅ Keyboard: Space+drag pans canvas
- ✅ Mouse: Middle-click+drag pans canvas
- ✅ Touch: Two-finger pan
- ✅ Checkerboard background for transparency
- ✅ Canvas container fills available space

**Implementation** (`CanvasArea.tsx`):
```typescript
interface CanvasAreaProps {
  children: ReactNode; // ImageCanvas component
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
}

export function CanvasArea({ children, zoomLevel, onZoomChange }: CanvasAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Pan/scroll handlers
  // Keyboard shortcuts for pan

  return (
    <div
      ref={containerRef}
      className="relative flex-1 overflow-auto bg-checkerboard"
    >
      <div className="min-h-full flex items-center justify-center p-4">
        {children}
      </div>
      <div className="absolute bottom-4 right-4">
        <ZoomControls zoom={zoomLevel} onZoomChange={onZoomChange} />
      </div>
    </div>
  );
}
```

**Files Created**:
- `src/components/layout/CanvasArea.tsx`
- `src/tests/unit/components/layout/CanvasArea.test.tsx`

---

### Phase 4: Right Panel (TDD)

#### 4.1 RightPanel Component
**Test First** (`RightPanel.test.tsx`):
- ✅ Renders collapsible sections
- ✅ Section headers have expand/collapse icons
- ✅ Sections can be expanded/collapsed by clicking header
- ✅ Keyboard: Enter/Space toggles section
- ✅ Section state persists to localStorage
- ✅ Restores section state on mount
- ✅ Smooth expand/collapse animation (200ms)
- ✅ Sections can have custom icons
- ✅ Empty sections show placeholder text
- ✅ Accessible: ARIA expanded state

**Implementation** (`RightPanel.tsx`):
```typescript
interface PanelSection {
  id: string;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultExpanded?: boolean;
}

interface RightPanelProps {
  sections: PanelSection[];
}

export function RightPanel({ sections }: RightPanelProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Load from localStorage
  // Save on toggle

  return (
    <div className="flex flex-col border-l bg-background overflow-y-auto">
      {sections.map(section => (
        <CollapsibleSection
          key={section.id}
          {...section}
          expanded={expanded[section.id]}
          onToggle={() => toggleSection(section.id)}
        />
      ))}
    </div>
  );
}
```

**Files Created**:
- `src/components/layout/RightPanel.tsx`
- `src/components/layout/CollapsibleSection.tsx`
- `src/tests/unit/components/layout/RightPanel.test.tsx`
- `src/tests/unit/components/layout/CollapsibleSection.test.tsx`

---

### Phase 5: Status Bar (TDD)

#### 5.1 StatusBar Component
**Test First** (`StatusBar.test.tsx`):
- ✅ Displays status message (Ready, Processing, Error)
- ✅ Shows image dimensions when image loaded
- ✅ Shows current zoom level
- ✅ Shows contextual tips based on current tool
- ✅ Status updates in real-time
- ✅ Error messages have error styling
- ✅ Processing status has loading indicator
- ✅ Accessible: Status updates announced to screen readers (aria-live)
- ✅ Mobile: Truncates long messages with ellipsis

**Implementation** (`StatusBar.tsx`):
```typescript
interface StatusBarProps {
  status: 'ready' | 'processing' | 'error';
  message?: string;
  imageDimensions?: { width: number; height: number };
  zoomLevel: number;
  tip?: string;
}

export function StatusBar({
  status,
  message,
  imageDimensions,
  zoomLevel,
  tip
}: StatusBarProps) {
  return (
    <div
      className="border-t bg-background px-4 py-2 text-sm"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <StatusMessage status={status} message={message} />
          {imageDimensions && (
            <span>Dimensions: {imageDimensions.width} × {imageDimensions.height}px</span>
          )}
          <span>Zoom: {zoomLevel}%</span>
        </div>
        {tip && <span className="text-muted-foreground">{tip}</span>}
      </div>
    </div>
  );
}
```

**Files Created**:
- `src/components/layout/StatusBar.tsx`
- `src/tests/unit/components/layout/StatusBar.test.tsx`

---

### Phase 6: Integration and Persistence (TDD)

#### 6.1 useLayoutPreferences Hook
**Test First** (`useLayoutPreferences.test.tsx`):
- ✅ Returns default preferences when localStorage empty
- ✅ Loads preferences from localStorage on mount
- ✅ Saves preferences to localStorage on change
- ✅ Validates stored data (ignores corrupt data)
- ✅ Handles localStorage errors gracefully
- ✅ Debounces saves (300ms) to avoid excessive writes
- ✅ Provides reset function to restore defaults

**Implementation** (`useLayoutPreferences.ts`):
```typescript
interface LayoutPreferences {
  leftSidebarVisible: boolean;
  rightPanelVisible: boolean;
  rightPanelWidth: number;
  statusBarVisible: boolean;
  expandedSections: Record<string, boolean>;
}

const DEFAULT_PREFERENCES: LayoutPreferences = {
  leftSidebarVisible: true,
  rightPanelVisible: true,
  rightPanelWidth: 400,
  statusBarVisible: true,
  expandedSections: {
    properties: true,
    adjustments: true,
    layers: false,
  },
};

export function useLayoutPreferences() {
  const [prefs, setPrefs] = useState<LayoutPreferences>(DEFAULT_PREFERENCES);

  // Load from localStorage
  // Save to localStorage (debounced)
  // Validation

  return {
    preferences: prefs,
    updatePreferences: setPrefs,
    resetPreferences: () => setPrefs(DEFAULT_PREFERENCES),
  };
}
```

**Files Created**:
- `src/hooks/useLayoutPreferences.ts`
- `src/tests/unit/hooks/useLayoutPreferences.test.tsx`

---

#### 6.2 Layout Integration into App.tsx
**Test First** (`App.integration.test.tsx`):
- ✅ App renders with new EditorLayout
- ✅ Toolbar contains all expected menus
- ✅ Left sidebar shows Auto-Prep tool
- ✅ Canvas area renders ImageCanvas
- ✅ Right panel shows adjustment controls
- ✅ Status bar shows "Ready" initially
- ✅ Upload triggers file upload flow
- ✅ Auto-Prep updates status to "Processing"
- ✅ Status bar shows image dimensions after upload
- ✅ Panel toggles persist across page reload
- ✅ Responsive: Mobile layout works at <768px

**Implementation**: Refactor `App.tsx` to use new layout structure

**Files Modified**:
- `src/App.tsx`
- `src/tests/integration/App.integration.test.tsx` (new)

---

### Phase 7: Responsive Design (TDD)

#### 7.1 Mobile Layout Component
**Test First** (`MobileLayout.test.tsx`):
- ✅ Renders hamburger menu at <768px
- ✅ Hamburger menu opens drawer with navigation
- ✅ Drawer contains: Upload, Auto-Prep, Adjustments, Download
- ✅ Drawer closes on item selection
- ✅ Drawer closes on backdrop click
- ✅ Drawer closes on Escape key
- ✅ Canvas takes full width
- ✅ Adjustments panel floats over canvas when opened
- ✅ Status bar sticks to bottom
- ✅ Accessible: Focus trap in drawer

**Implementation**: Conditional rendering in `EditorLayout.tsx` based on screen size

**Files Modified**:
- `src/components/layout/EditorLayout.tsx`
- `src/tests/unit/components/layout/EditorLayout.test.tsx`

---

### Phase 8: Keyboard Shortcuts and Accessibility (TDD)

#### 8.1 Keyboard Shortcut System
**Test First** (`useKeyboardShortcuts.test.tsx`):
- ✅ Ctrl+B toggles left sidebar
- ✅ Ctrl+1 toggles right panel
- ✅ Ctrl+H toggles status bar
- ✅ Alt+F opens File menu
- ✅ Alt+E opens Edit menu
- ✅ Alt+V opens View menu
- ✅ Ctrl+Z triggers undo
- ✅ Ctrl+Y triggers redo
- ✅ Space+drag pans canvas
- ✅ Escape closes open menus/dialogs
- ✅ Shortcuts don't trigger when typing in inputs
- ✅ Mac: Uses Cmd instead of Ctrl

**Implementation** (`useKeyboardShortcuts.ts`):
```typescript
interface KeyboardShortcuts {
  [key: string]: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if typing in input
      if (isTypingInInput(e.target)) return;

      // Build shortcut key (e.g., "Ctrl+B", "Alt+F")
      const key = buildShortcutKey(e);

      // Execute if shortcut registered
      if (shortcuts[key]) {
        e.preventDefault();
        shortcuts[key]();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
```

**Files Created**:
- `src/hooks/useKeyboardShortcuts.ts`
- `src/tests/unit/hooks/useKeyboardShortcuts.test.tsx`

---

#### 8.2 Accessibility Audit
**Test First** (`accessibility.test.tsx`):
- ✅ All interactive elements have ARIA labels
- ✅ Toolbar menus have proper ARIA roles
- ✅ Panel sections have aria-expanded state
- ✅ Status bar has aria-live region
- ✅ Keyboard focus visible on all elements (3px outline)
- ✅ Tab order is logical (toolbar → sidebar → canvas → panel → status)
- ✅ Focus trap in modal dialogs
- ✅ Skip link to main content
- ✅ Color contrast ≥7:1 for text (AAA)
- ✅ All functionality accessible via keyboard
- ✅ Screen reader announces panel state changes
- ✅ Lighthouse accessibility score ≥95

**Implementation**: Review and fix accessibility issues across all components

---

### Phase 9: E2E Testing (Playwright)

#### 9.1 Layout Interaction Tests
**Test File** (`layout.e2e.test.ts`):
```typescript
test.describe('Editor Layout', () => {
  test('should toggle left sidebar with Ctrl+B', async ({ page }) => {
    await page.goto('https://craftyprep.demosrv.uk');

    // Sidebar visible initially
    await expect(page.locator('[data-testid="left-sidebar"]')).toBeVisible();

    // Toggle with keyboard shortcut
    await page.keyboard.press('Control+b');
    await expect(page.locator('[data-testid="left-sidebar"]')).toBeHidden();

    // Toggle again
    await page.keyboard.press('Control+b');
    await expect(page.locator('[data-testid="left-sidebar"]')).toBeVisible();
  });

  test('should resize right panel', async ({ page }) => {
    await page.goto('https://craftyprep.demosrv.uk');

    const panel = page.locator('[data-testid="right-panel"]');
    const handle = page.locator('[data-testid="resize-handle"]');

    // Get initial width
    const initialWidth = await panel.evaluate(el => el.clientWidth);

    // Drag handle to resize
    await handle.dragTo(handle, { targetPosition: { x: -100, y: 0 } });

    // Verify width changed
    const newWidth = await panel.evaluate(el => el.clientWidth);
    expect(newWidth).toBeLessThan(initialWidth);
  });

  test('should persist layout preferences', async ({ page, context }) => {
    await page.goto('https://craftyprep.demosrv.uk');

    // Toggle panel
    await page.keyboard.press('Control+1');
    await expect(page.locator('[data-testid="right-panel"]')).toBeHidden();

    // Reload page
    await page.reload();

    // Panel should still be hidden
    await expect(page.locator('[data-testid="right-panel"]')).toBeHidden();
  });

  test('should switch to mobile layout on small screen', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://craftyprep.demosrv.uk');

    // Hamburger menu visible
    await expect(page.locator('[data-testid="hamburger-menu"]')).toBeVisible();

    // Desktop toolbar hidden
    await expect(page.locator('[data-testid="desktop-toolbar"]')).toBeHidden();
  });

  test('should open File menu with Alt+F', async ({ page }) => {
    await page.goto('https://craftyprep.demosrv.uk');

    // Press Alt+F
    await page.keyboard.press('Alt+f');

    // File menu visible
    await expect(page.locator('[role="menu"]')).toBeVisible();
    await expect(page.locator('text=Upload')).toBeVisible();
  });

  test('should show contextual tips in status bar', async ({ page }) => {
    await page.goto('https://craftyprep.demosrv.uk');

    // Initial tip
    await expect(page.locator('[data-testid="status-tip"]')).toContainText('Upload an image to get started');

    // Upload image
    await page.setInputFiles('input[type="file"]', 'tests/fixtures/sample.jpg');

    // Tip changes
    await expect(page.locator('[data-testid="status-tip"]')).toContainText('Click Auto-Prep to process');
  });
});
```

**Files Created**:
- `src/tests/e2e/layout.e2e.test.ts`

---

## Testing Strategy

### Unit Tests (Vitest)
**Target Coverage**: ≥80% for all components

**Test Files**:
1. `EditorLayout.test.tsx` - Layout shell, panel visibility, responsiveness
2. `ResizablePanel.test.tsx` - Resize logic, constraints, persistence
3. `TopToolbar.test.tsx` - Menu rendering, interactions, keyboard shortcuts
4. `ToolbarMenu.test.tsx` - Dropdown behavior, keyboard navigation
5. `LeftSidebar.test.tsx` - Tool buttons, active state, tooltips
6. `CanvasArea.test.tsx` - Canvas container, scrolling, pan controls
7. `RightPanel.test.tsx` - Collapsible sections, persistence
8. `CollapsibleSection.test.tsx` - Expand/collapse animation
9. `StatusBar.test.tsx` - Status display, dimensions, tips
10. `useLayoutPreferences.test.tsx` - Persistence hook logic
11. `useKeyboardShortcuts.test.tsx` - Shortcut registration and execution

**Total Unit Tests**: ~55 tests

---

### Integration Tests (Vitest)
**Test Files**:
1. `App.integration.test.tsx` - Full layout integration with existing features
2. `LayoutPersistence.integration.test.tsx` - localStorage persistence across components

**Total Integration Tests**: ~10 tests

---

### E2E Tests (Playwright)
**Test Files**:
1. `layout.e2e.test.ts` - Layout interactions, responsiveness, persistence

**Total E2E Tests**: ~6 tests

---

### Accessibility Tests (axe-core via Playwright)
**Test Files**:
1. `accessibility.test.ts` - WCAG 2.2 AAA compliance

**Lighthouse Targets**:
- Accessibility: ≥95/100
- Performance: ≥90/100

---

## File Structure

```
src/
├── components/
│   └── layout/
│       ├── EditorLayout.tsx          (NEW)
│       ├── TopToolbar.tsx            (NEW)
│       ├── ToolbarMenu.tsx           (NEW)
│       ├── LeftSidebar.tsx           (NEW)
│       ├── CanvasArea.tsx            (NEW)
│       ├── RightPanel.tsx            (NEW)
│       ├── CollapsibleSection.tsx    (NEW)
│       ├── StatusBar.tsx             (NEW)
│       └── ResizablePanel.tsx        (NEW)
├── hooks/
│   ├── useLayoutPreferences.ts       (NEW)
│   └── useKeyboardShortcuts.ts       (NEW)
├── lib/
│   └── utils/
│       └── layoutStorage.ts          (NEW)
├── App.tsx                            (MODIFIED)
└── tests/
    ├── unit/
    │   ├── components/
    │   │   └── layout/
    │   │       ├── EditorLayout.test.tsx
    │   │       ├── TopToolbar.test.tsx
    │   │       ├── ToolbarMenu.test.tsx
    │   │       ├── LeftSidebar.test.tsx
    │   │       ├── CanvasArea.test.tsx
    │   │       ├── RightPanel.test.tsx
    │   │       ├── CollapsibleSection.test.tsx
    │   │       ├── StatusBar.test.tsx
    │   │       └── ResizablePanel.test.tsx
    │   └── hooks/
    │       ├── useLayoutPreferences.test.tsx
    │       └── useKeyboardShortcuts.test.tsx
    ├── integration/
    │   ├── App.integration.test.tsx
    │   └── LayoutPersistence.integration.test.tsx
    └── e2e/
        ├── layout.e2e.test.ts
        └── accessibility.test.ts
```

**Total New Files**: 23
**Modified Files**: 1 (App.tsx)

---

## Acceptance Criteria Validation

### Functional Requirements
- [x] Top toolbar with icon buttons and dropdowns → TopToolbar component
- [x] Left sidebar with tool selection (vertical) → LeftSidebar component
- [x] Center canvas with proper sizing and scrollbars → CanvasArea component
- [x] Right panel with collapsible sections → RightPanel + CollapsibleSection
- [x] Bottom status bar with contextual information → StatusBar component
- [x] Responsive behavior for tablet/mobile → MobileLayout logic in EditorLayout
- [x] Panel resize/collapse functionality → ResizablePanel component
- [x] Layout persists in localStorage → useLayoutPreferences hook

### Accessibility Requirements (WCAG 2.2 AAA)
- [x] Keyboard navigation for all controls
- [x] ARIA labels and roles
- [x] Focus indicators (3px outline, ≥3:1 contrast)
- [x] Color contrast ≥7:1 (normal text), ≥4.5:1 (large text)
- [x] Screen reader support (aria-live regions)
- [x] Touch targets ≥44px × 44px
- [x] Respects prefers-reduced-motion

### Performance Requirements
- [x] Smooth panel transitions (200-300ms)
- [x] Debounced localStorage saves (300ms)
- [x] No layout shift during resize
- [x] Canvas rendering stays responsive

---

## Risk Assessment

### High Risk
1. **ResizablePanel Performance**: Dragging must be smooth (60fps)
   - **Mitigation**: Use CSS transforms, throttle drag events, requestAnimationFrame

2. **Layout Shift on Panel Toggle**: Content must not jump
   - **Mitigation**: Use CSS grid with fixed gaps, transition width/visibility separately

### Medium Risk
3. **localStorage Quota**: Layout preferences + custom presets + settings
   - **Mitigation**: Validate size before save, graceful fallback to defaults

4. **Responsive Breakpoint Timing**: Layout switches during resize
   - **Mitigation**: Debounce resize events, use CSS media queries for critical layout

### Low Risk
5. **Keyboard Shortcut Conflicts**: Browser shortcuts vs. app shortcuts
   - **Mitigation**: Use Alt/Ctrl modifiers, document shortcuts, allow customization

---

## Performance Considerations

### Optimization Strategies
1. **Lazy Load Panels**: Don't render hidden panel content
2. **Memoize Layout Components**: Prevent unnecessary re-renders
3. **CSS Transitions**: Use transform/opacity for smooth animations
4. **Debounce Resize**: Throttle resize handler to 16ms (60fps)
5. **Virtual Scrolling**: If panel content becomes large (future)

### Performance Budgets
- Panel toggle: <100ms
- Resize drag: 60fps (16ms per frame)
- localStorage save: <50ms
- Initial render: <200ms

---

## Security Considerations

### localStorage Security
- **Validate all data** from localStorage before use
- **Sanitize values** (e.g., panel width must be number within range)
- **Handle corruption** gracefully (fallback to defaults)
- **No sensitive data** (layout preferences only)

### XSS Prevention
- **Sanitize status messages** (use textContent, not innerHTML)
- **Validate user input** (panel width, section IDs)

---

## Documentation Requirements

### Code Documentation
- [x] JSDoc comments on all public APIs
- [x] Inline comments for complex logic
- [x] README for layout system

### User Documentation
- [x] Keyboard shortcuts reference (in help menu)
- [x] Layout customization guide (in help panel)

---

## Definition of Done

### Code Quality
- ✅ All tests passing (unit + integration + E2E)
- ✅ Test coverage ≥80%
- ✅ No TypeScript errors
- ✅ No ESLint warnings
- ✅ Code reviewed (passes /code-review)

### Functionality
- ✅ All acceptance criteria met
- ✅ Layout works on Chrome, Firefox, Safari, Edge
- ✅ Responsive layout works on mobile, tablet, desktop
- ✅ Keyboard shortcuts functional
- ✅ Panel resize smooth and functional
- ✅ Layout preferences persist correctly

### Accessibility
- ✅ Lighthouse accessibility score ≥95
- ✅ WCAG 2.2 AAA compliant
- ✅ Screen reader tested (NVDA/VoiceOver)
- ✅ Keyboard navigation tested
- ✅ Color contrast validated

### Performance
- ✅ Lighthouse performance score ≥90
- ✅ Panel animations smooth (no jank)
- ✅ No layout shift during interactions
- ✅ localStorage operations fast (<50ms)

### Documentation
- ✅ Code documented
- ✅ Keyboard shortcuts documented
- ✅ Layout customization guide written

---

## Estimated Breakdown

| Phase | Description | Hours |
|-------|-------------|-------|
| 1 | Layout Infrastructure (EditorLayout, ResizablePanel) | 2.5 |
| 2 | Toolbar Components (TopToolbar, ToolbarMenu) | 2.0 |
| 3 | Sidebar and Canvas (LeftSidebar, CanvasArea) | 2.0 |
| 4 | Right Panel (RightPanel, CollapsibleSection) | 2.0 |
| 5 | Status Bar | 1.0 |
| 6 | Integration and Persistence (useLayoutPreferences) | 1.5 |
| 7 | Responsive Design (Mobile Layout) | 1.5 |
| 8 | Keyboard Shortcuts and Accessibility | 1.0 |
| 9 | E2E Testing (Playwright) | 0.5 |
| **Total** | | **14.0** |

---

## Next Steps After Completion

1. ✅ Mark task-024 as COMPLETE
2. ✅ Run /commit to archive task
3. ✅ Begin task-025: Professional Control Panel Redesign
4. ✅ Begin task-026: Enhanced Slider and Input Components

---

## References

- FUNCTIONAL.md - Feature 5: Responsive User Interface
- ARCHITECTURE.md - Component Architecture
- Design System (task-023) - Theme tokens and component patterns
- ACCESSIBILITY.md - WCAG 2.2 AAA requirements

---

**Plan Status**: COMPLETE
**Ready for**: /build
