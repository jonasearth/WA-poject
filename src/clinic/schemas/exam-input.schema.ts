import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
import { StatusEnum } from '../../shared/enums/status.enum';
import { ExamEnum } from '../enum/exam.enum';

@Exclude()
export class ExamInputSchema {
  id?: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsEnum(ExamEnum)
  type: ExamEnum;

  @Expose()
  @IsEnum(StatusEnum)
  status: StatusEnum;
}
