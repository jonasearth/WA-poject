import { AxiosError, AxiosResponse } from 'axios';
import { HttpStatus } from '@nestjs/common';

export class AxiosHelper {
  static createAxiosResponse(
    status: HttpStatus,
    data: unknown = {},
    request: unknown = {},
  ): AxiosResponse {
    return {
      data,
      status,
      statusText: 'OK',
      headers: {},
      config: {},
      request,
    };
  }

  static createAxiosError(
    request: unknown = {},
    response?: AxiosResponse,
  ): AxiosError {
    return {
      config: {},
      code: 'ERROR',
      request,
      response,
      isAxiosError: true,
      toJSON: () => {
        return {};
      },
      name: 'AxiosError',
      message: 'Axios error',
    };
  }

  static createHeaders(): object {
    return { 'Content-Type': 'application/json' };
  }
}
