import { Exclude, Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { ExamInputSchema } from './exam-input.schema';

@Exclude()
export class UpdateManyExamInputSchema extends ExamInputSchema {
  @Expose()
  @IsUUID(4)
  id: string;
}
