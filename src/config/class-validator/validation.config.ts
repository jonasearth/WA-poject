import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipeOptions,
} from '@nestjs/common';

const validationPipeConfigs: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  validationError: {
    target: false,
  },
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  exceptionFactory: (errors) => new UnprocessableEntityException(errors),
};

export default Object.freeze(validationPipeConfigs);
