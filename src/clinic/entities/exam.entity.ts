import { Expose } from 'class-transformer';
import { StatusEnum } from '../../shared/enums/status.enum';
import { ExamEnum } from '../enum/exam.enum';

export class Exam {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  type: ExamEnum;

  @Expose()
  status: StatusEnum;

  @Expose()
  deleted_at: Date;
}
