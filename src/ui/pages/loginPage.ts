import { expect, Page, Browser } from '@playwright/test';
import fs from 'fs';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/Prod/Account/Login');
  }

  async login(username: string, password: string, authStateFile?: string) {
    await this.goto();
    await this.page.fill('#Username', username);
    await this.page.fill('#Password', password);
    await this.page.click('button[type=submit]');
    await expect(this.page.locator('#employeesTable')).toBeVisible();

    if (authStateFile) {
      await this.page.context().storageState({
        path: authStateFile,
      });
    }
  }

  static async ensureAuthState(browser: Browser, username: string, password: string, authStateFile: string) {
    if (!fs.existsSync(authStateFile)) {
      const context = await browser.newContext();
      const page = await context.newPage();
      const loginPage = new LoginPage(page);

      await loginPage.login(username, password, authStateFile);

      await context.close();
    }
  }

  static getStorageState(authStateFile: string) {
    return fs.existsSync(authStateFile) ? authStateFile : undefined;
  }
}
