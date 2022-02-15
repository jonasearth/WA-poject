import { plainToClass } from 'class-transformer';
import { StatusEnum } from '../../../shared/enums/status.enum';
import { LaboratoryInputSchema } from '../../schemas/laboratory-input.schema';

export class LaboratoryInputSchemaHelper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static createPlain(): any {
    return {
      name: 'IHEF',
      address: 'Av Getulio vargas, 4462',
      status: StatusEnum.ACTIVE,
    };
  }

  static createClass(): LaboratoryInputSchema {
    return plainToClass(
      LaboratoryInputSchema,
      LaboratoryInputSchemaHelper.createPlain(),
    );
  }
}
