import { Page, Locator, expect } from '@playwright/test';

export class CoreDashboardPage {
  readonly page: Page;
  readonly appsMenu: Locator;
  readonly usersMenu: Locator;
  readonly orgChartMenu: Locator;
  readonly activitiesMenu: Locator;

  constructor(page: Page) {
    this.page           = page;
    this.appsMenu       = page.locator('a[href="/applications"]');
    this.usersMenu      = page.locator('a[href="/people/users"]');
    this.orgChartMenu   = page.locator('a[href="/organizational-chart"]');
    this.activitiesMenu = page.locator('a[href="/activities"]');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/applications/, { timeout: 8000 });
    await expect(this.appsMenu).toBeVisible();
  }

  async expectAdminMenuVisible() {
    await expect(this.usersMenu).toBeVisible();
    await expect(this.orgChartMenu).toBeVisible();
    await expect(this.activitiesMenu).toBeVisible();
  }
}