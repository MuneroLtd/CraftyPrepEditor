# Acceptance Criteria: CI Pipeline and Testing Setup

**Task ID**: task-010
**Created**: 2025-10-05

---

## Must Have (Critical)

### GitHub Actions CI Workflow

- [ ] **GitHub Actions workflow file created** at `.github/workflows/test.yml`
- [ ] **Workflow triggers on push** to main/develop branches
- [ ] **Workflow triggers on pull requests** to main/develop branches
- [ ] **Node.js 20 configured** in workflow
- [ ] **Dependencies installed** using `npm ci` (not `npm install`)
- [ ] **Lint step executes** (`npm run lint` in src/ directory)
- [ ] **Type check step executes** (`npm run typecheck` in src/ directory)
- [ ] **Unit tests execute** (`npm test` in src/ directory)
- [ ] **Coverage check executes** (`npm run test:coverage` in src/ directory)
- [ ] **Coverage threshold enforced** at ≥80%
- [ ] **Security audit runs** (`npm audit --audit-level=moderate`)
- [ ] **All steps pass** on clean codebase

### Playwright Configuration

- [ ] **Playwright config created** at `src/playwright.config.ts`
- [ ] **Base URL configured** to `https://craftyprep.demosrv.uk`
- [ ] **Browser configured** for chromium only
- [ ] **Screenshots on failure** enabled
- [ ] **Test timeout** set to 30 seconds
- [ ] **Retries configured**: 2 on CI, 0 locally
- [ ] **Test directory** set to `src/tests/e2e`
- [ ] **Output directory** set to `src/playwright-report`
- [ ] **Reporters configured**: HTML and list

### E2E Test Implementation

- [ ] **E2E test file created** at `src/tests/e2e/happy-path.spec.ts`
- [ ] **Test navigates** to application URL
- [ ] **Test uploads image** via file input
- [ ] **Test waits for upload** to complete (original preview visible)
- [ ] **Test clicks Auto-Prep** button
- [ ] **Test waits for processing** (loading state visible)
- [ ] **Test waits for processed image** (processed preview visible)
- [ ] **Test verifies download button** is enabled
- [ ] **Test triggers download** and captures download event
- [ ] **Test verifies filename** matches pattern `*_laserprep.png`
- [ ] **Test passes** when run against development server

### CI E2E Integration

- [ ] **Playwright installation step** added to CI workflow
- [ ] **Playwright browsers installed** (chromium with deps)
- [ ] **E2E test execution step** added to CI workflow
- [ ] **E2E tests run** in CI pipeline
- [ ] **Test results uploaded** as artifacts on failure
- [ ] **Playwright report uploaded** as artifact

---

## Should Have (Important)

### Performance

- [ ] **CI pipeline execution time** <5 minutes total
- [ ] **E2E test execution time** <30 seconds per test
- [ ] **Node modules caching** enabled in CI for faster builds

### Test Fixtures

- [ ] **Test image fixture created** at `src/tests/fixtures/sample-image.jpg`
- [ ] **Fixture is valid image** (500KB, typical photo)
- [ ] **Fixture accessible** to E2E tests

### Error Handling

- [ ] **CI fails gracefully** with clear error messages
- [ ] **E2E test failures** produce screenshots
- [ ] **E2E test failures** produce videos (on retry)
- [ ] **Test report generated** and accessible

---

## Could Have (Nice to Have)

### Documentation

- [ ] **CI badge added** to README.md (optional)
- [ ] **CI documentation** in README explaining workflow
- [ ] **E2E test documentation** explaining how to run locally

### Additional Testing

- [ ] **E2E test for error handling** (invalid file upload)
- [ ] **E2E test for accessibility** (keyboard navigation)
- [ ] **Multiple browser testing** (firefox, webkit - optional)

---

## Verification Steps

### Local Verification

1. **Playwright Config**:
   ```bash
   cd src && npx playwright test --list
   ```
   - Expected: Lists `happy-path.spec.ts` test

2. **E2E Test Execution**:
   ```bash
   cd src && npm run test:e2e
   ```
   - Expected: Test passes, download verified

3. **CI Workflow Syntax**:
   ```bash
   # Use GitHub Actions extension or online validator
   # Verify .github/workflows/test.yml syntax
   ```

### CI Verification

1. **Push to GitHub**:
   - Workflow triggers automatically
   - All steps execute in order
   - All checks pass (green)

2. **Pull Request Test**:
   - Create test PR
   - Workflow runs on PR
   - Status checks required

3. **Failure Scenarios**:
   - Introduce lint error → CI fails at lint step
   - Introduce type error → CI fails at typecheck step
   - Break test → CI fails at test step
   - Verify artifacts uploaded on E2E failure

---

## Definition of Done

- [ ] All "Must Have" criteria met
- [ ] All "Should Have" criteria met
- [ ] CI workflow passing on main branch
- [ ] E2E test passing against `https://craftyprep.demosrv.uk`
- [ ] Code review passed
- [ ] Documentation updated
- [ ] No console errors or warnings in CI logs
- [ ] Sprint 1 complete (all 10 tasks COMPLETE)

---

## Edge Cases

### CI Edge Cases

- [ ] **Empty commit**: CI runs and passes
- [ ] **Large codebase**: CI completes within time limit
- [ ] **Concurrent PRs**: Multiple workflows run without conflict

### E2E Edge Cases

- [ ] **Slow network**: Test waits appropriately (timeouts sufficient)
- [ ] **Server error**: Test fails gracefully with useful error
- [ ] **Image load failure**: Test retries and captures error

---

## Quality Standards

### Code Quality

- All configuration files follow TypeScript/YAML best practices
- No hardcoded values (use variables/constants)
- Comments explain non-obvious configuration choices

### Testing Quality

- E2E test uses proper selectors (roles, test IDs, not CSS classes)
- Test waits are explicit and deterministic
- Test assertions are specific and meaningful

### Performance Quality

- CI pipeline optimized with caching
- Playwright only installs required browsers
- Tests run in parallel where possible

---

## Acceptance Review Checklist

**Before marking COMPLETE**:

- [ ] All must-have criteria verified
- [ ] CI workflow executed successfully at least once
- [ ] E2E test passed against live dev URL
- [ ] Screenshots/videos captured on intentional test failure
- [ ] Playwright report generated and reviewed
- [ ] All existing tests still passing
- [ ] No new security vulnerabilities introduced
- [ ] Documentation complete and accurate

---

**Status**: PENDING → PLANNED (after /plan) → REVIEW (after /build) → TEST → COMPLETE
