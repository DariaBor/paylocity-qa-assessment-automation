import { request, APIRequestContext } from '@playwright/test';
import { ENV } from '../utils/env';

export class ApiClient {
  private requestContext: APIRequestContext;
  private authHeader: string;

  constructor(requestContext: APIRequestContext) {
    this.requestContext = requestContext;
    const credentials = `${ENV.username}:${ENV.password}`;
    this.authHeader = 'Basic ' + Buffer.from(credentials).toString('base64');
  }

  private getHeaders() {
    return {
      Authorization: this.authHeader,
    };
  }

  async get(url: string) {
    return await this.requestContext.get(url, { headers: this.getHeaders() });
  }

  async post(url: string, data: any) {
    return await this.requestContext.post(url, {
      data,
      headers: this.getHeaders(),
    });
  }

  async put(url: string, data: any) {
    return await this.requestContext.put(url, {
      data,
      headers: this.getHeaders(),
    });
  }

  async delete(url: string) {
    return await this.requestContext.delete(url, {
      headers: this.getHeaders(),
    });
  }
}
