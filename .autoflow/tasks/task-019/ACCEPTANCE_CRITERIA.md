# Acceptance Criteria: Accessibility Audit and Fixes

**Task ID**: task-019
**Sprint**: Sprint 2

---

## Functional Requirements

### Automated Accessibility Compliance

- [ ] **Lighthouse accessibility score ≥95/100**
  - Run on https://craftyprep.demosrv.uk
  - Score calculated across all accessibility categories
  - No errors in accessibility audit

- [ ] **Zero axe-core violations**
  - Test with tags: `['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag21a', 'wcag21aa', 'wcag22aa']`
  - All violations documented and fixed
  - Re-run audit confirms zero violations

### Keyboard Navigation

- [ ] **Complete keyboard navigation working**
  - Tab through all interactive elements in logical order
  - Shift+Tab reverses navigation correctly
  - Enter key activates all buttons
  - Space key activates buttons (not links)
  - Arrow keys adjust sliders
  - Escape key clears errors/closes modals

- [ ] **No keyboard traps**
  - Can navigate into and out of all components
  - Focus never stuck in any component
  - Can complete all workflows with keyboard only

- [ ] **Logical tab order**
  - Skip link → Dropzone → Auto-Prep → Sliders → Download → Reset
  - Order follows visual layout
  - No unexpected focus jumps

### Visual Accessibility

- [ ] **Focus indicators visible**
  - Minimum 3px outline thickness
  - Minimum 3:1 contrast ratio with background
  - Visible on all interactive elements
  - Consistent styling across all components

- [ ] **Color contrast meets AAA standards**
  - Normal text: ≥7:1 contrast ratio
  - Large text (18pt+ or 14pt+ bold): ≥4.5:1 contrast ratio
  - All text, icons, and UI components comply
  - Verified with Chrome DevTools or WebAIM Contrast Checker

- [ ] **Touch targets adequate size**
  - All interactive elements ≥24×24px (AAA minimum)
  - Ideally ≥44×44px for better usability
  - Includes buttons, links, form inputs, slider thumbs

### ARIA & Semantic HTML

- [ ] **ARIA labels on all interactive elements**
  - All buttons have accessible names
  - All form inputs have associated labels
  - Canvas elements have descriptive aria-label
  - Icon-only buttons have aria-label
  - Custom components have proper ARIA roles

- [ ] **Status announcements working**
  - aria-live regions present for dynamic content
  - Upload progress announced (aria-live="polite")
  - Processing status announced (aria-live="polite")
  - Completion announced (aria-live="polite")
  - Errors announced (role="alert", aria-live="assertive")

- [ ] **Semantic HTML structure**
  - Proper heading hierarchy (h1 → h2 → h3, no skips)
  - Landmark roles: header, main, footer, nav
  - All interactive elements use semantic HTML (<button>, not <div onClick>)
  - Valid HTML (no parsing errors)

### Screen Reader Compatibility

- [ ] **Screen reader tested (NVDA or VoiceOver)**
  - All headings announced with correct level
  - All buttons announced with accessible name
  - All form inputs announced with label
  - Slider values announced on change
  - Loading/processing states announced
  - Error messages announced
  - No redundant announcements (e.g., "button button")

### Responsive Accessibility

- [ ] **200% zoom support**
  - No horizontal scrolling at 200% zoom
  - All content remains accessible and readable
  - Layout adapts without breaking
  - Text remains legible

- [ ] **Text spacing compliant**
  - Line height ≥1.5
  - Paragraph spacing ≥2× font size
  - Text can be adjusted without loss of content

---

## Testing Requirements

### E2E Accessibility Tests Passing

- [ ] **axe violations test**
  ```typescript
  test('no axe violations', async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
  ```

- [ ] **Keyboard navigation test**
  ```typescript
  test('keyboard navigation complete flow', async ({ page }) => {
    // Tab through skip link → dropzone → auto-prep → sliders → download
    // Verify focus order and activation
  });
  ```

- [ ] **Screen reader announcements test**
  ```typescript
  test('screen reader announcements', async ({ page }) => {
    // Verify aria-live regions announce state changes
    // Verify errors announced with assertive priority
  });
  ```

- [ ] **Focus indicator test**
  ```typescript
  test('focus indicators visible', async ({ page }) => {
    // Tab through elements, verify outline visible
    // Check contrast ratio of focus indicator
  });
  ```

- [ ] **Color contrast test**
  ```typescript
  test('color contrast AAA', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2aaa'])
      .analyze();
    const contrastViolations = results.violations.filter(
      v => v.id === 'color-contrast-enhanced'
    );
    expect(contrastViolations).toEqual([]);
  });
  ```

---

## Manual Verification

### Keyboard Testing Checklist

- [ ] Tab through entire page without mouse
- [ ] Shift+Tab works in reverse
- [ ] All buttons activate with Enter
- [ ] All sliders adjust with Arrow keys
- [ ] Escape clears errors
- [ ] Focus always visible
- [ ] No keyboard traps

### Screen Reader Testing Checklist

- [ ] Test with VoiceOver (macOS) or NVDA (Windows)
- [ ] All headings announced
- [ ] All buttons announced with name
- [ ] All form inputs announced with label
- [ ] Canvas elements described
- [ ] Slider values announced
- [ ] Loading states announced
- [ ] Errors announced assertively

### Visual Testing Checklist

- [ ] Zoom to 200% in browser
- [ ] Verify no horizontal scroll
- [ ] Verify all content readable
- [ ] Check focus indicators on all elements
- [ ] Verify color contrast with DevTools

---

## Performance Criteria

- [ ] Accessibility tests complete in <30 seconds
- [ ] No performance degradation from accessibility features
- [ ] Screen reader announcements not excessive (no spam)

---

## Documentation

- [ ] All axe violations documented in REVIEW.md
- [ ] All fixes documented with before/after
- [ ] Manual testing results documented
- [ ] Screen reader testing notes documented

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Lighthouse accessibility score ≥95
- [ ] Zero axe-core violations
- [ ] All E2E tests passing
- [ ] Manual keyboard testing complete
- [ ] Screen reader testing complete
- [ ] Code reviewed and approved
- [ ] Documentation complete

---

## WCAG 2.2 Level AAA Compliance

This task ensures compliance with WCAG 2.2 Level AAA across:

1. **Perceivable**: Text alternatives, color contrast, text spacing
2. **Operable**: Keyboard accessibility, focus indicators, no keyboard traps
3. **Understandable**: Clear labels, consistent navigation, error handling
4. **Robust**: Valid HTML, proper ARIA, assistive technology support

---

**Reference**: See [.autoflow/docs/ACCESSIBILITY.md] for complete WCAG 2.2 AAA requirements
