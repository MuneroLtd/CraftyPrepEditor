import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for E2E testing
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Test directory
  testDir: './tests/e2e',

  // Maximum time one test can run (increased for keyboard interaction tests)
  timeout: 90 * 1000,

  // Test execution settings
  fullyParallel: false, // Disable parallel execution to prevent resource contention
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Force serial execution (1 worker)

  // Reporter configuration
  reporter: [['html', { outputFolder: 'playwright-report' }], ['list']],

  // Shared settings for all tests
  use: {
    // Base URL - uses live development URL for consistency
    baseURL: 'https://craftyprep.demosrv.uk',

    // Collect trace on first retry
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on first retry
    video: 'retain-on-failure',

    // Default timeout for expect() assertions (increased for processing time)
    actionTimeout: 10 * 1000,

    // Navigation timeout
    navigationTimeout: 30 * 1000,
  },

  // Configure projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Web server configuration disabled - using live dev server
  // Development server must be running at https://craftyprep.demosrv.uk
});
