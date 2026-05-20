import { test, expect } from '../../fixtures/base';
import { BrowserContext, Page } from '@playwright/test';
import { CoreLoginPage } from '../../pages/CoreLoginPage';
import { CORE_USERS }    from '../../fixtures/core-users';

test.describe('Core — Administrator (Super Admin)', () => {

  let loginPage: CoreLoginPage;

  test.beforeEach(async ({ page, context }: { page: Page; context: BrowserContext }) => {
    await context.clearCookies();
    loginPage = new CoreLoginPage(page);
    await loginPage.goto();
    await loginPage.login(CORE_USERS.admin.username, CORE_USERS.admin.password);
    await page.waitForURL('**/applications', { timeout: 10000 });
  });

  test('TC-21 | Super Admin — Positions & Roles page loads with data', async ({ page }) => {
    await test.step('Step 1 — Navigate to Positions & Roles', async () => {
      await page.goto('/administrator/positions');
      await expect(page).toHaveURL(/administrator\/positions/, { timeout: 5000 });
    });

    await test.step('Step 2 — Verify table has data', async () => {
      const rows = page.locator('.ant-table-row');
      await expect(rows.first()).toBeVisible({ timeout: 5000 });
    });

    await test.step('Step 3 — Verify Python Developer position exists with Super Admin role', async () => {
      const row = page.locator('.ant-table-row').filter({ hasText: 'Python Developer' }).first();
      await expect(row).toBeVisible({ timeout: 5000 });
      await expect(row.locator('text=Super Admin').first()).toBeVisible();
    });
  });

  test('TC-22 | Super Admin — Roles & Permissions page loads with data', async ({ page }) => {
    await test.step('Step 1 — Navigate to Roles & Permissions', async () => {
      await page.goto('/administrator/roles');
      await expect(page).toHaveURL(/administrator\/roles/, { timeout: 5000 });
    });

    await test.step('Step 2 — Verify roles table is visible', async () => {
      const table = page.locator('.ant-table-content');
      await expect(table).toBeVisible({ timeout: 5000 });
    });

    await test.step('Step 3 — Verify Admin role exists', async () => {
      const adminRole = page.locator('.ant-table-content').locator('text=Admin').first();
      await expect(adminRole).toBeVisible({ timeout: 5000 });
    });

    await test.step('Step 4 — Verify HR Admin role exists', async () => {
      const hrAdminRole = page.locator('.ant-table-content').locator('text=HR Admin').first();
      await expect(hrAdminRole).toBeVisible({ timeout: 5000 });
    });
  });

  test('TC-23 | No permissions user — Positions & Roles table is empty', async ({ page }) => {
    await test.step('Step 1 — Login as anastasia.bumbac', async () => {
      await page.goto('/authentication/login');
      await loginPage.login(CORE_USERS.noPermissions.username, CORE_USERS.noPermissions.password);
      await page.waitForURL('**/applications', { timeout: 10000 });
    });

    await test.step('Step 2 — Navigate to Positions & Roles', async () => {
      await page.goto('/administrator/positions');
      await expect(page).toHaveURL(/administrator\/positions/, { timeout: 5000 });
    });

    await test.step('Step 3 — Verify table has no data', async () => {
      await expect(page.locator('.ant-table-row').first()).not.toBeVisible({ timeout: 5000 });
    });
  });

  test('TC-24 | No permissions user — Roles & Permissions table is empty', async ({ page }) => {
    await test.step('Step 1 — Login as anastasia.bumbac', async () => {
      await page.goto('/authentication/login');
      await loginPage.login(CORE_USERS.noPermissions.username, CORE_USERS.noPermissions.password);
      await page.waitForURL('**/applications', { timeout: 10000 });
    });

    await test.step('Step 2 — Navigate to Roles & Permissions', async () => {
      await page.goto('/administrator/roles');
      await expect(page).toHaveURL(/administrator\/roles/, { timeout: 5000 });
    });

    await test.step('Step 3 — Verify table has no data', async () => {
      await expect(page.locator('.ant-table-row').first()).not.toBeVisible({ timeout: 5000 });
    });
  });

});