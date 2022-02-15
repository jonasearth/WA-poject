import { plainToClass } from 'class-transformer';
import { ExamEnum } from '../../enum/exam.enum';
import { StatusEnum } from '../../../shared/enums/status.enum';
import { ExamInputSchema } from '../../schemas/exam-input.schema';

export class ExamInputSchemaHelper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static createPlain(): any {
    return {
      name: 'Exame de sangue',
      type: ExamEnum.CLINICAL_ANALYSIS,
      status: StatusEnum.ACTIVE,
    };
  }

  static createClass(): ExamInputSchema {
    return plainToClass(ExamInputSchema, ExamInputSchemaHelper.createPlain());
  }
}
