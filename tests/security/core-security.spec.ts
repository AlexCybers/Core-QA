import { test, expect, BrowserContext, Page } from '@playwright/test';
import { CoreLoginPage }    from '../../pages/CoreLoginPage';
import { CoreSecurityPage } from '../../pages/CoreSecurityPage';
import { CORE_USERS }       from '../../fixtures/core-users';

test.describe('Core — Security', () => {

  let loginPage: CoreLoginPage;
  let securityPage: CoreSecurityPage;

  test.beforeEach(async ({ page, context }: { page: Page; context: BrowserContext }) => {
    await context.clearCookies();
    loginPage    = new CoreLoginPage(page);
    securityPage = new CoreSecurityPage(page);
  });

  test('TC-15 | Direct access to /applications without login — redirect to login', async ({ page }) => {
    await test.step('Step 1 — Clear cookies and go directly to /applications', async () => {
      await page.goto('/applications');
    });

    await test.step('Step 2 — Verify redirect to login page', async () => {
      await securityPage.expectRedirectToLogin();
    });
  });

  test('TC-16 | Direct access to /people/users without login — redirect to login', async ({ page }) => {
    await test.step('Step 1 — Clear cookies and go directly to /people/users', async () => {
      await page.goto('/people/users');
    });

    await test.step('Step 2 — Verify redirect to login page', async () => {
      await securityPage.expectRedirectToLogin();
    });
  });

  test('TC-17 | Logout — session ends, redirect to login', async ({ page }) => {
    await test.step('Step 1 — Login as admin', async () => {
    await loginPage.goto();
    await loginPage.login(CORE_USERS.admin.username, CORE_USERS.admin.password);
    await page.waitForURL('**/applications', { timeout: 15000 });
    await page.waitForTimeout(1000);
    });

    await test.step('Step 2 — Click avatar and logout', async () => {
    await page.waitForTimeout(500);
    await securityPage.logout();
    });

    await test.step('Step 3 — Verify redirect to login page', async () => {
      await securityPage.expectRedirectToLogin();
    });

    await test.step('Step 4 — Verify protected page is no longer accessible', async () => {
      await page.goto('/applications');
      await securityPage.expectRedirectToLogin();
    });
  });

});