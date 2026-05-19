import { test, expect } from '../../fixtures/base';
import { BrowserContext, Page } from '@playwright/test';
import { CoreLoginPage } from '../../pages/CoreLoginPage';
import { CORE_USERS }    from '../../fixtures/core-users';

test.describe('Core — Language', () => {

  let loginPage: CoreLoginPage;

  test.beforeEach(async ({ page, context }: { page: Page; context: BrowserContext }) => {
    await context.clearCookies();
    loginPage = new CoreLoginPage(page);
    await loginPage.goto();
    await loginPage.login(CORE_USERS.admin.username, CORE_USERS.admin.password);
    await page.waitForURL('**/applications', { timeout: 10000 });
  });

  test('TC-18 | Switch language to Romanian — UI updates', async ({ page }) => {
    await test.step('Step 1 — Click language switcher', async () => {
      await page.locator('button.ant-btn-text').first().click();
      await page.waitForTimeout(500);
    });

    await test.step('Step 2 — Select Română', async () => {
      await page.locator('.ant-dropdown-menu-item').filter({ hasText: 'Română' }).click();
      await page.waitForTimeout(1500);
    });

    await test.step('Step 3 — Verify UI switched to Romanian', async () => {
      await expect(page.locator('h4.ant-typography').first()).toContainText('Aplicații');
      await expect(page.locator('button.ant-btn-text').first()).toContainText('Română');
    });

    await test.step('Step 4 — Switch back to English', async () => {
      await page.locator('button.ant-btn-text').first().click();
      await page.waitForTimeout(500);
      await page.locator('.ant-dropdown-menu-item').filter({ hasText: 'English' }).click();
      await page.waitForTimeout(1500);
    });

    await test.step('Step 5 — Verify UI switched back to English', async () => {
      await expect(page.locator('h4.ant-typography').first()).toContainText('Apps');
      await expect(page.locator('button.ant-btn-text').first()).toContainText('English');
    });
  });

  test('TC-19 | Switch language to Russian — UI updates', async ({ page }) => {
    await test.step('Step 1 — Click language switcher', async () => {
      await page.locator('button.ant-btn-text').first().click();
      await page.waitForTimeout(500);
    });

    await test.step('Step 2 — Select Русский', async () => {
      await page.locator('.ant-dropdown-menu-item').filter({ hasText: 'Русский' }).click();
      await page.waitForTimeout(1500);
    });

    await test.step('Step 3 — Verify UI switched to Russian', async () => {
      await expect(page.locator('h4.ant-typography').first()).toContainText('Приложения');
      await expect(page.locator('button.ant-btn-text').first()).toContainText('Русский');
    });

    await test.step('Step 4 — Switch back to English', async () => {
      await page.locator('button.ant-btn-text').first().click();
      await page.waitForTimeout(500);
      await page.locator('.ant-dropdown-menu-item').filter({ hasText: 'English' }).click();
      await page.waitForTimeout(1500);
    });

    await test.step('Step 5 — Verify UI switched back to English', async () => {
      await expect(page.locator('h4.ant-typography').first()).toContainText('Apps');
      await expect(page.locator('button.ant-btn-text').first()).toContainText('English');
    });
  });

});