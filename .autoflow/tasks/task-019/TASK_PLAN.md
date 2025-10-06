# Task Plan: Accessibility Audit and Fixes

**Task ID**: task-019
**Sprint**: Sprint 2
**Priority**: HIGH
**Estimated Effort**: 6 hours
**Status**: PLANNED

---

## Overview

Comprehensive accessibility audit using Lighthouse and axe-core, followed by systematic fixes to achieve WCAG 2.2 Level AAA compliance. This task ensures all users, including those using assistive technologies, can fully interact with CraftyPrep.

---

## Implementation Approach

### TDD 5-Phase Approach

#### Phase 1: Automated Audit & Issue Documentation (1 hour)

**Test-First Actions**:
1. Run Lighthouse accessibility audit on https://craftyprep.demosrv.uk
   - Target score: ≥95/100
   - Document all violations
2. Run axe-core with WCAG 2.2 AAA tags
   - Use `@axe-core/playwright` in E2E tests
   - Check: `['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag21a', 'wcag21aa', 'wcag22aa']`
3. Document all violations in `.autoflow/tasks/task-019/REVIEW.md`
   - Categorize by severity: CRITICAL, HIGH, MEDIUM, LOW
   - Categorize by type: Keyboard, ARIA, Contrast, Focus, Semantic HTML
4. Create checklist for each violation

**Expected Violations** (based on common issues):
- Canvas elements without aria-label
- Insufficient color contrast ratios
- Missing focus indicators on custom components
- Form inputs without associated labels
- Missing aria-live regions for dynamic content

**Deliverables**:
- REVIEW.md with all violations documented
- Lighthouse report saved
- axe-core violations report

---

#### Phase 2: Fix Critical Issues - Keyboard & ARIA (2 hours)

**Implementation**:

1. **Keyboard Navigation Fixes**:
   - Verify tab order is logical: Skip link → Dropzone → Auto-Prep → Sliders → Download → Reset
   - Ensure no keyboard traps in any component
   - Add keyboard event handlers where missing (Enter, Space, Escape, Arrows)
   - Test Escape key to clear errors/close modals

2. **ARIA Labels & Roles**:
   - Add aria-label to all buttons without visible text (icons)
   - Add aria-label to canvas elements: `<canvas aria-label="Original image preview">`, `<canvas aria-label="Processed image preview">`
   - Verify all form inputs have associated labels (use `htmlFor` or `aria-labelledby`)
   - Add aria-describedby for help text/instructions
   - Ensure proper ARIA roles on custom components

3. **Semantic HTML**:
   - Verify proper heading hierarchy (h1 → h2 → h3, no skipped levels)
   - Ensure all interactive elements use semantic HTML (`<button>`, not `<div onClick>`)
   - Add landmark roles if missing: header, main, footer, nav, region

4. **Live Regions**:
   - Verify aria-live regions exist for:
     - Upload progress: `<div aria-live="polite" aria-busy="true">Uploading...</div>`
     - Processing status: `<div aria-live="polite">Processing image...</div>`
     - Completion: `<div aria-live="polite">Image ready</div>`
     - Errors: `<div role="alert" aria-live="assertive">Error message</div>`

**Tests**:
```typescript
// tests/e2e/accessibility.spec.ts
test('keyboard navigation - complete flow', async ({ page }) => {
  // Skip link
  await page.keyboard.press('Tab');
  await expect(page.getByText('Skip to main content')).toBeFocused();

  // Dropzone
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: /upload/i })).toBeFocused();

  // Upload with Enter key
  // ... continue full keyboard flow
});

test('ARIA labels present on all interactive elements', async ({ page }) => {
  // Verify canvas has aria-label
  const canvas = page.locator('canvas').first();
  await expect(canvas).toHaveAttribute('aria-label');

  // Verify all buttons have accessible names
  const buttons = page.getByRole('button').all();
  for (const button of await buttons) {
    await expect(button).toHaveAccessibleName();
  }
});
```

**Deliverables**:
- All keyboard navigation paths working
- All interactive elements have accessible names
- Proper ARIA usage throughout
- No keyboard traps
- Tests passing

---

#### Phase 3: Fix Visual Accessibility - Contrast & Focus (1.5 hours)

**Implementation**:

1. **Color Contrast Fixes** (≥7:1 for normal text, ≥4.5:1 for large text):
   - Audit all text colors using Chrome DevTools or WebAIM Contrast Checker
   - Update Tailwind classes to use high-contrast colors:
     - `text-gray-500` → `text-gray-700` or `text-gray-800`
     - `text-blue-500` → `text-blue-700`
   - Verify button states (hover, active, disabled) maintain contrast
   - Check placeholder text contrast (often fails AAA)

2. **Focus Indicators** (≥3px, ≥3:1 contrast):
   - Add global focus styles in `src/styles/index.css`:
     ```css
     *:focus-visible {
       outline: 3px solid #0066cc;
       outline-offset: 2px;
     }
     ```
   - Verify focus indicators visible on:
     - Buttons (including icon buttons)
     - Links (skip link, footer links)
     - Form inputs (file input, sliders)
     - Custom components (dropzone)
   - Test focus indicator contrast against all backgrounds

3. **Touch Target Sizes** (≥24×24px minimum, ≥44×44px ideal):
   - Audit all interactive elements
   - Increase padding/size for small buttons:
     ```tsx
     <button className="min-h-[44px] min-w-[44px] p-2">
     ```
   - Verify slider thumbs are ≥24×24px
   - Check icon buttons have adequate touch area

4. **Text Spacing & Line Height** (line-height ≥1.5):
   - Verify body text has line-height: 1.5 or higher
   - Ensure paragraph spacing ≥2× font size
   - Test text remains readable at 200% zoom (no horizontal scroll)

**Tests**:
```typescript
// tests/e2e/accessibility.spec.ts
test('color contrast meets AAA standards', async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2aaa'])
    .analyze();

  const contrastViolations = results.violations.filter(
    v => v.id === 'color-contrast-enhanced'
  );

  expect(contrastViolations).toEqual([]);
});

test('focus indicators visible and high contrast', async ({ page }) => {
  // Tab through elements and verify focus indicator
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  const focusedElement = page.locator(':focus');
  const outlineColor = await focusedElement.evaluate(el =>
    window.getComputedStyle(el).outlineColor
  );

  expect(outlineColor).toBeTruthy();
  // Visual verification via screenshot
  await page.screenshot({ path: 'focus-indicator-verification.png' });
});
```

**Deliverables**:
- All text meets 7:1 contrast ratio (normal) or 4.5:1 (large)
- Focus indicators visible on all interactive elements (≥3px, ≥3:1 contrast)
- All touch targets ≥24×24px
- Text spacing and line height compliant
- Tests passing

---

#### Phase 4: Manual Testing & Edge Cases (1 hour)

**Manual Testing Checklist**:

1. **Keyboard Navigation** (no mouse):
   - [ ] Tab through entire page in logical order
   - [ ] Shift+Tab reverses tab order correctly
   - [ ] Enter key activates all buttons
   - [ ] Space key activates buttons (not links)
   - [ ] Arrow keys adjust sliders
   - [ ] Escape key clears errors
   - [ ] No keyboard traps anywhere
   - [ ] Focus visible on all interactive elements

2. **Screen Reader Testing** (VoiceOver on macOS or NVDA on Windows):
   - [ ] All headings announced with correct level
   - [ ] All buttons announced with accessible name
   - [ ] All form inputs announced with label
   - [ ] Canvas elements announced with description
   - [ ] Slider values announced on change
   - [ ] Loading states announced ("Processing image...")
   - [ ] Completion announced ("Image ready")
   - [ ] Errors announced with assertive priority
   - [ ] No redundant ARIA (buttons don't say "button button")

3. **Visual Testing**:
   - [ ] Zoom to 200% - no horizontal scroll
   - [ ] Zoom to 200% - all content remains accessible
   - [ ] High contrast mode - all content visible
   - [ ] Focus indicators visible in all states
   - [ ] All text readable and high contrast

4. **Touch/Mobile Testing** (if applicable):
   - [ ] All touch targets ≥44×44px
   - [ ] Sliders adjustable on mobile
   - [ ] No hover-only interactions

**Document Additional Issues**:
- Any issues found during manual testing go into REVIEW.md
- Update fix plan based on findings

**Deliverables**:
- Completed manual testing checklist
- Any additional issues documented and fixed
- Screen reader test results documented

---

#### Phase 5: Comprehensive E2E Tests (0.5 hours)

**Expand E2E Test Coverage**:

```typescript
// tests/e2e/accessibility.spec.ts

test.describe('Accessibility - Complete Coverage', () => {
  test('no axe violations on initial load', async ({ page }) => {
    await page.goto('https://craftyprep.demosrv.uk');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('no axe violations after image upload', async ({ page }) => {
    await page.goto('https://craftyprep.demosrv.uk');
    await uploadTestImage(page);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('no axe violations after auto-prep', async ({ page }) => {
    await page.goto('https://craftyprep.demosrv.uk');
    await uploadTestImage(page);
    await page.getByRole('button', { name: /auto-prep/i }).click();
    await page.waitForSelector('[data-testid="processed-preview"]');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('keyboard navigation - complete upload flow', async ({ page }) => {
    await page.goto('https://craftyprep.demosrv.uk');

    // Tab to skip link
    await page.keyboard.press('Tab');
    await expect(page.getByText('Skip to main content')).toBeFocused();

    // Skip to main content
    await page.keyboard.press('Enter');

    // Focus should be on main content
    const main = page.locator('main');
    const focusedInMain = await main.evaluate(el =>
      el.contains(document.activeElement)
    );
    expect(focusedInMain).toBe(true);
  });

  test('keyboard navigation - slider adjustments', async ({ page }) => {
    await page.goto('https://craftyprep.demosrv.uk');
    await uploadAndProcessImage(page);

    // Tab to brightness slider
    const brightnessSlider = page.getByLabel(/brightness/i);
    await brightnessSlider.focus();

    // Get initial value
    const initialValue = await brightnessSlider.inputValue();

    // Adjust with arrow keys
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');

    // Verify value changed
    const newValue = await brightnessSlider.inputValue();
    expect(parseInt(newValue)).toBeGreaterThan(parseInt(initialValue));
  });

  test('screen reader announcements - processing state', async ({ page }) => {
    await page.goto('https://craftyprep.demosrv.uk');

    // Check aria-live region exists
    const liveRegion = page.locator('[aria-live]');
    await expect(liveRegion).toBeAttached();

    await uploadTestImage(page);
    await page.getByRole('button', { name: /auto-prep/i }).click();

    // Verify processing announcement
    await expect(liveRegion).toContainText(/processing|loading/i);

    // Wait for completion
    await page.waitForSelector('[data-testid="processed-preview"]');

    // Verify completion announcement
    await expect(liveRegion).toContainText(/complete|ready/i);
  });

  test('screen reader announcements - error state', async ({ page }) => {
    await page.goto('https://craftyprep.demosrv.uk');

    // Trigger error (upload invalid file type)
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('invalid file'),
    });

    // Verify error announcement
    const errorAlert = page.locator('[role="alert"]');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toHaveAttribute('aria-live', 'assertive');
  });

  test('focus management - no focus lost during state changes', async ({ page }) => {
    await page.goto('https://craftyprep.demosrv.uk');
    await uploadTestImage(page);

    // Focus auto-prep button
    const autoPrepBtn = page.getByRole('button', { name: /auto-prep/i });
    await autoPrepBtn.focus();
    await expect(autoPrepBtn).toBeFocused();

    // Click button
    await autoPrepBtn.click();

    // Verify focus is managed (not lost to body)
    const focusedElement = page.locator(':focus');
    const tagName = await focusedElement.evaluate(el => el.tagName);
    expect(tagName).not.toBe('BODY');
  });

  test('Lighthouse accessibility score ≥95', async ({ page }) => {
    await page.goto('https://craftyprep.demosrv.uk');

    // Note: Lighthouse integration requires @playwright/test lighthouse plugin
    // This is a placeholder - actual implementation will use lighthouse CI
    // or manual Lighthouse audit verification

    // For now, verify key metrics with axe
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2aaa'])
      .analyze();

    expect(results.violations).toEqual([]);
    expect(results.passes.length).toBeGreaterThan(0);
  });
});
```

**Deliverables**:
- Comprehensive E2E test suite
- All tests passing
- Zero axe violations across all states
- Keyboard navigation tests covering all flows
- Screen reader announcement tests

---

## Testing Strategy

### Automated Tests
- **Lighthouse**: Target score ≥95/100
- **axe-core**: Zero violations with WCAG 2.2 AAA tags
- **Playwright**: E2E tests for keyboard navigation, focus management, announcements

### Manual Tests
- **Keyboard**: Complete navigation without mouse
- **Screen Reader**: VoiceOver (macOS) or NVDA (Windows)
- **Zoom**: 200% browser zoom, verify no horizontal scroll
- **Visual**: Focus indicators, color contrast, touch targets

### Test Coverage
- Initial page load
- After image upload
- After auto-prep processing
- During slider adjustments
- Error states
- Loading states

---

## Documentation References

- **Primary**: [.autoflow/docs/ACCESSIBILITY.md] - WCAG 2.2 AAA complete requirements
- **Testing**: [.autoflow/docs/TESTING.md#accessibility-testing] - Testing procedures
- **Standards**: WCAG 2.2 Level AAA (https://www.w3.org/WAI/WCAG22/quickref/)

---

## Success Criteria

1. **Automated**:
   - [ ] Lighthouse accessibility score ≥95/100
   - [ ] Zero axe-core violations (WCAG 2.2 AAA tags)
   - [ ] All E2E accessibility tests passing

2. **Keyboard**:
   - [ ] Complete keyboard navigation working
   - [ ] No keyboard traps
   - [ ] Logical tab order
   - [ ] All keyboard shortcuts working (Enter, Space, Arrows, Escape)

3. **Visual**:
   - [ ] Focus indicators visible (≥3px, ≥3:1 contrast)
   - [ ] Color contrast ≥7:1 (normal text), ≥4.5:1 (large text)
   - [ ] Touch targets ≥24×24px
   - [ ] No horizontal scroll at 200% zoom

4. **Screen Reader**:
   - [ ] All elements announced correctly
   - [ ] Loading states announced
   - [ ] Errors announced with assertive priority
   - [ ] Slider values announced on change

5. **Semantic HTML**:
   - [ ] Proper heading hierarchy
   - [ ] All ARIA labels correct
   - [ ] No redundant ARIA
   - [ ] Valid HTML (no parsing errors)

---

## Risk Assessment

**LOW RISK**:
- Existing accessibility E2E test already in place
- Most components likely already accessible (shadcn/ui components)
- Clear WCAG 2.2 AAA guidelines to follow

**Potential Issues**:
- Canvas elements may need additional ARIA descriptions
- Custom slider components may need enhanced ARIA
- Color contrast may require design adjustments

**Mitigation**:
- Use axe-core to identify issues systematically
- Reference shadcn/ui accessibility patterns
- Test with real screen readers (VoiceOver/NVDA)

---

## Estimated Breakdown

| Phase | Description | Duration |
|-------|-------------|----------|
| 1 | Automated audit & documentation | 1h |
| 2 | Fix critical issues (keyboard & ARIA) | 2h |
| 3 | Fix visual issues (contrast & focus) | 1.5h |
| 4 | Manual testing & edge cases | 1h |
| 5 | Comprehensive E2E tests | 0.5h |
| **Total** | | **6h** |

---

## Next Steps

After planning approval (`/plan` complete):
1. Run `/build` to implement accessibility fixes
2. Follow TDD approach: Test → Fix → Verify
3. Document all violations and fixes
4. Verify with manual testing
5. Run `/test` for unit/integration tests
6. Run `/verify-implementation` for E2E tests
7. Run `/code-review` for final validation

---

**Status**: PLANNED
**Ready for**: `/build`
