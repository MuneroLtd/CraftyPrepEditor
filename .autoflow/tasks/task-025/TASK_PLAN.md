# Task Plan: Professional Control Panel Redesign

## Objective

Transform the flat, basic control panel into a professional, grouped panel system with collapsible sections, visual hierarchy, and state persistence. This redesign will enhance usability, organization, and visual polish while maintaining full accessibility (WCAG 2.2 AAA) and all existing functionality.

## Approach

Following TDD methodology with focus on component composition, state management, and accessibility. All controls will be logically grouped into collapsible accordion sections with professional styling using existing design tokens. Panel state (expanded/collapsed) will persist across sessions using localStorage.

## Architecture Rules

1. **Component Composition**: Reuse all existing control components (BrightnessSlider, ContrastSlider, etc.) within new panel structure - no duplication
2. **Single Source of Truth**: ControlPanel component manages accordion state, passes down to children
3. **Separation of Concerns**: Panel layout separate from control logic
4. **State Persistence**: Centralized localStorage utility for panel state
5. **Accessibility First**: ARIA attributes, keyboard navigation, screen reader support in all components

## Implementation Steps

### Step 1: Add shadcn/ui Accordion Component (0.5 hours)

**1.1 Install Accordion Component**
```bash
cd src
npx shadcn-ui@latest add accordion
```

**1.2 Verify Installation**
- Confirm `src/components/ui/accordion.tsx` exists
- Verify TypeScript types
- Check imports work correctly

**1.3 Write Basic Test**
```typescript
// src/tests/unit/components/ui/accordion.test.tsx
import { render, screen } from '@testing-library/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

describe('Accordion Component', () => {
  it('should render accordion items', () => {
    render(
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByText('Section 1')).toBeInTheDocument();
  });
});
```

### Step 2: Create Panel State Persistence Utility (1 hour)

**2.1 Write Tests First (TDD)**
```typescript
// src/tests/unit/lib/utils/panelStateStorage.test.ts
import { savePanelState, loadPanelState, clearPanelState } from '@/lib/utils/panelStateStorage';

describe('panelStateStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should save panel state to localStorage', () => {
    const state = { adjustments: true, export: false };
    savePanelState(state);
    expect(localStorage.getItem('craftyprep_panel_state')).toBeTruthy();
  });

  it('should load panel state from localStorage', () => {
    const state = { adjustments: true, export: false };
    savePanelState(state);
    const loaded = loadPanelState();
    expect(loaded).toEqual(state);
  });

  it('should return default state if localStorage empty', () => {
    const loaded = loadPanelState();
    expect(loaded).toEqual({
      materialPresets: true,
      backgroundRemoval: true,
      adjustments: true,
      history: true,
      export: true,
      actions: true,
    });
  });

  it('should handle localStorage unavailable gracefully', () => {
    // Mock localStorage to throw error
    const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('localStorage unavailable');
    });
    
    const loaded = loadPanelState();
    expect(loaded).toEqual(/* default state */);
    
    spy.mockRestore();
  });

  it('should validate panel state schema', () => {
    localStorage.setItem('craftyprep_panel_state', 'invalid json');
    const loaded = loadPanelState();
    expect(loaded).toEqual(/* default state */);
  });
});
```

**2.2 Implement Utility**
```typescript
// src/lib/utils/panelStateStorage.ts
export interface PanelState {
  materialPresets: boolean;
  backgroundRemoval: boolean;
  adjustments: boolean;
  history: boolean;
  export: boolean;
  actions: boolean;
}

const STORAGE_KEY = 'craftyprep_panel_state';

const DEFAULT_STATE: PanelState = {
  materialPresets: true,
  backgroundRemoval: true,
  adjustments: true,
  history: true,
  export: true,
  actions: true,
};

export function savePanelState(state: PanelState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save panel state:', error);
  }
}

export function loadPanelState(): PanelState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_STATE;
    
    const parsed = JSON.parse(stored);
    // Validate schema
    if (!isValidPanelState(parsed)) {
      console.warn('Invalid panel state schema, using defaults');
      return DEFAULT_STATE;
    }
    
    return parsed;
  } catch (error) {
    console.warn('Failed to load panel state:', error);
    return DEFAULT_STATE;
  }
}

export function clearPanelState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear panel state:', error);
  }
}

function isValidPanelState(obj: any): obj is PanelState {
  return (
    typeof obj === 'object' &&
    typeof obj.materialPresets === 'boolean' &&
    typeof obj.backgroundRemoval === 'boolean' &&
    typeof obj.adjustments === 'boolean' &&
    typeof obj.history === 'boolean' &&
    typeof obj.export === 'boolean' &&
    typeof obj.actions === 'boolean'
  );
}
```

**2.3 Create Custom Hook**
```typescript
// src/hooks/usePanelState.ts
import { useState, useEffect, useCallback } from 'react';
import { savePanelState, loadPanelState, PanelState } from '@/lib/utils/panelStateStorage';

export function usePanelState() {
  const [state, setState] = useState<PanelState>(loadPanelState);

  const updateSection = useCallback((section: keyof PanelState, expanded: boolean) => {
    setState((prev) => {
      const newState = { ...prev, [section]: expanded };
      savePanelState(newState);
      return newState;
    });
  }, []);

  return { state, updateSection };
}
```

### Step 3: Create ControlPanel Component (3 hours)

**3.1 Write Component Tests First**
```typescript
// src/tests/unit/components/ControlPanel.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ControlPanel } from '@/components/ControlPanel';

describe('ControlPanel Component', () => {
  const mockProps = {
    brightness: 0,
    contrast: 0,
    threshold: 128,
    selectedPreset: 'auto' as const,
    onBrightnessChange: jest.fn(),
    onContrastChange: jest.fn(),
    onThresholdChange: jest.fn(),
    onPresetChange: jest.fn(),
    onReset: jest.fn(),
  };

  it('should render all sections', () => {
    render(<ControlPanel {...mockProps} />);
    expect(screen.getByText('Material Presets')).toBeInTheDocument();
    expect(screen.getByText('Background Removal')).toBeInTheDocument();
    expect(screen.getByText('Adjustments')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('should expand/collapse sections on click', () => {
    render(<ControlPanel {...mockProps} />);
    const trigger = screen.getByText('Adjustments');
    
    // Initially expanded (default state)
    expect(screen.getByText('Brightness')).toBeVisible();
    
    // Collapse
    fireEvent.click(trigger);
    expect(screen.queryByText('Brightness')).not.toBeVisible();
    
    // Expand
    fireEvent.click(trigger);
    expect(screen.getByText('Brightness')).toBeVisible();
  });

  it('should persist state to localStorage', () => {
    render(<ControlPanel {...mockProps} />);
    const trigger = screen.getByText('Adjustments');
    
    fireEvent.click(trigger);
    
    const stored = JSON.parse(localStorage.getItem('craftyprep_panel_state') || '{}');
    expect(stored.adjustments).toBe(false);
  });

  it('should support keyboard navigation', () => {
    render(<ControlPanel {...mockProps} />);
    const trigger = screen.getByText('Adjustments');
    
    trigger.focus();
    expect(trigger).toHaveFocus();
    
    fireEvent.keyDown(trigger, { key: 'Enter' });
    // Section should toggle
  });

  it('should have proper ARIA attributes', () => {
    render(<ControlPanel {...mockProps} />);
    const trigger = screen.getByText('Adjustments');
    
    expect(trigger).toHaveAttribute('aria-expanded');
    expect(trigger).toHaveAttribute('aria-controls');
  });
});
```

**3.2 Implement ControlPanel Component**
```typescript
// src/components/ControlPanel.tsx
import { memo } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { MaterialPresetSelector } from '@/components/MaterialPresetSelector';
import { BackgroundRemovalControl } from '@/components/BackgroundRemovalControl';
import { BrightnessSlider } from '@/components/BrightnessSlider';
import { ContrastSlider } from '@/components/ContrastSlider';
import { ThresholdSlider } from '@/components/ThresholdSlider';
import { UndoRedoButtons } from '@/components/UndoRedoButtons';
import { DownloadButton } from '@/components/DownloadButton';
import { ResetButton } from '@/components/ResetButton';
import { usePanelState } from '@/hooks/usePanelState';
import { SPACING, PANEL } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';
import type { MaterialPresetName } from '@/lib/types/presets';

export interface ControlPanelProps {
  // Material Presets
  selectedPreset: MaterialPresetName;
  onPresetChange: (preset: MaterialPresetName) => void;
  
  // Background Removal
  backgroundRemovalEnabled?: boolean;
  backgroundRemovalSensitivity?: number;
  onBackgroundRemovalToggle?: (enabled: boolean) => void;
  onBackgroundRemovalSensitivityChange?: (value: number) => void;
  
  // Adjustments
  brightness: number;
  contrast: number;
  threshold: number;
  onBrightnessChange: (value: number) => void;
  onContrastChange: (value: number) => void;
  onThresholdChange: (value: number) => void;
  
  // History
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  
  // Export
  canvas?: HTMLCanvasElement | null;
  originalFilename?: string;
  
  // Actions
  onReset?: () => void;
  isResetting?: boolean;
  
  // State
  disabled?: boolean;
  className?: string;
}

export const ControlPanel = memo(function ControlPanel({
  selectedPreset,
  onPresetChange,
  backgroundRemovalEnabled = false,
  backgroundRemovalSensitivity = 128,
  onBackgroundRemovalToggle,
  onBackgroundRemovalSensitivityChange,
  brightness,
  contrast,
  threshold,
  onBrightnessChange,
  onContrastChange,
  onThresholdChange,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  canvas,
  originalFilename,
  onReset,
  isResetting = false,
  disabled = false,
  className,
}: ControlPanelProps) {
  const { state, updateSection } = usePanelState();

  // Convert panel state to accordion value array
  const defaultValue = Object.entries(state)
    .filter(([, expanded]) => expanded)
    .map(([section]) => section);

  const handleValueChange = (value: string[]) => {
    // Update each section's state
    Object.keys(state).forEach((section) => {
      const expanded = value.includes(section);
      if (state[section as keyof typeof state] !== expanded) {
        updateSection(section as keyof typeof state, expanded);
      }
    });
  };

  return (
    <div
      className={cn(
        'rounded-lg border bg-card shadow-sm',
        'p-6 space-y-4',
        className
      )}
      role="region"
      aria-label="Control Panel"
    >
      <h2 className="text-xl font-semibold">Controls</h2>
      
      <Accordion
        type="multiple"
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        className="space-y-2"
      >
        {/* Material Presets Section */}
        <AccordionItem value="materialPresets" className="border rounded-lg">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/50">
            <span className="font-medium">Material Presets</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <MaterialPresetSelector
              value={selectedPreset}
              onChange={onPresetChange}
              disabled={disabled}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Background Removal Section */}
        {onBackgroundRemovalToggle && onBackgroundRemovalSensitivityChange && (
          <AccordionItem value="backgroundRemoval" className="border rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:bg-muted/50">
              <span className="font-medium">Background Removal</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2">
              <BackgroundRemovalControl
                enabled={backgroundRemovalEnabled}
                sensitivity={backgroundRemovalSensitivity}
                onToggle={onBackgroundRemovalToggle}
                onSensitivityChange={onBackgroundRemovalSensitivityChange}
                disabled={disabled}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Adjustments Section */}
        <AccordionItem value="adjustments" className="border rounded-lg">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/50">
            <span className="font-medium">Adjustments</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2 space-y-4">
            <BrightnessSlider
              value={brightness}
              onChange={onBrightnessChange}
              disabled={disabled}
            />
            <ContrastSlider
              value={contrast}
              onChange={onContrastChange}
              disabled={disabled}
            />
            <ThresholdSlider
              value={threshold}
              onChange={onThresholdChange}
              disabled={disabled}
            />
          </AccordionContent>
        </AccordionItem>

        {/* History Section */}
        {onUndo && onRedo && (
          <AccordionItem value="history" className="border rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:bg-muted/50">
              <span className="font-medium">History</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2">
              <UndoRedoButtons
                canUndo={canUndo}
                canRedo={canRedo}
                onUndo={onUndo}
                onRedo={onRedo}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Export Section */}
        {canvas && originalFilename && (
          <AccordionItem value="export" className="border rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:bg-muted/50">
              <span className="font-medium">Export</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2">
              <DownloadButton
                canvas={canvas}
                originalFilename={originalFilename}
                disabled={!canvas}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Actions Section */}
        {onReset && (
          <AccordionItem value="actions" className="border rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:bg-muted/50">
              <span className="font-medium">Actions</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2">
              <ResetButton
                onReset={onReset}
                disabled={disabled}
                loading={isResetting}
              />
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
});
```

### Step 4: Update App.tsx Integration (2 hours)

**4.1 Modify App.tsx to Use ControlPanel**
```typescript
// src/App.tsx (modifications)

// Replace the old RefinementControls section with:
{baselineImageData && (
  <div className="w-full max-w-2xl mx-auto px-4">
    <ControlPanel
      selectedPreset={selectedPreset}
      onPresetChange={handlePresetChange}
      backgroundRemovalEnabled={backgroundRemovalEnabled}
      backgroundRemovalSensitivity={backgroundRemovalSensitivity}
      onBackgroundRemovalToggle={setBackgroundRemovalEnabled}
      onBackgroundRemovalSensitivityChange={setBackgroundRemovalSensitivity}
      brightness={brightness}
      contrast={contrast}
      threshold={threshold}
      onBrightnessChange={handleBrightnessChange}
      onContrastChange={handleContrastChange}
      onThresholdChange={handleThresholdChange}
      canUndo={canUndo}
      canRedo={canRedo}
      onUndo={handleUndo}
      onRedo={handleRedo}
      canvas={processedCanvas}
      originalFilename={selectedFile?.name}
      onReset={handleReset}
      isResetting={isProcessing}
      disabled={isProcessing}
    />
  </div>
)}

// Remove the separate DownloadButton section (now integrated in ControlPanel)
```

**4.2 Update Tests**
```typescript
// src/tests/unit/App.test.tsx (update)
import { render, screen } from '@testing-library/react';
import App from '@/App';

describe('App Component', () => {
  it('should render ControlPanel after processing', async () => {
    render(<App />);
    
    // Upload and process image
    // ...
    
    expect(screen.getByText('Controls')).toBeInTheDocument();
    expect(screen.getByText('Material Presets')).toBeInTheDocument();
    expect(screen.getByText('Adjustments')).toBeInTheDocument();
  });

  it('should not show DownloadButton separately', () => {
    render(<App />);
    
    // Upload and process image
    // ...
    
    // Download button should be inside ControlPanel
    const downloadSections = screen.queryAllByText(/download/i);
    expect(downloadSections.length).toBe(1); // Only one instance
  });
});
```

### Step 5: Add Animations and Polish (1 hour)

**5.1 Add CSS for Smooth Animations**
```css
/* src/styles/index.css (add) */

/* Accordion animations - respects prefers-reduced-motion */
@media (prefers-reduced-motion: no-preference) {
  [data-state="open"] > .accordion-content {
    animation: accordion-down var(--duration-medium) var(--ease-out);
  }
  
  [data-state="closed"] > .accordion-content {
    animation: accordion-up var(--duration-medium) var(--ease-out);
  }
}

@keyframes accordion-down {
  from {
    height: 0;
    opacity: 0;
  }
  to {
    height: var(--radix-accordion-content-height);
    opacity: 1;
  }
}

@keyframes accordion-up {
  from {
    height: var(--radix-accordion-content-height);
    opacity: 1;
  }
  to {
    height: 0;
    opacity: 0;
  }
}

/* Disable animations if user prefers reduced motion */
@media (prefers-reduced-motion: reduce) {
  .accordion-content {
    animation: none !important;
    transition: none !important;
  }
}
```

**5.2 Add Visual Separators**
```typescript
// Update AccordionItem styling to add subtle borders
<AccordionItem 
  value="adjustments" 
  className="border border-border/50 rounded-lg transition-colors hover:border-border"
>
```

### Step 6: Integration & E2E Tests (2 hours)

**6.1 Integration Tests**
```typescript
// src/tests/integration/ControlPanel.integration.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ControlPanel } from '@/components/ControlPanel';

describe('ControlPanel Integration', () => {
  it('should persist state across re-renders', () => {
    const { rerender } = render(<ControlPanel {...mockProps} />);
    
    // Collapse Adjustments section
    fireEvent.click(screen.getByText('Adjustments'));
    
    // Re-render component
    rerender(<ControlPanel {...mockProps} />);
    
    // State should persist
    expect(screen.queryByText('Brightness')).not.toBeVisible();
  });

  it('should handle rapid section toggling', async () => {
    render(<ControlPanel {...mockProps} />);
    const trigger = screen.getByText('Adjustments');
    
    // Rapidly click multiple times
    for (let i = 0; i < 10; i++) {
      fireEvent.click(trigger);
    }
    
    // Should handle gracefully without errors
    await waitFor(() => {
      expect(trigger).toBeInTheDocument();
    });
  });

  it('should update adjustments while sections are collapsed', () => {
    const onBrightnessChange = jest.fn();
    render(<ControlPanel {...mockProps} onBrightnessChange={onBrightnessChange} />);
    
    // Collapse Adjustments
    fireEvent.click(screen.getByText('Adjustments'));
    
    // Brightness change should still work (via parent state)
    // This tests that collapsing doesn't break functionality
  });
});
```

**6.2 E2E Tests with Playwright**
```typescript
// src/tests/e2e/control-panel.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Professional Control Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://craftyprep.demosrv.uk');
    
    // Upload test image
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./tests/fixtures/test-image.jpg');
    
    // Run auto-prep
    await page.click('button:has-text("Auto-Prep")');
    await page.waitForSelector('text=Controls', { timeout: 10000 });
  });

  test('should render all control sections', async ({ page }) => {
    await expect(page.locator('text=Material Presets')).toBeVisible();
    await expect(page.locator('text=Background Removal')).toBeVisible();
    await expect(page.locator('text=Adjustments')).toBeVisible();
    await expect(page.locator('text=History')).toBeVisible();
    await expect(page.locator('text=Export')).toBeVisible();
    await expect(page.locator('text=Actions')).toBeVisible();
  });

  test('should collapse and expand sections', async ({ page }) => {
    const adjustmentsTrigger = page.locator('button:has-text("Adjustments")');
    
    // Initially expanded
    await expect(page.locator('text=Brightness')).toBeVisible();
    
    // Collapse
    await adjustmentsTrigger.click();
    await expect(page.locator('text=Brightness')).not.toBeVisible();
    
    // Expand
    await adjustmentsTrigger.click();
    await expect(page.locator('text=Brightness')).toBeVisible();
  });

  test('should persist panel state on page reload', async ({ page }) => {
    // Collapse Adjustments section
    await page.click('button:has-text("Adjustments")');
    await expect(page.locator('text=Brightness')).not.toBeVisible();
    
    // Reload page
    await page.reload();
    
    // Upload and process image again
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./tests/fixtures/test-image.jpg');
    await page.click('button:has-text("Auto-Prep")');
    await page.waitForSelector('text=Controls');
    
    // Adjustments should still be collapsed
    await expect(page.locator('text=Brightness')).not.toBeVisible();
  });

  test('should be keyboard accessible', async ({ page }) => {
    // Tab to first section trigger
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // Navigate to first trigger
    
    // Enter should toggle section
    await page.keyboard.press('Enter');
    
    // Section should collapse/expand
    // Add assertion based on initial state
  });

  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await expect(page.locator('text=Controls')).toBeVisible();
    await expect(page.locator('text=Adjustments')).toBeVisible();
    
    // Touch targets should be ≥44px
    const trigger = page.locator('button:has-text("Adjustments")');
    const box = await trigger.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });

  test('should respect prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    // Collapse section
    await page.click('button:has-text("Adjustments")');
    
    // Should still work but without animation
    // Check that content is immediately hidden
    await expect(page.locator('text=Brightness')).not.toBeVisible();
  });
});
```

### Step 7: Accessibility Validation (Included in all steps)

**7.1 Automated Accessibility Tests**
```typescript
// src/tests/accessibility/control-panel.a11y.test.ts
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ControlPanel } from '@/components/ControlPanel';

expect.extend(toHaveNoViolations);

describe('ControlPanel Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<ControlPanel {...mockProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper heading hierarchy', () => {
    render(<ControlPanel {...mockProps} />);
    
    // h2 for main heading
    expect(screen.getByRole('heading', { level: 2, name: 'Controls' })).toBeInTheDocument();
    
    // Section triggers should be buttons with proper labels
    const triggers = screen.getAllByRole('button');
    triggers.forEach(trigger => {
      expect(trigger).toHaveAttribute('aria-expanded');
    });
  });

  it('should announce section state to screen readers', () => {
    render(<ControlPanel {...mockProps} />);
    const trigger = screen.getByText('Adjustments');
    
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
```

## Required Reading

Document sections REQUIRED for implementation:

- [.autoflow/docs/FUNCTIONAL.md#feature-3]: Refinement controls specifications, slider behavior, reset functionality
- [.autoflow/docs/ARCHITECTURE.md#component-patterns]: React patterns (composition, hooks), component organization
- [.autoflow/docs/ARCHITECTURE.md#design-patterns]: Container/Presentational pattern, custom hooks pattern

## Technical Decisions

**Decision 1: Accordion Component Choice**
- **Chosen**: shadcn/ui Accordion (Radix UI primitives)
- **Rationale**: Built-in accessibility, keyboard navigation, smooth animations, TypeScript support
- **Trade-off**: Adds dependency, but saves significant development time and ensures WCAG compliance
- **Alternative Considered**: Custom accordion implementation (rejected - reinventing the wheel)

**Decision 2: State Persistence Strategy**
- **Chosen**: localStorage with validation and error handling
- **Rationale**: Simple, works offline, no backend required, persists across sessions
- **Trade-off**: Not synchronized across devices (acceptable for MVP)
- **Alternative Considered**: Session storage (rejected - doesn't persist across sessions)

**Decision 3: Section Organization**
- **Chosen**: 6 sections (Material Presets, Background Removal, Adjustments, History, Export, Actions)
- **Rationale**: Follows pipeline order, logical grouping, clear separation of concerns
- **Trade-off**: More sections = more clicks to access, but improved organization
- **Alternative Considered**: 3 large sections (rejected - too much content per section)

**Decision 4: Accordion Behavior**
- **Chosen**: Multiple sections can be open simultaneously
- **Rationale**: Users may want to see multiple sections at once, reduces clicks
- **Trade-off**: More vertical space used when all expanded
- **Alternative Considered**: Exclusive accordion (only one open) - rejected as too restrictive

**Decision 5: Default State**
- **Chosen**: All sections expanded by default
- **Rationale**: First-time users see all controls, no hidden functionality
- **Trade-off**: More scrolling required
- **Alternative Considered**: All collapsed - rejected as poor discoverability

## Test Examples

**Architecture Test: Component Composition**
```typescript
// Verify ControlPanel reuses existing components (no duplication)
test('should compose existing slider components', () => {
  render(<ControlPanel {...mockProps} />);
  
  // Should render BrightnessSlider, not duplicate its logic
  expect(screen.getByLabelText('Brightness')).toBeInTheDocument();
  
  // Should use existing MaterialPresetSelector
  expect(screen.getByRole('combobox', { name: /material preset/i })).toBeInTheDocument();
});
```

**Architecture Test: Single Source of Truth**
```typescript
// Verify panel state is managed in one place
test('should manage all accordion state in ControlPanel', () => {
  render(<ControlPanel {...mockProps} />);
  
  // Check that state is not duplicated in children
  // Panel state should be passed down, not managed by children
});
```

**Architecture Test: State Persistence**
```typescript
// Verify localStorage is only accessed via utility
test('should use panelStateStorage utility for all localStorage access', () => {
  const spy = jest.spyOn(Storage.prototype, 'setItem');
  
  render(<ControlPanel {...mockProps} />);
  fireEvent.click(screen.getByText('Adjustments'));
  
  // Verify storage key matches utility
  expect(spy).toHaveBeenCalledWith(
    'craftyprep_panel_state',
    expect.any(String)
  );
  
  spy.mockRestore();
});
```

## Success Metrics

- [ ] All 7 acceptance criteria met (from task description)
- [ ] Unit test coverage ≥80% for new components
- [ ] Zero accessibility violations (axe, Lighthouse)
- [ ] E2E tests passing for all user workflows
- [ ] Panel state persists correctly across sessions
- [ ] Animations smooth (60fps) on target devices
- [ ] Mobile responsive (320px - 1920px)
- [ ] Keyboard navigation works flawlessly
- [ ] Implementation complete within 10-hour estimate
