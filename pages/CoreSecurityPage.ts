import { Page, Locator, expect } from '@playwright/test';

export class CoreSecurityPage {
  readonly page: Page;
  readonly avatarButton: Locator;
  readonly logoutButton: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    this.page         = page;
    this.avatarButton = page.locator('span.ant-avatar.ant-dropdown-trigger');
    this.logoutButton = page.locator('li.ant-dropdown-menu-item-danger');
    this.signInButton = page.locator('button[type="submit"]');
  }

  async logout() {
    await this.avatarButton.click();
    await this.page.waitForTimeout(1000);
    await expect(this.logoutButton).toBeVisible({ timeout: 5000 });
    await this.logoutButton.click();
  }

  async expectRedirectToLogin() {
    await expect(this.page).toHaveURL(/authentication\/login/, { timeout: 8000 });
    await expect(this.signInButton).toBeVisible({ timeout: 5000 });
  }
}