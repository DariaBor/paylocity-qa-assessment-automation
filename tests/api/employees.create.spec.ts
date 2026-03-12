import { test, expect } from '../../src/api/fixtures';
import { createEmployee } from '../../src/utils/testData';

test.describe('Employees API - POST /api/employees', () => {
  test('should create employee with valid data', async ({
    employeesService,
  }) => {
    const payload = createEmployee({
      firstName: `John-${Date.now()}`,
      lastName: `Doe-${Date.now()}`,
      dependants: 2,
    });
    const response = await employeesService.createEmployee(payload);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.firstName).toBe(payload.firstName);
    expect(data.lastName).toBe(payload.lastName);
    expect(data.dependants).toBe(2);
  });

  test.fixme('should reject unknown properties', async ({
    employeesService,
  }) => {
    const payload = {
      ...createEmployee({
        firstName: `one-${Date.now()}`,
        lastName: `two-${Date.now()}`,
        dependants: 2,
      }),
      efwef: 890,
    };
    const response = await employeesService.createEmployee(payload);
    expect(response.status()).toBe(400); // Fails, issue described in bug challenge, should reject unknown properties but accepts and ignores them instead
  });

  const invalidPostPayloads = [
    {
      name: 'firstName is missing',
      payload: { lastName: 'Doe' },
    },
    {
      name: 'lastName is missing',
      payload: { firstName: 'John' },
    },
    {
      name: 'username is missing',
      payload: { firstName: 'John', lastName: 'Doe' },
      fixme: true,
    },
    {
      name: 'firstName is empty',
      payload: { firstName: '', lastName: 'Doe', username: 'johndoe' },
    },
    {
      name: 'firstName exceeds max length (50)',
      payload: { firstName: 'a'.repeat(51), lastName: 'Doe', username: 'johndoe' },
    },
    {
      name: 'dependants exceeds maximum (32)',
      payload: { firstName: 'John', lastName: 'Doe', username: 'johndoe', dependants: 33 },
    },
    {
      name: 'dependants is negative',
      payload: { firstName: 'John', lastName: 'Doe', username: 'johndoe', dependants: -1 },
    },
  ];

  invalidPostPayloads.forEach(({ name, payload, fixme }) => {
    const testFn = fixme ? test.fixme : test;
    testFn(`should return 400 when ${name}`, async ({ api }) => {
      expect((await api.post('/Prod/api/employees', payload)).status()).toBe(400);
    });
  });

  test.fixme('should create employee with optional fields', async ({
    employeesService,
  }) => {
    const payload = createEmployee({
      firstName: `Jane-${Date.now()}`,
      lastName: `Smith-${Date.now()}`,
      dependants: 0,
      salary: 60000,
    });
    const response = await employeesService.createEmployee(payload);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.firstName).toBe(payload.firstName);
    expect(data.salary).toBe(60000); // Fails because of the issue described in bug challenge
  });

  test('should ignore (reject?) read-only fields', async ({
    employeesService,
  }) => {
    const payload = {
      ...createEmployee({
        firstName: `Bob-${Date.now()}`,
        lastName: `Johnson-${Date.now()}`,
        dependants: 1,
      }),
      id: '550e8400-e29b-41d4-a716-446655440000',
      gross: 5000,
      benefitsCost: 500,
      net: 4500,
    };
    const response = await employeesService.createEmployee(payload);
    expect(response.status()).toBe(200); // or 400 if API rejects read-only fields
  });
});
