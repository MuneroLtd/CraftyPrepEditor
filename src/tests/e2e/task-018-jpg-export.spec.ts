import { test, expect } from '@playwright/test';
import {
  uploadTestImage,
  waitForUploadComplete,
  waitForProcessingComplete,
} from './helpers/test-helpers';

/**
 * E2E Tests for task-018: JPG Export Option
 *
 * Verifies that users can export processed images in JPG format
 * with correct filename generation and format selection UI.
 */
test.describe('JPG Export - task-018', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://craftyprep.demosrv.uk');
  });

  test('should default to PNG format', async ({ page }) => {
    // Upload test image
    await uploadTestImage(page);
    await waitForUploadComplete(page);

    // Click Auto-Prep
    await page.getByRole('button', { name: /auto-prep/i }).click();
    await waitForProcessingComplete(page);

    // Verify PNG is selected by default
    const pngRadio = page.locator('input[name="format"][value="png"]');
    await expect(pngRadio).toBeChecked();

    // Verify button text shows PNG
    const downloadButton = page.locator('button:has-text("Download PNG")');
    await expect(downloadButton).toBeVisible();
  });

  test('should export image as JPG format', async ({ page }) => {
    // Upload test image
    await uploadTestImage(page);
    await waitForUploadComplete(page);

    // Click Auto-Prep
    await page.getByRole('button', { name: /auto-prep/i }).click();
    await waitForProcessingComplete(page);

    // Select JPG format
    const jpgRadio = page.locator('input[name="format"][value="jpeg"]');
    await jpgRadio.check();
    await expect(jpgRadio).toBeChecked();

    // Verify button text updated
    const downloadButton = page.locator('button:has-text("Download JPG")');
    await expect(downloadButton).toBeVisible();

    // Trigger download
    const downloadPromise = page.waitForEvent('download');
    await downloadButton.click();
    const download = await downloadPromise;

    // Verify filename has .jpg extension
    expect(download.suggestedFilename()).toMatch(/_laserprep\.jpg$/);
  });

  test('should toggle between PNG and JPG formats', async ({ page }) => {
    await uploadTestImage(page);
    await waitForUploadComplete(page);

    await page.getByRole('button', { name: /auto-prep/i }).click();
    await waitForProcessingComplete(page);

    // Toggle to JPG
    const jpgRadio = page.locator('input[name="format"][value="jpeg"]');
    await jpgRadio.check();
    await expect(page.locator('button:has-text("Download JPG")')).toBeVisible();

    // Toggle back to PNG
    const pngRadio = page.locator('input[name="format"][value="png"]');
    await pngRadio.check();
    await expect(page.locator('button:has-text("Download PNG")')).toBeVisible();
  });

  test('should be keyboard accessible', async ({ page }) => {
    await uploadTestImage(page);
    await waitForUploadComplete(page);

    await page.getByRole('button', { name: /auto-prep/i }).click();
    await waitForProcessingComplete(page);

    // Tab to format selector (from file input)
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // May need adjustment depending on UI layout

    // Space to select JPG
    await page.keyboard.press('Space');
    const jpgRadio = page.locator('input[name="format"][value="jpeg"]');
    await expect(jpgRadio).toBeChecked();

    // Tab back and select PNG with Space
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Space');
    const pngRadio = page.locator('input[name="format"][value="png"]');
    await expect(pngRadio).toBeChecked();
  });

  test('should have proper focus indicators', async ({ page }) => {
    await uploadTestImage(page);
    await waitForUploadComplete(page);

    await page.getByRole('button', { name: /auto-prep/i }).click();
    await waitForProcessingComplete(page);

    const pngRadio = page.locator('input[name="format"][value="png"]');
    const jpgRadio = page.locator('input[name="format"][value="jpeg"]');

    // Focus PNG radio
    await pngRadio.focus();
    await expect(pngRadio).toBeFocused();

    // Focus JPG radio
    await jpgRadio.focus();
    await expect(jpgRadio).toBeFocused();
  });

  test('should have accessible format selector with legend', async ({ page }) => {
    await uploadTestImage(page);
    await waitForUploadComplete(page);

    await page.getByRole('button', { name: /auto-prep/i }).click();
    await waitForProcessingComplete(page);

    // Verify fieldset and legend exist
    const fieldset = page.locator('fieldset:has-text("Export Format")');
    await expect(fieldset).toBeVisible();

    // Verify both options are present
    await expect(page.locator('text=PNG (Lossless)')).toBeVisible();
    await expect(page.locator('text=JPG (Smaller)')).toBeVisible();
  });
});
