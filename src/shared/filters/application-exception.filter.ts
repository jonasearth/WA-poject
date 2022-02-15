import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { ApplicationException } from '../exceptions/application.exception';
import { ConflictException } from '../exceptions/conflict.exception';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { InvalidActionException } from '../exceptions/invalid-action.exception';
import { InvalidInputException } from '../exceptions/invalid-input.exception';
import { NotFoundException } from '../exceptions/not-found.exception';
import { UnauthorizedException } from '../exceptions/unauthorized.exception';
import { ErrorResponse } from '../types/error-response.type';

@Catch(ApplicationException)
export class ApplicationExceptionFilter implements ExceptionFilter {
  private static HTTP_ERROR_MAP = [
    {
      type: ConflictException,
      error: 'Conflict',
      statusCode: HttpStatus.CONFLICT,
    },
    {
      type: ForbiddenException,
      error: 'Forbidden',
      statusCode: HttpStatus.FORBIDDEN,
    },
    {
      type: InvalidActionException,
      error: 'Bad Request',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      type: InvalidInputException,
      error: 'Unprocessable Entity',
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    },
    {
      type: NotFoundException,
      error: 'Not Found',
      statusCode: HttpStatus.NOT_FOUND,
    },
    {
      type: UnauthorizedException,
      error: 'Unauthorized',
      statusCode: HttpStatus.UNAUTHORIZED,
    },
  ];

  private static DEFAULT_ERROR_RESPONSE = {
    error: 'Internal server error',
    message: 'Unknown error',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  };

  // eslint-disable-next-line class-methods-use-this
  catch(exception: ApplicationException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const errorResponse =
      ApplicationExceptionFilter.getErrorResponse(exception);

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  static getErrorResponse(exception: ApplicationException): ErrorResponse {
    const httpError = ApplicationExceptionFilter.HTTP_ERROR_MAP.find(
      ({ type }) => {
        return exception instanceof type;
      },
    );

    if (!httpError) {
      return ApplicationExceptionFilter.DEFAULT_ERROR_RESPONSE;
    }

    return {
      statusCode: httpError.statusCode,
      error: httpError.error,
      message: exception.message,
    };
  }
}
