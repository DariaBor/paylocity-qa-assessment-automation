import { test as base } from '@playwright/test';
import { ApiClient } from './apiClient';
import { EmployeesService } from './employeesService';

type TestFixtures = {
  api: ApiClient;
  employeesService: EmployeesService;
};

export const test = base.extend<TestFixtures>({
  api: async ({ request }, use) => {
    const api = new ApiClient(request);
    await use(api);
  },
  employeesService: async ({ request }, use) => {
    const api = new ApiClient(request);
    const employees = new EmployeesService(api);
    await use(employees);
  },
});

export { expect } from '@playwright/test';
