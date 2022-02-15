import { Exclude, Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

@Exclude()
export class DisconnectExamInputSchema {
  @Expose()
  @IsUUID(4)
  exam_id: string;

  @Expose()
  @IsUUID(4)
  id: string;
}
