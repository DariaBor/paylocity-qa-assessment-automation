import { Page, Locator } from '@playwright/test';

export class AddEmployeeModal {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly dependantsInput: Locator;
  readonly submitButton: Locator;

  constructor(private page: Page) {
    this.firstNameInput = this.page.locator('#firstName');
    this.lastNameInput = this.page.locator('#lastName');
    this.dependantsInput = this.page.locator('#dependants');
    this.submitButton = this.page.locator('#addEmployee');
  }

  async fillEmployee(data: any) {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.dependantsInput.fill(data.dependants.toString());
  }

  async submit() {
    await this.submitButton.click();
  }

  async submitAndWaitForResponse() {
    const responsePromise = this.page.waitForResponse(
      response => response.url().includes('/Prod/api/employees') && response.request().method() === 'POST'
    );

    await this.submit();
    return await responsePromise;
  }
}
