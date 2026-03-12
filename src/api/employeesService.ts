import { ApiClient } from '../api/apiClient';

export class EmployeesService {
  constructor(private api: ApiClient) {}

  async createEmployee(employee: any) {
    return await this.api.post('/Prod/api/employees', employee);
  }

  async getEmployees() {
    return await this.api.get('/Prod/api/employees');
  }

  async getEmployeeById(id: string) {
    return await this.api.get(`/Prod/api/employees/${id}`);
  }

  async updateEmployee(employee: any) {
    return await this.api.put('/Prod/api/employees', employee);
  }

  async deleteEmployee(id: string) {
    return await this.api.delete(`/Prod/api/employees/${id}`);
  }
}
