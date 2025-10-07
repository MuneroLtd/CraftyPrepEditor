import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const BASE_URL = 'https://craftyprep.demosrv.uk';

test.describe('Design System - Accessibility', () => {
  test('should have no accessibility violations on home page', async ({ page }) => {
    await page.goto(BASE_URL);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper color contrast (WCAG AAA)', async ({ page }) => {
    await page.goto(BASE_URL);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aaa'])
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'color-contrast-enhanced'
    );

    expect(contrastViolations).toHaveLength(0);
  });

  test('should have visible focus indicators', async ({ page }) => {
    await page.goto(BASE_URL);

    // Get all interactive elements
    const buttons = await page.locator('button, a, input, select, textarea').all();

    for (const element of buttons.slice(0, 5)) {
      // Test first 5
      await element.focus();

      const outline = await element.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          outlineWidth: styles.outlineWidth,
          outlineStyle: styles.outlineStyle,
        };
      });

      // Should have visible outline (≥3px for WCAG AAA)
      const outlineWidth = parseInt(outline.outlineWidth);
      expect(outlineWidth).toBeGreaterThanOrEqual(3);
    }
  });

  test('should respect prefers-reduced-motion', async ({ page }) => {
    // Emulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(BASE_URL);

    // Check that transitions are disabled
    const body = page.locator('body');
    const transitionDuration = await body.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.transitionDuration;
    });

    // Should be near-instant (0.01ms as per CSS)
    expect(transitionDuration).toMatch(/0\.01ms|0s/);
  });

  test('should have proper ARIA labels on interactive elements', async ({ page }) => {
    await page.goto(BASE_URL);

    const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2a']).analyze();

    const ariaViolations = accessibilityScanResults.violations.filter(
      (v) => v.id.includes('aria-') || v.id.includes('label')
    );

    expect(ariaViolations).toEqual([]);
  });

  test('should have semantic HTML structure', async ({ page }) => {
    await page.goto(BASE_URL);

    // Check for semantic landmarks
    const header = await page.locator('header').count();
    const main = await page.locator('main').count();
    const footer = await page.locator('footer').count();

    expect(header).toBeGreaterThanOrEqual(1);
    expect(main).toBeGreaterThanOrEqual(1);
    expect(footer).toBeGreaterThanOrEqual(1);
  });

  test('should have keyboard accessible navigation', async ({ page }) => {
    await page.goto(BASE_URL);

    // Tab to focus first interactive element
    await page.keyboard.press('Tab');

    // Check if something is focused
    const focusedElement = await page.locator(':focus').count();
    expect(focusedElement).toBeGreaterThanOrEqual(1);
  });
});

test.describe('Design System - Theme Switching', () => {
  test('should support dark theme', async ({ page }) => {
    await page.goto(BASE_URL);

    // Add dark class to test
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });

    // Check background color changed
    const bgColor = await page.locator('body').evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Dark theme should have dark background
    expect(bgColor).toMatch(/rgb\(15,\s*23,\s*42\)/); // Slate 900
  });
});

test.describe('Design System - Typography', () => {
  test('should use correct font families', async ({ page }) => {
    await page.goto(BASE_URL);

    const bodyFont = await page.locator('body').evaluate((el) => {
      return window.getComputedStyle(el).fontFamily;
    });

    // Should use system font stack
    expect(bodyFont).toMatch(/-apple-system|BlinkMacSystemFont|Segoe UI/);
  });

  test('should have readable line heights', async ({ page }) => {
    await page.goto(BASE_URL);

    const lineHeight = await page.locator('body').evaluate((el) => {
      return window.getComputedStyle(el).lineHeight;
    });

    // Line height should be at least 1.5 for readability
    const lineHeightValue = parseFloat(lineHeight);
    expect(lineHeightValue).toBeGreaterThanOrEqual(1.5);
  });
});
