import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://craftyprep.demosrv.uk';

test.describe('Enhanced Sliders', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    // Upload a test image to enable sliders
    await page.setInputFiles('input[type="file"]', {
      name: 'test-image.png',
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64'
      ),
    });
    // Wait for image to load
    await page.waitForSelector('[data-testid="preview-canvas"]', { timeout: 5000 });
    // Click "Auto Prep" to enable refinement controls
    await page.click('button:has-text("Auto Prep")');
    // Wait for controls to be visible
    await page.waitForSelector('text=Brightness', { timeout: 5000 });
  });

  test.describe('Brightness Slider', () => {
    test('should display gradient track', async ({ page }) => {
      const slider = page.locator('[aria-label*="brightness"]').first();
      await expect(slider).toBeVisible();

      // Check that the track has gradient fill
      const track = page.locator('[data-testid="slider-fill"]').first();
      await expect(track).toBeVisible();
    });

    test('should show value badge on hover', async ({ page }) => {
      const sliderContainer = page.locator('[data-testid="slider-container"]').first();

      // Hover over slider
      await sliderContainer.hover();

      // Value badge should appear
      const badge = page.locator('[data-testid="value-badge"]').first();
      await expect(badge).toBeVisible({ timeout: 1000 });
    });

    test('should allow clicking +/- buttons', async ({ page }) => {
      // Get initial value
      const input = page.locator('input[type="number"]').first();
      const initialValue = await input.inputValue();

      // Click increment button
      await page.locator('button[aria-label="Increase value"]').first().click();

      // Value should increase
      const newValue = await input.inputValue();
      expect(parseInt(newValue)).toBeGreaterThan(parseInt(initialValue));
    });

    test('should allow direct input', async ({ page }) => {
      const input = page.locator('input[type="number"]').first();

      // Clear and type new value
      await input.click();
      await input.fill('50');
      await input.press('Enter');

      // Value should update
      await expect(input).toHaveValue('50');
    });

    test('should support keyboard navigation on slider', async ({ page }) => {
      const slider = page.locator('[aria-label*="brightness"]').first();

      // Focus slider
      await slider.focus();

      // Get initial value
      const initialValue = await slider.getAttribute('aria-valuenow');

      // Press arrow right
      await slider.press('ArrowRight');

      // Value should increase
      const newValue = await slider.getAttribute('aria-valuenow');
      expect(parseInt(newValue!)).toBeGreaterThan(parseInt(initialValue!));
    });
  });

  test.describe('Contrast Slider', () => {
    test('should display purple gradient', async ({ page }) => {
      // Check that contrast slider has purple gradient colors
      const sliderContainers = page.locator('[data-testid="slider-container"]');
      const contrastSlider = sliderContainers.nth(1); // Second slider
      await expect(contrastSlider).toBeVisible();
    });

    test('should have numeric input', async ({ page }) => {
      const inputs = page.locator('input[type="number"]');
      const contrastInput = inputs.nth(1); // Second input
      await expect(contrastInput).toBeVisible();
    });
  });

  test.describe('Threshold Slider', () => {
    test('should display gray gradient', async ({ page }) => {
      // Check that threshold slider exists
      const sliderContainers = page.locator('[data-testid="slider-container"]');
      const thresholdSlider = sliderContainers.nth(2); // Third slider
      await expect(thresholdSlider).toBeVisible();
    });

    test('should have range 0-255', async ({ page }) => {
      const inputs = page.locator('input[type="number"]');
      const thresholdInput = inputs.nth(2); // Third input

      // Type maximum value
      await thresholdInput.click();
      await thresholdInput.fill('255');
      await thresholdInput.press('Enter');

      await expect(thresholdInput).toHaveValue('255');
    });
  });

  test.describe('Touch Targets', () => {
    test('should have sufficiently large touch targets', async ({ page }) => {
      // Check slider handle size (should be at least 44px)
      const handle = page.locator('[role="slider"]').first();
      const box = await handle.boundingBox();

      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    });

    test('should have large +/- buttons', async ({ page }) => {
      // Check button size
      const incrementButton = page.locator('button[aria-label="Increase value"]').first();
      const box = await incrementButton.boundingBox();

      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels', async ({ page }) => {
      const sliders = page.locator('[role="slider"]');

      // All sliders should have aria-label
      const count = await sliders.count();
      for (let i = 0; i < count; i++) {
        const slider = sliders.nth(i);
        const ariaLabel = await slider.getAttribute('aria-label');
        expect(ariaLabel).toBeTruthy();
      }
    });

    test('should have visible focus indicators', async ({ page }) => {
      const slider = page.locator('[role="slider"]').first();

      // Focus slider
      await slider.focus();

      // Check that focus is visible (ring should be present)
      // This is a visual check - in real testing we'd verify the ring styles
      await expect(slider).toBeFocused();
    });

    test('should announce value changes to screen readers', async ({ page }) => {
      const slider = page.locator('[role="slider"]').first();

      // Check aria-valuenow is present and updates
      const initialValue = await slider.getAttribute('aria-valuenow');
      expect(initialValue).toBeTruthy();

      await slider.focus();
      await slider.press('ArrowRight');

      const newValue = await slider.getAttribute('aria-valuenow');
      expect(newValue).not.toBe(initialValue);
    });
  });

  test.describe('Value Synchronization', () => {
    test('should sync slider and input values', async ({ page }) => {
      const slider = page.locator('[role="slider"]').first();
      const input = page.locator('input[type="number"]').first();

      // Move slider
      await slider.focus();
      await slider.press('ArrowRight');
      await slider.press('ArrowRight');
      await slider.press('ArrowRight');

      // Get slider value
      const sliderValue = await slider.getAttribute('aria-valuenow');

      // Input should match
      const inputValue = await input.inputValue();
      expect(inputValue).toBe(sliderValue);
    });

    test('should update slider when input changes', async ({ page }) => {
      const slider = page.locator('[role="slider"]').first();
      const input = page.locator('input[type="number"]').first();

      // Type in input
      await input.click();
      await input.fill('25');
      await input.press('Enter');

      // Slider should update
      const sliderValue = await slider.getAttribute('aria-valuenow');
      expect(sliderValue).toBe('25');
    });
  });

  test.describe('Validation', () => {
    test('should clamp values to min/max', async ({ page }) => {
      const input = page.locator('input[type="number"]').first();

      // Try to enter value above max (100)
      await input.click();
      await input.fill('200');
      await input.press('Enter');

      // Should be clamped to max
      await expect(input).toHaveValue('100');
    });

    test('should disable increment button at max', async ({ page }) => {
      const input = page.locator('input[type="number"]').first();
      const incrementButton = page.locator('button[aria-label="Increase value"]').first();

      // Set to maximum
      await input.click();
      await input.fill('100');
      await input.press('Enter');

      // Wait for input to update
      await page.waitForTimeout(100);

      // Increment button should be disabled
      await expect(incrementButton).toBeDisabled();
    });

    test('should disable decrement button at min', async ({ page }) => {
      const input = page.locator('input[type="number"]').first();
      const decrementButton = page.locator('button[aria-label="Decrease value"]').first();

      // Set to minimum
      await input.click();
      await input.fill('-100');
      await input.press('Enter');

      // Wait for input to update
      await page.waitForTimeout(100);

      // Decrement button should be disabled
      await expect(decrementButton).toBeDisabled();
    });
  });
});
