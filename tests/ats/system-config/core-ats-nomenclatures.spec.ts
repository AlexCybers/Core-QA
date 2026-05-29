import { test, expect } from '../../../fixtures/base';
import { BrowserContext, Page } from '@playwright/test';
import { CoreLoginPage } from '../../../pages/CoreLoginPage';
import { CORE_USERS }    from '../../../fixtures/core-users';

const ts = Date.now();

test.describe('ATS — System Configuration Nomenclatures (CRUD)', () => {

  let loginPage: CoreLoginPage;

  test.beforeEach(async ({ page, context }: { page: Page; context: BrowserContext }) => {
    await context.clearCookies();
    loginPage = new CoreLoginPage(page);
    await loginPage.goto();
    await loginPage.login(CORE_USERS.admin.username, CORE_USERS.admin.password);
    await page.waitForURL('**/applications', { timeout: 10000 });
    // Each test navigates directly to its tab URL — no generic admin goto needed here
  });

  // ─── Helpers ─────────────────────────────────────────────────────────────

  async function openRowMenu(page: Page, rowText: string, action: 'edit' | 'delete') {
    const row = page.locator('tr').filter({ hasText: rowText }).first();
    await row.locator('button.ant-dropdown-trigger').click();
    await page.locator('.ant-dropdown-menu').waitFor({ state: 'visible', timeout: 5000 });
    if (action === 'edit') {
      await page.locator('.ant-dropdown-menu-item').filter({ hasText: /modify|edit/i }).first().click();
    } else {
      await page.locator('.ant-dropdown-menu-item').filter({ hasText: /delete|remove/i }).first().click();
    }
    // Wait for dropdown to close rather than using a fixed timeout
    await page.locator('.ant-dropdown-menu').waitFor({ state: 'hidden', timeout: 5000 });
  }

  async function clickSave(page: Page) {
    await page.locator('button', { hasText: 'Save' }).first().click();
  }

  async function searchRecord(page: Page, name: string) {
    const searchInput = page.locator('input[placeholder="Search"]');
    await expect(searchInput).toBeVisible({ timeout: 5000 });
    await searchInput.clear();
    await searchInput.fill(name);
    // Wait for table to re-render after filtering
    await page.waitForTimeout(1500);
  }

  // ─── TC-01 | Recruitment template ────────────────────────────────────────
  // Paginated table — must searchRecord before every assertion, including
  // the "not visible" check in Step 7.
  test('TC-01 | ATS Nomenclatures — Recruitment template add/edit/delete', async ({ page }) => {
    const name       = `QA Template ${ts}`;
    const nameEdited = `QA Template ${ts} Edited`;

    await test.step('Step 1 — Navigate to Recruitment template tab', async () => {
      await page.goto('/apps/ats/admin');
      await page.waitForLoadState('networkidle');
    });

    await test.step('Step 2 — Add record', async () => {
      await page.locator('button', { hasText: 'Add template' }).click();
      await expect(page.locator('input[placeholder="Enter template title"]')).toBeVisible({ timeout: 8000 });
      await page.locator('input[placeholder="Enter template title"]').pressSequentially(name);

      // A "screening" stage is required — click "Add stage" then select "Screening CV"
      const addStageBtn = page.locator('button', { hasText: 'Add stage' });
      await expect(addStageBtn).toBeVisible({ timeout: 5000 });
      await addStageBtn.click();

      // Wait explicitly — covers Ant dropdown items, Select options, and plain list items
      const screeningOption = page.locator(
        '.ant-dropdown-menu-item, .ant-select-item-option, .ant-select-item, li, [class*="option"], [class*="menu-item"]'
      ).filter({ hasText: /screening cv/i }).first();
      await expect(screeningOption).toBeVisible({ timeout: 5000 });
      await screeningOption.click();
      await page.waitForTimeout(500);

      await page.locator('button', { hasText: 'Add action' }).click();
      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 8000 });
      await page.waitForLoadState('networkidle');
    });

    await test.step('Step 3 — Verify record appears', async () => {
      // Search first — table is paginated, new record may not be on page 1
      await searchRecord(page, name);
      await expect(page.locator('td', { hasText: name }).first()).toBeVisible({ timeout: 8000 });
    });

    await test.step('Step 4 — Edit record', async () => {
      await openRowMenu(page, name, 'edit');
      const input = page.locator('input[placeholder="Enter template title"]');
      await input.clear();
      await input.pressSequentially(nameEdited);
      await clickSave(page);
      await page.waitForTimeout(1000);
    });

    await test.step('Step 5 — Verify modified name', async () => {
      await searchRecord(page, nameEdited);
      await expect(page.locator('td', { hasText: nameEdited }).first()).toBeVisible({ timeout: 8000 });
    });

    await test.step('Step 6 — Delete record', async () => {
      await openRowMenu(page, nameEdited, 'delete');
      await page.locator('button', { hasText: 'Delete' }).click();
      await page.waitForTimeout(1000);
    });

    await test.step('Step 7 — Verify record is gone', async () => {
      // Must search first; without this the row may still be visible on another page
      await searchRecord(page, nameEdited);
      await expect(page.locator('td', { hasText: nameEdited })).not.toBeVisible({ timeout: 5000 });
    });
  });

  // ─── TC-02 | Positions ────────────────────────────────────────────────────
  test('TC-02 | ATS Nomenclatures — Positions add/edit/delete', async ({ page }) => {
    const name       = `QA Position ${ts}`;
    const nameEdited = `QA Position ${ts} Edited`;

    await test.step('Step 1 — Navigate to Positions tab', async () => {
      await page.goto('/apps/ats/admin/positions');
      await page.waitForLoadState('networkidle');
    });

    await test.step('Step 2 — Add record', async () => {
      await page.locator('button', { hasText: 'Add position' }).click();
      await expect(page.locator('input[placeholder="Enter position name"]')).toBeVisible({ timeout: 8000 });
      await page.locator('input[placeholder="Enter position name"]').pressSequentially(name);
      await page.locator('button', { hasText: 'Add action' }).click();
      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 8000 });
      await page.waitForLoadState('networkidle');
    });

    await test.step('Step 3 — Verify record appears', async () => {
      await searchRecord(page, name);
      await expect(page.locator('td', { hasText: name }).first()).toBeVisible({ timeout: 8000 });
    });

    await test.step('Step 4 — Edit record', async () => {
      await openRowMenu(page, name, 'edit');
      const input = page.locator('input[placeholder="Enter position name"]');
      await input.clear();
      await input.pressSequentially(nameEdited);
      await clickSave(page);
      await page.waitForTimeout(1000);
    });

    await test.step('Step 5 — Verify modified name', async () => {
      await searchRecord(page, nameEdited);
      await expect(page.locator('td', { hasText: nameEdited }).first()).toBeVisible({ timeout: 8000 });
    });

    await test.step('Step 6 — Delete record', async () => {
      await openRowMenu(page, nameEdited, 'delete');
      await page.locator('button', { hasText: 'Delete' }).click();
      await page.waitForTimeout(1000);
    });

    await test.step('Step 7 — Verify record is gone', async () => {
      await searchRecord(page, nameEdited);
      await expect(page.locator('td', { hasText: nameEdited })).not.toBeVisible({ timeout: 5000 });
    });
  });

  // ─── TC-03 | Location ─────────────────────────────────────────────────────
  test('TC-03 | ATS Nomenclatures — Location add/edit/delete', async ({ page }) => {
    const name       = `QA Location ${ts}`;
    const nameEdited = `QA Location ${ts} Edited`;

    await test.step('Step 1 — Navigate to Location tab', async () => {
      await page.goto('/apps/ats/admin/jobs/locations');
      await page.waitForLoadState('networkidle');
    });

    await test.step('Step 2 — Add record', async () => {
      await page.locator('button', { hasText: 'Add location' }).click();
      await expect(page.locator('input[placeholder="Enter location name"]')).toBeVisible({ timeout: 8000 });
      await page.locator('input[placeholder="Enter location name"]').pressSequentially(name);
      await page.locator('button', { hasText: 'Add action' }).click();
      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 8000 });
      await page.waitForLoadState('networkidle');
    });

    await test.step('Step 3 — Verify record appears', async () => {
      await searchRecord(page, name);
      await expect(page.locator('td', { hasText: name }).first()).toBeVisible({ timeout: 8000 });
    });

    await test.step('Step 4 — Edit record', async () => {
      await openRowMenu(page, name, 'edit');
      const input = page.locator('input[placeholder="Enter location name"]');
      await input.clear();
      await input.pressSequentially(nameEdited);
      await clickSave(page);
      await page.waitForTimeout(1000);
    });

    await test.step('Step 5 — Verify modified name', async () => {
      await searchRecord(page, nameEdited);
      await expect(page.locator('td', { hasText: nameEdited }).first()).toBeVisible({ timeout: 8000 });
    });

    await test.step('Step 6 — Delete record', async () => {
      await openRowMenu(page, nameEdited, 'delete');
      await page.locator('button', { hasText: 'Delete' }).click();
      await page.waitForTimeout(1000);
    });

    await test.step('Step 7 — Verify record is gone', async () => {
      await searchRecord(page, nameEdited);
      await expect(page.locator('td', { hasText: nameEdited })).not.toBeVisible({ timeout: 5000 });
    });
  });

  // ─── TC-04 | Type of Employment ───────────────────────────────────────────
  test('TC-04 | ATS Nomenclatures — Type of Employment add/edit/delete', async ({ page }) => {
    const name       = `QA Employment ${ts}`;
    const nameEdited = `QA Employment ${ts} Edited`;

    await test.step('Step 1 — Navigate to Type of Employment tab', async () => {
      await page.goto('/apps/ats/admin/jobs/employment-type');
      await page.waitForLoadState('networkidle');
    });

    await test.step('Step 2 — Add record', async () => {
      await page.locator('button', { hasText: 'Add employment type' }).click();
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible({ timeout: 8000 });
      await modal.locator('input').first().pressSequentially(name);
      await modal.locator('button', { hasText: 'Add action' }).click();
      await expect(modal).not.toBeVisible({ timeout: 8000 });
      await page.waitForLoadState('networkidle');
    });

    await test.step('Step 3 — Verify record appears', async () => {
      await searchRecord(page, name);
      await expect(page.locator('td', { hasText: name }).first()).toBeVisible({ timeout: 8000 });
    });

    await test.step('Step 4 — Edit record', async () => {
      await openRowMenu(page, name, 'edit');
      const editModal = page.locator('[role="dialog"]');
      await expect(editModal).toBeVisible({ timeout: 5000 });
      const input = editModal.locator('input').first();
      await input.clear();
      await input.pressSequentially(nameEdited);
      await clickSave(page);
      await page.waitForTimeout(1000);
    });

    await test.step('Step 5 — Verify modified name', async () => {
      await searchRecord(page, nameEdited);
      await expect(page.locator('td', { hasText: nameEdited }).first()).toBeVisible({ timeout: 8000 });
    });

    await test.step('Step 6 — Delete record', async () => {
      await openRowMenu(page, nameEdited, 'delete');
      await page.locator('button', { hasText: 'Delete' }).click();
      await page.waitForTimeout(1000);
    });

    await test.step('Step 7 — Verify record is gone', async () => {
      await searchRecord(page, nameEdited);
      await expect(page.locator('td', { hasText: nameEdited })).not.toBeVisible({ timeout: 5000 });
    });
  });

  // ─── TC-05 | Application Source ───────────────────────────────────────────
  test('TC-05 | ATS Nomenclatures — Application Source add/edit/delete', async ({ page }) => {
    const name       = `QA Source ${ts}`;
    const nameEdited = `QA Source ${ts} Edited`;

    await test.step('Step 1 — Navigate to Application Source tab', async () => {
      await page.goto('/apps/ats/admin/candidates/application-source');
      await page.waitForLoadState('networkidle');
    });

    await test.step('Step 2 — Add record', async () => {
      await page.locator('button', { hasText: 'Add application source' }).click();
      await expect(page.locator('input[placeholder="Enter application source"]')).toBeVisible({ timeout: 8000 });
      await page.locator('input[placeholder="Enter application source"]').pressSequentially(name);
      await page.locator('button', { hasText: 'Add action' }).click();
      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 8000 });
      await page.waitForLoadState('networkidle');
    });

    await test.step('Step 3 — Verify record appears', async () => {
      await searchRecord(page, name);
      await expect(page.locator('td', { hasText: name }).first()).toBeVisible({ timeout: 8000 });
    });

    await test.step('Step 4 — Edit record', async () => {
      await openRowMenu(page, name, 'edit');
      const input = page.locator('input[placeholder="Enter application source"]');
      await input.clear();
      await input.pressSequentially(nameEdited);
      await clickSave(page);
      await page.waitForTimeout(1000);
    });

    await test.step('Step 5 — Verify modified name', async () => {
      await searchRecord(page, nameEdited);
      await expect(page.locator('td', { hasText: nameEdited }).first()).toBeVisible({ timeout: 8000 });
    });

    await test.step('Step 6 — Delete record', async () => {
      await openRowMenu(page, nameEdited, 'delete');
      await page.locator('button', { hasText: 'Delete' }).click();
      await page.waitForTimeout(1000);
    });

    await test.step('Step 7 — Verify record is gone', async () => {
      await searchRecord(page, nameEdited);
      await expect(page.locator('td', { hasText: nameEdited })).not.toBeVisible({ timeout: 5000 });
    });
  });

  // ─── TC-06 | Currency ─────────────────────────────────────────────────────
  test('TC-06 | ATS Nomenclatures — Currency add/edit/delete', async ({ page }) => {
    const name         = `QA Currency ${ts}`;
    const nameEdited   = `QA Currency ${ts} Edited`;
    // Code must be unique per run — derive 3 uppercase chars from the timestamp
    const currencyCode = ts.toString(36).slice(-3).toUpperCase(); // e.g. "X4K"

    await test.step('Step 1 — Navigate to Currency tab', async () => {
      // URL confirmed from Ant Design panel ID: rc-tabs-0-panel-/admin/currency
      await page.goto('/apps/ats/admin/currency');
      await page.waitForLoadState('networkidle');
      await expect(page.getByRole('button', { name: 'Add currency' })).toBeVisible({ timeout: 8000 });
    });

    await test.step('Step 2 — Add record', async () => {
      await page.getByRole('button', { name: 'Add currency' }).click();
      // Use role="dialog" — works regardless of Ant Design modal class variant
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible({ timeout: 8000 });
      await expect(modal.locator('button', { hasText: 'OK' })).toBeVisible({ timeout: 8000 });
      await modal.locator('input').nth(0).pressSequentially(name);
      await modal.locator('input').nth(1).pressSequentially(currencyCode);
      await modal.locator('button', { hasText: 'OK' }).click();
      await expect(modal).not.toBeVisible({ timeout: 8000 });
      await page.waitForLoadState('networkidle');
    });

    await test.step('Step 3 — Verify record appears', async () => {
      await searchRecord(page, name);
      await expect(page.locator('td', { hasText: name }).first()).toBeVisible({ timeout: 8000 });
    });

    await test.step('Step 4 — Edit record', async () => {
      await openRowMenu(page, name, 'edit');
      // Currency edit modal uses OK (not Save) — scope to dialog
      const editModal = page.locator('[role="dialog"]');
      await expect(editModal).toBeVisible({ timeout: 5000 });
      const inputs = editModal.locator('input').filter({ visible: true });
      await inputs.nth(0).clear();
      await inputs.nth(0).pressSequentially(nameEdited);
      await editModal.locator('button', { hasText: 'OK' }).click();
      await page.waitForTimeout(1000);
    });

    await test.step('Step 5 — Verify modified name', async () => {
      await searchRecord(page, nameEdited);
      await expect(page.locator('td', { hasText: nameEdited }).first()).toBeVisible({ timeout: 8000 });
    });

    await test.step('Step 6 — Delete record', async () => {
      await openRowMenu(page, nameEdited, 'delete');
      await page.locator('button', { hasText: 'Delete' }).click();
      await page.waitForTimeout(1000);
    });

    await test.step('Step 7 — Verify record is gone', async () => {
      await searchRecord(page, nameEdited);
      await expect(page.locator('td', { hasText: nameEdited })).not.toBeVisible({ timeout: 5000 });
    });
  });

  // ─── TC-07 | Letter template ──────────────────────────────────────────────
  test('TC-07 | ATS Nomenclatures — Letter template add/edit/delete', async ({ page }) => {
    const name       = `QA Letter ${ts}`;
    const nameEdited = `QA Letter ${ts} Edited`;

    await test.step('Step 1 — Navigate to Letter template tab', async () => {
      // URL confirmed from Ant Design panel ID: rc-tabs-0-panel-/admin/email-templates
      await page.goto('/apps/ats/admin/email-templates');
      await page.waitForLoadState('networkidle');
      await expect(page.getByRole('button', { name: 'Add letter template' })).toBeVisible({ timeout: 8000 });
    });

    await test.step('Step 2 — Add record', async () => {
      await page.getByRole('button', { name: 'Add letter template' }).click();
      // Use role="dialog" — works regardless of Ant Design modal class variant
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible({ timeout: 8000 });
      await expect(modal.locator('button', { hasText: 'OK' })).toBeVisible({ timeout: 8000 });

      // Fill all three required fields: Name, Subject, Message body
      const nameInput = modal.locator('input[placeholder*="name" i], input[placeholder*="title" i], input').nth(0);
      await nameInput.pressSequentially(name);

      const subjectInput = modal.locator('input[placeholder*="subject" i], input').nth(1);
      await subjectInput.pressSequentially('QA Test Subject');

      // Rich-text message body (contenteditable)
      const messageBody = modal.locator('[contenteditable="true"]').first();
      await messageBody.click();
      await messageBody.fill('QA Test Message');

      await modal.locator('button', { hasText: 'OK' }).click();
      await expect(modal).not.toBeVisible({ timeout: 8000 });
      await page.waitForLoadState('networkidle');
    });

    await test.step('Step 3 — Verify record appears', async () => {
      await searchRecord(page, name);
      await expect(page.locator('td', { hasText: name }).first()).toBeVisible({ timeout: 8000 });
    });

    await test.step('Step 4 — Edit record', async () => {
      await openRowMenu(page, name, 'edit');
      // Letter template edit modal uses OK (not Save) — scope to dialog
      const editModal = page.locator('[role="dialog"]');
      await expect(editModal).toBeVisible({ timeout: 5000 });
      const nameInput = editModal.locator('input[placeholder*="name" i], input[placeholder*="title" i], input').nth(0);
      await nameInput.clear();
      await nameInput.pressSequentially(nameEdited);
      await editModal.locator('button', { hasText: 'OK' }).click();
      await page.waitForTimeout(1000);
    });

    await test.step('Step 5 — Verify modified name', async () => {
      await searchRecord(page, nameEdited);
      await expect(page.locator('td', { hasText: nameEdited }).first()).toBeVisible({ timeout: 8000 });
    });

    await test.step('Step 6 — Delete record', async () => {
      await openRowMenu(page, nameEdited, 'delete');
      await page.locator('button', { hasText: 'Delete' }).click();
      await page.waitForTimeout(1000);
    });

    await test.step('Step 7 — Verify record is gone', async () => {
      await searchRecord(page, nameEdited);
      await expect(page.locator('td', { hasText: nameEdited })).not.toBeVisible({ timeout: 5000 });
    });
  });

  // ─── TC-08 | Application withdrawal reason ────────────────────────────────
  test('TC-08 | ATS Nomenclatures — Application withdrawal reason add/edit/delete', async ({ page }) => {
    const name       = `QA Withdrawal ${ts}`;
    const nameEdited = `QA Withdrawal ${ts} Edited`;

    await test.step('Step 1 — Navigate to Application withdrawal reason tab', async () => {
      await page.goto('/apps/ats/admin/candidates/withdrawal-reasons');
      await page.waitForLoadState('networkidle');
    });

    await test.step('Step 2 — Add record', async () => {
      await page.locator('button', { hasText: 'Add application withdrawal reason' }).click();
      await expect(page.locator('input[placeholder="Enter application withdrawal reason title"]')).toBeVisible({ timeout: 8000 });
      await page.locator('input[placeholder="Enter application withdrawal reason title"]').pressSequentially(name);
      await page.locator('button', { hasText: 'Add action' }).click();
      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 8000 });
      await page.waitForLoadState('networkidle');
    });

    await test.step('Step 3 — Verify record appears', async () => {
      await searchRecord(page, name);
      await expect(page.locator('td', { hasText: name }).first()).toBeVisible({ timeout: 8000 });
    });

    await test.step('Step 4 — Edit record', async () => {
      await openRowMenu(page, name, 'edit');
      const input = page.locator('input[placeholder="Enter application withdrawal reason title"]');
      await input.clear();
      await input.pressSequentially(nameEdited);
      await clickSave(page);
      await page.waitForTimeout(1000);
    });

    await test.step('Step 5 — Verify modified name', async () => {
      await searchRecord(page, nameEdited);
      await expect(page.locator('td', { hasText: nameEdited }).first()).toBeVisible({ timeout: 8000 });
    });

    await test.step('Step 6 — Delete record', async () => {
      await openRowMenu(page, nameEdited, 'delete');
      await page.locator('button', { hasText: 'Delete' }).click();
      await page.waitForTimeout(1000);
    });

    await test.step('Step 7 — Verify record is gone', async () => {
      await searchRecord(page, nameEdited);
      await expect(page.locator('td', { hasText: nameEdited })).not.toBeVisible({ timeout: 5000 });
    });
  });

  // ─── TC-09 | Offer refusal reason ─────────────────────────────────────────
  test('TC-09 | ATS Nomenclatures — Offer refusal reason add/edit/delete', async ({ page }) => {
    const name       = `QA Refusal ${ts}`;
    const nameEdited = `QA Refusal ${ts} Edited`;

    await test.step('Step 1 — Navigate to Offer refusal reason tab', async () => {
      await page.goto('/apps/ats/admin/candidates/offer-refusal-reasons');
      await page.waitForLoadState('networkidle');
    });

    await test.step('Step 2 — Add record', async () => {
      await page.locator('button', { hasText: 'Add offer refusal reason' }).click();
      await expect(page.locator('input[placeholder="Enter offer refusal reason title"]')).toBeVisible({ timeout: 8000 });
      await page.locator('input[placeholder="Enter offer refusal reason title"]').pressSequentially(name);
      await page.locator('button', { hasText: 'Add action' }).click();
      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 8000 });
      await page.waitForLoadState('networkidle');
    });

    await test.step('Step 3 — Verify record appears', async () => {
      await searchRecord(page, name);
      await expect(page.locator('td', { hasText: name }).first()).toBeVisible({ timeout: 8000 });
    });

    await test.step('Step 4 — Edit record', async () => {
      await openRowMenu(page, name, 'edit');
      const input = page.locator('input[placeholder="Enter offer refusal reason title"]');
      await input.clear();
      await input.pressSequentially(nameEdited);
      await clickSave(page);
      await page.waitForTimeout(1000);
    });

    await test.step('Step 5 — Verify modified name', async () => {
      await searchRecord(page, nameEdited);
      await expect(page.locator('td', { hasText: nameEdited }).first()).toBeVisible({ timeout: 8000 });
    });

    await test.step('Step 6 — Delete record', async () => {
      await openRowMenu(page, nameEdited, 'delete');
      await page.locator('button', { hasText: 'Delete' }).click();
      await page.waitForTimeout(1000);
    });

    await test.step('Step 7 — Verify record is gone', async () => {
      await searchRecord(page, nameEdited);
      await expect(page.locator('td', { hasText: nameEdited })).not.toBeVisible({ timeout: 5000 });
    });
  });


});