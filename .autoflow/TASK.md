# Current Sprint Tasks

**Project**: CraftyPrep - Laser Engraving Image Prep Tool
**Current Sprint**: Sprint 1 - Foundation & Core Processing
**Sprint Goal**: Deliver working image upload and basic auto-prep functionality with MVP feature set
**Duration**: Week 1-2
**Status**: ACTIVE
**Progress**: 7/10 complete
**Last Updated**: 2025-10-05

---

## 🎯 Sprint Focus

**This sprint will deliver**: A working end-to-end workflow where users can upload an image, click "Auto-Prep", and download a laser-ready PNG file.

**Why it matters**: This provides immediate value to laser engraving enthusiasts by solving the tedious image preparation problem with a single click.

---

## 📋 Sprint Tasks (Max 10)

### Task 1.5: Grayscale Conversion Algorithm

**ID**: task-005
**Priority**: HIGH
**Status**: COMPLETE
**Estimated Effort**: 3 hours

**Description**:
Implement the weighted grayscale conversion algorithm (luminosity method: 0.299R + 0.587G + 0.114B) as the first step in the auto-prep processing pipeline.

**Required Reading**:
- .autoflow/docs/FUNCTIONAL.md#auto-prep-processing - Complete algorithm specification with formulas
- .autoflow/docs/ARCHITECTURE.md#processing-layer - ImageProcessor class design and pure function patterns

**Design References** (full docs):
- 📘 [.autoflow/docs/FUNCTIONAL.md](.autoflow/docs/FUNCTIONAL.md) - Algorithm details
- 📘 [.autoflow/docs/ARCHITECTURE.md](.autoflow/docs/ARCHITECTURE.md) - Processing architecture

**Acceptance Criteria**:
- [ ] Grayscale conversion function implemented as pure function
- [ ] Uses correct weighted formula: 0.299 × R + 0.587 × G + 0.114 × B
- [ ] Processes entire ImageData object efficiently
- [ ] Handles edge cases: all-white, all-black, fully transparent pixels
- [ ] Unit tests with known input/output values
- [ ] Unit tests for edge cases
- [ ] Performance: <1 second for 2MB image (5MP @ 2MB)
- [ ] Function signature properly typed (TypeScript)
- [ ] No side effects (pure function)
- [ ] Tests written and passing (≥80% coverage)
- [ ] Code review passed

**Definition of Done**:
- [ ] Algorithm matches specification exactly
- [ ] All unit tests passing
- [ ] Performance target met
- [ ] Edge cases covered
- [ ] TypeScript types correct

**Dependencies**: Task 1.4 (needs ImageData from canvas)

**Task Plan**: (Will be added by /plan command)

**Blockers**: None

---

### Task 1.6: Histogram Equalization Algorithm

**ID**: task-006
**Priority**: HIGH
**Status**: COMPLETE
**Estimated Effort**: 4 hours

**Description**:
Implement histogram equalization to enhance image contrast automatically as part of the auto-prep pipeline. This step makes details more visible for laser engraving.

**Required Reading**:
- .autoflow/docs/FUNCTIONAL.md#auto-prep-processing - Histogram equalization algorithm steps
- .autoflow/docs/ARCHITECTURE.md#processing-patterns - Pipeline pattern for chaining algorithms

**Design References** (full docs):
- 📘 [.autoflow/docs/FUNCTIONAL.md](.autoflow/docs/FUNCTIONAL.md) - Algorithm specification
- 📘 [.autoflow/docs/ARCHITECTURE.md](.autoflow/docs/ARCHITECTURE.md) - Pipeline architecture

**Acceptance Criteria**:
- [ ] Histogram calculation implemented (256 bins for 0-255 values)
- [ ] Cumulative Distribution Function (CDF) computed correctly
- [ ] CDF normalized to 0-255 range
- [ ] Pixel values mapped through normalized CDF
- [ ] Results in measurably enhanced contrast
- [ ] Unit tests with sample images (before/after comparison)
- [ ] Performance: <1 second for 2MB image
- [ ] Deterministic: same input always produces same output
- [ ] Pure function (no side effects)
- [ ] Tests written and passing (≥80% coverage)
- [ ] Code review passed

**Definition of Done**:
- [ ] Algorithm implementation correct
- [ ] Contrast enhancement verified visually and programmatically
- [ ] Performance target met
- [ ] Deterministic behavior confirmed
- [ ] Integration with pipeline working

**Dependencies**: Task 1.5 (works on grayscale image)

**Task Plan**: [.autoflow/tasks/task-006/TASK_PLAN.md](.autoflow/tasks/task-006/TASK_PLAN.md)

**Blockers**: None

---

### Task 1.7: Otsu's Threshold Algorithm

**ID**: task-007
**Priority**: HIGH
**Status**: COMPLETE
**Estimated Effort**: 5 hours

**Description**:
Implement Otsu's method for automatic optimal threshold calculation and binarization. This creates the final high-contrast black-and-white image optimized for laser engraving.

**Required Reading**:
- .autoflow/docs/FUNCTIONAL.md#auto-prep-processing - Otsu's algorithm specification and binarization
- .autoflow/docs/ARCHITECTURE.md#processing-layer - Integration with processing pipeline

**Design References** (full docs):
- 📘 [.autoflow/docs/FUNCTIONAL.md](.autoflow/docs/FUNCTIONAL.md) - Complete algorithm
- 📘 [.autoflow/docs/ARCHITECTURE.md](.autoflow/docs/ARCHITECTURE.md) - Processing layer design

**Acceptance Criteria**:
- [ ] Histogram of grayscale image calculated
- [ ] Between-class variance computed for each threshold value (0-255)
- [ ] Optimal threshold selected (maximum variance)
- [ ] Binarization applied: pixels < threshold → 0 (black), else → 255 (white)
- [ ] Threshold value returned for display/refinement
- [ ] Unit tests with images of known optimal thresholds
- [ ] Performance: <2 seconds for 2MB image
- [ ] Handles low-contrast images gracefully (doesn't crash)
- [ ] Handles high-contrast images (already optimized)
- [ ] Tests written and passing (≥80% coverage)
- [ ] Code review passed

**Definition of Done**:
- [ ] Otsu's method implemented correctly
- [ ] Binarization produces clean black/white images
- [ ] Optimal threshold calculation verified
- [ ] Performance acceptable
- [ ] Edge cases handled

**Dependencies**: Task 1.6 (works on equalized grayscale)

**Task Plan**: (Will be added by /plan command)

**Blockers**: None

---

### Task 1.8: Auto-Prep Button and Processing Flow

**ID**: task-008
**Priority**: HIGH
**Status**: COMPLETE
**Estimated Effort**: 6 hours
**Actual Effort**: 4 hours

**Description**:
Wire up the Auto-Prep button to execute the complete processing pipeline (grayscale → equalization → threshold) and display results with loading states and error handling.

**Required Reading**:
- .autoflow/docs/FUNCTIONAL.md#auto-prep-processing - Complete workflow, UI requirements, loading states
- .autoflow/docs/ARCHITECTURE.md#data-flow - Processing flow diagram and pipeline execution

**Design References** (full docs):
- 📘 [.autoflow/docs/FUNCTIONAL.md](.autoflow/docs/FUNCTIONAL.md) - Auto-prep feature spec
- 📘 [.autoflow/docs/ARCHITECTURE.md](.autoflow/docs/ARCHITECTURE.md) - Data flow and pipeline

**Acceptance Criteria**:
- [ ] Auto-Prep button component created with icon
- [ ] Button disabled when no image loaded (with tooltip)
- [ ] Loading state during processing (button shows spinner + "Processing...")
- [ ] Pipeline executes in order: grayscale → histogram equalization → Otsu threshold
- [ ] Processed result displayed in right-side preview canvas
- [ ] Processing time <5 seconds for 2MB image
- [ ] Error handling for processing failures (display user-friendly message)
- [ ] Success/completion feedback (visual confirmation)
- [ ] Original image preserved on left for comparison
- [ ] Integration test for complete pipeline
- [ ] Keyboard accessible (Tab to button, Enter to activate)
- [ ] Screen reader announces processing status
- [ ] Tests written and passing (≥80% coverage)
- [ ] Code review passed

**Definition of Done**:
- [ ] Full pipeline working end-to-end
- [ ] Processing performance acceptable
- [ ] Error handling robust
- [ ] UI feedback clear
- [ ] Accessibility working

**Dependencies**: Tasks 1.5, 1.6, 1.7 (all algorithms), Task 1.4 (preview canvas)

**Task Plan**: (Will be added by /plan command)

**Blockers**: None

---

### Task 1.9: PNG Export and Download

**ID**: task-009
**Priority**: HIGH
**Status**: PENDING
**Estimated Effort**: 4 hours

**Description**:
Implement PNG export from the processed canvas and trigger browser download with properly generated filename (original_laserprep.png).

**Required Reading**:
- .autoflow/docs/FUNCTIONAL.md#image-export-and-download - Export specifications, filename generation
- .autoflow/docs/ARCHITECTURE.md#export-flow - Canvas to Blob to download implementation

**Design References** (full docs):
- 📘 [.autoflow/docs/FUNCTIONAL.md](.autoflow/docs/FUNCTIONAL.md) - Export requirements
- 📘 [.autoflow/docs/ARCHITECTURE.md](.autoflow/docs/ARCHITECTURE.md) - Export architecture

**Acceptance Criteria**:
- [ ] Download button component created
- [ ] Canvas exported to PNG Blob using `toBlob()`
- [ ] Filename generated: `{original_name}_laserprep.png`
- [ ] Special characters sanitized in filename (replace `/\?%*:|"<>` with `_`)
- [ ] Download triggered via blob URL and anchor element
- [ ] Blob URLs cleaned up after download (prevent memory leaks)
- [ ] Button disabled until processed image exists
- [ ] Button shows format in text: "Download PNG"
- [ ] Unit tests for filename generation and sanitization
- [ ] Integration test for complete export flow
- [ ] Keyboard accessible
- [ ] Tests written and passing (≥80% coverage)
- [ ] Code review passed

**Definition of Done**:
- [ ] Export working reliably
- [ ] Downloaded PNG matches preview exactly
- [ ] Filename generation correct
- [ ] Memory properly cleaned up
- [ ] All tests passing

**Dependencies**: Task 1.8 (processed image must exist)

**Task Plan**: (Will be added by /plan command)

**Blockers**: None

---

### Task 1.10: CI Pipeline and Testing Setup

**ID**: task-010
**Priority**: MEDIUM
**Status**: PENDING
**Estimated Effort**: 6 hours

**Description**:
Set up continuous integration pipeline with GitHub Actions for automated testing, linting, type checking, and code coverage reporting. Establish testing infrastructure for entire project.

**Required Reading**:
- .autoflow/docs/TESTING.md#continuous-integration - Complete CI configuration and pipeline steps
- .autoflow/docs/ARCHITECTURE.md#development-tools - Testing tools and framework setup

**Design References** (full docs):
- 📘 [.autoflow/docs/TESTING.md](.autoflow/docs/TESTING.md) - Complete testing strategy
- 📘 [.autoflow/docs/ARCHITECTURE.md](.autoflow/docs/ARCHITECTURE.md) - Development tools

**Acceptance Criteria**:
- [ ] Vitest configured for unit testing with coverage
- [ ] React Testing Library installed and configured
- [ ] GitHub Actions workflow created (.github/workflows/test.yml)
- [ ] Pipeline runs: lint → typecheck → unit tests → coverage check
- [ ] Code coverage reporting enabled (codecov or similar)
- [ ] Coverage threshold enforced: ≥80%
- [ ] Playwright installed and configured for E2E tests
- [ ] Happy path E2E test created: upload image → auto-prep → download
- [ ] CI runs on push to main/develop and pull requests
- [ ] CI badge added to README (optional)
- [ ] All tests currently passing
- [ ] Pipeline execution time <5 minutes

**Definition of Done**:
- [ ] CI pipeline running successfully
- [ ] All checks passing (lint, typecheck, tests)
- [ ] Coverage at or above 80%
- [ ] E2E test working
- [ ] Documentation updated

**Dependencies**: All previous tasks (tests entire system)

**Task Plan**: (Will be added by /plan command)

**Blockers**: None

---

## 📚 Documentation References

**Read before starting any task**:
- 📘 [.autoflow/docs/PRODUCT.md](.autoflow/docs/PRODUCT.md) - Product vision, user stories, and success metrics
- 📘 [.autoflow/docs/FUNCTIONAL.md](.autoflow/docs/FUNCTIONAL.md) - Detailed functional specifications for all features
- 📘 [.autoflow/docs/ARCHITECTURE.md](.autoflow/docs/ARCHITECTURE.md) - Technical architecture, stack, and patterns
- 📘 [.autoflow/docs/TESTING.md](.autoflow/docs/TESTING.md) - Testing strategy, requirements, and standards
- 📘 [.autoflow/docs/SECURITY.md](.autoflow/docs/SECURITY.md) - Security requirements and validation rules

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

**Sprint 1 is complete when**:
- [ ] All 10 tasks marked COMPLETE
- [ ] All tests passing (unit + integration + E2E)
- [ ] Code coverage ≥80% (per .autoflow/docs/TESTING.md)
- [ ] All code reviews passed (DRY, SOLID, FANG validated)
- [ ] All security scans passed (npm audit clean)
- [ ] CI pipeline green
- [ ] Working end-to-end workflow: Upload → Auto-Prep → Download
- [ ] No console errors or warnings
- [ ] Responsive design working (desktop ≥1024px, tablet ≥768px)
- [ ] Accessibility basics working (keyboard nav, screen reader)

**Next Sprint**: Sprint 2 (Refinement Controls & UX) tasks will populate this file after Sprint 1 completes

---

## 📝 Notes

- **Max 10 tasks** per sprint for focused execution and predictable velocity
- **TDD approach**: Write tests first, then implement features
- **Quality gates**: Automated `/code-review` ensures standards (no skipping)
- **Documentation-driven**: All tasks reference specific design doc sections
- **Task plans**: `/plan` command creates detailed plans in `.autoflow/tasks/task-XXX/`
- **Completed tasks**: Moved to COMPLETED_TASKS.md and removed from TASK.md
- **Sprint auto-load**: When Sprint 1 completes, Sprint 2 tasks auto-populate from SPRINTS.md

---

**Ready to start?** Run `/plan` to create a detailed plan for Task 1.1 (Project Setup and Configuration).
