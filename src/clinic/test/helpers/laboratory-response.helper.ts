import { plainToClass } from 'class-transformer';
import { Laboratory } from '../../entities/laboratory.entity';
import { StatusEnum } from '../../../shared/enums/status.enum';

export class LaboratoryResponseSchemaHelper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static createPlain(): any {
    return {
      id: '1a119b57-581b-4b98-9382-3db110bffdb6',
      name: 'IHEF',
      address: 'Av Getulio vargas, 4462',
      status: StatusEnum.ACTIVE,
    };
  }

  static createClass(): Laboratory {
    return plainToClass(
      Laboratory,
      LaboratoryResponseSchemaHelper.createPlain(),
    );
  }
}
