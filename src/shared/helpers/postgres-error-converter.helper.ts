import { PostgresErrorEnum } from '../enums/postgres-error.enum';
import { EntityAlreadyExistsError } from '../exceptions/entity-already-exists.exception';
import { NotNullableException } from '../exceptions/not-nullable-fields.exception';

export type PostgresError = Error & { code: string };

export function isPostgresError(error: unknown): error is PostgresError {
  return typeof error === 'object' && error !== null && 'code' in error;
}

export class PostgresErrorConverter {
  static throwClassErrorByCode(error: unknown): never {
    if (!isPostgresError(error)) {
      throw error;
    }

    switch (error.code) {
      case PostgresErrorEnum.NOT_NULL_VIOLATION:
        throw new NotNullableException('Not Null Violation');
      case PostgresErrorEnum.UNIQUE_VIOLATION:
        throw new EntityAlreadyExistsError('Integrity Constraint Violation');
      default:
        throw error;
    }
  }
}
