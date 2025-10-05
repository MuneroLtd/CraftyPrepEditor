# Research: Reset Button and State Management

**Task ID**: task-017
**Sprint**: Sprint 2 (Refinement Controls & UX)
**Research Date**: 2025-10-05

---

## Problem Statement

Implement a reset button that:
1. Restores all refinement sliders to default values
2. Re-applies the auto-prep algorithm
3. Discards all manual adjustments
4. Provides visual feedback during reset
5. Maintains clean state management patterns

**Context**: Users need a way to "start over" after experimenting with manual adjustments, returning to the optimal auto-prep result without re-uploading the image.

---

## State Management Research

### Current Architecture

**Pattern**: React Hooks with Local State (No Context API)

**Rationale**:
- Simple component hierarchy (App → RefinementControls → Sliders)
- No deep prop drilling issues
- State is scoped to single parent (App.tsx)
- Clear data flow (top-down props, bottom-up callbacks)

**State Location**:
```
App.tsx (state owner)
  ├─ uploadedImage (from useFileUpload hook)
  ├─ baselineImageData (from useImageProcessing hook)
  ├─ otsuThreshold (from useImageProcessing hook)
  ├─ brightness (local useState)
  ├─ contrast (local useState)
  ├─ threshold (local useState)
  ├─ backgroundRemovalEnabled (local useState)
  └─ backgroundRemovalSensitivity (local useState)
```

**Conclusion**: No need for Context API or Redux. Current pattern sufficient.

---

### Alternative Patterns Considered

#### Option 1: Context API
**Pros**:
- Avoids prop drilling
- Global state access
- Easier to add new components

**Cons**:
- Overkill for current component tree
- Adds complexity
- Harder to debug
- Performance overhead (re-renders)

**Decision**: ❌ NOT NEEDED for this task

---

#### Option 2: Zustand (Lightweight Global State)
**Pros**:
- Minimal boilerplate
- Good performance
- Easy to use

**Cons**:
- New dependency
- Unnecessary for current scope
- Team learning curve

**Decision**: ❌ NOT NEEDED for this task

---

#### Option 3: React Hook Form
**Pros**:
- Built for form state
- Validation support
- Reset functionality built-in

**Cons**:
- Not a form (sliders, not inputs)
- Overkill for our use case
- Different mental model

**Decision**: ❌ NOT APPLICABLE

---

#### Option 4: Custom Hook (useRefinementState)
**Pros**:
- Encapsulates reset logic
- Reusable pattern
- Clean API

**Cons**:
- Premature abstraction
- Adds indirection
- Only one consumer (App.tsx)

**Decision**: ⚠️ FUTURE CONSIDERATION (not for MVP)

**Conclusion**: Use existing React hooks pattern (useState + useCallback) for simplicity and consistency with current codebase.

---

## Reset UX Patterns Research

### Pattern 1: Immediate Reset (No Confirmation)

**Description**: Clicking reset immediately triggers reset action

**Pros**:
- Simple, fast interaction
- Fewer clicks
- Modern UX pattern

**Cons**:
- No undo (could be added later)
- Accidental clicks possible

**Examples**: Photoshop filters, Google Photos editor

**Decision**: ✅ SELECTED (matches functional spec)

---

### Pattern 2: Confirmation Dialog

**Description**: Show "Are you sure?" dialog before reset

**Pros**:
- Prevents accidental resets
- Gives user time to reconsider

**Cons**:
- Extra click required
- Interrupts workflow
- Annoying for intentional use

**Examples**: Older desktop software

**Decision**: ❌ NOT SELECTED (too disruptive)

---

### Pattern 3: Undo/Redo Stack

**Description**: Reset is undoable via undo/redo buttons

**Pros**:
- User confidence (can undo)
- Flexible workflow
- Professional UX

**Cons**:
- Complex implementation
- Out of scope for current task
- Planned for Sprint 3

**Examples**: Adobe Creative Suite, Figma

**Decision**: ⏭️ DEFERRED to task-027 (Sprint 3)

---

### Pattern 4: Reset with Visual Preview

**Description**: Hover over reset shows preview of result

**Pros**:
- User can see before committing
- Reduces uncertainty

**Cons**:
- Complex to implement
- Performance overhead
- Mobile doesn't have hover

**Decision**: ❌ NOT SELECTED (complexity vs. value)

---

**Selected Pattern**: **Immediate Reset with Loading Indicator**
- Click reset → shows loading → preview updates
- Simple, fast, clear feedback
- Consistent with auto-prep button behavior

---

## Default Values Strategy

### Problem

Need consistent default values across:
1. Initial state (`useState` default)
2. Reset handler
3. Tests
4. Documentation

**Risk**: Magic numbers scattered in code, inconsistency, maintenance issues

---

### Solution: Constants File

**File**: `src/lib/constants.ts`

```typescript
/**
 * Default values for image refinement sliders
 *
 * These values are used for:
 * - Initial state in App.tsx
 * - Reset functionality
 * - Test assertions
 *
 * Brightness: 0 = no adjustment
 * Contrast: 0 = no adjustment
 * Threshold: 128 = mid-range (Otsu will override)
 * Background Sensitivity: 128 = mid-range
 */
export const DEFAULT_BRIGHTNESS = 0;
export const DEFAULT_CONTRAST = 0;
export const DEFAULT_THRESHOLD = 128;
export const DEFAULT_BG_SENSITIVITY = 128;
```

**Benefits**:
- Single source of truth
- Type-safe
- Easy to find and modify
- Self-documenting
- Reusable in tests

**Usage**:
```typescript
// App.tsx
import { DEFAULT_BRIGHTNESS, DEFAULT_CONTRAST, DEFAULT_THRESHOLD } from '@/lib/constants';

const [brightness, setBrightness] = useState(DEFAULT_BRIGHTNESS);
const [contrast, setContrast] = useState(DEFAULT_CONTRAST);
const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD);

const handleReset = useCallback(() => {
  setBrightness(DEFAULT_BRIGHTNESS);
  setContrast(DEFAULT_CONTRAST);
  setThreshold(otsuThreshold); // Use calculated value, not constant
  // ...
}, [otsuThreshold, runAutoPrepAsync]);
```

**Decision**: ✅ IMPLEMENT constants file

---

## Reset Behavior Research

### Question: Should reset re-run auto-prep pipeline or just reset sliders?

#### Option A: Reset Sliders Only

**Behavior**:
- Set brightness = 0, contrast = 0, threshold = otsu
- Re-apply adjustments to existing baseline
- Fast (no pipeline re-run)

**Pros**:
- Very fast (<100ms)
- Simple implementation

**Cons**:
- Doesn't match functional spec ("re-applies auto-prep algorithm")
- May not account for background removal side effects
- Less predictable (depends on baseline state)

**Decision**: ❌ NOT SELECTED

---

#### Option B: Re-Run Full Auto-Prep Pipeline

**Behavior**:
- Reset slider values
- Call `runAutoPrepAsync(uploadedImage, defaultOptions)`
- Full pipeline: grayscale → equalization → Otsu → threshold
- Creates fresh baseline

**Pros**:
- Matches functional spec exactly
- Deterministic (same as original auto-prep)
- Handles all edge cases (background removal, etc.)
- Clear user expectation ("Reset" = "Start over")
- Provides visual feedback (loading indicator)

**Cons**:
- Slower (<3 seconds for 2MB image)
- Repeats work if no background removal

**Decision**: ✅ SELECTED (matches spec, clearer UX)

**Functional Spec Quote**:
> "Reset button returns all sliders to default values and **re-applies auto-prep algorithm**"

---

## Accessibility Research (WCAG 2.2 AAA)

### Reset Button Accessibility Requirements

#### Keyboard Navigation
**Standard**: WCAG 2.1.1 (Keyboard)
- ✅ Focusable via Tab
- ✅ Activates via Enter or Space
- ✅ Focus indicator visible (3px outline, ≥3:1 contrast)

**Implementation**: Use semantic `<button>` element (built-in keyboard support)

---

#### Screen Reader Support
**Standard**: WCAG 4.1.2 (Name, Role, Value)
- ✅ Button role announced
- ✅ Button label clear ("Reset to auto-prep defaults")
- ✅ Button state announced (disabled/enabled)
- ✅ Loading state announced (aria-busy)

**Implementation**:
```tsx
<Button
  aria-label="Reset to auto-prep defaults"
  aria-busy={loading}
  disabled={disabled}
>
  {loading ? 'Resetting...' : 'Reset to Auto-Prep'}
</Button>
```

---

#### Visual Feedback
**Standard**: WCAG 1.4.1 (Use of Color)
- ✅ Disabled state visually distinct (not just color)
- ✅ Focus state has non-color indicator (outline)
- ✅ Loading state shows spinner (not just text change)

**Implementation**: Use shadcn/ui Button variants (built-in states)

---

#### Touch Targets
**Standard**: WCAG 2.5.5 (Target Size) - Level AAA
- ✅ Minimum 44px × 44px
- ✅ Adequate spacing from other controls

**Implementation**: `size="lg"` prop + `min-h-[44px]` class

---

### Icon Research

**Icon**: RotateCcw (rotate counterclockwise)
**Library**: lucide-react

**Rationale**:
- Universal symbol for "reset" or "undo"
- Directional (counterclockwise = backward in time)
- Simple, recognizable shape
- Already used in project

**Accessibility**:
- Icon has `aria-hidden="true"` (redundant with text)
- Text provides label ("Reset to Auto-Prep")
- No reliance on icon alone

**Alternative Icons Considered**:
- ❌ RefreshCw (clockwise) - Implies "reload", not "reset"
- ❌ RotateCw (clockwise) - Implies "forward", not "backward"
- ❌ Undo - Too generic
- ❌ X - Implies "close" or "cancel"

---

## Performance Research

### Reset Performance Target

**Target**: <3 seconds for 2MB image
**Actual Expected**: ~2 seconds (same as auto-prep)

**Breakdown**:
1. User clicks reset: <10ms
2. State update (sliders): <10ms
3. Call runAutoPrepAsync: <10ms
4. Auto-prep pipeline: ~2000ms
   - Grayscale: ~200ms
   - Histogram equalization: ~300ms
   - Otsu calculation: ~100ms
   - Threshold application: ~200ms
   - Canvas operations: ~200ms
5. Preview update: ~100ms

**Total**: ~2.5 seconds (within target)

---

### Optimization Opportunities (Future)

1. **Debounce reset clicks**: Prevent accidental double-clicks
2. **Cancel in-progress reset**: If user clicks auto-prep during reset
3. **Web Worker**: Offload processing to separate thread
4. **Progressive rendering**: Show partial result while processing

**Decision**: ✅ Optimizations deferred (current performance acceptable)

---

## Testing Strategy Research

### Test Pyramid for Reset Functionality

```
        ┌─────────┐
        │   E2E   │ Manual browser testing
        │  Tests  │ Cross-browser, screen reader
        └─────────┘
           ▲
      ┌──────────┐
      │Integration│ ResetFlow.integration.test.tsx
      │   Tests    │ Upload → Auto-prep → Adjust → Reset
      └──────────┘
         ▲
    ┌─────────────┐
    │  Unit Tests  │ ResetButton.test.tsx
    │              │ Component behavior, props, states
    └─────────────┘
```

**Unit Tests**: 70% of test effort
- Component rendering
- Props handling
- State management
- Callbacks
- Edge cases

**Integration Tests**: 25% of test effort
- Full workflow
- State transitions
- Preview updates
- Multiple resets

**E2E Tests**: 5% of test effort
- Manual browser testing
- Screen reader testing
- Cross-browser validation

---

### Test Coverage Target

**Minimum**: 80% (WCAG requirement)
**Target**: 95%+ (components are simple, high coverage achievable)

**Coverage by File**:
- `ResetButton.tsx`: 100% (simple component)
- `RefinementControls.tsx`: 95% (add reset button)
- `App.tsx` (reset handler): 100% (well-defined logic)

---

## Edge Cases Identified

### Edge Case 1: Reset Before Auto-Prep
**Scenario**: User clicks reset before running auto-prep
**Expected**: Button disabled (no baseline available)
**Implementation**: `disabled={!baselineImageData}`

---

### Edge Case 2: Reset During Processing
**Scenario**: User clicks reset while auto-prep is running
**Expected**: Button disabled (loading state)
**Implementation**: `disabled={isProcessing}`

---

### Edge Case 3: Multiple Rapid Resets
**Scenario**: User clicks reset multiple times quickly
**Expected**: Only one reset runs (button disabled during processing)
**Implementation**: `disabled={loading || isProcessing}`

---

### Edge Case 4: Reset with No Adjustments
**Scenario**: User runs auto-prep, then immediately clicks reset (no adjustments)
**Expected**: Reset still works (re-runs auto-prep)
**Implementation**: No special handling needed (idempotent)

---

### Edge Case 5: Reset After Background Removal
**Scenario**: User enables background removal, then clicks reset
**Expected**: Background removal disabled, full auto-prep re-run
**Implementation**: `setBackgroundRemovalEnabled(false)` + `runAutoPrepAsync` with default options

---

## Security Considerations

### No Security Risks Identified

**Rationale**:
- Reset is client-side only (no server communication)
- No user input to sanitize (button click)
- No localStorage or cookies involved
- No external API calls
- No file system access

**Conclusion**: No special security measures needed

---

## Browser Compatibility

### Target Browsers (Same as Project)
- ✅ Chrome 90+ (latest)
- ✅ Firefox 88+ (latest)
- ✅ Safari 14+ (latest)
- ✅ Edge 90+ (latest)

### Required Browser Features
- ✅ Canvas API (already required)
- ✅ ES2020 features (already required)
- ✅ React 19 (already required)

**Conclusion**: No additional browser compatibility concerns

---

## Best Practices from Similar Tools

### Photoshop
**Pattern**: Reset button at bottom of filter panel
**Learning**: Secondary position (less prominent than apply)

### Lightroom
**Pattern**: Reset all adjustments with one click, no confirmation
**Learning**: Immediate feedback, trust user intent

### GIMP
**Pattern**: Reset button next to each slider + global reset
**Learning**: Per-slider reset too complex for our MVP

### Canva
**Pattern**: Clear visual feedback during reset (progress bar)
**Learning**: Users appreciate seeing progress

### Google Photos
**Pattern**: Simple "Reset" text button, no icon
**Learning**: Icon helps but text is primary

**Conclusions**:
- ✅ Secondary button styling (less prominent)
- ✅ Bottom position in controls
- ✅ Icon + text for clarity
- ✅ Loading indicator for feedback
- ✅ No confirmation dialog (trust user)

---

## Component Design Decisions

### Button Variant: Secondary
**Rationale**:
- Less prominent than Auto-Prep (primary action)
- Supports workflow: Auto-Prep (primary) → Adjust → Reset (secondary)
- Matches functional spec: "Secondary button styling"

---

### Button Size: Large (lg)
**Rationale**:
- Touch-friendly (≥44px height)
- Consistent with Auto-Prep button
- Easy to tap on mobile

---

### Button Text: "Reset to Auto-Prep"
**Rationale**:
- Clear action ("Reset")
- Clear destination ("to Auto-Prep")
- Not ambiguous ("Reset" alone could mean "clear image")

**Alternatives Considered**:
- ❌ "Reset" - Too vague
- ❌ "Restore Defaults" - Too generic
- ❌ "Start Over" - Implies re-upload
- ❌ "Undo All" - Implies undo stack (Sprint 3)

---

### Icon Position: Left of Text
**Rationale**:
- Standard pattern (icon-text)
- Matches Auto-Prep button
- Icon reinforces action

---

### Loading State: "Resetting..."
**Rationale**:
- Clear feedback (action in progress)
- Consistent with "Processing..." (Auto-Prep)
- Screen reader announces state change

---

## Implementation Risks & Mitigation

### Risk 1: Stale Closure in useCallback

**Description**: Reset handler might capture old state values if dependencies incorrect

**Mitigation**:
```typescript
const handleReset = useCallback(() => {
  // Logic
}, [uploadedImage, otsuThreshold, runAutoPrepAsync]);
// ↑ All external dependencies listed
```

**Test**: Verify handler updates when dependencies change

---

### Risk 2: Race Condition (Multiple Resets)

**Description**: User clicks reset multiple times, triggering concurrent auto-prep runs

**Mitigation**: Disable button during processing
```typescript
disabled={!baselineImageData || isProcessing || loading}
```

**Test**: Rapid click test (should only trigger one reset)

---

### Risk 3: Inconsistent Defaults

**Description**: Reset might use different defaults than initial state

**Mitigation**: Extract constants to `src/lib/constants.ts`
```typescript
// Both use same constant
const [brightness, setBrightness] = useState(DEFAULT_BRIGHTNESS);
const handleReset = () => setBrightness(DEFAULT_BRIGHTNESS);
```

**Test**: Verify reset matches initial state

---

## Memory Considerations

### Memory Usage During Reset

**Before Reset**:
- uploadedImage: ~2MB
- baselineImageData: ~8MB (RGBA)
- processedCanvas: ~8MB

**During Reset**:
- New ImageData created: ~8MB
- Temporary canvas: ~8MB
- Old processedCanvas: ~8MB (not yet GC'd)

**Peak Memory**: ~32MB (temporary spike)

**After Reset**:
- Old processedCanvas released
- GC reclaims ~8MB
- Back to ~24MB baseline

**Conclusion**: No memory leak concerns, cleanup handled by React/browser GC

---

## Findings Summary

### Key Decisions

1. **State Management**: Use existing React hooks pattern (no Context API)
2. **Reset Behavior**: Re-run full auto-prep pipeline (not just slider reset)
3. **UX Pattern**: Immediate reset with loading indicator (no confirmation)
4. **Default Values**: Extract to constants file (`src/lib/constants.ts`)
5. **Button Style**: Secondary variant, large size, icon + text
6. **Accessibility**: Full WCAG 2.2 AAA compliance (keyboard, screen reader, focus)

### Implementation Approach

**5-Phase TDD**:
1. Write tests (Red)
2. Minimal implementation (Green)
3. Refactor (Blue)
4. Quality assurance (Testing)
5. Documentation

### No Blockers

- ✅ All dependencies satisfied
- ✅ All required components exist
- ✅ Clear requirements from functional spec
- ✅ Established patterns to follow

### Estimated Complexity

**Complexity**: 🟢 LOW
- Simple component (button + callback)
- Well-defined behavior
- Existing patterns to follow
- No new dependencies

**Confidence**: 🟢 HIGH (95%)
- Clear requirements
- No unknowns
- Proven patterns
- All dependencies ready

---

## References

### Functional Specifications
- `.autoflow/docs/FUNCTIONAL.md#reset-functionality` (FR3.5)

### Architecture Documentation
- `.autoflow/docs/ARCHITECTURE.md#state-management`

### Existing Code
- `src/App.tsx` - Current state management
- `src/components/RefinementControls.tsx` - Container component
- `src/hooks/useImageProcessing.ts` - Auto-prep pipeline
- `src/components/BrightnessSlider.tsx` - Slider pattern
- `src/components/AutoPrepButton.tsx` - Button pattern

### External Resources
- React Hooks: https://react.dev/reference/react/hooks
- WCAG 2.2: https://www.w3.org/WAI/WCAG22/quickref/
- shadcn/ui Button: https://ui.shadcn.com/docs/components/button
- lucide-react Icons: https://lucide.dev/icons

---

**Research Complete**: 2025-10-05
**Next Step**: `/build` - Implement task-017 following this research
