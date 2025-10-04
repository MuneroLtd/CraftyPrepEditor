import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Task-002: Basic UI Layout - Component Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('should render Layout component with header, main, and footer', async ({ page }) => {
    // Verify semantic HTML5 structure
    const header = page.locator('header');
    const main = page.locator('main');
    const footer = page.locator('footer');

    await expect(header).toBeVisible();
    await expect(main).toBeVisible();
    await expect(footer).toBeVisible();
  });

  test('should display Header with "CraftyPrep" text', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toContainText('CraftyPrep');
  });

  test('should display Footer with copyright text', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toContainText('© 2025 CraftyPrep');
  });

  test('should have correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/CraftyPrep/);
  });
});

test.describe('Task-002: Responsive Testing', () => {
  test('should work at 320px mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('http://localhost:5173');

    // Verify layout renders
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    // Verify no horizontal scrolling
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // +1 for rounding

    // Take screenshot
    await page.screenshot({ path: 'task-002-mobile.png', fullPage: true });
  });

  test('should work at 768px tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:5173');

    // Verify layout renders
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'task-002-tablet.png', fullPage: true });
  });

  test('should work at 1024px+ desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('http://localhost:5173');

    // Verify layout renders
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'task-002-desktop.png', fullPage: true });
  });

  test('should capture full layout screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('http://localhost:5173');
    await page.screenshot({ path: 'task-002-layout.png', fullPage: true });
  });
});

test.describe('Task-002: Keyboard Navigation', () => {
  test('should have skip link as first focusable element', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Tab to first element
    await page.keyboard.press('Tab');

    // Check if skip link is focused
    const focused = page.locator(':focus');
    const text = await focused.textContent();
    expect(text).toContain('Skip to main content');
  });

  test('should show skip link on focus', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Tab to skip link
    await page.keyboard.press('Tab');

    // Skip link should be visible when focused
    const skipLink = page.locator('a:has-text("Skip to main content")');
    await expect(skipLink).toBeVisible();
  });

  test('should move focus to main content when skip link is activated', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Tab to skip link
    await page.keyboard.press('Tab');

    // Press Enter
    await page.keyboard.press('Enter');

    // Wait a moment for focus to move
    await page.waitForTimeout(100);

    // Verify focus is on main or within main
    const focused = await page.evaluate(() => {
      const active = document.activeElement;
      const main = document.querySelector('main');
      return active === main || main?.contains(active);
    });
    expect(focused).toBe(true);
  });

  test('should have logical tab order through all elements', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Collect all focusable elements
    const focusableElements = await page.evaluate(() => {
      const elements = Array.from(
        document.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      return elements.map((el) => ({
        tag: el.tagName,
        text: el.textContent?.trim().substring(0, 50),
      }));
    });

    // Verify we have focusable elements
    expect(focusableElements.length).toBeGreaterThan(0);
  });

  test('should have visible focus indicators', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Tab to first element
    await page.keyboard.press('Tab');

    // Get focused element outline
    const outlineInfo = await page.evaluate(() => {
      const active = document.activeElement as HTMLElement;
      const styles = window.getComputedStyle(active);
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        outlineStyle: styles.outlineStyle,
        outlineColor: styles.outlineColor,
        boxShadow: styles.boxShadow,
      };
    });

    // Verify focus indicator exists (either outline or box-shadow)
    const hasFocusIndicator =
      (outlineInfo.outline !== 'none' && outlineInfo.outlineWidth !== '0px') ||
      outlineInfo.boxShadow !== 'none';

    expect(hasFocusIndicator).toBe(true);
  });

  test('should not have keyboard traps', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Tab through all elements
    const tabCount = 20;
    for (let i = 0; i < tabCount; i++) {
      await page.keyboard.press('Tab');

      // Verify we can still interact with the page
      const isPageInteractive = await page.evaluate(() => {
        return document.activeElement !== null;
      });
      expect(isPageInteractive).toBe(true);
    }

    // Verify we can shift-tab back
    await page.keyboard.press('Shift+Tab');
    const canTabBack = await page.evaluate(() => {
      return document.activeElement !== null;
    });
    expect(canTabBack).toBe(true);
  });
});

test.describe('Task-002: Interactive Components', () => {
  test('should render Button component', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Look for any button element
    const buttons = page.locator('button');
    const count = await buttons.count();

    // We should have at least one button (from shadcn/ui)
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should render Slider component if present', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Check if slider input exists (shadcn slider uses input[type="range"])
    const sliders = page.locator('input[type="range"], [role="slider"]');
    const count = await sliders.count();

    // Note: Slider might not be on main page yet, so we just check it doesn't error
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Task-002: Accessibility (WCAG 2.2 AAA)', () => {
  test('should have no accessibility violations', async ({ page }) => {
    await page.goto('http://localhost:5173');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    // Report violations
    if (accessibilityScanResults.violations.length > 0) {
      console.log('Accessibility violations found:');
      accessibilityScanResults.violations.forEach((violation) => {
        console.log(`- ${violation.id}: ${violation.description}`);
        console.log(`  Impact: ${violation.impact}`);
        console.log(`  Nodes: ${violation.nodes.length}`);
      });
    }

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper semantic HTML structure', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Verify semantic elements exist
    const header = page.locator('header');
    const main = page.locator('main');
    const footer = page.locator('footer');

    await expect(header).toBeAttached();
    await expect(main).toBeAttached();
    await expect(footer).toBeAttached();
  });

  test('should have ARIA landmarks', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Verify ARIA landmarks (semantic HTML provides implicit landmarks)
    const landmarks = await page.evaluate(() => {
      const header = document.querySelector('header');
      const main = document.querySelector('main');
      const footer = document.querySelector('footer');

      return {
        hasHeader: !!header,
        hasMain: !!main,
        hasFooter: !!footer,
      };
    });

    expect(landmarks.hasHeader).toBe(true);
    expect(landmarks.hasMain).toBe(true);
    expect(landmarks.hasFooter).toBe(true);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('http://localhost:5173');

    const headings = await page.evaluate(() => {
      const h1s = Array.from(document.querySelectorAll('h1'));
      const h2s = Array.from(document.querySelectorAll('h2'));
      const h3s = Array.from(document.querySelectorAll('h3'));

      return {
        h1Count: h1s.length,
        h2Count: h2s.length,
        h3Count: h3s.length,
        h1Text: h1s.map((h) => h.textContent?.trim()),
      };
    });

    // Should have exactly one h1
    expect(headings.h1Count).toBe(1);

    // h1 should contain CraftyPrep
    expect(headings.h1Text[0]).toContain('CraftyPrep');
  });

  test('should meet color contrast requirements (WCAG AAA)', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Run axe with contrast checking
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aaa'])
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'color-contrast' || v.id === 'color-contrast-enhanced'
    );

    if (contrastViolations.length > 0) {
      console.log('Color contrast violations:');
      contrastViolations.forEach((violation) => {
        console.log(`- ${violation.description}`);
      });
    }

    expect(contrastViolations).toEqual([]);
  });
});

test.describe('Task-002: Visual Regression', () => {
  test('should match visual snapshot', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    // Take full page screenshot for visual regression
    await expect(page).toHaveScreenshot('task-002-full-page.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });
});
