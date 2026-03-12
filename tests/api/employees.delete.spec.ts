import { test, expect } from '../../src/api/fixtures';
import { createEmployee } from '../../src/utils/testData';
import { createEmployeeViaApi } from '../../src/utils/testHelpers';

test.describe('Employees API - DELETE /api/employees/{id}', () => {
  test('should delete existing employee', async ({ employeesService }) => {
    const payload = createEmployee({
      firstName: `DeleteTest-${Date.now()}`,
      lastName: `Target-${Date.now()}`,
      dependants: 1,
    });
    const createdEmployee = await createEmployeeViaApi(
      employeesService,
      payload,
    );

    const response = await employeesService.deleteEmployee(
      createdEmployee.id,
    );
    expect(response.status()).toBe(200);
  });

  const invalidDeleteIds = [
    {
      name: 'non-existent id',
      id: '550e8400-e29b-41d4-a716-446655440001',
      expectedStatus: 404,
      fixme: true,
    },
    {
      name: 'invalid uuid format',
      id: 'invalid-id',
      expectedStatus: 405,
      fixme: false,
    },
  ];

  invalidDeleteIds.forEach(({ name, id, expectedStatus, fixme }) => {
    const testFn = fixme ? test.fixme : test;
    testFn(`should return ${expectedStatus} for ${name}`, async ({
      employeesService,
    }) => {
      expect((await employeesService.deleteEmployee(id)).status()).toBe(
        expectedStatus,
      );
    });
  });

  test.fixme('should not be able to get deleted employee', async ({
    employeesService,
  }) => {
    const payload = createEmployee({
      firstName: `DeleteVerify-${Date.now()}`,
      lastName: `Check-${Date.now()}`,
      dependants: 0,
    });
    const createdEmployee = await createEmployeeViaApi(
      employeesService,
      payload,
    );
    await employeesService.deleteEmployee(createdEmployee.id);
    const getResponse = await employeesService.getEmployeeById(
      createdEmployee.id,
    );
    expect(getResponse.status()).toBe(404); // Fails because of the issue described in bug challenge, returns 200 with empty body instead of 404
  });
});
