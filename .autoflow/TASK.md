# Current Sprint Tasks

**Project**: CraftyPrep - Laser Engraving Image Prep Tool
**Current Sprint**: Sprint 3 - Material Presets & Settings
**Sprint Goal**: Add material-specific presets, undo/redo history, and settings persistence for enhanced user workflow
**Duration**: Week 5-6
**Status**: ACTIVE
**Progress**: 1/3 complete
**Last Updated**: 2025-10-06

---

## 🎯 Sprint Focus

**This sprint will deliver**: Material-specific presets for common laser engraving materials, undo/redo functionality, and settings persistence.

**Why it matters**: Professional users can save time with material presets optimized for Wood, Leather, Acrylic, etc., and maintain their preferred settings across sessions.

---

## 📋 Sprint Tasks (2 tasks remaining)

### Task 3.2: Undo/Redo History System

**ID**: task-021
**Priority**: MEDIUM
**Status**: REVIEWFIX
**Estimated Effort**: 5 hours

**Description**:
Implement undo/redo functionality with history stack (max 10 states) and keyboard shortcuts for iterative refinement workflow.

**Required Reading**:
- .autoflow/docs/FUNCTIONAL.md#undo-redo-functionality - Requirements
- .autoflow/docs/ARCHITECTURE.md#command-pattern - History implementation

**Design References** (full docs):
- 📘 [.autoflow/docs/FUNCTIONAL.md](.autoflow/docs/FUNCTIONAL.md) - Undo/redo requirements
- 📘 [.autoflow/docs/ARCHITECTURE.md](.autoflow/docs/ARCHITECTURE.md) - Command pattern

**Acceptance Criteria**:
- [ ] History stack implemented (max 10 states)
- [ ] Undo button reverts to previous state
- [ ] Redo button re-applies undone state
- [ ] Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Y (redo)
- [ ] New adjustment clears redo stack
- [ ] Buttons disabled when no undo/redo available
- [ ] Unit tests for history operations
- [ ] WCAG 2.2 AAA accessibility compliance

**Definition of Done**:
- [ ] All acceptance criteria met
- [ ] Unit tests passing (≥80% coverage)
- [ ] Integration tests passing
- [ ] E2E verification passed
- [ ] Code review passed
- [ ] Keyboard shortcuts working

**Dependencies**: Sprint 2 complete (all adjustments functional)

**Task Plan**: [.autoflow/tasks/task-021/TASK_PLAN.md](.autoflow/tasks/task-021/TASK_PLAN.md)

**Blockers**: None

---

### Task 3.3: Settings Persistence (localStorage)

**ID**: task-022
**Priority**: LOW
**Status**: PENDING
**Estimated Effort**: 3 hours

**Description**:
Persist user settings (custom preset, slider values) in browser localStorage for improved user experience across sessions.

**Required Reading**:
- .autoflow/docs/FUNCTIONAL.md#settings-persistence - Storage requirements
- .autoflow/docs/SECURITY.md#data-storage - Privacy considerations

**Design References** (full docs):
- 📘 [.autoflow/docs/FUNCTIONAL.md](.autoflow/docs/FUNCTIONAL.md) - Settings persistence requirements
- 📘 [.autoflow/docs/SECURITY.md](.autoflow/docs/SECURITY.md) - Privacy and storage security

**Acceptance Criteria**:
- [ ] Custom preset saved to localStorage
- [ ] Settings restored on page load
- [ ] Clear/reset localStorage option
- [ ] No sensitive data stored (privacy-focused)
- [ ] Privacy disclosure in UI (optional)
- [ ] Unit tests for storage/retrieval
- [ ] Error handling for localStorage unavailable

**Definition of Done**:
- [ ] All acceptance criteria met
- [ ] Unit tests passing (≥80% coverage)
- [ ] Integration tests passing
- [ ] E2E verification passed
- [ ] Code review passed
- [ ] Privacy compliance verified

**Dependencies**: task-020 (Material Preset System) complete

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

**Sprint 3 is complete when**:
- [ ] All 3 tasks marked COMPLETE
- [ ] Material presets working (5+ materials: Wood, Leather, Acrylic, Glass, Metal)
- [ ] Undo/redo functional with keyboard shortcuts (Ctrl+Z, Ctrl+Y)
- [ ] Settings persistence working (localStorage)
- [ ] All tests passing (unit + integration + E2E)
- [ ] WCAG 2.2 AAA compliance maintained
- [ ] No console warnings or errors

**Next Sprint**: Sprint 4 (Advanced Editing - Crop & Resize) tasks will populate this file after Sprint 3 completes

---

## 📝 Notes

- **Sprint 1 Complete**: All 10 tasks complete (archived to COMPLETED_TASKS.md)
- **Sprint 2 Complete**: All 9 tasks complete (task-011 through task-019 archived)
- **Sprint 3 Status**: Ready to begin (3 focused tasks)
- **Restructuring**: Deployment/testing tasks moved to Sprint 7 (Week 13-14)
- **Benefits**: Uninterrupted feature development through Sprint 6
- **TDD approach**: Write tests first, then implement features
- **Quality gates**: Automated `/code-review` ensures standards (no skipping)
- **Documentation-driven**: All tasks reference specific design doc sections
- **Task plans**: `/plan` command creates detailed plans in `.autoflow/tasks/task-XXX/`
- **Completed tasks**: Archived to COMPLETED_TASKS.md and marked [COMMITTED] in SPRINTS.md

---

**Ready to begin Sprint 3?** Run `/plan` to create a detailed plan for Task 3.1 (Material Preset System).
