import { BrowserContext } from '@playwright/test';
import { ENV } from './env';
import { EmployeesService } from '../api/employeesService';

export async function setupAuthRoute(context: BrowserContext) {
  const credentials = `${ENV.username}:${ENV.password}`;
  const authHeader = 'Basic ' + Buffer.from(credentials).toString('base64');

  await context.route('**/Prod/api/**', async (route) => {
    route.continue({
      headers: {
        ...route.request().headers(),
        Authorization: authHeader,
      },
    });
  });
}

export async function createEmployeeViaApi(service: EmployeesService, payload: any) {
  const response = await service.createEmployee(payload);
  if (response.status() !== 200) {
    throw new Error('Employee creation failed');
  }
  return await response.json();
}
