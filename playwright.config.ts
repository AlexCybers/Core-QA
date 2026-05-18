import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 1,
  workers: 2,
  use: {
    baseURL: 'https://admin.micb.dev.devebs.net',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    storageState: undefined,
    locale: 'en-GB',
    timezoneId: 'Europe/London',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
});