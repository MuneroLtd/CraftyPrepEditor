import { expect, type Page } from '@playwright/test';
import path from 'path';
import AxeBuilder from '@axe-core/playwright';

/**
 * Uploads the test image to the application
 * @param page - Playwright page object
 */
export async function uploadTestImage(page: Page): Promise<void> {
  const fileInput = page.locator('input[type="file"]');
  const testImagePath = path.join(__dirname, '../../fixtures/sample-image.jpg');
  await fileInput.setInputFiles(testImagePath);
}

/**
 * Waits for the upload to complete and original preview to be visible
 * @param page - Playwright page object
 */
export async function waitForUploadComplete(page: Page): Promise<void> {
  await expect(page.locator('[data-testid="original-preview"]')).toBeVisible({
    timeout: 5000,
  });
}

/**
 * Waits for image processing to complete and processed preview to be visible
 * @param page - Playwright page object
 */
export async function waitForProcessingComplete(page: Page): Promise<void> {
  await expect(page.locator('[data-testid="processed-preview"]')).toBeVisible({
    timeout: 10000,
  });
}

/**
 * Performs accessibility scan using axe-core with WCAG 2.2 AAA level
 * @param page - Playwright page object
 * @param context - Optional context description for better error messages
 * @throws If any accessibility violations are found
 */
export async function scanAccessibility(page: Page, context?: string): Promise<void> {
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2aaa', 'wcag22aa', 'wcag21aa'])
    .analyze();

  const violations = accessibilityScanResults.violations;

  if (violations.length > 0) {
    const message = context
      ? `Accessibility violations found in "${context}"`
      : 'Accessibility violations found';

    console.error(message);
    console.error(JSON.stringify(violations, null, 2));
  }

  expect(violations).toEqual([]);
}
