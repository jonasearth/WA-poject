import { HttpStatus } from '@nestjs/common';

export type ErrorResponse = {
  statusCode: number | HttpStatus;
  error: string;
  message: string;
};
