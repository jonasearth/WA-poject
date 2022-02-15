import { Inject, Injectable } from '@nestjs/common';

import { Knex } from 'knex';
import { ConvertPostgresError } from '../../shared/decorators/postgres-error-handler.decorator';
import { ConstantsEnum } from '../../shared/enums/constants.enum';
import { TablesEnum } from '../../shared/enums/tables.enum';
import { RepositoryInterface } from '../../shared/interfaces/repository.interface';
import { LaboratoryExams } from '../entities/laboratory-exam.entity';

@Injectable()
export class LaboratoryExamRepository
  implements RepositoryInterface<LaboratoryExams>
{
  // eslint-disable-next-line no-useless-constructor
  constructor(@Inject(ConstantsEnum.KNEX_TOKEN) private knex: Knex) {}

  async find(
    laboratoryExams: Partial<LaboratoryExams>,
  ): Promise<LaboratoryExams[]> {
    const query = this.knex<LaboratoryExams>(TablesEnum.LABORATORY_EXAMS_TABLE);
    if (laboratoryExams.exam_id) {
      query.where({ exam_id: laboratoryExams.exam_id });
    }
    if (laboratoryExams.laboratory_id) {
      query.where({ laboratory_id: laboratoryExams.laboratory_id });
    }
    return query;
  }

  async findOne(id: string): Promise<LaboratoryExams | null> {
    const [laboratory] = await this.knex<LaboratoryExams>(
      TablesEnum.LABORATORY_EXAMS_TABLE,
    )
      .select()
      .where({ id });

    return laboratory ?? null;
  }

  async update(values: LaboratoryExams): Promise<LaboratoryExams> {
    const [laboratory] = await this.knex<LaboratoryExams>(
      TablesEnum.LABORATORY_EXAMS_TABLE,
    )
      .update(values)
      .where({
        id: values.id,
      })
      .returning('*');

    return laboratory;
  }

  @ConvertPostgresError()
  async create(values: Omit<LaboratoryExams, 'id'>): Promise<LaboratoryExams> {
    const [laboratory] = await this.knex<LaboratoryExams>(
      TablesEnum.LABORATORY_EXAMS_TABLE,
    )
      .insert(values)
      .returning('*');

    return laboratory;
  }

  async delete(laboratoryExams: Partial<LaboratoryExams>): Promise<void> {
    await this.knex<LaboratoryExams>(TablesEnum.LABORATORY_EXAMS_TABLE)
      .delete()
      .where(laboratoryExams);
  }
}
