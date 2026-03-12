export function createEmployee(overrides = {}) {
  return {
    firstName: 'John',
    lastName: 'Doe',
    dependants: 1,
    ...overrides,
  };
}
