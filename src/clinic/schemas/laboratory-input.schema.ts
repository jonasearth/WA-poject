import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
import { StatusEnum } from '../../shared/enums/status.enum';

@Exclude()
export class LaboratoryInputSchema {
  id?: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  address: string;

  @Expose()
  @IsEnum(StatusEnum)
  status: StatusEnum;
}
