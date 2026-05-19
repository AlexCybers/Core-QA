import { test, expect } from '../../fixtures/base';
import { BrowserContext, Page } from '@playwright/test';
import { CoreLoginPage } from '../../pages/CoreLoginPage';
import { CORE_USERS }    from '../../fixtures/core-users';

test.describe('Core — Activities', () => {

  let loginPage: CoreLoginPage;

  test.beforeEach(async ({ page, context }: { page: Page; context: BrowserContext }) => {
    await context.clearCookies();
    loginPage = new CoreLoginPage(page);
  });

  test('TC-20 | Failed and successful login activities are recorded', async ({ page }) => {

    await test.step('Step 1 — Login with valid admin credentials', async () => {
      await loginPage.goto();
      await loginPage.login(CORE_USERS.admin.username, CORE_USERS.admin.password);
      await page.waitForURL('**/applications', { timeout: 10000 });
    });

    await test.step('Step 2 — Navigate to Activities page', async () => {
      await page.goto('/activities');
      await expect(page.locator('h4.ant-typography').first()).toBeVisible({ timeout: 5000 });
    });

    await test.step('Step 3 — Verify Alexandru Enachi Successful login activity', async () => {
      const successRow = page.locator('.ant-table-row').filter({ hasText: 'Alexandru Enachi' }).first();
      await expect(successRow).toBeVisible({ timeout: 5000 });
      await expect(successRow.locator('text=Successful login')).toBeVisible();
    });

    await test.step('Step 4 — Open new page and attempt failed login with testalex', async () => {
      await page.goto('/authentication/login');
      await loginPage.login(CORE_USERS.invalidCredentials.username, CORE_USERS.invalidCredentials.password);
      await expect(page.locator('text=Invalid credentials')).toBeVisible({ timeout: 5000 });
    });

    await test.step('Step 5 — Login again as admin', async () => {
      await loginPage.login(CORE_USERS.admin.username, CORE_USERS.admin.password);
      await page.waitForURL('**/applications', { timeout: 10000 });
    });

    await test.step('Step 6 — Navigate to Activities and verify testalex Failed login', async () => {
      await page.goto('/activities');
      const failedRow = page.locator('.ant-table-row').filter({ hasText: 'testalex' }).first();
      await expect(failedRow).toBeVisible({ timeout: 5000 });
      await expect(failedRow.locator('text=Failed login').first()).toBeVisible();
      await expect(failedRow.locator('text=Failure')).toBeVisible();
    });

  });

});