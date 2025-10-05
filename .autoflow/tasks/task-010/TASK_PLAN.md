# Task Plan: CI Pipeline and Testing Setup

**Task ID**: task-010
**Sprint**: Sprint 1 - Foundation & Core Processing
**Status**: PLANNED
**Priority**: MEDIUM
**Estimated Effort**: 6 hours
**Created**: 2025-10-05

---

## Overview

Set up continuous integration pipeline with GitHub Actions for automated testing, linting, type checking, and code coverage reporting. Establish Playwright E2E testing infrastructure.

---

## Implementation Steps

### Phase 1: GitHub Actions CI Workflow (2 hours)

**Objective**: Create automated CI pipeline for all quality checks

**Files to Create**:
- `.github/workflows/test.yml` - Main CI workflow

**Implementation**:
1. Create `.github/workflows/` directory
2. Create `test.yml` workflow with jobs:
   - Checkout code
   - Setup Node.js 20
   - Install dependencies (`npm ci` in src/)
   - Run lint (`npm run lint`)
   - Run typecheck (`npm run typecheck`)
   - Run unit tests (`npm test`)
   - Run unit tests with coverage (`npm run test:coverage`)
   - Security audit (`npm audit`)
3. Configure workflow triggers:
   - Push to main/develop branches
   - Pull requests to main/develop
4. Add caching for node_modules

**Testing**:
- Verify workflow syntax is valid
- Test workflow execution locally (using act or GitHub)

---

### Phase 2: Playwright E2E Configuration (2 hours)

**Objective**: Configure Playwright for E2E testing against live development URL

**Files to Create**:
- `src/playwright.config.ts` - Playwright configuration

**Implementation**:
1. Create Playwright config with:
   - Base URL: `https://craftyprep.demosrv.uk`
   - Browsers: chromium (primary)
   - Screenshots on failure
   - Video on first retry
   - Test timeout: 30 seconds
   - Expect timeout: 5 seconds
   - Retries: 2 on CI, 0 locally
2. Configure test directory: `src/tests/e2e`
3. Configure output directory: `src/playwright-report`
4. Add reporters: HTML, list

**Testing**:
- Verify Playwright config loads without errors
- Run `npx playwright install` successfully

---

### Phase 3: Happy Path E2E Test (1.5 hours)

**Objective**: Create comprehensive E2E test for main user workflow

**Files to Create**:
- `src/tests/e2e/happy-path.spec.ts` - Main E2E test

**Implementation**:
1. Create E2E test file with test:
   ```typescript
   test('complete workflow: upload → auto-prep → download', async ({ page }) => {
     // 1. Navigate to app
     await page.goto('/');

     // 2. Upload test image
     const fileInput = page.locator('input[type="file"]');
     await fileInput.setInputFiles('tests/fixtures/sample-image.jpg');

     // 3. Wait for upload complete
     await expect(page.getByTestId('original-preview')).toBeVisible();

     // 4. Click Auto-Prep button
     await page.getByRole('button', { name: /auto-prep/i }).click();

     // 5. Wait for processing (loading state)
     await expect(page.getByText(/processing/i)).toBeVisible();

     // 6. Wait for processed image
     await expect(page.getByTestId('processed-preview')).toBeVisible({ timeout: 10000 });

     // 7. Verify download button enabled
     await expect(page.getByRole('button', { name: /download/i })).toBeEnabled();

     // 8. Click download (verify download triggered)
     const downloadPromise = page.waitForEvent('download');
     await page.getByRole('button', { name: /download/i }).click();
     const download = await downloadPromise;

     // 9. Verify filename
     expect(download.suggestedFilename()).toMatch(/_laserprep\.png$/);
   });
   ```

2. Add test image fixture: `src/tests/fixtures/sample-image.jpg` (500KB test image)

**Testing**:
- Run E2E test locally against dev server
- Verify all assertions pass
- Verify download works

---

### Phase 4: CI Integration for E2E Tests (0.5 hours)

**Objective**: Add E2E tests to CI pipeline

**Files to Modify**:
- `.github/workflows/test.yml` - Add E2E test step

**Implementation**:
1. Add Playwright installation step:
   ```yaml
   - name: Install Playwright
     run: cd src && npx playwright install --with-deps chromium
   ```

2. Add E2E test execution step:
   ```yaml
   - name: E2E tests
     run: cd src && npm run test:e2e
   ```

3. Add artifact upload for test results:
   ```yaml
   - name: Upload test results
     if: always()
     uses: actions/upload-artifact@v3
     with:
       name: playwright-report
       path: src/playwright-report/
   ```

**Testing**:
- Verify CI runs E2E tests
- Verify artifacts are uploaded on failure

---

## Dependencies

**Technical Dependencies**:
- Playwright already installed (`package.json` devDependencies)
- Vitest already configured
- GitHub repository exists
- Development server accessible at `https://craftyprep.demosrv.uk`

**Task Dependencies**:
- All previous tasks (001-009) COMPLETE
- Development server running and accessible

---

## Test Strategy

### Unit Tests
- N/A (configuration files only)

### Integration Tests
- Verify CI workflow executes all steps
- Verify E2E test passes against live dev URL

### E2E Tests
- Happy path test covers full workflow
- Screenshot/video capture on failure for debugging

---

## Quality Checklist

- [ ] GitHub Actions workflow syntax valid
- [ ] Workflow triggers correctly on push/PR
- [ ] All CI steps execute successfully
- [ ] Lint passes
- [ ] TypeCheck passes
- [ ] Unit tests pass with coverage ≥80%
- [ ] E2E test passes
- [ ] Playwright config correct
- [ ] Test fixtures created
- [ ] Documentation updated (package.json scripts)

---

## Performance Targets

- CI pipeline execution: <5 minutes total
- E2E test execution: <30 seconds per test
- Playwright installation: <2 minutes

---

## Security Considerations

- Use `npm ci` instead of `npm install` for reproducible builds
- Run `npm audit` for dependency security checks
- Use GitHub Actions secrets for any sensitive data (N/A for this task)

---

## Documentation Updates

**Files to Update**:
- `README.md` - Add CI badge (optional)
- `package.json` - Ensure all scripts documented

**CI Badge** (optional):
```markdown
![CI](https://github.com/[username]/craftyprep/actions/workflows/test.yml/badge.svg)
```

---

## Rollback Plan

If CI fails:
1. Check workflow syntax with GitHub Actions validator
2. Debug failing steps locally
3. Review GitHub Actions logs for errors
4. Temporarily disable E2E tests if blocking (comment out step)
5. Fix and re-run

---

## Success Criteria

- [ ] `.github/workflows/test.yml` created and working
- [ ] `src/playwright.config.ts` configured correctly
- [ ] `src/tests/e2e/happy-path.spec.ts` created and passing
- [ ] CI pipeline runs on every push/PR
- [ ] All quality checks passing (lint, typecheck, test, coverage)
- [ ] E2E test passes against `https://craftyprep.demosrv.uk`
- [ ] CI execution time <5 minutes
- [ ] Test fixtures created
- [ ] Documentation complete

---

## Notes

- Use `https://craftyprep.demosrv.uk` as base URL (not localhost)
- E2E tests assume development server is running
- Screenshots/videos captured on failure for debugging
- Playwright retries: 2 on CI, 0 locally (for speed)
- CI badge in README is optional but recommended

---

**Next Steps**: Run `/build` to implement this plan with TDD approach
