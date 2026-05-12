import { test, BrowserContext, Page } from '@playwright/test';
import { CoreLoginPage }     from '../../pages/CoreLoginPage';
import { CoreDashboardPage } from '../../pages/CoreDashboardPage';
import { CORE_USERS, CORE_ERRORS } from '../../fixtures/core-users';
test.describe('Core — Authentication', () => {

  let loginPage: CoreLoginPage;
  let dashboardPage: CoreDashboardPage;

  test.beforeEach(async ({ page, context }: { page: Page; context: BrowserContext }) => {
    await context.clearCookies();
    loginPage     = new CoreLoginPage(page);
    dashboardPage = new CoreDashboardPage(page);
  });

  test('TC-01 | Admin login — redirect to dashboard', async () => {
    await test.step('Step 1 — Open login page', async () => {
      await loginPage.goto();
    });

    await test.step('Step 2 — Enter valid admin credentials', async () => {
      await loginPage.usernameInput.fill(CORE_USERS.admin.username);
      await loginPage.passwordInput.fill(CORE_USERS.admin.password);
    });

    await test.step('Step 3 — Click Sign In button', async () => {
      await loginPage.signInButton.click();
    });

    await test.step('Step 4 — Verify redirect to dashboard', async () => {
      await dashboardPage.expectLoaded();
    });

    await test.step('Step 5 — Verify admin menu items are visible', async () => {
      await dashboardPage.expectAdminMenuVisible();
    });
  });

  test('TC-02 | No role mapping — error message displayed', async () => {
    await test.step('Step 1 — Open login page', async () => {
      await loginPage.goto();
    });

    await test.step('Step 2 — Enter credentials of user with no role mapping', async () => {
      await loginPage.usernameInput.fill(CORE_USERS.noRoleMapping.username);
      await loginPage.passwordInput.fill(CORE_USERS.noRoleMapping.password);
    });

    await test.step('Step 3 — Click Sign In button', async () => {
      await loginPage.signInButton.click();
    });

    await test.step('Step 4 — Verify error message is displayed', async () => {
      await loginPage.expectErrorMessage(CORE_ERRORS.noRoleMapping);
    });

    await test.step('Step 5 — Verify user stays on login page', async () => {
      await loginPage.expectStaysOnLogin();
    });
  });

  test('TC-03 | No matching employee in 1C — error message displayed', async () => {
    await test.step('Step 1 — Open login page', async () => {
      await loginPage.goto();
    });

    await test.step('Step 2 — Enter credentials of user with no 1C employee', async () => {
      await loginPage.usernameInput.fill(CORE_USERS.noEmployee1C.username);
      await loginPage.passwordInput.fill(CORE_USERS.noEmployee1C.password);
    });

    await test.step('Step 3 — Click Sign In button', async () => {
      await loginPage.signInButton.click();
    });

    await test.step('Step 4 — Verify error message is displayed', async () => {
      await loginPage.expectErrorMessage(CORE_ERRORS.noEmployee1C);
    });

    await test.step('Step 5 — Verify user stays on login page', async () => {
      await loginPage.expectStaysOnLogin();
    });
  });

  test('TC-04 | Invalid credentials — error message displayed', async () => {
    await test.step('Step 1 — Open login page', async () => {
      await loginPage.goto();
    });

    await test.step('Step 2 — Enter invalid credentials', async () => {
      await loginPage.usernameInput.fill(CORE_USERS.invalidCredentials.username);
      await loginPage.passwordInput.fill(CORE_USERS.invalidCredentials.password);
    });

    await test.step('Step 3 — Click Sign In button', async () => {
      await loginPage.signInButton.click();
    });

    await test.step('Step 4 — Verify error message is displayed', async () => {
      await loginPage.expectErrorMessage(CORE_ERRORS.invalidCreds);
    });

    await test.step('Step 5 — Verify user stays on login page', async () => {
      await loginPage.expectStaysOnLogin();
    });
  });

  test('TC-05 | Empty username and password — stays on login', async () => {
    await test.step('Step 1 — Open login page', async () => {
      await loginPage.goto();
    });

    await test.step('Step 2 — Leave both fields empty and click Sign In', async () => {
      await loginPage.signInButton.click();
    });

    await test.step('Step 3 — Verify user stays on login page', async () => {
      await loginPage.expectStaysOnLogin();
    });
  });

  test('TC-06 | Empty password only — stays on login', async () => {
    await test.step('Step 1 — Open login page', async () => {
      await loginPage.goto();
    });

    await test.step('Step 2 — Enter username but leave password empty', async () => {
      await loginPage.usernameInput.fill(CORE_USERS.admin.username);
    });

    await test.step('Step 3 — Click Sign In button', async () => {
      await loginPage.signInButton.click();
    });

    await test.step('Step 4 — Verify user stays on login page', async () => {
      await loginPage.expectStaysOnLogin();
    });
  });

  test('TC-07 | Empty username only — stays on login', async () => {
    await test.step('Step 1 — Open login page', async () => {
      await loginPage.goto();
    });

    await test.step('Step 2 — Enter password but leave username empty', async () => {
      await loginPage.passwordInput.fill(CORE_USERS.admin.password);
    });

    await test.step('Step 3 — Click Sign In button', async () => {
      await loginPage.signInButton.click();
    });

    await test.step('Step 4 — Verify user stays on login page', async () => {
      await loginPage.expectStaysOnLogin();
    });
  });

});