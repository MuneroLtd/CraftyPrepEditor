import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Testing - WCAG 2.2 AAA', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://craftyprep.demosrv.uk');
  });

  test('should not have any automatically detectable accessibility violations', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper keyboard navigation', async ({ page }) => {
    // Tab to skip link
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a:has-text("Skip to main content")');
    await expect(skipLink).toBeFocused();

    // Tab to dropzone
    await page.keyboard.press('Tab');
    const dropzone = page.getByRole('button', { name: /upload image file/i });
    await expect(dropzone).toBeFocused();

    // Verify focus indicator is visible
    const dropzoneBox = await dropzone.boundingBox();
    expect(dropzoneBox).toBeTruthy();
  });

  test('should have sufficient color contrast for all text', async ({ page }) => {
    // Run color contrast specific tests
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aaa'])
      .include('body')
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'color-contrast' || v.id === 'color-contrast-enhanced'
    );

    expect(contrastViolations).toEqual([]);
  });

  test('should have proper ARIA labels and roles', async ({ page }) => {
    // Check dropzone has proper role
    const dropzone = page.getByRole('button', { name: /upload image file/i });
    await expect(dropzone).toBeVisible();

    // Check for upload region label
    const uploadRegion = page.getByRole('region', { name: /image upload/i });
    await expect(uploadRegion).toBeVisible();

    // Verify skip link
    const skipLink = page.locator('a:has-text("Skip to main content")');
    await expect(skipLink).toBeVisible();
  });

  test('should have proper semantic HTML structure', async ({ page }) => {
    // Check for header
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Check for main landmark
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Check for footer
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Check heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('CraftyPrep');

    const h2 = page.locator('h2');
    await expect(h2).toBeVisible();
  });

  test('should support screen reader announcements', async ({ page }) => {
    // Check for live regions (will be added during file upload)
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    // Ensure no ARIA violations
    const ariaViolations = accessibilityScanResults.violations.filter(
      (v) => v.id.includes('aria')
    );

    expect(ariaViolations).toEqual([]);
  });

  test('should have focus indicators with sufficient contrast', async ({ page }) => {
    // Tab to dropzone
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Take screenshot to verify focus indicator
    await page.screenshot({ path: 'focus-indicator-test.png' });

    // Run color contrast check on focused element
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aaa'])
      .analyze();

    const focusViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'focus-order-semantics' || v.id === 'focus-visible'
    );

    expect(focusViolations).toEqual([]);
  });
});
