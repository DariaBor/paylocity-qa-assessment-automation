import { Page } from '@playwright/test';

export class AddEmployeeModal {
  constructor(private page: Page) {}

  async fillEmployee(data: any) {
    await this.page.fill('#firstName', data.firstName);
    await this.page.fill('#lastName', data.lastName);
    await this.page.fill('#dependants', data.dependants.toString());
  }

  async submit() {
    await this.page.locator('#addEmployee').click();
  }

  async submitAndWaitForResponse() {
    const responsePromise = this.page.waitForResponse(
      response => response.url().includes('/Prod/api/employees') && response.request().method() === 'POST'
    );

    await this.submit();
    return await responsePromise;
  }
}
