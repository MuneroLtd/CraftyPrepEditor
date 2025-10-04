# Testing Strategy

## Testing Philosophy

**Test-Driven Development (TDD)**: Write tests before implementation to clarify requirements and ensure coverage.

**Testing Pyramid**:
```
        ┌──────────┐
        │   E2E    │  10%  - User workflows, critical paths
        ├──────────┤
        │Integration│ 20%  - Component interactions, flows
        ├──────────┤
        │   Unit    │ 70%  - Functions, utilities, logic
        └──────────┘
```

**Coverage Target**: ≥80% code coverage (enforced)

---
**Implementation**: PENDING
- **Sprint**: All sprints (TDD throughout)
- **Tasks**: To be planned
- **Status**: Testing pyramid and TDD approach established

---

## Testing Pyramid

### Unit Tests (70% of tests)

**Scope**: Individual functions, utilities, custom hooks

**What to Test**:
- Image processing algorithms (grayscale, threshold, etc.)
- Utility functions (file validation, filename sanitization)
- Custom hooks (useImageUpload, useImageProcessing)
- State management logic
- Pure functions and calculations

**Tools**:
- **Framework**: Vitest
- **Library**: @testing-library/react for hook testing
- **Mocking**: vi.fn() from Vitest

**Coverage Target**: ≥80% for all business logic

#### Example Test Structure

```typescript
// src/lib/imageProcessing.test.ts
import { describe, it, expect } from 'vitest';
import { convertToGrayscale, applyThreshold } from './imageProcessing';

describe('Image Processing', () => {
  describe('convertToGrayscale', () => {
    it('converts RGB pixel to grayscale using weighted average', () => {
      const imageData = createMockImageData([255, 0, 0, 255]); // Red pixel
      const result = convertToGrayscale(imageData);

      // Expected: 0.299 * 255 = 76.245 ≈ 76
      expect(result.data[0]).toBe(76); // R
      expect(result.data[1]).toBe(76); // G
      expect(result.data[2]).toBe(76); // B
    });

    it('handles all-white image', () => {
      const imageData = createMockImageData([255, 255, 255, 255]);
      const result = convertToGrayscale(imageData);

      expect(result.data[0]).toBe(255);
    });

    it('handles all-black image', () => {
      const imageData = createMockImageData([0, 0, 0, 255]);
      const result = convertToGrayscale(imageData);

      expect(result.data[0]).toBe(0);
    });
  });

  describe('applyThreshold', () => {
    it('applies threshold correctly', () => {
      const imageData = createMockImageData([100, 100, 100, 255]);
      const result = applyThreshold(imageData, 128);

      // 100 < 128, so should be black (0)
      expect(result.data[0]).toBe(0);
    });

    it('handles edge case at threshold boundary', () => {
      const imageData = createMockImageData([128, 128, 128, 255]);
      const result = applyThreshold(imageData, 128);

      // 128 >= 128, so should be white (255)
      expect(result.data[0]).toBe(255);
    });
  });
});
```

---
**Implementation**: PENDING
- **Sprint**: Sprint 1 (image processing), Sprint 2 (UI logic)
- **Tasks**: To be planned
- **Status**: Unit test approach and examples defined

---

### Integration Tests (20% of tests)

**Scope**: Component interactions, data flow, end-to-end workflows

**What to Test**:
- Upload component → Auto-Prep → Preview component flow
- Slider adjustment → Canvas update → Preview render
- Settings persistence (localStorage) - Sprint 3
- Export download flow
- Error handling across components

**Tools**:
- **Framework**: Vitest
- **Library**: @testing-library/react
- **DOM**: @testing-library/jest-dom

#### Example Integration Test

```typescript
// src/components/ImageEditor.integration.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImageEditor } from './ImageEditor';

describe('ImageEditor Integration', () => {
  it('uploads image, processes with auto-prep, and displays result', async () => {
    render(<ImageEditor />);

    // Upload image
    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
    const upload = screen.getByLabelText(/upload/i);
    await userEvent.upload(upload, file);

    // Wait for image to load
    await waitFor(() => {
      expect(screen.getByAltText(/original/i)).toBeInTheDocument();
    });

    // Click Auto-Prep
    const autoPrepButton = screen.getByRole('button', { name: /auto-prep/i });
    await userEvent.click(autoPrepButton);

    // Wait for processing
    await waitFor(() => {
      expect(screen.getByAltText(/laser-ready/i)).toBeInTheDocument();
    }, { timeout: 5000 });

    // Verify download button enabled
    const downloadButton = screen.getByRole('button', { name: /download/i });
    expect(downloadButton).toBeEnabled();
  });

  it('adjusts brightness slider and updates preview', async () => {
    const { container } = render(<ImageEditor />);

    // Upload and process image (setup)
    await uploadAndProcessTestImage(container);

    // Find brightness slider
    const brightnessSlider = screen.getByLabelText(/brightness/i);

    // Adjust slider
    await userEvent.clear(brightnessSlider);
    await userEvent.type(brightnessSlider, '50');

    // Wait for debounced update
    await waitFor(() => {
      const canvas = screen.getByTestId('processed-canvas');
      expect(canvas).toHaveAttribute('data-updated', 'true');
    }, { timeout: 500 });
  });
});
```

---
**Implementation**: PENDING
- **Sprint**: Sprint 1 (upload/process flow), Sprint 2 (refinement flow)
- **Tasks**: To be planned
- **Status**: Integration test examples defined

---

### End-to-End Tests (10% of tests)

**Scope**: Complete user workflows in real browser environment

**What to Test**:
- **Happy Path**: Upload → Auto-Prep → Download
- **Refinement Path**: Upload → Auto-Prep → Adjust sliders → Download
- **Error Handling**: Invalid file upload, file too large
- **Preset Workflow** (Sprint 3): Select material preset → Download
- **Accessibility**: Keyboard navigation, screen reader

**Tools**:
- **Framework**: Playwright
- **Browsers**: Chromium, Firefox, WebKit (Safari)

#### Example E2E Test

```typescript
// tests/e2e/laser-prep.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Laser Prep Workflow', () => {
  test('user can upload, auto-prep, and download image', async ({ page }) => {
    // Navigate to app
    await page.goto('/');

    // Upload image
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('tests/fixtures/sample-image.jpg');

    // Wait for upload
    await expect(page.locator('[data-testid="original-preview"]')).toBeVisible();

    // Click Auto-Prep
    await page.getByRole('button', { name: /auto-prep/i }).click();

    // Wait for processing
    await expect(page.locator('[data-testid="processed-preview"]')).toBeVisible({ timeout: 10000 });

    // Verify processed image different from original
    const processedCanvas = page.locator('[data-testid="processed-canvas"]');
    expect(await processedCanvas.screenshot()).toBeDefined();

    // Download
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /download/i }).click();
    const download = await downloadPromise;

    // Verify filename
    expect(download.suggestedFilename()).toMatch(/_laserprep\.png$/);
  });

  test('user can refine with sliders', async ({ page }) => {
    await page.goto('/');

    // Upload and auto-prep (setup)
    await uploadAndAutoPrep(page, 'tests/fixtures/sample-image.jpg');

    // Adjust brightness
    const brightnessSlider = page.getByLabel(/brightness/i);
    await brightnessSlider.fill('25');

    // Wait for update (debounced)
    await page.waitForTimeout(200);

    // Verify value updated
    await expect(page.locator('text=/Brightness: 25/')).toBeVisible();

    // Adjust contrast
    const contrastSlider = page.getByLabel(/contrast/i);
    await contrastSlider.fill('15');

    await page.waitForTimeout(200);

    // Download refined result
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /download/i }).click();
    await downloadPromise;
  });

  test('handles invalid file upload gracefully', async ({ page }) => {
    await page.goto('/');

    // Upload non-image file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('tests/fixtures/document.pdf');

    // Expect error message
    await expect(page.locator('[role="alert"]')).toContainText(/unsupported file type/i);

    // Verify Auto-Prep button disabled
    await expect(page.getByRole('button', { name: /auto-prep/i })).toBeDisabled();
  });
});
```

---
**Implementation**: PENDING
- **Sprint**: Sprint 2 (E2E setup), Sprint 3 (full coverage)
- **Tasks**: To be planned
- **Status**: E2E test examples with Playwright defined

---

## Accessibility Testing

**WCAG 2.2 Level AAA Compliance Required**

### Automated Accessibility Testing

**Tools**:
- **Playwright axe**: Automated a11y checks in E2E tests
- **Lighthouse**: Accessibility audit
- **axe DevTools**: Manual browser extension testing

#### Example Accessibility Test

```typescript
// tests/e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('homepage passes axe accessibility audit', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag2aaa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/');

    // Upload image (setup)
    await uploadTestImage(page);

    // Tab to Auto-Prep button
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: /auto-prep/i })).toBeFocused();

    // Activate with Enter
    await page.keyboard.press('Enter');

    // Wait for processing
    await page.waitForSelector('[data-testid="processed-preview"]', { timeout: 10000 });

    // Tab to brightness slider
    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/brightness/i)).toBeFocused();

    // Adjust with arrow keys
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');

    // Verify value changed
    const value = await page.getByLabel(/brightness/i).inputValue();
    expect(parseInt(value)).toBeGreaterThan(0);
  });

  test('screen reader announcements', async ({ page }) => {
    await page.goto('/');

    // Check aria-live regions exist
    const liveRegion = page.locator('[aria-live="polite"]');
    await expect(liveRegion).toBeAttached();

    // Upload image
    await uploadTestImage(page);

    // Click Auto-Prep
    await page.getByRole('button', { name: /auto-prep/i }).click();

    // Verify processing announcement
    await expect(liveRegion).toContainText(/processing/i);

    // Wait for completion
    await page.waitForSelector('[data-testid="processed-preview"]', { timeout: 10000 });

    // Verify completion announcement
    await expect(liveRegion).toContainText(/complete|ready/i);
  });
});
```

### Manual Accessibility Testing

**Checklist**:
- [ ] Keyboard navigation (Tab, Shift+Tab, Enter, Arrow keys, Escape)
- [ ] Screen reader testing (NVDA on Windows, VoiceOver on macOS)
- [ ] Color contrast verification (Chrome DevTools, Contrast Checker)
- [ ] Focus indicators visible and high contrast
- [ ] No keyboard traps
- [ ] All interactive elements have accessible names
- [ ] Form inputs have labels
- [ ] Error messages announced to screen readers
- [ ] Image alt text appropriate
- [ ] Zoom to 200% without horizontal scroll

---
**Implementation**: PENDING
- **Sprint**: Sprint 1 (foundation), Sprint 2 (comprehensive testing)
- **Tasks**: To be planned
- **Status**: WCAG 2.2 AAA compliance testing defined

---

## Performance Testing

### Performance Metrics

**Target Metrics** (Lighthouse):
- **Performance Score**: ≥90/100
- **Accessibility Score**: ≥95/100
- **Best Practices Score**: ≥95/100
- **SEO Score**: ≥90/100

**Custom Metrics**:
- First Contentful Paint (FCP): <1.5s
- Time to Interactive (TTI): <3s
- Auto-Prep Processing: <5s (2MB image)
- Slider Response: <100ms

### Performance Tests

```typescript
// tests/performance/processing.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('auto-prep completes within 5 seconds', async ({ page }) => {
    await page.goto('/');

    // Upload 2MB image
    await uploadTestImage(page, 'tests/fixtures/2mb-image.jpg');

    // Start timer
    const startTime = Date.now();

    // Click Auto-Prep
    await page.getByRole('button', { name: /auto-prep/i }).click();

    // Wait for completion
    await page.waitForSelector('[data-testid="processed-preview"]', { timeout: 10000 });

    // Calculate duration
    const duration = Date.now() - startTime;

    // Assert < 5 seconds
    expect(duration).toBeLessThan(5000);
  });

  test('slider adjustments respond within 100ms', async ({ page }) => {
    await page.goto('/');

    // Upload and auto-prep (setup)
    await uploadAndAutoPrep(page, 'tests/fixtures/sample-image.jpg');

    // Adjust brightness slider
    const slider = page.getByLabel(/brightness/i);

    const startTime = Date.now();
    await slider.fill('50');

    // Wait for visual update
    await page.waitForFunction(() => {
      const canvas = document.querySelector('[data-testid="processed-canvas"]');
      return canvas?.getAttribute('data-updated') === 'true';
    }, { timeout: 500 });

    const duration = Date.now() - startTime;

    // Assert < 100ms (plus debounce time)
    expect(duration).toBeLessThan(200);
  });
});
```

---
**Implementation**: PENDING
- **Sprint**: Sprint 1 (baseline), Sprint 2 (optimization)
- **Tasks**: To be planned
- **Status**: Performance testing strategy defined

---

## Security Testing

See SECURITY.md for detailed security testing requirements.

**Automated Security Tests**:
- `npm audit` - Dependency vulnerabilities
- ESLint security rules
- Lighthouse security audit
- OWASP ZAP (if applicable)

**Manual Security Tests**:
- File upload fuzzing
- XSS attempts
- Path traversal attempts
- Header verification
- CSP violation testing

---
**Implementation**: PENDING
- **Sprint**: Sprint 2 (automated), Sprint 3 (manual)
- **Tasks**: To be planned
- **Status**: See SECURITY.md for complete strategy

---

## Cross-Browser Testing

### Target Browsers

**Desktop**:
- Chrome 90+ (latest)
- Firefox 88+ (latest)
- Safari 14+ (latest)
- Edge 90+ (latest)

**Mobile**:
- Mobile Safari (iOS 14+)
- Mobile Chrome (Android 10+)

### Browser Testing Strategy

**Automated** (Playwright):
```typescript
// playwright.config.ts
export default {
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 12'] } },
  ],
};
```

**Manual Testing Checklist**:
- [ ] Upload works on all browsers
- [ ] Auto-Prep processing works
- [ ] Slider controls responsive
- [ ] Download triggers correctly
- [ ] Canvas rendering accurate
- [ ] Touch interactions (mobile)
- [ ] Responsive layout (all breakpoints)

---
**Implementation**: PENDING
- **Sprint**: Sprint 2 (Playwright multi-browser), Sprint 3 (manual)
- **Tasks**: To be planned
- **Status**: Cross-browser testing defined

---

## Test Organization

### Directory Structure

```
src/
├── lib/
│   ├── imageProcessing.ts
│   └── imageProcessing.test.ts      # Co-located unit tests
├── components/
│   ├── ImageEditor.tsx
│   └── ImageEditor.test.tsx         # Component unit tests
│   └── ImageEditor.integration.test.tsx
tests/
├── e2e/
│   ├── laser-prep.spec.ts           # E2E tests
│   ├── accessibility.spec.ts
│   └── performance.spec.ts
├── fixtures/
│   ├── sample-image.jpg
│   ├── 2mb-image.jpg
│   └── corrupted-image.jpg
└── setup/
    ├── test-utils.ts                # Test helpers
    └── mocks.ts                     # Mock data/functions
```

### Test Naming Conventions

- Unit tests: `*.test.ts` or `*.test.tsx`
- Integration tests: `*.integration.test.tsx`
- E2E tests: `*.spec.ts`

---
**Implementation**: PENDING
- **Sprint**: Sprint 1 (structure setup)
- **Tasks**: To be planned
- **Status**: Test organization and conventions defined

---

## Continuous Integration (CI)

### CI Pipeline (GitHub Actions Example)

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci
        working-directory: ./src

      - name: Lint
        run: npm run lint
        working-directory: ./src

      - name: Type check
        run: npm run typecheck
        working-directory: ./src

      - name: Unit & Integration tests
        run: npm test -- --coverage
        working-directory: ./src

      - name: Security audit
        run: npm audit --audit-level=moderate
        working-directory: ./src

      - name: Install Playwright
        run: npx playwright install --with-deps
        working-directory: ./src

      - name: E2E tests
        run: npm run test:e2e
        working-directory: ./src

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./src/coverage/coverage-final.json
```

---
**Implementation**: PENDING
- **Sprint**: Sprint 2 (CI setup)
- **Tasks**: To be planned
- **Status**: CI pipeline configuration defined

---

## Test Data and Fixtures

### Test Image Fixtures

**Required Test Images**:
- `sample-image.jpg` - 500KB, typical photo
- `2mb-image.jpg` - 2MB, large typical image
- `10mb-image.jpg` - 10MB, maximum size
- `black-white-image.png` - Already high contrast
- `low-contrast-image.jpg` - Washed out, needs enhancement
- `corrupted-image.jpg` - Invalid/corrupted file
- `large-dimensions.jpg` - 10000×10000px, edge case

**Non-Image Fixtures**:
- `document.pdf` - Wrong file type
- `text-file.txt` - Wrong file type

---
**Implementation**: PENDING
- **Sprint**: Sprint 1 (create fixtures)
- **Tasks**: To be planned
- **Status**: Test fixture requirements defined

---

## Testing Checklist

### Pre-Commit

- [ ] All unit tests passing
- [ ] Lint passing
- [ ] Type check passing
- [ ] No new console errors/warnings

### Pre-Merge (Pull Request)

- [ ] All tests passing (unit, integration, E2E)
- [ ] Code coverage ≥80%
- [ ] Accessibility audit passing
- [ ] Security audit clean
- [ ] Performance metrics met
- [ ] Manual testing on 2+ browsers

### Pre-Deployment

- [ ] Full test suite passing
- [ ] E2E tests on all target browsers
- [ ] Lighthouse audits ≥90 (performance, accessibility, best practices)
- [ ] Security scan clean
- [ ] Manual accessibility testing passed
- [ ] Cross-browser manual testing passed

---
**Implementation**: PENDING
- **Sprint**: All sprints (enforced)
- **Tasks**: To be planned
- **Status**: Testing gates for development workflow

---

This comprehensive testing strategy ensures CraftyPrep is reliable, performant, secure, and accessible to all users.
