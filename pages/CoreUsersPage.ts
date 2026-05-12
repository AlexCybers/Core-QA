import { Page, Locator, expect } from '@playwright/test';

export class CoreUsersPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page        = page;
    this.pageTitle   = page.locator('h4').first();
    this.searchInput = page.locator('input.ant-input').first();
}

  async goto() {
    await this.page.goto('/people/users');
    await expect(this.pageTitle).toBeVisible();
  }

  async searchUser(name: string) {
    await this.searchInput.fill(name);
    await this.searchInput.press('Enter');
    await this.page.waitForTimeout(1500);
  }

  async expectUserFound(name: string) {
    await expect(this.page.locator(`text=${name}`).first()).toBeVisible({ timeout: 5000 });
  }

  async expectNoResults() {
    await expect(this.page.locator('.ant-table-placeholder')).toBeVisible({ timeout: 5000 });
}

  async openUserDetails(name: string) {
    const row = this.page.locator('tr').filter({ hasText: name });
    await row.locator('button').last().click();
    await this.page.waitForTimeout(1500);
  }

  async getUserJobTitle(): Promise<string> {
    const jobTitle = await this.page.locator('text=Job title').locator('..').locator('td').last().textContent();
    return jobTitle?.trim() ?? '';
  }

  async expectUserDetails(name: string, jobTitle: string, email: string) {
    await expect(this.page.locator(`text=${name}`).first()).toBeVisible();
    await expect(this.page.locator(`text=${jobTitle}`).first()).toBeVisible();
    await expect(this.page.locator(`text=${email}`).first()).toBeVisible();
  }
}