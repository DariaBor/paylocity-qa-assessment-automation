import { test as base } from '@playwright/test';
import { DashboardPage } from '../ui/pages/dashboardPage';
import { AddEmployeeModal } from '../ui/components/addEmployeeModal';
import { ApiClient } from '../api/apiClient';
import { EmployeesService } from '../api/employeesService';

type UIFixtures = {
  dashboard: DashboardPage;
  modal: AddEmployeeModal;
  employeesService: EmployeesService;
};

export const test = base.extend<UIFixtures>({
  dashboard: async ({ page }, use) => {
    const dashboard = new DashboardPage(page);
    await use(dashboard);
  },
  modal: async ({ page }, use) => {
    const modal = new AddEmployeeModal(page);
    await use(modal);
  },
  employeesService: async ({ request }, use) => {
    const api = new ApiClient(request);
    const employees = new EmployeesService(api);
    await use(employees);
  },
});

export { expect } from '@playwright/test';
