import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 1,
  use: {
    baseURL: 'https://admin.micb.dev.devebs.net',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    storageState: undefined,
    locale: 'en-GB',        // ← add this
    timezoneId: 'Europe/London',  // ← add this
},
 
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
});