import { test, expect } from '../../fixtures/base';
import { BrowserContext, Page } from '@playwright/test';
import { CoreLoginPage }    from '../../pages/CoreLoginPage';
import { CoreUsersPage }    from '../../pages/CoreUsersPage';
import { CORE_USERS }       from '../../fixtures/core-users';

const ADMIN_NAME      = 'Alexandru Enachi';
const ADMIN_JOB_TITLE = 'Python Developer';
const ADMIN_EMAIL     = 'alexandru.enachi@ebs-integrator.com';

test.describe('Core — Users', () => {

  let loginPage: CoreLoginPage;
  let usersPage: CoreUsersPage;

  test.beforeEach(async ({ page, context }: { page: Page; context: BrowserContext }) => {
    await context.clearCookies();
    loginPage    = new CoreLoginPage(page);
    usersPage    = new CoreUsersPage(page);
    await loginPage.goto();
    await loginPage.login(CORE_USERS.admin.username, CORE_USERS.admin.password);
    await page.waitForURL('**/applications', { timeout: 10000 });
  });

  test('TC-09 | Search existing user + verify details', async () => {
    await test.step('Step 1 — Navigate to Users', async () => {
      await usersPage.goto();
    });

    await test.step('Step 2 — Search for alexandru.enachi', async () => {
      await usersPage.searchUser('alexandru.enachi');
    });

    await test.step('Step 3 — Verify user found in list', async () => {
      await usersPage.expectUserFound(ADMIN_NAME);
    });

    await test.step('Step 4 — Open user details', async () => {
      await usersPage.openUserDetails(ADMIN_NAME);
    });

    await test.step('Step 5 — Verify Name, Job Title and Email', async () => {
      await usersPage.expectUserDetails(ADMIN_NAME, ADMIN_JOB_TITLE, ADMIN_EMAIL);
    });
  });

  test('TC-10 | Search non-existing user — empty result', async () => {
    await test.step('Step 1 — Navigate to Users', async () => {
      await usersPage.goto();
    });

    await test.step('Step 2 — Search for non-existing user', async () => {
      await usersPage.searchUser('xxxxxxxxxnonexistent');
    });

    await test.step('Step 3 — Verify no results found', async () => {
      await usersPage.expectNoResults();
    });
  });

 // TC-11 temporary disabled — Org Chart is under active development

});