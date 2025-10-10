import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false, // Run tests sequentially for better console output
  forbidOnly: false,
  retries: 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'test-results/html' }]
  ],

  use: {
    baseURL: 'https://www.pipguru.club',
    trace: 'retain-on-failure',
    screenshot: 'on',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // No web server for production testing
});
