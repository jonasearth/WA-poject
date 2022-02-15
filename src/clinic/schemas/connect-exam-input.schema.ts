import { Exclude, Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

@Exclude()
export class ConnectExamInputSchema {
  @Expose()
  @IsUUID(4)
  exam_id: string;
}
