# Task Plan: Refinement Slider Components

**Task ID**: task-011
**Task Name**: Refinement Slider Components
**Estimated Effort**: 5 hours
**Approach**: Test-Driven Development (TDD)

---

## Overview

Create three slider components (Brightness, Contrast, Threshold) for real-time image refinement controls. Components must be fully accessible (WCAG 2.2 Level AAA), keyboard navigable, and touch-friendly.

## Architecture Decision

**Approach**: Hybrid component architecture
- Create reusable `RefinementSlider` base component
- Create three specific slider components that configure the base
- Create `RefinementControls` container component

**Rationale**:
- DRY principle (single source of truth for slider behavior)
- Consistent accessibility across all sliders
- Easy to maintain and extend
- Clear separation of concerns

## Implementation Phases

### Phase 1: Test Setup & Interfaces (1 hour)

**Objective**: Define interfaces and write failing tests (Red phase)

**Files to Create**:
- `src/components/RefinementSlider.tsx` (interface only)
- `src/components/BrightnessSlider.tsx` (interface only)
- `src/components/ContrastSlider.tsx` (interface only)
- `src/components/ThresholdSlider.tsx` (interface only)
- `src/tests/unit/components/RefinementSlider.test.tsx`
- `src/tests/unit/components/BrightnessSlider.test.tsx`
- `src/tests/unit/components/ContrastSlider.test.tsx`
- `src/tests/unit/components/ThresholdSlider.test.tsx`

**Test Cases**:
1. Component renders with correct label
2. Value display shows current value
3. ARIA attributes present (aria-label, aria-valuemin, aria-valuemax, aria-valuenow)
4. Keyboard navigation works (ArrowUp, ArrowDown, Home, End)
5. onChange callback fires with correct values
6. Touch target size ≥44px
7. Focus indicators visible
8. Min/max value constraints enforced

**TypeScript Interfaces**:
```typescript
interface RefinementSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  ariaLabel?: string;
  disabled?: boolean;
}
```

**Success Criteria**:
- [ ] All test files created
- [ ] All tests written and failing
- [ ] TypeScript interfaces defined
- [ ] Test coverage includes accessibility, keyboard nav, value display

---

### Phase 2: RefinementSlider Base Component (1.5 hours)

**Objective**: Implement base slider component (Green phase)

**Implementation**:
1. Wrap shadcn/ui Slider with label + value display
2. Configure Radix UI Slider props (min, max, step, value, onValueChange)
3. Add ARIA attributes for accessibility
4. Increase touch target size to 44px (currently 20px)
5. Add visible focus indicators (≥3:1 contrast, ≥3px)
6. Implement value display next to label

**File**: `src/components/RefinementSlider.tsx`

**Key Features**:
- Label text with associated value display
- Proper ARIA labeling (aria-label includes current value)
- Touch-friendly handle (44px minimum)
- High-contrast focus ring
- Controlled component (value and onChange from parent)

**Accessibility Enhancements**:
```typescript
// ARIA attributes
aria-label={`${label}: ${value}`}
aria-valuemin={min}
aria-valuemax={max}
aria-valuenow={value}

// Touch target sizing
className="h-11 w-11" // 44px × 44px thumb
```

**Success Criteria**:
- [ ] Component renders correctly
- [ ] All tests pass
- [ ] Touch target ≥44px verified
- [ ] Focus indicators visible
- [ ] ARIA attributes correct

---

### Phase 3: Specific Slider Components (1 hour)

**Objective**: Create brightness, contrast, and threshold sliders

**Files to Create**:
- `src/components/BrightnessSlider.tsx`
- `src/components/ContrastSlider.tsx`
- `src/components/ThresholdSlider.tsx`

**Brightness Slider**:
```typescript
export function BrightnessSlider({ value, onChange }: BrightnessSliderProps) {
  return (
    <RefinementSlider
      label="Brightness"
      value={value}
      min={-100}
      max={100}
      step={1}
      onChange={onChange}
      ariaLabel="Adjust image brightness from -100 to +100"
    />
  );
}
```

**Contrast Slider**:
```typescript
export function ContrastSlider({ value, onChange }: ContrastSliderProps) {
  return (
    <RefinementSlider
      label="Contrast"
      value={value}
      min={-100}
      max={100}
      step={1}
      onChange={onChange}
      ariaLabel="Adjust image contrast from -100 to +100"
    />
  );
}
```

**Threshold Slider**:
```typescript
export function ThresholdSlider({ value, onChange }: ThresholdSliderProps) {
  return (
    <RefinementSlider
      label="Threshold"
      value={value}
      min={0}
      max={255}
      step={1}
      onChange={onChange}
      ariaLabel="Adjust binarization threshold from 0 to 255"
    />
  );
}
```

**Success Criteria**:
- [ ] All three slider components implemented
- [ ] Correct value ranges configured
- [ ] All tests pass
- [ ] Props interfaces exported

---

### Phase 4: Container Component (0.5 hours)

**Objective**: Create RefinementControls container component

**File**: `src/components/RefinementControls.tsx`

**Features**:
- Groups all three sliders vertically
- Section heading: "Refinement Controls"
- Proper spacing (16px between controls)
- Responsive layout (mobile-first)
- Semantic HTML structure

**Implementation**:
```typescript
export function RefinementControls({
  brightness,
  contrast,
  threshold,
  onBrightnessChange,
  onContrastChange,
  onThresholdChange,
}: RefinementControlsProps) {
  return (
    <section aria-labelledby="refinement-heading" className="space-y-4">
      <h2 id="refinement-heading" className="text-lg font-semibold">
        Refinement Controls
      </h2>
      <BrightnessSlider value={brightness} onChange={onBrightnessChange} />
      <ContrastSlider value={contrast} onChange={onContrastChange} />
      <ThresholdSlider value={threshold} onChange={onThresholdChange} />
    </section>
  );
}
```

**Test File**: `src/tests/unit/components/RefinementControls.test.tsx`

**Success Criteria**:
- [ ] Container component implemented
- [ ] All three sliders rendered
- [ ] Semantic HTML (section, heading)
- [ ] Integration tests pass

---

### Phase 5: Testing & Documentation (1 hour)

**Objective**: Complete testing, refactor, and document (Refactor phase)

**Activities**:
1. Run full test suite (unit + integration)
2. Verify test coverage ≥80%
3. Manual accessibility testing:
   - Keyboard navigation (Tab, Arrow keys, Home, End)
   - Screen reader testing (NVDA/VoiceOver)
   - Focus indicators visible
   - Touch target size verification
4. Code review and refactor
5. Update component documentation
6. Create usage examples

**Test Coverage Target**: ≥80%

**Accessibility Verification**:
- [ ] Keyboard navigation works (all keys)
- [ ] Screen reader announces values
- [ ] Focus indicators visible (≥3:1 contrast)
- [ ] Touch targets ≥44px measured
- [ ] ARIA attributes correct
- [ ] No accessibility violations (axe-core)

**Documentation**:
- [ ] JSDoc comments on all components
- [ ] Props interfaces documented
- [ ] Usage examples in comments
- [ ] Accessibility notes included

**Success Criteria**:
- [ ] All tests pass
- [ ] Coverage ≥80%
- [ ] Manual accessibility tests pass
- [ ] Components documented
- [ ] Code refactored and clean

---

## Dependencies

**Required**:
- ✅ Sprint 1 complete (verified - Auto-Prep implemented)
- ✅ shadcn/ui Slider component installed
- ✅ @radix-ui/react-slider installed
- ✅ TypeScript 5.x configured
- ✅ React 19 installed
- ✅ Tailwind CSS configured

**Integration Dependencies** (for subsequent tasks):
- task-012: Brightness adjustment implementation (will consume BrightnessSlider)
- task-013: Contrast adjustment implementation (will consume ContrastSlider)
- task-014: Threshold adjustment implementation (will consume ThresholdSlider)

**Note**: This task creates UI components only. Integration with image processing pipeline happens in tasks 012-014.

---

## Key Design Decisions

### 1. Touch Target Size
**Issue**: Current shadcn/ui Slider thumb is 20px (h-5 w-5)
**Requirement**: WCAG AAA requires ≥44px for touch targets
**Solution**: Override thumb size with `h-11 w-11` (44px)

### 2. Controlled Components
**Decision**: Sliders are controlled (value from parent)
**Rationale**:
- Parent manages state and debouncing
- Sliders are pure UI components
- Easier to test and reason about

### 3. Debouncing Strategy
**Decision**: No debouncing in slider components
**Rationale**:
- Debouncing is a state management concern
- Parent component handles debouncing with useDebounce hook
- Sliders fire onChange immediately for responsive UI

### 4. Value Display Pattern
**Decision**: Value displayed in label text and ARIA label
**Example**: `Brightness: +15`
**Rationale**:
- Clear visual feedback
- Screen readers announce label with value
- Meets WCAG 2.5.3 (Label in Name)

---

## Testing Strategy

### Unit Tests
- Component rendering
- Prop validation
- Value display updates
- onChange callback behavior
- ARIA attribute presence
- Edge cases (min/max values)

### Integration Tests
- RefinementControls with all three sliders
- Parent component interaction
- State updates propagate correctly

### Accessibility Tests
- Keyboard navigation (automated + manual)
- Screen reader compatibility (manual)
- Focus indicators (automated + manual)
- Touch target sizing (automated)
- ARIA attributes (automated)

### Testing Tools
- Vitest (unit tests)
- React Testing Library (component tests)
- @testing-library/user-event (keyboard simulation)
- Manual testing with keyboard and screen reader

---

## Success Metrics

**Completion Criteria**:
- [ ] All 5 components implemented (RefinementSlider + 3 specific + container)
- [ ] All unit tests pass (≥80% coverage)
- [ ] Integration tests pass
- [ ] Keyboard navigation verified manually
- [ ] Screen reader tested (NVDA or VoiceOver)
- [ ] Touch targets verified ≥44px
- [ ] Focus indicators visible and meet contrast requirements
- [ ] No accessibility violations (axe-core clean)
- [ ] Code reviewed and refactored
- [ ] Components documented

**Quality Gates**:
- ✅ Test coverage ≥80%
- ✅ No TypeScript errors
- ✅ No ESLint warnings
- ✅ WCAG 2.2 Level AAA compliance
- ✅ All acceptance criteria met

---

## Next Steps

After this task completes:
1. `/code-review` - Review code quality, DRY, SOLID, accessibility
2. `/test` - Run full test suite
3. `/commit` - Commit slider components

Then proceed to:
- **task-012**: Wire BrightnessSlider to brightness adjustment algorithm
- **task-013**: Wire ContrastSlider to contrast adjustment algorithm
- **task-014**: Wire ThresholdSlider to threshold adjustment algorithm

---

**Estimated Effort**: 5 hours
**Approach**: TDD (Test-Driven Development)
**Risk Level**: Low (well-understood UI task with existing patterns)
