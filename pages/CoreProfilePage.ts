import { Page, Locator, expect } from '@playwright/test';

export class CoreProfilePage {
  readonly page: Page;
  readonly personalInfo: Locator;
  readonly nameValue: Locator;
  readonly jobTitleValue: Locator;
  readonly emailValue: Locator;
  readonly roleValue: Locator;

  constructor(page: Page) {
    this.page           = page;
    this.personalInfo   = page.locator('text=Personal Information');
    this.nameValue      = page.locator('text=Alexandru Enachi').first();
    this.jobTitleValue  = page.locator('text=Python Developer').first();
    this.emailValue     = page.locator('text=alexandru.enachi@ebs-integrator.com').first();
    this.roleValue      = page.locator('text=Super Admin').first();
  }

  async goto() {
    await this.page.goto('/people/users/3');
    await expect(this.page).toHaveURL(/people\/users\/3/, { timeout: 8000 });
    await expect(this.page.locator('span.ant-typography').first()).toBeVisible({ timeout: 8000 });
}

  async expectProfileData(name: string, jobTitle: string, email: string) {
    await expect(this.page.locator(`text=${name}`).first()).toBeVisible();
    await expect(this.page.locator(`text=${jobTitle}`).first()).toBeVisible();
    await expect(this.page.locator(`text=${email}`).first()).toBeVisible();
  }

  async expectRoleVisible(role: string) {
    await expect(this.page.locator(`text=${role}`).first()).toBeVisible();
  }
}