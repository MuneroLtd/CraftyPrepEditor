# Current Sprint Tasks

**Project**: CraftyPrep - Laser Engraving Image Prep Tool
**Current Sprint**: Sprint 2 - Refinement Controls & UX
**Sprint Goal**: Add slider controls for refinement, optimize performance, enhance UX, and improve accessibility
**Duration**: Week 3-4
**Status**: ACTIVE
**Progress**: 7/11 complete (4 tasks remaining)
**Last Updated**: 2025-10-05 (task-017 committed)

---

## 🎯 Sprint Focus

**This sprint will deliver**: Refinement controls (brightness/contrast/threshold sliders), performance optimizations, comprehensive accessibility compliance, and cross-browser compatibility.

**Why it matters**: Users can fine-tune the auto-prep results to match their specific material and engraving needs, making the tool more versatile and professional.

---

## 📋 Sprint Tasks (Max 12)

### Task 2.8: JPG Export Option

**ID**: task-018
**Priority**: LOW
**Status**: PENDING
**Estimated Effort**: 3 hours

**Description**:
Add JPG export format option alongside existing PNG export.

**Required Reading**:
- .autoflow/docs/FUNCTIONAL.md#file-format-options - JPG export spec
- .autoflow/docs/ARCHITECTURE.md#export-flow - Format selection

**Design References** (full docs):
- 📘 [.autoflow/docs/FUNCTIONAL.md](.autoflow/docs/FUNCTIONAL.md) - Export formats
- 📘 [.autoflow/docs/ARCHITECTURE.md](.autoflow/docs/ARCHITECTURE.md) - Export architecture

**Acceptance Criteria**:
- [ ] Format selector UI (PNG | JPG)
- [ ] JPG export with 95% quality
- [ ] Filename includes correct extension
- [ ] PNG remains default format
- [ ] Download button text updates with format
- [ ] Unit tests for JPG export
- [ ] File size comparison (JPG < PNG)

**Definition of Done**:
- [ ] JPG export working
- [ ] Format selector functional
- [ ] Tests passing
- [ ] Code review passed

**Dependencies**: Sprint 1 task-009 (PNG download)

**Task Plan**: (Will be created by `/plan`)

**Blockers**: None

---

### Task 2.9: Accessibility Audit and Fixes

**ID**: task-019
**Priority**: HIGH
**Status**: PENDING
**Estimated Effort**: 6 hours

**Description**:
Comprehensive accessibility audit using axe and manual testing, fix all issues to WCAG 2.2 AAA.

**Required Reading**:
- .autoflow/docs/ACCESSIBILITY.md - Complete WCAG 2.2 AAA requirements
- .autoflow/docs/TESTING.md#accessibility-testing - Testing procedures

**Design References** (full docs):
- 📘 [.autoflow/docs/ACCESSIBILITY.md](.autoflow/docs/ACCESSIBILITY.md) - WCAG 2.2 AAA standards
- 📘 [.autoflow/docs/TESTING.md](.autoflow/docs/TESTING.md) - Accessibility testing

**Acceptance Criteria**:
- [ ] Lighthouse accessibility score ≥95
- [ ] Zero axe violations
- [ ] Keyboard navigation complete (Tab, Enter, Arrows, Escape)
- [ ] Screen reader tested (NVDA or VoiceOver)
- [ ] Focus indicators visible (≥3px, ≥3:1 contrast)
- [ ] Color contrast ≥7:1 (normal text), ≥4.5:1 (large)
- [ ] ARIA labels on all interactive elements
- [ ] Status announcements (aria-live regions)
- [ ] No keyboard traps
- [ ] E2E accessibility tests passing

**Definition of Done**:
- [ ] All accessibility issues resolved
- [ ] Lighthouse score ≥95
- [ ] Screen reader tested
- [ ] Tests passing

**Dependencies**: All previous Sprint 2 tasks

**Task Plan**: (Will be created by `/plan`)

**Blockers**: None

---

### Task 2.10: Cross-Browser Testing and Fixes

**ID**: task-020
**Priority**: MEDIUM
**Status**: PENDING
**Estimated Effort**: 5 hours

**Description**:
Test application on all target browsers and fix compatibility issues.

**Required Reading**:
- .autoflow/docs/TESTING.md#cross-browser-testing - Browser matrix
- .autoflow/docs/ARCHITECTURE.md#browser-compatibility - Requirements

**Design References** (full docs):
- 📘 [.autoflow/docs/TESTING.md](.autoflow/docs/TESTING.md) - Testing strategy
- 📘 [.autoflow/docs/ARCHITECTURE.md](.autoflow/docs/ARCHITECTURE.md) - Browser compatibility

**Acceptance Criteria**:
- [ ] Tested on Chrome 90+ (latest)
- [ ] Tested on Firefox 88+ (latest)
- [ ] Tested on Safari 14+ (latest)
- [ ] Tested on Edge 90+ (latest)
- [ ] Tested on Mobile Safari (iOS 14+)
- [ ] Tested on Mobile Chrome (Android 10+)
- [ ] All features work on all browsers
- [ ] Canvas rendering consistent
- [ ] Playwright multi-browser E2E passing

**Definition of Done**:
- [ ] All browsers tested and working
- [ ] Compatibility issues resolved
- [ ] E2E tests passing on all browsers
- [ ] Code review passed

**Dependencies**: All previous Sprint 2 tasks

**Task Plan**: (Will be created by `/plan`)

**Blockers**: None

---

### Task 2.11: Performance Optimization and Code Review

**ID**: task-021
**Priority**: MEDIUM
**Status**: PENDING
**Estimated Effort**: 5 hours

**Description**:
Optimize bundle size, lazy load components, improve processing speed, and conduct code review.

**Required Reading**:
- .autoflow/docs/ARCHITECTURE.md#performance-considerations - Optimization strategies
- .autoflow/docs/TESTING.md#performance-testing - Performance targets

**Design References** (full docs):
- 📘 [.autoflow/docs/ARCHITECTURE.md](.autoflow/docs/ARCHITECTURE.md) - Performance optimization
- 📘 [.autoflow/docs/TESTING.md](.autoflow/docs/TESTING.md) - Performance testing

**Acceptance Criteria**:
- [ ] Bundle size <200KB (gzipped)
- [ ] Code splitting implemented
- [ ] React.memo for canvas components
- [ ] useMemo for expensive calculations
- [ ] Lighthouse performance score ≥90
- [ ] First Contentful Paint <1.5s
- [ ] Time to Interactive <3s
- [ ] Code review checklist completed
- [ ] Refactoring applied (DRY, SOLID)
- [ ] No console warnings or errors

**Definition of Done**:
- [ ] Performance targets met
- [ ] Bundle size optimized
- [ ] Code review passed
- [ ] All metrics green

**Dependencies**: All previous Sprint 2 tasks

**Task Plan**: (Will be created by `/plan`)

**Blockers**: None

---

## 📚 Documentation References

**Read before starting any task**:
- 📘 [.autoflow/docs/PRODUCT.md](.autoflow/docs/PRODUCT.md) - Product vision, user stories, and success metrics
- 📘 [.autoflow/docs/FUNCTIONAL.md](.autoflow/docs/FUNCTIONAL.md) - Detailed functional specifications for all features
- 📘 [.autoflow/docs/ARCHITECTURE.md](.autoflow/docs/ARCHITECTURE.md) - Technical architecture, stack, and patterns
- 📘 [.autoflow/docs/TESTING.md](.autoflow/docs/TESTING.md) - Testing strategy, requirements, and standards
- 📘 [.autoflow/docs/SECURITY.md](.autoflow/docs/SECURITY.md) - Security requirements and validation rules
- 📘 [.autoflow/docs/ACCESSIBILITY.md](.autoflow/docs/ACCESSIBILITY.md) - WCAG 2.2 AAA compliance requirements

**Task-specific documentation**:
- Each task lists specific sections to read in "Required Reading"
- Read referenced sections before starting implementation
- Refer back during development for clarity

---

## 🔄 Workflow

**For each task**:
1. **`/plan`** → Creates detailed implementation plan in `.autoflow/tasks/task-XXX/`
2. **`/build`** → Implements code following TDD (tests first, then implementation)
3. **`/code-review`** → Validates DRY, SOLID, FANG principles, security, performance
4. **Loop**: Repeat `/build` → `/code-review` until all blockers resolved (status: REVIEWFIX → REVIEW)
5. **`/test`** → Runs full test suite, verifies ≥80% coverage
6. **`/commit`** → Commits code and marks task COMPLETE

**Automated workflow** (recommended):
```bash
/auto-flow    # Orchestrates: plan → build → code-review → test → commit
```

**Task status progression**:
```
PENDING → PLANNED → REVIEW → TEST → COMPLETE
           ↓         ↓        ↓
         REVIEWFIX ←→ (automatic quality loop)
```

---

## ✅ Sprint Completion Criteria

**Sprint 2 is complete when**:
- [ ] All 10 tasks marked COMPLETE
- [ ] Refinement sliders functional and performant
- [ ] All tests passing (unit + integration + E2E)
- [ ] Accessibility audit ≥95/100 (WCAG 2.2 AAA)
- [ ] Cross-browser tested and working (Chrome, Firefox, Safari, Edge)
- [ ] Performance metrics met (Lighthouse ≥90)
- [ ] Code reviewed and refactored
- [ ] Bundle size <200KB (gzipped)
- [ ] First Contentful Paint <1.5s
- [ ] Time to Interactive <3s

**Next Sprint**: Sprint 3 (Enhancement & Deployment) tasks will populate this file after Sprint 2 completes

---

## 📝 Notes

- **Sprint 1 Complete**: All 10 tasks complete and archived to COMPLETED_TASKS.md
- **Sprint 2 Progress**: 7/11 complete (task-011 through task-017 archived)
- **Remaining**: 4 tasks (task-018 through task-021)
- **TDD approach**: Write tests first, then implement features
- **Quality gates**: Automated `/code-review` ensures standards (no skipping)
- **Documentation-driven**: All tasks reference specific design doc sections
- **Task plans**: `/plan` command creates detailed plans in `.autoflow/tasks/task-XXX/`
- **Completed tasks**: Archived to COMPLETED_TASKS.md and marked [COMMITTED] in SPRINTS.md
- **Sprint auto-load**: When Sprint 2 completes, Sprint 3 tasks auto-populate from SPRINTS.md

---

**Ready to continue?** Run `/plan` to create a detailed plan for Task 2.7 (Reset Button and State Management).
