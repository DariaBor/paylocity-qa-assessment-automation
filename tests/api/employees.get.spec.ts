import { test, expect } from '../../src/api/fixtures';
import { createEmployee } from '../../src/utils/testData';

test.describe('Employees API - GET /api/employees', () => {
  test('should return all employees', async ({ employeesService }) => {
    const response = await employeesService.getEmployees();
    expect(response.status()).toBe(200);
    expect(Array.isArray(await response.json())).toBe(true);
  });

  test('should return employees with correct structure', async ({
    employeesService,
  }) => {
    const payload = createEmployee({
      firstName: `TestFirst-${Date.now()}`,
      lastName: `TestLast-${Date.now()}`,
      dependants: 1,
    });
    await employeesService.createEmployee(payload);
    const response = await employeesService.getEmployees();
    expect(response.status()).toBe(200);
    const data = await response.json();

    expect(Array.isArray(data)).toBe(true);
    if (data.length > 0) {
      const employee = data[0];
      expect(employee).toHaveProperty('id');
      expect(employee).toHaveProperty('firstName');
      expect(employee).toHaveProperty('lastName');
    }
  });
});
