import { test } from '../../fixtures/base';
import { BrowserContext, Page } from '@playwright/test';
import { CoreLoginPage }   from '../../pages/CoreLoginPage';
import { CoreProfilePage } from '../../pages/CoreProfilePage';
import { CORE_USERS }      from '../../fixtures/core-users';

const ADMIN_NAME      = 'Alexandru Enachi';
const ADMIN_JOB_TITLE = 'Python Developer';
const ADMIN_EMAIL     = 'alexandru.enachi@ebs-integrator.com';
const ADMIN_ROLE      = 'Super Admin';

test.describe('Core — Profile', () => {

  let loginPage: CoreLoginPage;
  let profilePage: CoreProfilePage;

  test.beforeEach(async ({ page, context }: { page: Page; context: BrowserContext }) => {
    await context.clearCookies();
    loginPage   = new CoreLoginPage(page);
    profilePage = new CoreProfilePage(page);
    await loginPage.goto();
    await loginPage.login(CORE_USERS.admin.username, CORE_USERS.admin.password);
    await page.waitForURL('**/applications', { timeout: 10000 });
  });

  test('TC-13 | Profile page loads — correct name, job title, email', async () => {
    await test.step('Step 1 — Navigate to profile page', async () => {
      await profilePage.goto();
    });

    await test.step('Step 2 — Verify Personal Information section visible', async () => {
      await profilePage.personalInfo.isVisible();
    });

    await test.step('Step 3 — Verify Name, Job Title and Email', async () => {
      await profilePage.expectProfileData(ADMIN_NAME, ADMIN_JOB_TITLE, ADMIN_EMAIL);
    });

    await test.step('Step 4 — Verify Role is Super Admin', async () => {
      await profilePage.expectRoleVisible(ADMIN_ROLE);
    });
  });

  test('TC-14 | Profile page — correct URL and page structure', async () => {
    await test.step('Step 1 — Navigate to profile page', async () => {
      await profilePage.goto();
    });

    await test.step('Step 2 — Verify URL contains user ID', async () => {
      await profilePage.page.waitForURL('**/people/users/3', { timeout: 5000 });
    });

    await test.step('Step 3 — Verify all key fields are present', async () => {
      await profilePage.nameValue.isVisible();
      await profilePage.jobTitleValue.isVisible();
      await profilePage.emailValue.isVisible();
      await profilePage.roleValue.isVisible();
    });
  });

});