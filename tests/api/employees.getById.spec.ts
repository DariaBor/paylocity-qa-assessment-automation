import { test, expect } from '../../src/api/fixtures';
import { createEmployee } from '../../src/utils/testData';
import { createEmployeeViaApi } from '../../src/utils/testHelpers';

test.describe('Employees API - GET /api/employees/{id}', () => {
  test('should return employee by valid id', async ({ employeesService }) => {
    const payload = createEmployee({
      firstName: `GetOne-${Date.now()}`,
      lastName: `ById-${Date.now()}`,
      dependants: 0,
    });
    const createdEmployee = await createEmployeeViaApi(
      employeesService,
      payload,
    );
    const response = await employeesService.getEmployeeById(
      createdEmployee.id,
    );
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.id).toBe(createdEmployee.id);
    expect(data.firstName).toBe(payload.firstName);
  });

  const invalidGetIds = [
    {
      name: 'non-existent id',
      id: '550e8400-e29b-41d4-a716-446655440000',
      expectedStatus: 404,
      fixme: true,
    },
    {
      name: 'invalid uuid format',
      id: 'invalid-id',
      expectedStatus: 405,
      fixme: true,
    },
  ];

  invalidGetIds.forEach(({ name, id, expectedStatus, fixme }) => {
    const testFn = fixme ? test.fixme : test;
    testFn(`should return ${expectedStatus} for ${name}`, async ({
      employeesService,
    }) => {
      expect((await employeesService.getEmployeeById(id)).status()).toBe(
        expectedStatus,
      );
    });
  });
});
