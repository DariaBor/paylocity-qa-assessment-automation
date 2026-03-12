import { test as base } from '@playwright/test';
import { DashboardPage } from '../ui/pages/dashboardPage';
import { AddEmployeeModal } from '../ui/components/addEmployeeModal';

type UIFixtures = {
  dashboard: DashboardPage;
  modal: AddEmployeeModal;
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
});

export { expect } from '@playwright/test';
