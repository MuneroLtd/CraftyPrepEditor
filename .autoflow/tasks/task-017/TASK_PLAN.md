# Task Plan: Reset Button and State Management

**Task ID**: task-017
**Sprint**: Sprint 2 (Refinement Controls & UX)
**Estimated Effort**: 3 hours
**Priority**: MEDIUM

---

## Overview

Implement reset functionality to restore all refinement controls to their auto-prep default values and re-apply the auto-prep algorithm, discarding all manual adjustments. Ensure clean state management using React hooks pattern already established in the application.

---

## Implementation Approach: 5-Phase TDD

### Phase 1: Test Foundation (Red Phase)

**Goal**: Write comprehensive tests that fail (no implementation yet)

**Test Files to Create**:
1. `src/tests/unit/components/ResetButton.test.tsx` - Unit tests for ResetButton component
2. `src/tests/integration/ResetFlow.integration.test.tsx` - Integration test for complete reset workflow

**Test Scenarios**:

**Unit Tests (ResetButton.test.tsx)**:
- ✅ Renders reset button with correct text and icon
- ✅ Button disabled when no baseline (before auto-prep)
- ✅ Button enabled when baseline exists (after auto-prep)
- ✅ Calls onReset callback when clicked
- ✅ Shows loading state during reset
- ✅ Keyboard accessible (Tab, Enter)
- ✅ Screen reader announces button and state
- ✅ Focus indicator visible
- ✅ Touch target ≥44px × 44px
- ✅ Secondary button styling (less prominent than Auto-Prep)

**Integration Tests (ResetFlow.integration.test.tsx)**:
- ✅ Upload → Auto-Prep → Manual adjustments → Reset → Returns to auto-prep defaults
- ✅ Reset restores brightness to 0
- ✅ Reset restores contrast to 0
- ✅ Reset restores threshold to Otsu value
- ✅ Reset disables background removal
- ✅ Reset re-applies auto-prep algorithm (full pipeline)
- ✅ Preview updates to show reset result
- ✅ Reset button becomes enabled after adjustments made
- ✅ Multiple reset operations work correctly

**Acceptance Criteria Tests**:
- ✅ Reset button component created
- ✅ Returns all sliders to default (0, 0, auto)
- ✅ Re-applies auto-prep algorithm
- ✅ Discards manual adjustments
- ✅ Keyboard accessible
- ✅ Visual feedback on reset

**Time Estimate**: 45 minutes

---

### Phase 2: Minimal Implementation (Green Phase)

**Goal**: Write minimal code to make tests pass

**Files to Create**:
1. `src/components/ResetButton.tsx` - Reset button component
2. Update `src/components/RefinementControls.tsx` - Add Reset button to controls container
3. Update `src/App.tsx` - Add reset handler logic

**Implementation Steps**:

**Step 2.1: Create ResetButton Component**

```typescript
// src/components/ResetButton.tsx
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ResetButtonProps {
  /** Callback fired when reset button clicked */
  onReset: () => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether the button is in loading state */
  loading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export const ResetButton = memo(function ResetButton({
  onReset,
  disabled = false,
  loading = false,
  className = '',
}: ResetButtonProps): React.JSX.Element {
  return (
    <Button
      onClick={onReset}
      disabled={disabled || loading}
      variant="secondary"
      size="lg"
      className={cn('w-full min-h-[44px]', className)}
      aria-label="Reset to auto-prep defaults"
      aria-busy={loading}
    >
      <RotateCcw className="mr-2 h-5 w-5" aria-hidden="true" />
      {loading ? 'Resetting...' : 'Reset to Auto-Prep'}
    </Button>
  );
});
```

**Step 2.2: Add Reset Button to RefinementControls**

```typescript
// Update src/components/RefinementControls.tsx
import { ResetButton } from '@/components/ResetButton';

export interface RefinementControlsProps {
  // ... existing props ...
  /** Callback fired when reset button clicked */
  onReset?: () => void;
  /** Whether reset is in progress */
  isResetting?: boolean;
}

export const RefinementControls = memo(function RefinementControls({
  // ... existing props ...
  onReset,
  isResetting = false,
  // ...
}: RefinementControlsProps): React.JSX.Element {
  return (
    <section aria-labelledby="refinement-heading" className={cn('space-y-4', className)}>
      {/* ... existing sliders ... */}

      {/* Reset Button (at the bottom) */}
      {onReset && (
        <ResetButton
          onReset={onReset}
          disabled={disabled}
          loading={isResetting}
        />
      )}
    </section>
  );
});
```

**Step 2.3: Add Reset Logic to App.tsx**

```typescript
// Update src/App.tsx
const handleReset = useCallback(() => {
  if (uploadedImage && otsuThreshold !== null) {
    // Reset slider values to defaults
    setBrightness(0);
    setContrast(0);
    setThreshold(otsuThreshold);

    // Disable background removal
    setBackgroundRemovalEnabled(false);
    setBackgroundRemovalSensitivity(128);

    // Re-run auto-prep with default settings
    runAutoPrepAsync(uploadedImage, {
      removeBackground: false,
      bgSensitivity: 128,
    });
  }
}, [uploadedImage, otsuThreshold, runAutoPrepAsync]);

// Pass to RefinementControls
<RefinementControls
  // ... existing props ...
  onReset={handleReset}
  isResetting={isProcessing}
/>
```

**Time Estimate**: 60 minutes

---

### Phase 3: Refactoring (Blue Phase)

**Goal**: Clean up code, improve design, ensure DRY

**Refactoring Tasks**:

1. **Extract Default Values**:
   - Create constants for default values (brightness: 0, contrast: 0, etc.)
   - Use constants in both initial state and reset handler
   - Prevents magic numbers and ensures consistency

2. **State Management Review**:
   - Verify no state duplication
   - Ensure single source of truth for all values
   - Check for stale closure issues

3. **Memoization**:
   - Verify ResetButton is memoized correctly
   - Check callback dependencies in App.tsx
   - Ensure no unnecessary re-renders

4. **Accessibility**:
   - Verify ARIA labels accurate
   - Test keyboard navigation flow
   - Ensure screen reader announcements clear

**Files to Refactor**:
- `src/components/ResetButton.tsx` - Component optimizations
- `src/App.tsx` - Extract constants, optimize handlers
- `src/lib/constants.ts` (create) - Centralized default values

**Example Refactoring**:

```typescript
// src/lib/constants.ts
export const DEFAULT_BRIGHTNESS = 0;
export const DEFAULT_CONTRAST = 0;
export const DEFAULT_THRESHOLD = 128;
export const DEFAULT_BG_SENSITIVITY = 128;

// src/App.tsx
import {
  DEFAULT_BRIGHTNESS,
  DEFAULT_CONTRAST,
  DEFAULT_THRESHOLD,
  DEFAULT_BG_SENSITIVITY,
} from '@/lib/constants';

const [brightness, setBrightness] = useState(DEFAULT_BRIGHTNESS);
const [contrast, setContrast] = useState(DEFAULT_CONTRAST);
const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD);

const handleReset = useCallback(() => {
  if (uploadedImage && otsuThreshold !== null) {
    setBrightness(DEFAULT_BRIGHTNESS);
    setContrast(DEFAULT_CONTRAST);
    setThreshold(otsuThreshold); // Use calculated Otsu value
    setBackgroundRemovalEnabled(false);
    setBackgroundRemovalSensitivity(DEFAULT_BG_SENSITIVITY);

    runAutoPrepAsync(uploadedImage, {
      removeBackground: false,
      bgSensitivity: DEFAULT_BG_SENSITIVITY,
    });
  }
}, [uploadedImage, otsuThreshold, runAutoPrepAsync]);
```

**Time Estimate**: 30 minutes

---

### Phase 4: Testing & Quality Assurance

**Goal**: Verify all tests pass and code meets quality standards

**Quality Checks**:

1. **Unit Test Coverage**: ≥80%
   ```bash
   npm run test:coverage -- src/components/ResetButton
   ```

2. **Integration Tests**: All scenarios pass
   ```bash
   npm run test -- ResetFlow.integration
   ```

3. **Type Checking**: No TypeScript errors
   ```bash
   npm run typecheck
   ```

4. **Linting**: No ESLint violations
   ```bash
   npm run lint
   ```

5. **E2E Testing**: Manual verification
   - Upload image
   - Run auto-prep
   - Adjust sliders (brightness +50, contrast -20, threshold 200)
   - Click Reset
   - Verify sliders return to defaults
   - Verify preview shows auto-prep result

6. **Accessibility Testing**:
   - Keyboard navigation (Tab to Reset, Enter to activate)
   - Screen reader testing (NVDA/VoiceOver)
   - Focus indicators visible
   - Color contrast ≥7:1 for text

**Test Matrix**:

| Scenario | Expected Result | Status |
|----------|----------------|--------|
| Reset after brightness adjustment | Brightness = 0 | ✅ |
| Reset after contrast adjustment | Contrast = 0 | ✅ |
| Reset after threshold adjustment | Threshold = Otsu value | ✅ |
| Reset with background removal enabled | Background removal OFF | ✅ |
| Reset with all adjustments | All return to defaults | ✅ |
| Reset button disabled before auto-prep | Button disabled | ✅ |
| Reset button enabled after auto-prep | Button enabled | ✅ |
| Multiple reset operations | All work correctly | ✅ |
| Keyboard navigation | Tab + Enter works | ✅ |
| Screen reader | Announces state | ✅ |

**Time Estimate**: 45 minutes

---

### Phase 5: Documentation

**Goal**: Document reset functionality and state management patterns

**Documentation Tasks**:

1. **Component Documentation**:
   - JSDoc comments for ResetButton component
   - Props documentation with examples
   - Usage patterns

2. **Code Comments**:
   - Explain reset logic in App.tsx
   - Document state flow: upload → auto-prep → adjust → reset
   - Note any edge cases

3. **Integration Notes**:
   - Update existing component docs if needed
   - Document relationship between reset and state management

**Documentation Examples**:

```typescript
/**
 * ResetButton - Component for resetting refinement controls to auto-prep defaults
 *
 * Resets all sliders (brightness, contrast, threshold) to their default values
 * and re-runs the auto-prep algorithm, discarding all manual adjustments.
 *
 * Features:
 * - Secondary button styling (less prominent than Auto-Prep)
 * - Loading state during reset processing
 * - Disabled state when no baseline available
 * - Keyboard accessible (Tab, Enter)
 * - Screen reader support with ARIA labels
 * - Icon (rotate counterclockwise) for visual feedback
 * - Touch-friendly (≥44px target)
 *
 * @example
 * ```tsx
 * <ResetButton
 *   onReset={handleReset}
 *   disabled={!baselineImageData}
 *   loading={isProcessing}
 * />
 * ```
 */
```

**Time Estimate**: 15 minutes

---

## Technical Decisions

### State Management Approach

**Decision**: Use existing React hooks pattern (no Context API needed for this task)

**Rationale**:
- State is already managed in App.tsx (single parent component)
- No deep component tree requiring Context
- Simple prop drilling is sufficient and more explicit
- Maintains consistency with existing codebase
- No global state needed (reset is local to current image)

**State Flow**:
```
App.tsx (state owner)
  ↓ props
RefinementControls (container)
  ↓ props
ResetButton (presentation)
  ↑ callback
App.tsx (reset handler)
  → Updates state
  → Triggers auto-prep
  → Preview updates via existing hooks
```

### Default Values Management

**Decision**: Extract constants to `src/lib/constants.ts`

**Rationale**:
- Single source of truth for defaults
- Easy to modify in one place
- Type-safe (TypeScript enforces)
- No magic numbers in code
- Reusable across components and tests

### Reset Behavior

**Decision**: Re-run full auto-prep pipeline (not just reset sliders)

**Rationale**:
- Matches functional spec: "Re-applies auto-prep algorithm"
- Ensures deterministic result (same as original auto-prep)
- Handles edge cases (e.g., background removal side effects)
- Provides visual feedback (loading indicator)
- User expectation: "Reset" = "Start over"

---

## Dependencies

**Direct Dependencies**:
- ✅ task-014 (Brightness slider) - COMMITTED
- ✅ task-015 (Contrast slider) - COMMITTED
- ✅ task-016 (Threshold slider with auto-detection) - COMMITTED
- ✅ Background removal control - COMMITTED

**Hooks Used**:
- `useImageProcessing` - For `runAutoPrepAsync` and `otsuThreshold`
- `useState` - For slider value state
- `useCallback` - For reset handler memoization

**Components Used**:
- `Button` (shadcn/ui) - Base button component
- `RotateCcw` (lucide-react) - Reset icon
- `RefinementControls` - Container for sliders and reset button

---

## Risks & Mitigation

### Risk 1: Stale Closure in Reset Handler

**Impact**: Reset might use old state values
**Mitigation**: Use `useCallback` with correct dependencies (uploadedImage, otsuThreshold, runAutoPrepAsync)

### Risk 2: Race Condition During Reset

**Impact**: Multiple clicks could trigger concurrent resets
**Mitigation**: Disable button during processing (`loading` state)

### Risk 3: Inconsistent Default Values

**Impact**: Reset might not match initial state
**Mitigation**: Extract constants, use in both initial state and reset

### Risk 4: Accessibility Issues

**Impact**: Keyboard users or screen reader users can't reset
**Mitigation**: Full keyboard support, ARIA labels, screen reader testing

---

## Success Criteria

**Functional**:
- ✅ Reset button component created and integrated
- ✅ Clicking reset restores all sliders to defaults
- ✅ Reset re-runs auto-prep algorithm
- ✅ Manual adjustments discarded on reset
- ✅ Loading indicator shown during reset
- ✅ Button disabled when no baseline available

**Quality**:
- ✅ Unit test coverage ≥80%
- ✅ All integration tests pass
- ✅ No TypeScript errors
- ✅ No ESLint violations
- ✅ Code follows DRY principles

**Accessibility**:
- ✅ Keyboard accessible (Tab, Enter)
- ✅ Screen reader announces button and state
- ✅ Focus indicator visible (≥3px, ≥3:1 contrast)
- ✅ Touch target ≥44px × 44px
- ✅ WCAG 2.2 Level AAA compliant

**Performance**:
- ✅ Reset triggers auto-prep: <3s for 2MB image
- ✅ UI remains responsive during reset
- ✅ No memory leaks

---

## Estimated Timeline

| Phase | Duration | Cumulative |
|-------|----------|-----------|
| Phase 1: Test Foundation | 45 min | 45 min |
| Phase 2: Implementation | 60 min | 1h 45min |
| Phase 3: Refactoring | 30 min | 2h 15min |
| Phase 4: Testing & QA | 45 min | 3h |
| Phase 5: Documentation | 15 min | 3h 15min |

**Total Estimated**: ~3 hours (matches task estimate)

---

## Next Steps

1. Run `/build` to implement this plan
2. Ensure Docker development environment is running
3. Execute TDD workflow (Red → Green → Blue)
4. Run `/code-review` after implementation
5. Run `/test` for comprehensive testing
6. Run `/commit` when all quality gates pass
