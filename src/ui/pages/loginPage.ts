import { expect, Page, Browser, Locator } from '@playwright/test';
import fs from 'fs';

export class LoginPage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly employeesTable: Locator;

  constructor(private page: Page) {
    this.usernameInput = this.page.locator('#Username');
    this.passwordInput = this.page.locator('#Password');
    this.submitButton = this.page.locator('button[type=submit]');
    this.employeesTable = this.page.locator('#employeesTable');
  }

  async goto() {
    await this.page.goto('/Prod/Account/Login');
  }

  async login(username: string, password: string, authStateFile?: string) {
    await this.goto();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await expect(this.employeesTable).toBeVisible();

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
