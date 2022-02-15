import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Logger } from 'winston';
import { ErrorResponse } from '../types/error-response.type';

/**
 * Convert axios errors to http errors
 */
@Injectable()
export class AxiosErrorInterceptor implements NestInterceptor {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-explicit-any
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error): never => {
        if (!error.isAxiosError) {
          throw error;
        }

        const axiosError = error as AxiosError;

        const response = {
          statusCode:
            axiosError.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
          error: axiosError.response?.statusText ?? 'Internal Server Error',
          message:
            axiosError.response?.data?.message ??
            axiosError.response?.data ??
            axiosError.message,
        };

        this.logAxiosError(response, axiosError);

        throw new HttpException(response, response.statusCode);
      }),
    );
  }

  protected static getAxiosErrorUrl(error: AxiosError): URL | null {
    try {
      return new URL(error.config.url ?? '');
    } catch (e) {
      return null;
    }
  }

  protected logAxiosError(response: ErrorResponse, error: AxiosError): void {
    if (response.statusCode < HttpStatus.INTERNAL_SERVER_ERROR) {
      return;
    }

    const url = AxiosErrorInterceptor.getAxiosErrorUrl(error);

    this.logger.error({
      statusCode: response.statusCode,
      serviceHostname: url?.hostname ?? '',
      serviceUrl: url?.origin ?? '',
      serviceEndpoint: url?.pathname ?? '',
      serviceMethod: error.config.method,
      message: `Error connecting to service ${url?.hostname}: ${error.message}`,
      stack: error.stack,
      context: AxiosErrorInterceptor.name,
    });
  }
}
