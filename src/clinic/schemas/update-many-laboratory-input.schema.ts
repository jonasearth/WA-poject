import { Exclude, Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { LaboratoryInputSchema } from './laboratory-input.schema';

@Exclude()
export class UpdateManyLaboratoryInputSchema extends LaboratoryInputSchema {
  @Expose()
  @IsUUID(4)
  id: string;
}
