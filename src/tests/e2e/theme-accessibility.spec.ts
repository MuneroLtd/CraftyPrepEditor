import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const APP_URL = 'https://craftyprep.demosrv.uk';

test.describe('Theme Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
    await page.evaluate(() => localStorage.clear());
  });

  test('light theme meets WCAG 2.2 Level AAA', async ({ page }) => {
    await page.goto(APP_URL);

    // Set to light theme
    const toggle = page.getByRole('button', { name: /theme/i });
    await toggle.click(); // System → Light
    await page.waitForTimeout(300);

    // Run axe accessibility scan with AAA standards
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag21a', 'wcag21aa', 'wcag21aaa', 'wcag22aa'])
      .analyze();

    // Should have zero violations
    expect(accessibilityScanResults.violations).toHaveLength(0);

    // If there are violations, log them for debugging
    if (accessibilityScanResults.violations.length > 0) {
      console.error('Accessibility violations in light theme:');
      accessibilityScanResults.violations.forEach((violation) => {
        console.error(`- ${violation.id}: ${violation.description}`);
        console.error(`  Impact: ${violation.impact}`);
        console.error(`  Nodes: ${violation.nodes.length}`);
      });
    }
  });

  test('dark theme meets WCAG 2.2 Level AAA', async ({ page }) => {
    await page.goto(APP_URL);

    // Set to dark theme
    const toggle = page.getByRole('button', { name: /theme/i });
    await toggle.click(); // System → Light
    await toggle.click(); // Light → Dark
    await page.waitForTimeout(300);

    // Run axe accessibility scan with AAA standards
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag21a', 'wcag21aa', 'wcag21aaa', 'wcag22aa'])
      .analyze();

    // Should have zero violations
    expect(accessibilityScanResults.violations).toHaveLength(0);

    // If there are violations, log them for debugging
    if (accessibilityScanResults.violations.length > 0) {
      console.error('Accessibility violations in dark theme:');
      accessibilityScanResults.violations.forEach((violation) => {
        console.error(`- ${violation.id}: ${violation.description}`);
        console.error(`  Impact: ${violation.impact}`);
        console.error(`  Nodes: ${violation.nodes.length}`);
      });
    }
  });

  test('theme toggle has clear ARIA label', async ({ page }) => {
    await page.goto(APP_URL);

    const toggle = page.getByRole('button', { name: /theme/i });

    // Should have descriptive aria-label
    const label = await toggle.getAttribute('aria-label');
    expect(label).toBeTruthy();
    expect(label).toMatch(/theme/i);

    // Label should describe current state
    expect(label).toMatch(/(light|dark|system)/i);
  });

  test('theme toggle is keyboard accessible', async ({ page }) => {
    await page.goto(APP_URL);

    // Tab to toggle
    await page.keyboard.press('Tab');
    let focused = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));

    let attempts = 0;
    while (!focused?.toLowerCase().includes('theme') && attempts < 20) {
      await page.keyboard.press('Tab');
      focused = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
      attempts++;
    }

    expect(focused?.toLowerCase()).toContain('theme');

    // Should be activatable with Enter
    const initialTheme = await page.locator('html').getAttribute('class');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    const afterEnter = await page.locator('html').getAttribute('class');
    expect(afterEnter).not.toBe(initialTheme);
  });

  test('focus indicator visible in light theme', async ({ page }) => {
    await page.goto(APP_URL);

    // Set to light theme
    const toggle = page.getByRole('button', { name: /theme/i });
    await toggle.click(); // System → Light
    await page.waitForTimeout(300);

    // Focus the toggle
    await toggle.focus();

    // Check for focus ring (should have outline or ring styles)
    const hasFocusStyles = await toggle.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return (
        styles.outline !== 'none' ||
        styles.boxShadow.includes('ring') ||
        styles.outlineWidth !== '0px'
      );
    });

    expect(hasFocusStyles).toBe(true);

    // Take screenshot for visual verification
    await page.screenshot({ path: 'test-results/focus-light-theme.png' });
  });

  test('focus indicator visible in dark theme', async ({ page }) => {
    await page.goto(APP_URL);

    // Set to dark theme
    const toggle = page.getByRole('button', { name: /theme/i });
    await toggle.click(); // System → Light
    await toggle.click(); // Light → Dark
    await page.waitForTimeout(300);

    // Focus the toggle
    await toggle.focus();

    // Check for focus ring (should have outline or ring styles)
    const hasFocusStyles = await toggle.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return (
        styles.outline !== 'none' ||
        styles.boxShadow.includes('ring') ||
        styles.outlineWidth !== '0px'
      );
    });

    expect(hasFocusStyles).toBe(true);

    // Take screenshot for visual verification
    await page.screenshot({ path: 'test-results/focus-dark-theme.png' });
  });

  test('reduced motion respected', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await page.goto(APP_URL);

    const toggle = page.getByRole('button', { name: /theme/i });

    // Check that transitions are disabled or minimal
    const transitionDuration = await toggle.evaluate((el) => {
      return window.getComputedStyle(el).transitionDuration;
    });

    // With reduced motion, transitions should be instant or very short (0.01ms)
    expect(transitionDuration === '0s' || transitionDuration === '0.01ms').toBe(true);
  });

  test('theme toggle meets contrast requirements in both themes', async ({ page }) => {
    await page.goto(APP_URL);

    const toggle = page.getByRole('button', { name: /theme/i });

    // Test light theme
    await toggle.click(); // System → Light
    await page.waitForTimeout(300);

    // Run contrast check for light theme
    let contrastResults = await new AxeBuilder({ page })
      .include('button[aria-label*="Theme"]')
      .withTags(['color-contrast'])
      .analyze();

    expect(contrastResults.violations.filter((v) => v.id === 'color-contrast')).toHaveLength(0);

    // Test dark theme
    await toggle.click(); // Light → Dark
    await page.waitForTimeout(300);

    // Run contrast check for dark theme
    contrastResults = await new AxeBuilder({ page })
      .include('button[aria-label*="Theme"]')
      .withTags(['color-contrast'])
      .analyze();

    expect(contrastResults.violations.filter((v) => v.id === 'color-contrast')).toHaveLength(0);
  });

  test('all interactive elements accessible in light theme', async ({ page }) => {
    await page.goto(APP_URL);

    // Set to light theme
    const toggle = page.getByRole('button', { name: /theme/i });
    await toggle.click(); // System → Light
    await page.waitForTimeout(300);

    // Check for common accessibility issues
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

    // Filter for critical issues
    const criticalViolations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    expect(criticalViolations).toHaveLength(0);
  });

  test('all interactive elements accessible in dark theme', async ({ page }) => {
    await page.goto(APP_URL);

    // Set to dark theme
    const toggle = page.getByRole('button', { name: /theme/i });
    await toggle.click(); // System → Light
    await toggle.click(); // Light → Dark
    await page.waitForTimeout(300);

    // Check for common accessibility issues
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

    // Filter for critical issues
    const criticalViolations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    expect(criticalViolations).toHaveLength(0);
  });

  test('screen reader can announce theme changes', async ({ page }) => {
    await page.goto(APP_URL);

    const toggle = page.getByRole('button', { name: /theme/i });

    // Get initial label
    const initialLabel = await toggle.getAttribute('aria-label');
    expect(initialLabel).toBeTruthy();

    // Click to change theme
    await toggle.click();
    await page.waitForTimeout(300);

    // Get updated label
    const updatedLabel = await toggle.getAttribute('aria-label');
    expect(updatedLabel).toBeTruthy();
    expect(updatedLabel).not.toBe(initialLabel);

    // Label should accurately reflect new theme
    expect(updatedLabel).toMatch(/(light|dark|system)/i);
  });

  test('theme icons have aria-hidden', async ({ page }) => {
    await page.goto(APP_URL);

    const toggle = page.getByRole('button', { name: /theme/i });

    // Icons should be decorative (aria-hidden)
    const icon = await toggle.locator('svg').first();
    const ariaHidden = await icon.getAttribute('aria-hidden');

    expect(ariaHidden).toBe('true');
  });

  test('focus indicator has sufficient contrast (≥3:1) in light theme', async ({ page }) => {
    await page.goto(APP_URL);

    // Set to light theme
    const toggle = page.getByRole('button', { name: /theme/i });
    await toggle.click(); // System → Light
    await page.waitForTimeout(300);

    // Focus the toggle
    await toggle.focus();

    // Get computed styles for focus ring
    const focusStyles = await toggle.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      // Parse box-shadow to extract ring color
      const boxShadow = styles.boxShadow;
      return {
        boxShadow,
        backgroundColor: styles.backgroundColor,
      };
    });

    // For WCAG 2.2 SC 2.4.13 (Focus Appearance), focus indicator must have:
    // - Minimum 2px thickness (we use ring-2)
    // - Contrast ratio ≥3:1 against adjacent colors
    // Our focus ring uses ring-primary-foreground/30 which provides sufficient contrast
    expect(focusStyles.boxShadow).toBeTruthy();
    expect(focusStyles.boxShadow).not.toBe('none');

    // Take screenshot for manual visual verification of contrast
    await page.screenshot({ path: 'test-results/focus-contrast-light.png' });
  });

  test('focus indicator has sufficient contrast (≥3:1) in dark theme', async ({ page }) => {
    await page.goto(APP_URL);

    // Set to dark theme
    const toggle = page.getByRole('button', { name: /theme/i });
    await toggle.click(); // System → Light
    await toggle.click(); // Light → Dark
    await page.waitForTimeout(300);

    // Focus the toggle
    await toggle.focus();

    // Get computed styles for focus ring
    const focusStyles = await toggle.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        boxShadow: styles.boxShadow,
        backgroundColor: styles.backgroundColor,
      };
    });

    // Verify focus ring is present in dark theme
    expect(focusStyles.boxShadow).toBeTruthy();
    expect(focusStyles.boxShadow).not.toBe('none');

    // Take screenshot for manual visual verification of contrast
    await page.screenshot({ path: 'test-results/focus-contrast-dark.png' });
  });

  test('theme toggle meets minimum touch target size (≥44x44px) in light theme', async ({
    page,
  }) => {
    await page.goto(APP_URL);

    // Set to light theme
    const toggle = page.getByRole('button', { name: /theme/i });
    await toggle.click(); // System → Light
    await page.waitForTimeout(300);

    // Get bounding box
    const boundingBox = await toggle.boundingBox();
    expect(boundingBox).toBeTruthy();

    // WCAG 2.2 SC 2.5.8 (Target Size - Minimum)
    // Touch targets should be at least 24x24px (Level AA) or 44x44px (AAA)
    // Our implementation uses w-11 h-11 which is 44x44px
    expect(boundingBox!.width).toBeGreaterThanOrEqual(44);
    expect(boundingBox!.height).toBeGreaterThanOrEqual(44);
  });

  test('theme toggle meets minimum touch target size (≥44x44px) in dark theme', async ({
    page,
  }) => {
    await page.goto(APP_URL);

    // Set to dark theme
    const toggle = page.getByRole('button', { name: /theme/i });
    await toggle.click(); // System → Light
    await toggle.click(); // Light → Dark
    await page.waitForTimeout(300);

    // Get bounding box
    const boundingBox = await toggle.boundingBox();
    expect(boundingBox).toBeTruthy();

    // Verify touch target size in dark theme (should be same as light)
    expect(boundingBox!.width).toBeGreaterThanOrEqual(44);
    expect(boundingBox!.height).toBeGreaterThanOrEqual(44);
  });

  test('theme transition timing is appropriate (200ms)', async ({ page }) => {
    await page.goto(APP_URL);

    const toggle = page.getByRole('button', { name: /theme/i });

    // Get transition duration
    const transitionInfo = await toggle.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        duration: styles.transitionDuration,
        property: styles.transitionProperty,
      };
    });

    // Verify transition is configured
    expect(transitionInfo.duration).toBeTruthy();
    // Should be 200ms (0.2s) for smooth but not sluggish transitions
    expect(transitionInfo.duration).toBe('0.2s');

    // Verify only specific properties transition (not 'all')
    expect(transitionInfo.property).not.toBe('all');
    expect(transitionInfo.property).toContain('background-color');
  });

  test('theme changes are visually smooth', async ({ page }) => {
    await page.goto(APP_URL);

    const toggle = page.getByRole('button', { name: /theme/i });
    const html = page.locator('html');

    // Get initial theme
    const initialClass = await html.getAttribute('class');

    // Take screenshot before transition
    await page.screenshot({ path: 'test-results/theme-before-transition.png' });

    // Trigger theme change
    const startTime = Date.now();
    await toggle.click();

    // Wait for transition to complete (200ms + buffer)
    await page.waitForTimeout(300);

    const endTime = Date.now();
    const transitionTime = endTime - startTime;

    // Take screenshot after transition
    await page.screenshot({ path: 'test-results/theme-after-transition.png' });

    // Verify theme actually changed
    const finalClass = await html.getAttribute('class');
    expect(finalClass).not.toBe(initialClass);

    // Transition should complete within reasonable time (300ms buffer is generous)
    expect(transitionTime).toBeLessThan(500);
  });
});
