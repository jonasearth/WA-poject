import { plainToClass } from 'class-transformer';
import { StatusEnum } from '../../../shared/enums/status.enum';
import { UpdateManyLaboratoryInputSchema } from '../../schemas/update-many-laboratory-input.schema';

export class UpdateManyLaboratoryResponseSchemaHelper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static createPlain(): any {
    return {
      id: '1a119b57-581b-4b98-9382-3db110bffdb6',
      name: 'IHEF',
      address: 'Av Getulio vargas, 4462',
      status: StatusEnum.ACTIVE,
    };
  }

  static createClass(): UpdateManyLaboratoryInputSchema {
    return plainToClass(
      UpdateManyLaboratoryInputSchema,
      UpdateManyLaboratoryResponseSchemaHelper.createPlain(),
    );
  }
}
