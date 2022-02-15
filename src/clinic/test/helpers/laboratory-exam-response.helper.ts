import { plainToClass } from 'class-transformer';
import { LaboratoryExams } from '../../entities/laboratory-exam.entity';

export class LaboratoryExamResponseSchemaHelper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static createPlain(): any {
    return {
      id: '1a119b57-581b-4b98-9382-3db110bffdb7',
      laboratory_id: '1a119b57-581b-4b98-9382-3db110bffdb6',
      exam_id: '1a119b57-581b-4b98-9382-3db110bffdb5',
    };
  }

  static createClass(): LaboratoryExams {
    return plainToClass(
      LaboratoryExams,
      LaboratoryExamResponseSchemaHelper.createPlain(),
    );
  }
}
