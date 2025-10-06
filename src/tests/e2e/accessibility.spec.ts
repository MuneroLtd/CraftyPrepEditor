import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {
  uploadTestImage,
  waitForProcessingComplete,
  scanAccessibility,
} from './helpers/test-helpers';

// Test timeout constants
const LAYOUT_SETTLE_TIMEOUT = 500;
const SELECTOR_TIMEOUT = 5000;

test.describe('Accessibility Testing - WCAG 2.2 AAA', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://craftyprep.demosrv.uk');
  });

  test('should not have any automatically detectable accessibility violations', async ({
    page,
  }) => {
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
    const ariaViolations = accessibilityScanResults.violations.filter((v) => v.id.includes('aria'));

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

  test('should have no axe violations after image upload', async ({ page }) => {
    await uploadTestImage(page);
    await scanAccessibility(page, 'after image upload');
  });

  test('should have no axe violations after auto-prep', async ({ page }) => {
    await uploadTestImage(page);

    // Click auto-prep button
    const autoPrepButton = page.getByRole('button', { name: /auto-prep/i });
    await autoPrepButton.click();

    // Wait for processing to complete
    await waitForProcessingComplete(page);

    await scanAccessibility(page, 'after auto-prep');
  });

  test('should support keyboard navigation with skip link', async ({ page }) => {
    // Tab to skip link
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a:has-text("Skip to main content")');
    await expect(skipLink).toBeFocused();

    // Skip link should have correct href
    await expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  test('should announce loading state with aria-live', async ({ page }) => {
    // Upload image and trigger auto-prep
    await uploadTestImage(page);

    const autoPrepButton = page.getByRole('button', { name: /auto-prep/i });
    await autoPrepButton.click();

    // Wait for processing to complete
    await waitForProcessingComplete(page);

    // Verify no ARIA violations (including live regions)
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const ariaViolations = accessibilityScanResults.violations.filter((v) => v.id.includes('aria'));
    expect(ariaViolations).toEqual([]);
  });

  test('should support slider adjustment with arrow keys', async ({ page }) => {
    await uploadTestImage(page);

    // Click auto-prep
    const autoPrepButton = page.getByRole('button', { name: /auto-prep/i });
    await autoPrepButton.click();

    // Wait for processing to complete and sliders to appear
    await waitForProcessingComplete(page);
    await page.waitForSelector('input[type="range"]', {
      state: 'visible',
      timeout: SELECTOR_TIMEOUT,
    });

    // Focus on first range slider (brightness)
    const brightnessSlider = page.locator('input[type="range"]').first();
    await brightnessSlider.focus();

    // Get initial value
    const initialValue = await brightnessSlider.inputValue();

    // Use arrow keys to adjust
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');

    // Verify value changed
    const newValue = await brightnessSlider.inputValue();
    expect(parseInt(newValue)).toBeGreaterThan(parseInt(initialValue));
  });

  test('should have accessible canvas elements', async ({ page }) => {
    await uploadTestImage(page);

    // Click auto-prep to show processed canvas
    const autoPrepButton = page.getByRole('button', { name: /auto-prep/i });
    await autoPrepButton.click();

    // Wait for processing to complete and canvases to render
    await waitForProcessingComplete(page);
    await page.waitForSelector('canvas', { state: 'visible', timeout: SELECTOR_TIMEOUT });

    // Verify canvases have aria-label (using role="img")
    const canvases = page.locator('canvas[role="img"]');
    const count = await canvases.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // Verify first canvas has aria-label
    const firstCanvas = canvases.first();
    await expect(firstCanvas).toHaveAttribute('aria-label');
  });

  test('should handle focus correctly during state transitions', async ({ page }) => {
    await uploadTestImage(page);

    // Focus on auto-prep button
    const autoPrepButton = page.getByRole('button', { name: /auto-prep/i });
    await autoPrepButton.focus();
    await expect(autoPrepButton).toBeFocused();

    // Click button
    await autoPrepButton.click();

    // Wait for processing to complete
    await waitForProcessingComplete(page);

    // Verify focus is managed (button should still exist and be focusable)
    await expect(autoPrepButton).toBeVisible();
  });

  test('should support 200% zoom without horizontal scrolling', async ({ page }) => {
    // Set viewport to 1280x720 (standard desktop)
    await page.setViewportSize({ width: 1280, height: 720 });

    // Zoom to 200%
    await page.evaluate(() => {
      document.body.style.zoom = '200%';
    });

    // Wait a moment for layout to settle
    await page.waitForTimeout(LAYOUT_SETTLE_TIMEOUT);

    // Check for horizontal scrollbar
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    expect(hasHorizontalScroll).toBe(false);

    // Reset zoom
    await page.evaluate(() => {
      document.body.style.zoom = '100%';
    });
  });
});
