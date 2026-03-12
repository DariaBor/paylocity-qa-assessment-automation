import { test, expect } from '../../src/api/fixtures';
import { createEmployee } from '../../src/utils/testData';
import { createEmployeeViaApi } from '../../src/utils/testHelpers';

test.describe('Employees API - PUT /api/employees', () => {
  test('should update employee with valid data', async ({
    employeesService,
  }) => {
    const createPayload = createEmployee({
      firstName: `UpdateTest-${Date.now()}`,
      lastName: `Original-${Date.now()}`,
      dependants: 2,
    });
    const createdEmployee = await (
      await employeesService.createEmployee(createPayload)
    ).json();
    const updatePayload = {
      id: createdEmployee.id,
      ...createdEmployee,
      firstName: `UpdateTest-${Date.now()}-Updated`,
      dependants: 3,
    };
    const response = await employeesService.updateEmployee(updatePayload);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.firstName).toBe(updatePayload.firstName);
    expect(data.dependants).toBe(3);
  });

  test.fixme('should reject unknown properties', async ({
    employeesService,
  }) => {
    const payload = createEmployee({
      firstName: `Unknown-${Date.now()}`,
      lastName: `Props-${Date.now()}`,
      dependants: 1,
    });
    const createdEmployee = await createEmployeeViaApi(
      employeesService,
      payload,
    );
    const updatePayload = {
      id: createdEmployee.id,
      ...createdEmployee,
      unknownField: 'should fail',
    };
    const response = await employeesService.updateEmployee(updatePayload);
    expect(response.status()).toBe(400); // Fails, issue described in bug challenge, should reject unknown properties but accepts and ignores them instead
  });

  test('should return 400 when firstName is empty', async ({
    employeesService,
  }) => {
    const payload = createEmployee({
      firstName: `EmptyTest-${Date.now()}`,
      lastName: `Check-${Date.now()}`,
      dependants: 1,
    });
    const createdEmployee = await createEmployeeViaApi(
      employeesService,
      payload,
    );
    const updatePayload = {
      id: createdEmployee.id,
      ...createdEmployee,
      firstName: '',
    };
    const response = await employeesService.updateEmployee(updatePayload);
    expect(response.status()).toBe(400);
  });

  test('should return 400 when dependants exceeds maximum', async ({
    employeesService,
  }) => {
    const payload = createEmployee({
      firstName: `DependantsTest-${Date.now()}`,
      lastName: `Max-${Date.now()}`,
      dependants: 1,
    });
    const createdEmployee = await createEmployeeViaApi(
      employeesService,
      payload,
    );
    const updatePayload = {
      id: createdEmployee.id,
      ...createdEmployee,
      dependants: 50,
    };
    const response = await employeesService.updateEmployee(updatePayload);
    expect(response.status()).toBe(400);
  });
});
