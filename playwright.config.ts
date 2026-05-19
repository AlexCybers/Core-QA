import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 1,
  workers: 1,
  use: {
    baseURL: 'https://admin.micb.dev.devebs.net',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    storageState: undefined,
    locale: 'en-GB',
    timezoneId: 'Europe/London',
    extraHTTPHeaders: {
      'Accept-Language': 'en-GB,en;q=0.9',
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
});