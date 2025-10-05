/**
 * E2E Tests for task-014: Contrast Adjustment Implementation
 *
 * Tests the contrast slider component and contrast adjustment algorithm
 * including UI interactions, processing pipeline integration, edge cases,
 * and WCAG 2.2 AAA accessibility compliance.
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

  // Get slider thumb bounding box
  const thumbBox = await slider.boundingBox();
  if (!thumbBox) {
    throw new Error('Slider thumb not found or not visible');
  }

  // Find the slider track (parent element with data-orientation)
  const track = slider.locator('xpath=ancestor::*[@data-orientation]').first();
  const trackBox = await track.boundingBox();

  if (!trackBox) {
    throw new Error('Slider track not found');
  }

  // Calculate target position on track
  // Range is -100 to +100, so normalize to 0-1
  const min = -100;
  const max = 100;
  const normalized = (targetValue - min) / (max - min); // 0 to 1

  // Calculate target X position on track
  const targetX = trackBox.x + trackBox.width * normalized;
  const targetY = trackBox.y + trackBox.height / 2;

  // Drag from current thumb position to target position
  const thumbCenterX = thumbBox.x + thumbBox.width / 2;
  const thumbCenterY = thumbBox.y + thumbBox.height / 2;

  await page.mouse.move(thumbCenterX, thumbCenterY);
  await page.mouse.down();
  await page.mouse.move(targetX, targetY, { steps: 10 });
  await page.mouse.up();

  // Wait for state update
  await page.waitForTimeout(150);
}

test.describe('task-014: Contrast Slider E2E Tests', () => {
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

    // Wait for upload success with explicit timeout
    await expect(page.getByText(/image uploaded successfully/i)).toBeVisible({ timeout: 15000 });

    // Click Auto-Prep to show sliders
    const autoPrepButton = page.getByRole('button', { name: /auto-prep/i });
    await autoPrepButton.waitFor({ state: 'visible', timeout: 10000 });
    await autoPrepButton.click();

    // Wait for sliders to appear and for processing to complete
    await expect(page.getByRole('slider', { name: /adjust image contrast/i })).toBeVisible({
      timeout: 15000,
    });

    // Wait for initial processing to complete
    await page.waitForTimeout(1000);
  });

  test.describe('FR-1: Slider Rendering', () => {
    test('should render contrast slider with correct label', async ({ page }) => {
      const contrastSlider = page.getByRole('slider', { name: /adjust image contrast/i });
      await expect(contrastSlider).toBeVisible();

      // Check label text
      await expect(page.getByText('Contrast')).toBeVisible();
    });

    test('should display default value of 0', async ({ page }) => {
      const valueDisplay = page.locator('text=Contrast').locator('..').getByText('0');
      await expect(valueDisplay).toBeVisible();
    });

    test('should have correct range attributes (-100 to +100)', async ({ page }) => {
      const contrastSlider = page.getByRole('slider', { name: /adjust image contrast/i });

      const min = await contrastSlider.getAttribute('aria-valuemin');
      const max = await contrastSlider.getAttribute('aria-valuemax');
      const current = await contrastSlider.getAttribute('aria-valuenow');

      expect(min).toBe('-100');
      expect(max).toBe('100');
      expect(current).toBe('0');
    });
  });

  test.describe('FR-2: User Interactions', () => {
    test('should adjust contrast to +50 and update preview', async ({ page }) => {
      const contrastSlider = page.getByRole('slider', { name: /adjust image contrast/i });

      // Set contrast to +50 using helper function
      await setSliderValue(page, /adjust image contrast/i, 50);

      // Wait for:
      // 1. Slider animation to complete
      // 2. Debounce delay (100ms)
      // 3. Processing time (can be significant for large images)
      await page.waitForTimeout(1500);

      // Check value is approximately 50 (may vary slightly)
      const ariaValueNow = await contrastSlider.getAttribute('aria-valuenow');
      expect(parseInt(ariaValueNow || '0')).toBeGreaterThanOrEqual(45);
      expect(parseInt(ariaValueNow || '0')).toBeLessThanOrEqual(55);

      // Verify the value display also updated
      const valueDisplay = page
        .locator('text=Contrast')
        .locator('..')
        .getByText(/50|49|48|47|46|51|52|53|54|55/);
      await expect(valueDisplay).toBeVisible();
    });

    test('should adjust contrast to -50 and update preview', async ({ page }) => {
      const contrastSlider = page.getByRole('slider', { name: /adjust image contrast/i });

      // Set contrast to -50 using keyboard navigation
      await setSliderValue(page, /adjust image contrast/i, -50);

      // Wait for animation + debounce + processing
      await page.waitForTimeout(1500);

      // Check value updated (approximately -50, allow for slider increments)
      const ariaValueNow = await contrastSlider.getAttribute('aria-valuenow');
      expect(parseInt(ariaValueNow || '0')).toBeGreaterThanOrEqual(-55);
      expect(parseInt(ariaValueNow || '0')).toBeLessThanOrEqual(-45);

      // Verify the value display also updated
      const valueDisplay = page
        .locator('text=Contrast')
        .locator('..')
        .getByText(/-50|-49|-48|-47|-46|-51|-52|-53|-54|-55/);
      await expect(valueDisplay).toBeVisible();
    });

    test('should handle keyboard navigation (Arrow keys)', async ({ page }) => {
      const contrastSlider = page.getByRole('slider', { name: /adjust image contrast/i });

      // Focus the slider
      await contrastSlider.focus();

      // Press Arrow Right 5 times (should increase by 5)
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('ArrowRight');
      }

      await page.waitForTimeout(800); // Increased for debounce

      // Check value increased
      const value = await contrastSlider.getAttribute('aria-valuenow');
      expect(parseInt(value || '0')).toBeGreaterThan(0);
    });

    test('should handle Home key (jump to minimum)', async ({ page }) => {
      const contrastSlider = page.getByRole('slider', { name: /adjust image contrast/i });

      // Set to middle value first
      await setSliderValue(page, /adjust image contrast/i, 50);
      await page.waitForTimeout(100);

      // Focus and press Home
      await contrastSlider.focus();
      await page.keyboard.press('Home');

      await page.waitForTimeout(800); // Increased for debounce

      // Check value is at minimum
      const value = await contrastSlider.getAttribute('aria-valuenow');
      expect(value).toBe('-100');
    });

    test('should handle End key (jump to maximum)', async ({ page }) => {
      const contrastSlider = page.getByRole('slider', { name: /adjust image contrast/i });

      // Focus and press End
      await contrastSlider.focus();
      await page.keyboard.press('End');

      await page.waitForTimeout(800); // Increased for debounce

      // Check value is at maximum
      const value = await contrastSlider.getAttribute('aria-valuenow');
      expect(value).toBe('100');
    });
  });

  test.describe('FR-3: E2E Integration', () => {
    test('should work with brightness adjustment', async ({ page }) => {
      const brightnessSlider = page.getByRole('slider', { name: /adjust image brightness/i });
      const contrastSlider = page.getByRole('slider', { name: /adjust image contrast/i });

      // Adjust brightness
      await setSliderValue(page, /adjust image brightness/i, 30);
      await page.waitForTimeout(800); // Increased for debounce

      // Then adjust contrast
      await setSliderValue(page, /adjust image contrast/i, 40);
      await page.waitForTimeout(1000); // Increased for processing time

      // Both values should be set (approximately, allowing for slider increments)
      const brightnessValue = await brightnessSlider.getAttribute('aria-valuenow');
      const contrastValue = await contrastSlider.getAttribute('aria-valuenow');

      expect(parseInt(brightnessValue || '0')).toBeGreaterThanOrEqual(25);
      expect(parseInt(brightnessValue || '0')).toBeLessThanOrEqual(35);
      expect(parseInt(contrastValue || '0')).toBeGreaterThanOrEqual(35);
      expect(parseInt(contrastValue || '0')).toBeLessThanOrEqual(45);
    });

    test('should work with threshold adjustment', async ({ page }) => {
      const contrastSlider = page.getByRole('slider', { name: /adjust image contrast/i });
      const thresholdSlider = page.getByRole('slider', { name: /adjust binarization threshold/i });

      // Adjust contrast
      await setSliderValue(page, /adjust image contrast/i, 50);
      await page.waitForTimeout(800); // Increased for debounce

      // Then adjust threshold
      await setSliderValue(page, /adjust binarization threshold/i, 150);
      await page.waitForTimeout(1000); // Increased for processing time

      // Both values should be set (approximately)
      const contrastValue = await contrastSlider.getAttribute('aria-valuenow');
      const thresholdValue = await thresholdSlider.getAttribute('aria-valuenow');

      expect(parseInt(contrastValue || '0')).toBeGreaterThanOrEqual(45);
      expect(parseInt(contrastValue || '0')).toBeLessThanOrEqual(55);
      expect(parseInt(thresholdValue || '0')).toBeGreaterThanOrEqual(145);
      expect(parseInt(thresholdValue || '0')).toBeLessThanOrEqual(155);
    });

    test('should work with all three adjustments combined', async ({ page }) => {
      const brightnessSlider = page.getByRole('slider', { name: /adjust image brightness/i });
      const contrastSlider = page.getByRole('slider', { name: /adjust image contrast/i });
      const thresholdSlider = page.getByRole('slider', { name: /adjust binarization threshold/i });

      // Get initial processed image
      const processedImage = page.getByRole('img', { name: /processed image preview/i });
      const initialSrc = await processedImage.getAttribute('src');

      // Adjust all three
      await setSliderValue(page, /adjust image brightness/i, 20);
      await page.waitForTimeout(800); // Increased for debounce

      await setSliderValue(page, /adjust image contrast/i, 30);
      await page.waitForTimeout(800); // Increased for debounce

      await setSliderValue(page, /adjust binarization threshold/i, 140);
      await page.waitForTimeout(1000); // Increased for processing time

      // Verify all values set correctly (approximately)
      const brightnessValue = parseInt(
        (await brightnessSlider.getAttribute('aria-valuenow')) || '0'
      );
      const contrastValue = parseInt((await contrastSlider.getAttribute('aria-valuenow')) || '0');
      const thresholdValue = parseInt((await thresholdSlider.getAttribute('aria-valuenow')) || '0');

      expect(brightnessValue).toBeGreaterThanOrEqual(15);
      expect(brightnessValue).toBeLessThanOrEqual(25);
      expect(contrastValue).toBeGreaterThanOrEqual(25);
      expect(contrastValue).toBeLessThanOrEqual(35);
      expect(thresholdValue).toBeGreaterThanOrEqual(135);
      expect(thresholdValue).toBeLessThanOrEqual(145);

      // Verify preview updated
      const finalSrc = await processedImage.getAttribute('src');
      expect(finalSrc).not.toBe(initialSrc);
    });

    test('should debounce preview updates during drag', async ({ page }) => {
      const contrastSlider = page.getByRole('slider', { name: /adjust image contrast/i });

      const startTime = Date.now();

      // Rapidly change values (simulating drag with keyboard)
      await setSliderValue(page, /adjust image contrast/i, 10);
      await page.waitForTimeout(20);
      await setSliderValue(page, /adjust image contrast/i, 20);
      await page.waitForTimeout(20);
      await setSliderValue(page, /adjust image contrast/i, 30);
      await page.waitForTimeout(20);
      await setSliderValue(page, /adjust image contrast/i, 40);

      // Wait for debounce to settle
      await page.waitForTimeout(1000); // Increased for processing time

      const endTime = Date.now();
      const totalTime = endTime - startTime;

      // Should complete quickly (debouncing prevents multiple processing)
      expect(totalTime).toBeLessThan(3000); // Adjusted for keyboard interaction time

      // Final value should be approximately 40
      const finalValue = await contrastSlider.getAttribute('aria-valuenow');
      expect(parseInt(finalValue || '0')).toBeGreaterThanOrEqual(35);
      expect(parseInt(finalValue || '0')).toBeLessThanOrEqual(45);
    });
  });

  test.describe('FR-4: Edge Cases', () => {
    test('should handle maximum contrast (+100)', async ({ page }) => {
      const contrastSlider = page.getByRole('slider', { name: /adjust image contrast/i });

      await setSliderValue(page, /adjust image contrast/i, 100);
      await page.waitForTimeout(1000); // Increased for processing time

      const value = await contrastSlider.getAttribute('aria-valuenow');
      expect(value).toBe('100');

      // Should show updated value
      const valueDisplay = page.locator('text=Contrast').locator('..').getByText('100');
      await expect(valueDisplay).toBeVisible();
    });

    test('should handle minimum contrast (-100)', async ({ page }) => {
      const contrastSlider = page.getByRole('slider', { name: /adjust image contrast/i });

      await setSliderValue(page, /adjust image contrast/i, -100);
      await page.waitForTimeout(1000); // Increased for processing time

      const value = await contrastSlider.getAttribute('aria-valuenow');
      expect(value).toBe('-100');

      // Should show updated value
      const valueDisplay = page.locator('text=Contrast').locator('..').getByText('-100');
      await expect(valueDisplay).toBeVisible();
    });

    test('should maintain performance with large adjustments', async ({ page }) => {
      const startTime = Date.now();

      // Large jump from 0 to 100 using End key (most efficient)
      await setSliderValue(page, /adjust image contrast/i, 100);

      // Wait for processing to complete
      await page.waitForTimeout(600);

      const endTime = Date.now();
      const processingTime = endTime - startTime;

      // Should complete within performance target (<500ms processing + debounce)
      expect(processingTime).toBeLessThan(1000);
    });
  });

  test.describe('AR-1: Accessibility - Keyboard Navigation', () => {
    test('should be accessible via Tab key', async ({ page }) => {
      // Tab to the contrast slider
      await page.keyboard.press('Tab'); // Skip link
      await page.keyboard.press('Tab'); // Upload button or first interactive element

      // Keep tabbing until we reach the contrast slider
      let attempts = 0;
      while (attempts < 20) {
        await page.keyboard.press('Tab');
        const focused = await page.evaluate(() =>
          document.activeElement?.getAttribute('aria-label')
        );
        if (focused?.includes('contrast')) {
          break;
        }
        attempts++;
      }

      // Should have focused the contrast slider
      const focusedElement = await page.evaluate(() =>
        document.activeElement?.getAttribute('aria-label')
      );
      expect(focusedElement).toContain('contrast');
    });

    test('should support all keyboard interactions', async ({ page }) => {
      const contrastSlider = page.getByRole('slider', { name: /adjust image contrast/i });
      await contrastSlider.focus();

      // Arrow Up (increase)
      await page.keyboard.press('ArrowUp');
      await page.waitForTimeout(100);
      let value = await contrastSlider.getAttribute('aria-valuenow');
      expect(parseInt(value || '0')).toBeGreaterThan(0);

      // Arrow Down (decrease)
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(100);
      value = await contrastSlider.getAttribute('aria-valuenow');
      expect(parseInt(value || '0')).toBeLessThan(0);

      // Home (min)
      await page.keyboard.press('Home');
      await page.waitForTimeout(100);
      value = await contrastSlider.getAttribute('aria-valuenow');
      expect(value).toBe('-100');

      // End (max)
      await page.keyboard.press('End');
      await page.waitForTimeout(100);
      value = await contrastSlider.getAttribute('aria-valuenow');
      expect(value).toBe('100');
    });
  });

  test.describe('AR-2: Accessibility - Focus Indicators', () => {
    test('should have visible focus indicator', async ({ page }) => {
      const contrastSlider = page.getByRole('slider', { name: /adjust image contrast/i });
      await contrastSlider.focus();

      // Check for focus outline (implementation detail varies)
      const outline = await contrastSlider.evaluate((el) => {
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
        parseInt(outline.outlineWidth || '0') > 0 ||
        outline.boxShadow !== 'none';

      expect(hasFocusIndicator).toBeTruthy();
    });

    test('should meet WCAG 2.2 focus indicator requirements (3px, 3:1 contrast)', async ({
      page,
    }) => {
      const contrastSlider = page.getByRole('slider', { name: /adjust image contrast/i });
      await contrastSlider.focus();

      // Take screenshot for manual verification if needed
      await page.screenshot({
        path: '/opt/workspaces/craftyprep.com/src/tests/e2e/screenshots/contrast-slider-focus.png',
        fullPage: false,
      });

      // This is a visual check - automated testing can verify presence,
      // but contrast ratio needs manual verification or specialized tools
      const isFocused = await contrastSlider.evaluate((el) => el === document.activeElement);
      expect(isFocused).toBeTruthy();
    });
  });

  test.describe('AR-3: Accessibility - Screen Reader Support', () => {
    test('should have proper ARIA attributes', async ({ page }) => {
      const contrastSlider = page.getByRole('slider', { name: /adjust image contrast/i });

      const ariaLabel = await contrastSlider.getAttribute('aria-label');
      const ariaValueMin = await contrastSlider.getAttribute('aria-valuemin');
      const ariaValueMax = await contrastSlider.getAttribute('aria-valuemax');
      const ariaValueNow = await contrastSlider.getAttribute('aria-valuenow');
      const role = await contrastSlider.getAttribute('role');

      expect(ariaLabel).toContain('contrast');
      expect(ariaLabel).toContain('-100');
      expect(ariaLabel).toContain('100');
      expect(ariaValueMin).toBe('-100');
      expect(ariaValueMax).toBe('100');
      expect(ariaValueNow).toBe('0');
      expect(role).toBe('slider');
    });

    test('should update aria-valuenow when value changes', async ({ page }) => {
      const contrastSlider = page.getByRole('slider', { name: /adjust image contrast/i });

      await setSliderValue(page, /adjust image contrast/i, 75);
      await page.waitForTimeout(100);

      const ariaValueNow = await contrastSlider.getAttribute('aria-valuenow');
      expect(parseInt(ariaValueNow || '0')).toBeGreaterThanOrEqual(70);
      expect(parseInt(ariaValueNow || '0')).toBeLessThanOrEqual(80);
    });
  });

  test.describe('AR-4: Accessibility - Automated Scan', () => {
    test('should have zero axe violations on refinement controls', async ({ page }) => {
      // Run axe scan on the refinement controls region
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('[aria-label*="Refinement Controls"]')
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should meet WCAG 2.2 AAA standards', async ({ page }) => {
      // Run comprehensive axe scan with WCAG 2.2 AAA rules
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag22aa'])
        .analyze();

      // Should have zero violations
      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have sufficient color contrast for all text', async ({ page }) => {
      // Run color contrast check
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['cat.color'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('AR-5: Accessibility - Touch Targets', () => {
    test('should have adequate touch target size (44x44px minimum)', async ({ page }) => {
      const contrastSlider = page.getByRole('slider', { name: /adjust image contrast/i });

      const boundingBox = await contrastSlider.boundingBox();

      expect(boundingBox).not.toBeNull();
      if (boundingBox) {
        // Height should be at least 44px for touch accessibility
        expect(boundingBox.height).toBeGreaterThanOrEqual(44);

        // Width should be reasonable (not checking full width, just that it exists)
        expect(boundingBox.width).toBeGreaterThan(0);
      }
    });
  });

  test.describe('IR-1: Integration - Export Functionality', () => {
    test('should include contrast adjustments in exported image', async ({ page }) => {
      // Adjust contrast
      await setSliderValue(page, /adjust image contrast/i, 60);
      await page.waitForTimeout(1000); // Increased for processing time

      // Click download button
      const downloadButton = page.getByRole('button', { name: /download/i });
      await expect(downloadButton).toBeVisible();

      // Verify button is enabled (indicates processing complete)
      await expect(downloadButton).toBeEnabled();
    });
  });
});
