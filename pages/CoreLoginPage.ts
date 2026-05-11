import { Page, Locator, expect } from '@playwright/test';

export class CoreLoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    this.page          = page;
    this.usernameInput = page.locator('input[placeholder="form.placeholder.username"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.signInButton  = page.locator('button[type="submit"]');
  }

  async goto() {
    await this.page.goto('/authentication/login');
    await expect(this.signInButton).toBeVisible();
  }

  async login(username: string, password: string) {
    await this.usernameInput.clear();
    await this.usernameInput.fill(username);
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async expectErrorMessage(message: string) {
    await expect(this.page.locator(`text=${message}`)).toBeVisible({ timeout: 5000 });
  }

  async expectRedirectToDashboard() {
    await expect(this.page).toHaveURL(/\/applications/, { timeout: 8000 });
  }

  async expectStaysOnLogin() {
    await expect(this.page).toHaveURL(/\/authentication\/login/);
  }
}