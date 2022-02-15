import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ExamEnum } from '../enum/exam.enum';

@Exclude()
export class ExamFilterSchema {
  @Expose()
  @IsString()
  @IsOptional()
  name?: string;

  @Expose()
  @IsEnum(ExamEnum)
  @IsOptional()
  type?: ExamEnum;
}
