import { Expose } from 'class-transformer';
import { StatusEnum } from '../../shared/enums/status.enum';

export class Laboratory {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  address: string;

  @Expose()
  status: StatusEnum;

  @Expose()
  deleted_at: Date;
}
