import { expect } from '@playwright/test';

export function verifyEmployeeResponse(employee: any) {
  const expectedGross = employee.salary / 26;
  const expectedBenefits = (1000 + employee.dependants * 500) / 26;
  const expectedNet = expectedGross - expectedBenefits;
  expect(employee.gross).toBeCloseTo(expectedGross, 2);
  expect(employee.benefitsCost).toBeCloseTo(expectedBenefits, 2);
  expect(employee.net).toBeCloseTo(expectedNet, 2);
}

// can be extended in the future to include more complex validation logic, e.g. schema validation, error response validation, etc.
