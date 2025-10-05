# Acceptance Criteria: Reset Button and State Management

**Task ID**: task-017
**Sprint**: Sprint 2 (Refinement Controls & UX)

---

## Functional Requirements

### FR1: Reset Button Component

**Criteria**:
- ✅ Reset button component created (`src/components/ResetButton.tsx`)
- ✅ Button displays icon (rotate counterclockwise) + text "Reset to Auto-Prep"
- ✅ Button uses secondary styling (less prominent than Auto-Prep button)
- ✅ Button minimum size: 100px × 44px (touch-friendly)
- ✅ Button positioned within RefinementControls component

**Test**:
```tsx
// Unit test
it('renders reset button with correct text and icon', () => {
  render(<ResetButton onReset={vi.fn()} />);
  expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  expect(screen.getByText('Reset to Auto-Prep')).toBeInTheDocument();
});
```

---

### FR2: Reset to Defaults

**Criteria**:
- ✅ Clicking reset restores brightness to 0
- ✅ Clicking reset restores contrast to 0
- ✅ Clicking reset restores threshold to Otsu auto-calculated value
- ✅ Clicking reset disables background removal
- ✅ Clicking reset restores background removal sensitivity to 128

**Test**:
```tsx
// Integration test
it('resets all sliders to default values', async () => {
  // Upload image, run auto-prep
  // Adjust sliders: brightness=50, contrast=-20, threshold=200
  // Click reset button
  // Verify: brightness=0, contrast=0, threshold=otsuValue
});
```

---

### FR3: Re-apply Auto-Prep Algorithm

**Criteria**:
- ✅ Reset re-runs full auto-prep pipeline (not just slider reset)
- ✅ Re-applied result matches original auto-prep output
- ✅ Processing indicator shown during reset (same as auto-prep)
- ✅ Preview updates to show reset result

**Test**:
```tsx
// Integration test
it('re-applies auto-prep algorithm on reset', async () => {
  // Upload image, run auto-prep, capture result
  // Adjust sliders, verify preview changed
  // Click reset
  // Verify preview matches original auto-prep result
});
```

---

### FR4: Discard Manual Adjustments

**Criteria**:
- ✅ All manual brightness/contrast/threshold adjustments discarded
- ✅ All manual background removal adjustments discarded
- ✅ Processed image returns to auto-prep baseline
- ✅ State is clean after reset (no lingering adjustments)

**Test**:
```tsx
// Integration test
it('discards all manual adjustments on reset', async () => {
  // Apply multiple adjustments (brightness, contrast, threshold, bg removal)
  // Click reset
  // Verify all adjustments reverted
});
```

---

## State Management Requirements

### SM1: Clean State Architecture

**Criteria**:
- ✅ No state duplication (single source of truth for each value)
- ✅ Reset handler uses existing state management hooks
- ✅ No new Context API needed (simple prop drilling sufficient)
- ✅ Default values extracted to constants (`src/lib/constants.ts`)

**Test**:
```typescript
// Code review check
// Verify constants defined in src/lib/constants.ts
export const DEFAULT_BRIGHTNESS = 0;
export const DEFAULT_CONTRAST = 0;
export const DEFAULT_THRESHOLD = 128;
```

---

### SM2: Callback Memoization

**Criteria**:
- ✅ Reset handler memoized with `useCallback`
- ✅ Dependencies correctly specified (uploadedImage, otsuThreshold, runAutoPrepAsync)
- ✅ No stale closure issues
- ✅ No unnecessary re-renders

**Test**:
```tsx
// Unit test
it('reset handler is stable across re-renders', () => {
  const { rerender } = render(<App />);
  const handler1 = screen.getByRole('button', { name: /reset/i }).onclick;
  rerender(<App />);
  const handler2 = screen.getByRole('button', { name: /reset/i }).onclick;
  expect(handler1).toBe(handler2);
});
```

---

## Accessibility Requirements (WCAG 2.2 Level AAA)

### A11Y1: Keyboard Navigation

**Criteria**:
- ✅ Reset button focusable via Tab key
- ✅ Reset button activates via Enter or Space key
- ✅ Focus indicator visible (≥3px outline, ≥3:1 contrast)
- ✅ Tab order logical (sliders → reset button)

**Test**:
```tsx
// E2E test
it('is keyboard accessible', async () => {
  // Tab to reset button
  await page.keyboard.press('Tab');
  // Verify focus visible
  // Press Enter
  await page.keyboard.press('Enter');
  // Verify reset triggered
});
```

---

### A11Y2: Screen Reader Support

**Criteria**:
- ✅ Button has ARIA label: "Reset to auto-prep defaults"
- ✅ Button state announced (disabled/enabled)
- ✅ Loading state announced (aria-busy="true")
- ✅ Semantic HTML (`<button>` element, not div)

**Test**:
```tsx
// Unit test
it('has correct ARIA attributes', () => {
  render(<ResetButton onReset={vi.fn()} loading={true} />);
  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('aria-label', 'Reset to auto-prep defaults');
  expect(button).toHaveAttribute('aria-busy', 'true');
});
```

---

### A11Y3: Visual Feedback

**Criteria**:
- ✅ Focus indicator visible on keyboard focus
- ✅ Hover state provides visual feedback
- ✅ Disabled state visually distinct (grayed out)
- ✅ Loading state shows spinner or animation
- ✅ Color contrast ≥7:1 for normal text (AAA)

**Test**:
```tsx
// Visual regression test
it('provides visual feedback for all states', () => {
  // Snapshot test for: default, hover, focus, disabled, loading
});
```

---

### A11Y4: Touch Targets

**Criteria**:
- ✅ Button minimum size: 44px × 44px (WCAG touch target)
- ✅ Button has adequate spacing from other controls (≥8px)
- ✅ No overlapping interactive elements

**Test**:
```tsx
// Unit test
it('meets touch target size requirements', () => {
  render(<ResetButton onReset={vi.fn()} />);
  const button = screen.getByRole('button');
  const { height } = button.getBoundingClientRect();
  expect(height).toBeGreaterThanOrEqual(44);
});
```

---

## Performance Requirements

### P1: Reset Performance

**Criteria**:
- ✅ Reset operation completes in <3 seconds for 2MB image
- ✅ UI remains responsive during reset
- ✅ No memory leaks (cleanup after reset)
- ✅ Processing indicator shows immediately (<100ms)

**Test**:
```tsx
// Performance test
it('completes reset within performance target', async () => {
  const start = performance.now();
  // Trigger reset
  await waitFor(() => {
    expect(screen.queryByText(/resetting/i)).not.toBeInTheDocument();
  });
  const duration = performance.now() - start;
  expect(duration).toBeLessThan(3000);
});
```

---

## Testing Requirements

### T1: Unit Test Coverage

**Criteria**:
- ✅ ResetButton component: ≥80% coverage
- ✅ All props tested (onReset, disabled, loading)
- ✅ All states tested (default, disabled, loading)
- ✅ Callbacks verified
- ✅ Edge cases covered

**Test**:
```bash
npm run test:coverage -- src/components/ResetButton
# Coverage: Statements 100%, Branches 100%, Functions 100%, Lines 100%
```

---

### T2: Integration Testing

**Criteria**:
- ✅ Full reset workflow tested (upload → auto-prep → adjust → reset)
- ✅ State transitions verified
- ✅ Preview updates confirmed
- ✅ Multiple reset operations tested
- ✅ Edge cases covered (reset before auto-prep, reset with no adjustments)

**Test**:
```tsx
// Integration test file: src/tests/integration/ResetFlow.integration.test.tsx
describe('Reset Flow Integration', () => {
  it('completes full reset workflow', async () => {
    // Test complete workflow
  });

  it('handles multiple resets', async () => {
    // Test repeated resets
  });

  it('handles edge cases', async () => {
    // Test edge cases
  });
});
```

---

### T3: E2E Testing

**Criteria**:
- ✅ Manual E2E test performed in browser
- ✅ Reset tested with real images (JPEG, PNG)
- ✅ Cross-browser testing (Chrome, Firefox, Safari)
- ✅ Responsive testing (desktop, tablet)

**Manual Test Checklist**:
```
[ ] Upload 2MB image
[ ] Run auto-prep
[ ] Adjust brightness to +50
[ ] Adjust contrast to -20
[ ] Adjust threshold to 200
[ ] Enable background removal
[ ] Click Reset button
[ ] Verify sliders return to: brightness=0, contrast=0, threshold=otsu
[ ] Verify background removal disabled
[ ] Verify preview shows auto-prep result
[ ] Click Reset again (should work)
[ ] Test keyboard navigation (Tab, Enter)
[ ] Test screen reader (NVDA/VoiceOver)
```

---

## Code Quality Requirements

### Q1: Type Safety

**Criteria**:
- ✅ All props typed with TypeScript interfaces
- ✅ No `any` types
- ✅ No TypeScript errors (`npm run typecheck`)
- ✅ Proper return types specified

**Test**:
```bash
npm run typecheck
# Exit code: 0 (no errors)
```

---

### Q2: Linting

**Criteria**:
- ✅ No ESLint errors (`npm run lint`)
- ✅ No unused variables
- ✅ No console.log statements (except error logging)
- ✅ Follows project ESLint configuration

**Test**:
```bash
npm run lint
# Exit code: 0 (no errors)
```

---

### Q3: Code Style

**Criteria**:
- ✅ Component memoized with `React.memo`
- ✅ Props destructured
- ✅ Default props documented
- ✅ JSDoc comments for component and props
- ✅ Code follows DRY principles (no duplication)

**Review Checklist**:
```
[ ] Component uses React.memo
[ ] Props interface exported
[ ] JSDoc comment with usage example
[ ] No magic numbers (constants extracted)
[ ] No code duplication
```

---

## Documentation Requirements

### D1: Component Documentation

**Criteria**:
- ✅ ResetButton component has JSDoc comment
- ✅ Props documented with descriptions
- ✅ Usage example provided in JSDoc
- ✅ Features listed in component doc

**Example**:
```typescript
/**
 * ResetButton - Component for resetting refinement controls to auto-prep defaults
 *
 * Resets all sliders (brightness, contrast, threshold) to their default values
 * and re-runs the auto-prep algorithm, discarding all manual adjustments.
 *
 * Features:
 * - Secondary button styling
 * - Loading state during reset
 * - Keyboard accessible
 * - Screen reader support
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

---

### D2: Code Comments

**Criteria**:
- ✅ Reset handler logic commented in App.tsx
- ✅ State flow documented
- ✅ Edge cases noted
- ✅ Dependencies explained

---

## Definition of Done

**All of the following must be true**:

- ✅ All functional requirements met
- ✅ All accessibility requirements met (WCAG 2.2 AAA)
- ✅ All performance requirements met
- ✅ Unit test coverage ≥80%
- ✅ All integration tests pass
- ✅ All E2E tests pass (manual checklist completed)
- ✅ No TypeScript errors
- ✅ No ESLint errors
- ✅ Code reviewed and approved
- ✅ Documentation complete
- ✅ Matches design specifications from FUNCTIONAL.md
- ✅ No regressions in existing functionality

---

**Total Acceptance Criteria**: 58 checkboxes
**Estimated Verification Time**: 30 minutes (included in Phase 4)
