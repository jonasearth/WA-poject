import { plainToClass } from 'class-transformer';
import { ExamEnum } from '../../enum/exam.enum';
import { Exam } from '../../entities/exam.entity';
import { StatusEnum } from '../../../shared/enums/status.enum';

export class ExamResponseSchemaHelper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static createPlain(): any {
    return {
      id: '1a119b57-581b-4b98-9382-3db110bffdb5',
      name: 'Exame de sangue',
      type: ExamEnum.CLINICAL_ANALYSIS,
      status: StatusEnum.ACTIVE,
    };
  }

  static createClass(): Exam {
    return plainToClass(Exam, ExamResponseSchemaHelper.createPlain());
  }
}
