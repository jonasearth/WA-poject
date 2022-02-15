import { plainToClass } from 'class-transformer';
import { ExamEnum } from '../../enum/exam.enum';
import { StatusEnum } from '../../../shared/enums/status.enum';
import { UpdateManyExamInputSchema } from '../../schemas/update-many-exam-input.schema';

export class UpdateManyExamResponseSchemaHelper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static createPlain(): any {
    return {
      id: '1a119b57-581b-4b98-9382-3db110bffdb5',
      name: 'Exame de sangue',
      type: ExamEnum.CLINICAL_ANALYSIS,
      status: StatusEnum.ACTIVE,
    };
  }

  static createClass(): UpdateManyExamInputSchema {
    return plainToClass(
      UpdateManyExamInputSchema,
      UpdateManyExamResponseSchemaHelper.createPlain(),
    );
  }
}
