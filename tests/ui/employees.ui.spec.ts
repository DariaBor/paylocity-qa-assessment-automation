import { test, expect } from '../../src/utils/fixtures';
import { LoginPage } from '../../src/ui/pages/loginPage';

import { createEmployee } from '../../src/utils/testData';
import { verifyEmployeeResponse } from '../../src/api/responseValidator';
import { ENV } from '../../src/utils/env';
import { setupAuthRoute } from '../../src/utils/testHelpers';

const authStateFile = 'authstate.json';

test.describe('Employees UI tests', () => {
  test.beforeAll(async ({ browser }) => {
    await LoginPage.ensureAuthState(
      browser,
      ENV.username,
      ENV.password,
      authStateFile,
    );
  });

  const storageState = LoginPage.getStorageState(authStateFile);
  if (storageState) {
    test.use({
      storageState,
    });
  }

  let employeeId: string | undefined;

  test.beforeEach(async ({ page, context }) => {
    employeeId = undefined;
    await page.goto('/Prod/Benefits');
    await setupAuthRoute(context);
  });

  test.afterEach(async ({ employeesService }) => {
    if (employeeId) {
      await employeesService.deleteEmployee(employeeId);
    }
  });

  test('Add new employee record', async ({ dashboard, modal }) => {
    const newEmployee = createEmployee({
      firstName: `John-${Date.now()}`,
      lastName: `Doe-${Date.now()}`,
      dependants: 2,
    });

    await dashboard.openAddEmployee();
    await modal.fillEmployee(newEmployee);
    const response = await (await modal.submitAndWaitForResponse()).json();
    verifyEmployeeResponse(response);
    employeeId = response.id;
    await dashboard.verifyEmployeeVisible(newEmployee);
  });

  test.fixme('Should show validation error when dependants is empty', async ({
    page,
    dashboard,
    modal,
  }) => {
    const employee = createEmployee({
      firstName: `John-${Date.now()}`,
      lastName: `Doe-${Date.now()}`,
      dependants: '',
    });

    await dashboard.openAddEmployee();
    await modal.fillEmployee(employee);

    const response = await modal.submitAndWaitForResponse();

    // Assume the API returns 400 for validation errors and the UI shows an error message but it's not which is reported as a bug
    expect(response.status()).toBe(400);
    await expect(page.getByText('Incorrect format')).toBeVisible();
  });
});
