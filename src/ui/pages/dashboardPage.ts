import { expect, Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly addButton: Locator;
  readonly employeeModal: Locator;
  readonly employeeRows: Locator;

  constructor(private page: Page) {
    this.addButton = this.page.locator('#add');
    this.employeeModal = this.page.locator('#employeeModal');
    this.employeeRows = this.page.locator('table tbody tr');
  }

  async openAddEmployee() {
    await this.addButton.click();
    await expect(this.employeeModal).toBeVisible();
  }

  getEmployeeRow(firstName: string, lastName: string): Locator {
    return this.page.locator(
      `tr:has-text("${firstName}"):has-text("${lastName}")`,
    );
  }

  async verifyEmployeeVisible(employee: any) {
    const employeeRow = this.getEmployeeRow(employee.firstName, employee.lastName);
    await expect(employeeRow).toBeVisible();
  }
}
