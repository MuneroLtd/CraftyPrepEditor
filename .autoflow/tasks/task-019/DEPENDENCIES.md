# Dependencies: Accessibility Audit and Fixes

**Task ID**: task-019
**Sprint**: Sprint 2

---

## Direct Dependencies

This task depends on **all previous Sprint 2 tasks** being complete:

### task-013: Brightness Slider
- **Why**: Need final slider implementation to audit ARIA labels, keyboard navigation, value announcements
- **Impact**: Slider component must be accessible (labels, keyboard support, screen reader announcements)

### task-014: Contrast Slider
- **Why**: Need final slider implementation to audit ARIA labels, keyboard navigation, value announcements
- **Impact**: Slider component must be accessible (labels, keyboard support, screen reader announcements)

### task-015: Threshold Slider with Auto-Calculation
- **Why**: Need final slider implementation with Otsu auto-calculation to audit accessibility
- **Impact**: Slider component must be accessible, auto-calculated value must be announced

### task-016: Reset Button
- **Why**: Need final reset button implementation to audit keyboard activation, focus management
- **Impact**: Button must be keyboard accessible (Enter/Space), have clear label, announce action

### task-017: Background Removal with Sensitivity Control
- **Why**: Need final toggle and slider implementation to audit accessibility
- **Impact**: Toggle must be keyboard accessible, slider must have ARIA labels, changes must be announced

### task-018: JPG Export with Conversion
- **Why**: Need final download button implementation to audit keyboard activation, ARIA labels
- **Impact**: Button must be keyboard accessible, have clear label, announce download action

---

## Indirect Dependencies

### Sprint 1 Tasks (Foundation)
- All Sprint 1 tasks provide the base UI that will be audited
- Layout, header, footer, file upload components all require accessibility compliance

---

## Technical Dependencies

### Testing Tools
- **@axe-core/playwright**: Already installed (verified in existing accessibility.spec.ts)
- **Lighthouse**: Built into Chrome DevTools (manual audit) or Lighthouse CI (automated)
- **Screen Reader**: VoiceOver (macOS built-in) or NVDA (Windows, free download)

### Browser Support
- Chrome/Edge: For Lighthouse and axe DevTools extension
- Firefox: For axe DevTools extension testing
- Safari: For VoiceOver testing

---

## Blocking Criteria

This task is **BLOCKED** until:
- [ ] task-013 status = COMMITTED
- [ ] task-014 status = COMMITTED
- [ ] task-015 status = COMMITTED
- [ ] task-016 status = COMMITTED
- [ ] task-017 status = COMMITTED
- [ ] task-018 status = COMMITTED

**Reason**: Accessibility audit must be performed on the final, complete UI implementation. Adding or modifying components after the audit would invalidate results and require re-testing.

---

## Downstream Impact

Tasks depending on task-019:
- **None** - This is the final task in Sprint 2
- Accessibility fixes may be referenced in Sprint 3 (Production Deployment) to ensure accessibility remains compliant

---

## Risk Assessment

**LOW RISK**:
- All dependency tasks are in progress or complete
- Accessibility testing tools already in place
- Clear WCAG 2.2 AAA guidelines to follow

**MEDIUM RISK**:
- Accessibility fixes may require design changes (color contrast adjustments)
- Screen reader testing may reveal unexpected issues
- Manual testing time may vary based on issues found

---

## Parallel Work Opportunities

**Cannot be parallelized** with other tasks because:
- Audit must be performed on complete, final implementation
- Fixes may affect multiple components across the application
- Comprehensive testing requires stable codebase

---

**Status**: All dependencies in Sprint 2 are in progress
**Next Action**: Wait for task-013 through task-018 to be COMMITTED before starting
