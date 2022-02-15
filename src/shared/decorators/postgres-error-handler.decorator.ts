import { PostgresErrorConverter } from '../helpers/postgres-error-converter.helper';
import { DescriptorValue } from '../types/descriptor-value.type';

/**
 * Convert Postgres error to application exception
 */
export const ConvertPostgresError = (): DescriptorValue => {
  return (
    _target: unknown,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    const descriptorConst = descriptor;

    const originalMethod = descriptorConst.value;

    descriptorConst.value = function errorHandler(...args: unknown[]): unknown {
      const result = originalMethod.apply(this, args);

      return result.catch((error: unknown) => {
        PostgresErrorConverter.throwClassErrorByCode(error);
      });
    };

    return descriptorConst;
  };
};
