import { test, expect } from '@playwright/test';

test.describe('CraftyPrep Application', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/');

    // Check that the page title is visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Check that Tailwind styles are applied
    const heading = page.getByRole('heading', { level: 1 });
    const fontSize = await heading.evaluate((el) => window.getComputedStyle(el).fontSize);

    // Verify that Tailwind's text-4xl is applied (should be larger than default)
    const fontSizeNum = parseFloat(fontSize);
    expect(fontSizeNum).toBeGreaterThan(30);
  });

  test('should have correct page title in head', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/CraftyPrep/);
  });

  test('should be responsive', async ({ page }) => {
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
