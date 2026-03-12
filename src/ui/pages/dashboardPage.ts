import { expect, Page } from '@playwright/test';

export class DashboardPage {
  constructor(private page: Page) {}

  async openAddEmployee() {
    await this.page.locator('#add').click();
    await expect(this.page.locator('#employeeModal')).toBeVisible();
  }

  async getEmployeeRows() {
    return this.page.locator('table tbody tr');
  }

  async verifyEmployeeVisible(employee: any) {
    const employeeRow = this.page.locator(
      `tr:has-text("${employee.firstName}"):has-text("${employee.lastName}")`,
    );
    await expect(employeeRow).toBeVisible();
  }
}
