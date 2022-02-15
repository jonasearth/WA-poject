import { Expose } from 'class-transformer';

export class LaboratoryExams {
  @Expose()
  id: string;

  @Expose()
  laboratory_id: string;

  @Expose()
  exam_id: string;
}
