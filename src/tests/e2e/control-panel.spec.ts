import { test, expect } from '@playwright/test';

test.describe('Professional Control Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://craftyprep.demosrv.uk');

    // Upload test image
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('input[type="file"]').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('./tests/fixtures/test-image.jpg');

    // Wait for upload to complete
    await page.waitForSelector('button:has-text("Auto-Prep")', { timeout: 10000 });

    // Run auto-prep
    await page.click('button:has-text("Auto-Prep")');

    // Wait for Controls heading to appear
    await page.waitForSelector('text=Controls', { timeout: 15000 });
  });

  test('should render all control sections', async ({ page }) => {
    // Verify all sections are present
    await expect(page.getByText('Material Presets')).toBeVisible();
    await expect(page.getByText('Background Removal')).toBeVisible();
    await expect(page.getByText('Adjustments')).toBeVisible();
    await expect(page.getByText('History')).toBeVisible();
    await expect(page.getByText('Export')).toBeVisible();
    await expect(page.getByText('Actions')).toBeVisible();
  });

  test('should collapse and expand sections', async ({ page }) => {
    const adjustmentsTrigger = page.locator('button:has-text("Adjustments")').first();

    // Initially expanded - check if sliders are visible
    await expect(page.getByText('Brightness')).toBeVisible();
    await expect(page.getByText('Contrast')).toBeVisible();
    await expect(page.getByText('Threshold')).toBeVisible();

    // Collapse
    await adjustmentsTrigger.click();
    await page.waitForTimeout(400); // Wait for animation

    // Verify content is hidden
    await expect(page.getByText('Brightness')).not.toBeVisible();

    // Expand
    await adjustmentsTrigger.click();
    await page.waitForTimeout(400); // Wait for animation

    // Verify content is visible again
    await expect(page.getByText('Brightness')).toBeVisible();
  });

  test('should persist panel state on page reload', async ({ page }) => {
    // Collapse Adjustments section
    const adjustmentsTrigger = page.locator('button:has-text("Adjustments")').first();
    await adjustmentsTrigger.click();
    await page.waitForTimeout(400);

    // Verify it's collapsed
    await expect(page.getByText('Brightness')).not.toBeVisible();

    // Reload page
    await page.reload();

    // Upload and process image again
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('input[type="file"]').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('./tests/fixtures/test-image.jpg');
    await page.waitForSelector('button:has-text("Auto-Prep")');
    await page.click('button:has-text("Auto-Prep")');
    await page.waitForSelector('text=Controls', { timeout: 15000 });

    // Adjustments should still be collapsed
    // Wait a moment for the accordion to initialize
    await page.waitForTimeout(500);
    await expect(page.getByText('Brightness')).not.toBeVisible();
  });

  test('should be keyboard accessible', async ({ page }) => {
    // Focus on the first accordion trigger
    await page.keyboard.press('Tab'); // Skip to first focusable element
    // Continue tabbing until we reach Material Presets trigger
    let focused = await page.evaluate(() => document.activeElement?.textContent);
    while (focused && !focused.includes('Material Presets')) {
      await page.keyboard.press('Tab');
      focused = await page.evaluate(() => document.activeElement?.textContent);
    }

    // Verify we can activate with Enter key
    const isExpanded = await page
      .locator('button:has-text("Material Presets")')
      .first()
      .getAttribute('aria-expanded');

    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);

    // Section should toggle
    const newIsExpanded = await page
      .locator('button:has-text("Material Presets")')
      .first()
      .getAttribute('aria-expanded');
    expect(newIsExpanded).not.toBe(isExpanded);
  });

  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(page.getByText('Controls')).toBeVisible();
    await expect(page.getByText('Adjustments')).toBeVisible();

    // Touch targets should be ≥44px
    const trigger = page.locator('button:has-text("Adjustments")').first();
    const box = await trigger.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    const triggers = page
      .locator('[role="button"]')
      .filter({ hasText: /Material Presets|Adjustments|Export/ });
    const count = await triggers.count();

    // Check first few triggers have proper ARIA
    for (let i = 0; i < Math.min(count, 3); i++) {
      const trigger = triggers.nth(i);
      await expect(trigger).toHaveAttribute('aria-expanded');
      await expect(trigger).toHaveAttribute('aria-controls');
    }
  });

  test('should integrate all controls correctly', async ({ page }) => {
    // Test that sliders work within collapsed sections
    await expect(page.getByText('Brightness')).toBeVisible();

    // Get initial brightness value
    const brightnessSlider = page.locator('input[type="range"]').first();
    const initialValue = await brightnessSlider.inputValue();

    // Adjust slider
    await brightnessSlider.fill('50');
    await page.waitForTimeout(200); // Wait for debounce

    const newValue = await brightnessSlider.inputValue();
    expect(newValue).not.toBe(initialValue);

    // Verify the image updates (canvas should be present)
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();
  });

  test('should show download button in Export section', async ({ page }) => {
    // Expand Export section if collapsed
    const exportTrigger = page.locator('button:has-text("Export")').first();
    const isExpanded = await exportTrigger.getAttribute('aria-expanded');

    if (isExpanded === 'false') {
      await exportTrigger.click();
      await page.waitForTimeout(400);
    }

    // Verify download button is visible
    await expect(page.locator('button:has-text("Download")')).toBeVisible();
  });

  test('should show undo/redo in History section', async ({ page }) => {
    // Expand History section if collapsed
    const historyTrigger = page.locator('button:has-text("History")').first();
    const isExpanded = await historyTrigger.getAttribute('aria-expanded');

    if (isExpanded === 'false') {
      await historyTrigger.click();
      await page.waitForTimeout(400);
    }

    // Verify undo/redo buttons are visible (may be disabled initially)
    const undoButton = page.locator('button[aria-label*="Undo"]').first();
    const redoButton = page.locator('button[aria-label*="Redo"]').first();

    await expect(undoButton).toBeVisible();
    await expect(redoButton).toBeVisible();
  });

  test('should have consistent spacing between sections', async ({ page }) => {
    // Get all accordion items
    const sections = page.locator('[role="region"] > div > div[data-state]');
    const count = await sections.count();

    if (count >= 2) {
      const first = sections.nth(0);
      const second = sections.nth(1);

      const firstBox = await first.boundingBox();
      const secondBox = await second.boundingBox();

      // Calculate spacing (should be consistent - approximately 8px based on space-y-2)
      if (firstBox && secondBox) {
        const spacing = secondBox.y - (firstBox.y + firstBox.height);
        // Allow some tolerance for rendering differences
        expect(spacing).toBeGreaterThanOrEqual(6);
        expect(spacing).toBeLessThanOrEqual(12);
      }
    }
  });
});
