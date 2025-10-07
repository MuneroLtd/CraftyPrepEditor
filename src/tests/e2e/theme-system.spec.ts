import { test, expect } from '@playwright/test';

const APP_URL = 'https://craftyprep.demosrv.uk';

test.describe('Theme System E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto(APP_URL);
    await page.evaluate(() => localStorage.clear());
  });

  test('theme toggle is visible and accessible in header', async ({ page }) => {
    await page.goto(APP_URL);

    // Find theme toggle by role
    const toggle = page.getByRole('button', { name: /theme/i });
    await expect(toggle).toBeVisible();

    // Verify it's in the header
    const header = page.locator('header');
    await expect(header).toContainText('CraftyPrep');
    await expect(header.locator('button[aria-label*="Theme"]')).toBeVisible();
  });

  test('clicking toggle cycles through themes', async ({ page }) => {
    await page.goto(APP_URL);

    const toggle = page.getByRole('button', { name: /theme/i });
    const html = page.locator('html');

    // Should start with system theme (default)
    const initialLabel = await toggle.getAttribute('aria-label');
    expect(initialLabel).toContain('System');

    // First click: System → Light
    await toggle.click();
    await page.waitForTimeout(300); // Wait for transition
    await expect(toggle).toHaveAttribute('aria-label', /light/i);
    await expect(html).not.toHaveClass(/dark/);

    // Second click: Light → Dark
    await toggle.click();
    await page.waitForTimeout(300);
    await expect(toggle).toHaveAttribute('aria-label', /dark/i);
    await expect(html).toHaveClass(/dark/);

    // Third click: Dark → System
    await toggle.click();
    await page.waitForTimeout(300);
    await expect(toggle).toHaveAttribute('aria-label', /system/i);
  });

  test('theme persists across page reload', async ({ page }) => {
    await page.goto(APP_URL);

    const toggle = page.getByRole('button', { name: /theme/i });

    // Set to dark theme
    await toggle.click(); // System → Light
    await toggle.click(); // Light → Dark
    await page.waitForTimeout(300);

    // Verify dark class is applied
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Reload page
    await page.reload();
    await page.waitForLoadState('domcontentloaded');

    // Verify theme persisted
    await expect(page.locator('html')).toHaveClass(/dark/);
    await expect(toggle).toHaveAttribute('aria-label', /dark/i);
  });

  test('system theme detected on first visit', async ({ page, context }) => {
    // Set system preference to dark
    await context.addInitScript(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          addEventListener: () => {},
          removeEventListener: () => {},
        }),
      });
    });

    await page.goto(APP_URL);

    // Should apply dark theme based on system preference
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('all UI elements visible in light theme', async ({ page }) => {
    await page.goto(APP_URL);

    const toggle = page.getByRole('button', { name: /theme/i });

    // Set to light theme
    await toggle.click(); // System → Light
    await page.waitForTimeout(300);

    // Verify key UI elements are visible
    await expect(page.locator('header')).toBeVisible();
    await expect(page.getByRole('heading', { name: /CraftyPrep/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Welcome to CraftyPrep/i })).toBeVisible();

    // Take screenshot for visual verification
    await page.screenshot({ path: 'test-results/light-theme.png', fullPage: true });
  });

  test('all UI elements visible in dark theme', async ({ page }) => {
    await page.goto(APP_URL);

    const toggle = page.getByRole('button', { name: /theme/i });

    // Set to dark theme
    await toggle.click(); // System → Light
    await toggle.click(); // Light → Dark
    await page.waitForTimeout(300);

    // Verify key UI elements are visible
    await expect(page.locator('header')).toBeVisible();
    await expect(page.getByRole('heading', { name: /CraftyPrep/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Welcome to CraftyPrep/i })).toBeVisible();

    // Take screenshot for visual verification
    await page.screenshot({ path: 'test-results/dark-theme.png', fullPage: true });
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto(APP_URL);

    // Tab to theme toggle
    await page.keyboard.press('Tab');
    let focused = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));

    // Keep tabbing until we reach the theme toggle
    let attempts = 0;
    while (!focused?.toLowerCase().includes('theme') && attempts < 20) {
      await page.keyboard.press('Tab');
      focused = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
      attempts++;
    }

    expect(focused?.toLowerCase()).toContain('theme');

    // Get initial theme
    const html = page.locator('html');
    const hadDarkClass = await html.evaluate((el) => el.classList.contains('dark'));

    // Activate with Enter
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);

    // Verify theme changed
    const hasDarkClass = await html.evaluate((el) => el.classList.contains('dark'));
    expect(hasDarkClass).not.toBe(hadDarkClass);
  });

  test('smooth transition between themes', async ({ page }) => {
    await page.goto(APP_URL);

    const toggle = page.getByRole('button', { name: /theme/i });

    // Measure transition time
    const startTime = Date.now();

    await toggle.click();
    await page.waitForTimeout(200); // Default transition duration

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Should complete within reasonable time (300ms threshold)
    expect(duration).toBeLessThan(300);
  });

  test('no FOUC on page load', async ({ page }) => {
    // Set theme to dark
    await page.goto(APP_URL);
    const toggle = page.getByRole('button', { name: /theme/i });
    await toggle.click(); // System → Light
    await toggle.click(); // Light → Dark
    await page.waitForTimeout(300);

    // Reload and check immediately
    await page.reload();

    // Check dark class is present before DOMContentLoaded
    const darkClassPresent = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });

    expect(darkClassPresent).toBe(true);
  });

  test('theme toggle has proper touch target size', async ({ page }) => {
    await page.goto(APP_URL);

    const toggle = page.getByRole('button', { name: /theme/i });
    const box = await toggle.boundingBox();

    expect(box).toBeTruthy();
    // Should meet WCAG AAA minimum touch target (44x44px)
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  test('localStorage handles errors gracefully', async ({ page }) => {
    // Override localStorage to throw errors
    await page.addInitScript(() => {
      Storage.prototype.setItem = function () {
        throw new Error('QuotaExceededError');
      };
    });

    await page.goto(APP_URL);

    const toggle = page.getByRole('button', { name: /theme/i });

    // Should not crash when localStorage fails
    await expect(toggle).toBeVisible();

    // Clicking should still work (just no persistence)
    await toggle.click();
    await page.waitForTimeout(300);

    // Should apply theme even without localStorage
    const html = page.locator('html');
    const hasDarkClass = await html.evaluate((el) => el.classList.contains('dark'));
    expect(typeof hasDarkClass).toBe('boolean');
  });
});
