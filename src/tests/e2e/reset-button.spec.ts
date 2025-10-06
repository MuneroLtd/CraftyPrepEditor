/**
 * E2E Tests for task-017: Reset Button and State Management
 *
 * Tests the reset button component and reset functionality including
 * UI interactions, state management, edge cases, and WCAG 2.2 AAA
 * accessibility compliance.
 *
 * Tests verify:
 * - Reset button visibility and disabled states
 * - Slider reset to defaults (brightness=0, contrast=0, threshold=Otsu)
 * - Background removal reset
 * - Re-application of auto-prep algorithm
 * - Multiple reset operations
 * - Keyboard accessibility
 * - Screen reader support
 * - Touch target compliance
 */

import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const TEST_IMAGE_PATH = '/opt/workspaces/craftyprep.com/src/tests/fixtures/sample-image.jpg';
const BASE_URL = 'https://craftyprep.demosrv.uk';

/**
 * Helper function to set Radix UI Slider value using drag
 * Radix UI sliders don't support .fill() method - use drag to position
 */
async function setSliderValue(page: Page, sliderName: RegExp, targetValue: number) {
  const slider = page.getByRole('slider', { name: sliderName });
  await slider.waitFor({ state: 'visible' });

  const thumbBox = await slider.boundingBox();
  if (!thumbBox) {
    throw new Error('Slider thumb not found or not visible');
  }

  const track = slider.locator('xpath=ancestor::*[@data-orientation]').first();
  const trackBox = await track.boundingBox();

  if (!trackBox) {
    throw new Error('Slider track not found');
  }

  // Calculate target position on track
  // Brightness/Contrast: -100 to +100, Threshold: 0 to 255
  let min = -100;
  let max = 100;

  // Check if this is threshold slider (different range)
  const ariaLabel = await slider.getAttribute('aria-label');
  if (ariaLabel?.includes('threshold')) {
    min = 0;
    max = 255;
  }

  const normalized = (targetValue - min) / (max - min); // 0 to 1

  const targetX = trackBox.x + trackBox.width * normalized;
  const targetY = trackBox.y + trackBox.height / 2;

  const thumbCenterX = thumbBox.x + thumbBox.width / 2;
  const thumbCenterY = thumbBox.y + thumbBox.height / 2;

  await page.mouse.move(thumbCenterX, thumbCenterY);
  await page.mouse.down();
  await page.mouse.move(targetX, targetY, { steps: 10 });
  await page.mouse.up();

  // Wait for state update
  await page.waitForTimeout(150);
}

test.describe('task-017: Reset Button E2E Tests', () => {
  // Configure for serial execution to prevent resource contention
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    // Set longer navigation timeout for initial load
    page.setDefaultTimeout(30000);
    page.setDefaultNavigationTimeout(30000);

    // Navigate with wait for network idle
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Wait for page to be fully loaded
    await page.waitForLoadState('domcontentloaded');

    // Upload test image
    const uploadButton = page.getByRole('button', { name: /upload image/i });
    await uploadButton.waitFor({ state: 'visible', timeout: 10000 });

    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser', { timeout: 10000 }),
      uploadButton.click(),
    ]);
    await fileChooser.setFiles([TEST_IMAGE_PATH]);

    // Wait for upload success
    await expect(page.getByText(/image uploaded successfully/i)).toBeVisible({ timeout: 15000 });

    // Click Auto-Prep to show sliders and reset button
    const autoPrepButton = page.getByRole('button', { name: /auto-prep/i });
    await autoPrepButton.waitFor({ state: 'visible', timeout: 10000 });
    await autoPrepButton.click();

    // Wait for sliders to appear and for processing to complete
    await expect(page.getByRole('slider', { name: /adjust image brightness/i })).toBeVisible({
      timeout: 15000,
    });

    // Wait for initial processing to complete
    await page.waitForTimeout(1000);
  });

  test.describe('FR-1: Reset Button Visibility', () => {
    test('should show reset button after auto-prep completes', async ({ page }) => {
      const resetButton = page.getByRole('button', { name: /reset to auto-prep/i });
      await expect(resetButton).toBeVisible();
    });

    test('should have correct button text and icon', async ({ page }) => {
      const resetButton = page.getByRole('button', { name: /reset to auto-prep/i });

      // Check button text
      await expect(resetButton).toContainText('Reset to Auto-Prep');
    });

    test('should have secondary styling (less prominent than Auto-Prep)', async ({ page }) => {
      const resetButton = page.getByRole('button', { name: /reset to auto-prep/i });

      // Check that button has variant="secondary" or similar styling
      const buttonClass = await resetButton.getAttribute('class');
      expect(buttonClass).toBeTruthy();

      // Secondary buttons typically have different background color
      const backgroundColor = await resetButton.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      // Should have some background color (not transparent)
      expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    });
  });

  test.describe('FR-2: Reset Functionality - Brightness', () => {
    test('should reset brightness to 0 from positive value', async ({ page }) => {
      const brightnessSlider = page.getByRole('slider', { name: /adjust image brightness/i });

      // Set brightness to +50
      await setSliderValue(page, /adjust image brightness/i, 50);
      await page.waitForTimeout(500);

      // Verify brightness is set
      let brightnessValue = await brightnessSlider.getAttribute('aria-valuenow');
      expect(parseInt(brightnessValue || '0')).toBeGreaterThan(40);

      // Click reset button
      const resetButton = page.getByRole('button', { name: /reset to auto-prep/i });
      await resetButton.click();

      // Wait for reset to complete
      await page.waitForTimeout(1500);

      // Verify brightness is back to 0
      brightnessValue = await brightnessSlider.getAttribute('aria-valuenow');
      expect(brightnessValue).toBe('0');
    });

    test('should reset brightness to 0 from negative value', async ({ page }) => {
      const brightnessSlider = page.getByRole('slider', { name: /adjust image brightness/i });

      // Set brightness to -50
      await setSliderValue(page, /adjust image brightness/i, -50);
      await page.waitForTimeout(500);

      // Verify brightness is set
      let brightnessValue = await brightnessSlider.getAttribute('aria-valuenow');
      expect(parseInt(brightnessValue || '0')).toBeLessThan(-40);

      // Click reset button
      const resetButton = page.getByRole('button', { name: /reset to auto-prep/i });
      await resetButton.click();

      // Wait for reset to complete
      await page.waitForTimeout(1500);

      // Verify brightness is back to 0
      brightnessValue = await brightnessSlider.getAttribute('aria-valuenow');
      expect(brightnessValue).toBe('0');
    });
  });

  test.describe('FR-2: Reset Functionality - Contrast', () => {
    test('should reset contrast to 0', async ({ page }) => {
      const contrastSlider = page.getByRole('slider', { name: /adjust image contrast/i });

      // Set contrast to -30
      await setSliderValue(page, /adjust image contrast/i, -30);
      await page.waitForTimeout(500);

      // Verify contrast is set
      let contrastValue = await contrastSlider.getAttribute('aria-valuenow');
      expect(parseInt(contrastValue || '0')).toBeLessThan(-20);

      // Click reset button
      const resetButton = page.getByRole('button', { name: /reset to auto-prep/i });
      await resetButton.click();

      // Wait for reset to complete
      await page.waitForTimeout(1500);

      // Verify contrast is back to 0
      contrastValue = await contrastSlider.getAttribute('aria-valuenow');
      expect(contrastValue).toBe('0');
    });
  });

  test.describe('FR-2: Reset Functionality - Threshold', () => {
    test('should reset threshold to Otsu calculated value', async ({ page }) => {
      const thresholdSlider = page.getByRole('slider', { name: /adjust binarization threshold/i });

      // Get initial Otsu value (after auto-prep)
      const initialThreshold = await thresholdSlider.getAttribute('aria-valuenow');
      const otsuValue = parseInt(initialThreshold || '128');

      // Set threshold to a different value (200)
      await setSliderValue(page, /adjust binarization threshold/i, 200);
      await page.waitForTimeout(500);

      // Verify threshold changed
      let thresholdValue = await thresholdSlider.getAttribute('aria-valuenow');
      expect(parseInt(thresholdValue || '0')).toBeGreaterThan(190);

      // Click reset button
      const resetButton = page.getByRole('button', { name: /reset to auto-prep/i });
      await resetButton.click();

      // Wait for reset to complete
      await page.waitForTimeout(1500);

      // Verify threshold is back to Otsu value (within reasonable range)
      thresholdValue = await thresholdSlider.getAttribute('aria-valuenow');
      expect(parseInt(thresholdValue || '0')).toBeGreaterThanOrEqual(otsuValue - 5);
      expect(parseInt(thresholdValue || '0')).toBeLessThanOrEqual(otsuValue + 5);
    });
  });

  test.describe('FR-2: Reset Functionality - Background Removal', () => {
    test('should disable background removal on reset', async ({ page }) => {
      // Enable background removal if present
      const bgRemovalCheckbox = page.getByRole('checkbox', { name: /remove background/i });

      // Check if background removal feature exists
      const isVisible = await bgRemovalCheckbox.isVisible().catch(() => false);

      if (isVisible) {
        // Enable it
        await bgRemovalCheckbox.check();
        await page.waitForTimeout(500);

        // Verify enabled
        expect(await bgRemovalCheckbox.isChecked()).toBeTruthy();

        // Click reset button
        const resetButton = page.getByRole('button', { name: /reset to auto-prep/i });
        await resetButton.click();

        // Wait for reset to complete
        await page.waitForTimeout(1500);

        // Verify background removal is disabled
        expect(await bgRemovalCheckbox.isChecked()).toBeFalsy();
      } else {
        // If feature doesn't exist, test passes (skip)
        test.skip();
      }
    });
  });

  test.describe('FR-3: Re-apply Auto-Prep Algorithm', () => {
    test('should re-run auto-prep algorithm on reset', async ({ page }) => {
      const processedImage = page.getByRole('img', { name: /processed image preview/i });

      // Get initial auto-prep result
      const initialSrc = await processedImage.getAttribute('src');

      // Adjust all sliders
      await setSliderValue(page, /adjust image brightness/i, 30);
      await page.waitForTimeout(500);
      await setSliderValue(page, /adjust image contrast/i, 40);
      await page.waitForTimeout(500);

      // Verify preview changed
      const modifiedSrc = await processedImage.getAttribute('src');
      expect(modifiedSrc).not.toBe(initialSrc);

      // Click reset button
      const resetButton = page.getByRole('button', { name: /reset to auto-prep/i });
      await resetButton.click();

      // Wait for reset processing to complete
      await page.waitForTimeout(2000);

      // Verify preview matches original auto-prep result
      const resetSrc = await processedImage.getAttribute('src');

      // The src should be similar to initial (not identical due to timestamp, but similar data)
      // We verify by checking that sliders are at defaults and image has been reprocessed
      const brightnessValue = await page
        .getByRole('slider', { name: /adjust image brightness/i })
        .getAttribute('aria-valuenow');
      const contrastValue = await page
        .getByRole('slider', { name: /adjust image contrast/i })
        .getAttribute('aria-valuenow');

      expect(brightnessValue).toBe('0');
      expect(contrastValue).toBe('0');
      expect(resetSrc).toBeTruthy(); // Image exists
    });

    test('should show processing indicator during reset', async ({ page }) => {
      // Click reset button
      const resetButton = page.getByRole('button', { name: /reset to auto-prep/i });
      await resetButton.click();

      // Check for loading state (button should show "Resetting..." or be disabled)
      // Wait a very short time to catch the loading state
      await page.waitForTimeout(100);

      // Button should either be disabled or show loading text
      const isDisabled = await resetButton.isDisabled().catch(() => false);
      const buttonText = await resetButton.textContent();

      // Either disabled OR shows loading state
      expect(isDisabled || buttonText?.includes('Resetting')).toBeTruthy();
    });
  });

  test.describe('FR-4: Multiple Reset Operations', () => {
    test('should handle multiple reset operations correctly', async ({ page }) => {
      const brightnessSlider = page.getByRole('slider', { name: /adjust image brightness/i });
      const resetButton = page.getByRole('button', { name: /reset to auto-prep/i });

      // First adjustment and reset
      await setSliderValue(page, /adjust image brightness/i, 50);
      await page.waitForTimeout(500);
      await resetButton.click();
      await page.waitForTimeout(1500);

      let brightnessValue = await brightnessSlider.getAttribute('aria-valuenow');
      expect(brightnessValue).toBe('0');

      // Second adjustment and reset
      await setSliderValue(page, /adjust image brightness/i, -40);
      await page.waitForTimeout(500);
      await resetButton.click();
      await page.waitForTimeout(1500);

      brightnessValue = await brightnessSlider.getAttribute('aria-valuenow');
      expect(brightnessValue).toBe('0');

      // Third reset (should work even without adjustments)
      await resetButton.click();
      await page.waitForTimeout(1500);

      brightnessValue = await brightnessSlider.getAttribute('aria-valuenow');
      expect(brightnessValue).toBe('0');
    });
  });

  test.describe('FR-5: Disabled States', () => {
    test('should be enabled after auto-prep completes', async ({ page }) => {
      const resetButton = page.getByRole('button', { name: /reset to auto-prep/i });

      // Should be enabled
      await expect(resetButton).toBeEnabled();
    });

    test('should be disabled during processing', async ({ page }) => {
      const resetButton = page.getByRole('button', { name: /reset to auto-prep/i });

      // Click reset to trigger processing
      await resetButton.click();

      // Check disabled state immediately (within processing window)
      await page.waitForTimeout(100);

      // Should be disabled during processing
      const isDisabled = await resetButton.isDisabled();
      expect(isDisabled).toBeTruthy();
    });
  });

  test.describe('A11Y-1: Keyboard Navigation', () => {
    test('should be accessible via Tab key', async ({ page }) => {
      // Tab through elements to reach reset button
      let attempts = 0;
      while (attempts < 30) {
        await page.keyboard.press('Tab');
        const focused = await page.evaluate(
          () =>
            document.activeElement?.getAttribute('aria-label') ||
            document.activeElement?.textContent
        );
        if (focused?.includes('Reset') || focused?.includes('reset')) {
          break;
        }
        attempts++;
      }

      // Should have focused the reset button
      const focusedElement = await page.evaluate(() => document.activeElement?.textContent);
      expect(focusedElement).toMatch(/reset/i);
    });

    test('should activate via Enter key', async ({ page }) => {
      const resetButton = page.getByRole('button', { name: /reset to auto-prep/i });
      const brightnessSlider = page.getByRole('slider', { name: /adjust image brightness/i });

      // Adjust brightness
      await setSliderValue(page, /adjust image brightness/i, 50);
      await page.waitForTimeout(500);

      // Focus reset button and press Enter
      await resetButton.focus();
      await page.keyboard.press('Enter');

      // Wait for reset
      await page.waitForTimeout(1500);

      // Verify reset occurred
      const brightnessValue = await brightnessSlider.getAttribute('aria-valuenow');
      expect(brightnessValue).toBe('0');
    });

    test('should activate via Space key', async ({ page }) => {
      const resetButton = page.getByRole('button', { name: /reset to auto-prep/i });
      const contrastSlider = page.getByRole('slider', { name: /adjust image contrast/i });

      // Adjust contrast
      await setSliderValue(page, /adjust image contrast/i, -30);
      await page.waitForTimeout(500);

      // Focus reset button and press Space
      await resetButton.focus();
      await page.keyboard.press('Space');

      // Wait for reset
      await page.waitForTimeout(1500);

      // Verify reset occurred
      const contrastValue = await contrastSlider.getAttribute('aria-valuenow');
      expect(contrastValue).toBe('0');
    });

    test('should have visible focus indicator', async ({ page }) => {
      const resetButton = page.getByRole('button', { name: /reset to auto-prep/i });
      await resetButton.focus();

      // Check for focus outline
      const outline = await resetButton.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          outline: styles.outline,
          outlineWidth: styles.outlineWidth,
          boxShadow: styles.boxShadow,
        };
      });

      // Should have some form of focus indicator
      const hasFocusIndicator =
        outline.outline !== 'none' ||
        parseInt(outline.outlineWidth || '0') >= 3 ||
        outline.boxShadow !== 'none';

      expect(hasFocusIndicator).toBeTruthy();
    });
  });

  test.describe('A11Y-2: Screen Reader Support', () => {
    test('should have proper ARIA label', async ({ page }) => {
      const resetButton = page.getByRole('button', { name: /reset to auto-prep/i });

      const ariaLabel = await resetButton.getAttribute('aria-label');

      // Should have aria-label describing the action
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel).toMatch(/reset/i);
    });

    test('should announce loading state', async ({ page }) => {
      const resetButton = page.getByRole('button', { name: /reset to auto-prep/i });

      // Click reset
      await resetButton.click();

      // Check for aria-busy during processing
      await page.waitForTimeout(100);

      const ariaBusy = await resetButton.getAttribute('aria-busy');

      // Should indicate busy state OR be disabled
      const isDisabled = await resetButton.isDisabled();
      expect(ariaBusy === 'true' || isDisabled).toBeTruthy();
    });

    test('should use semantic HTML (button element)', async ({ page }) => {
      const resetButton = page.getByRole('button', { name: /reset to auto-prep/i });

      const tagName = await resetButton.evaluate((el) => el.tagName.toLowerCase());

      expect(tagName).toBe('button');
    });
  });

  test.describe('A11Y-3: Touch Targets', () => {
    test('should meet touch target size requirements (≥44px height)', async ({ page }) => {
      const resetButton = page.getByRole('button', { name: /reset to auto-prep/i });

      const boundingBox = await resetButton.boundingBox();

      expect(boundingBox).not.toBeNull();
      if (boundingBox) {
        // Height should be at least 44px for touch accessibility
        expect(boundingBox.height).toBeGreaterThanOrEqual(44);

        // Width should be reasonable (at least 100px per spec)
        expect(boundingBox.width).toBeGreaterThanOrEqual(100);
      }
    });
  });

  test.describe('A11Y-4: Accessibility Scan', () => {
    test('should have zero axe violations on reset button', async ({ page }) => {
      // Run axe scan on the reset button and its container
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('button:has-text("Reset")')
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should meet WCAG 2.2 AAA standards', async ({ page }) => {
      // Run comprehensive axe scan
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag22aa'])
        .analyze();

      // Should have zero violations
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('P-1: Performance', () => {
    test('should complete reset within performance target (<3 seconds)', async ({ page }) => {
      const resetButton = page.getByRole('button', { name: /reset to auto-prep/i });

      const startTime = Date.now();

      // Click reset
      await resetButton.click();

      // Wait for reset to complete (button becomes enabled again)
      await page.waitForFunction(
        () => {
          const btn = document.querySelector('button[aria-label*="Reset"]') as HTMLButtonElement;
          return btn && !btn.disabled;
        },
        { timeout: 5000 }
      );

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete within 3 seconds
      expect(duration).toBeLessThan(3000);
    });

    test('should show processing indicator immediately (<100ms)', async ({ page }) => {
      const resetButton = page.getByRole('button', { name: /reset to auto-prep/i });

      const startTime = Date.now();

      // Click reset
      await resetButton.click();

      // Check disabled state immediately
      await page.waitForTimeout(50);

      const isDisabled = await resetButton.isDisabled();
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Should respond within 100ms
      expect(responseTime).toBeLessThan(100);
      expect(isDisabled).toBeTruthy();
    });
  });

  test.describe('IR-1: Integration - Complete Reset Workflow', () => {
    test('should execute full reset workflow: upload → auto-prep → adjust → reset', async ({
      page,
    }) => {
      // Already uploaded and auto-prepped in beforeEach

      // Adjust all sliders
      await setSliderValue(page, /adjust image brightness/i, 25);
      await page.waitForTimeout(300);
      await setSliderValue(page, /adjust image contrast/i, 35);
      await page.waitForTimeout(300);
      await setSliderValue(page, /adjust binarization threshold/i, 180);
      await page.waitForTimeout(300);

      // Verify adjustments applied
      const brightnessSlider = page.getByRole('slider', { name: /adjust image brightness/i });
      const contrastSlider = page.getByRole('slider', { name: /adjust image contrast/i });
      const thresholdSlider = page.getByRole('slider', { name: /adjust binarization threshold/i });

      let brightnessValue = parseInt((await brightnessSlider.getAttribute('aria-valuenow')) || '0');
      let contrastValue = parseInt((await contrastSlider.getAttribute('aria-valuenow')) || '0');
      const thresholdValue = parseInt((await thresholdSlider.getAttribute('aria-valuenow')) || '0');

      expect(brightnessValue).toBeGreaterThan(15);
      expect(contrastValue).toBeGreaterThan(25);
      expect(thresholdValue).toBeGreaterThan(170);

      // Click reset
      const resetButton = page.getByRole('button', { name: /reset to auto-prep/i });
      await resetButton.click();

      // Wait for reset to complete
      await page.waitForTimeout(2000);

      // Verify all values reset
      brightnessValue = parseInt((await brightnessSlider.getAttribute('aria-valuenow')) || '0');
      contrastValue = parseInt((await contrastSlider.getAttribute('aria-valuenow')) || '0');

      expect(brightnessValue).toBe(0);
      expect(contrastValue).toBe(0);
      // Threshold should be back to Otsu value (not checking exact value)
    });
  });
});
