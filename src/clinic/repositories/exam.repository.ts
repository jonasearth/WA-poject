import { Inject, Injectable } from '@nestjs/common';

import { Knex } from 'knex';
import { StatusEnum } from '../../shared/enums/status.enum';
import { ConvertPostgresError } from '../../shared/decorators/postgres-error-handler.decorator';
import { RepositoryInterface } from '../../shared/interfaces/repository.interface';
import { Exam } from '../entities/exam.entity';
import { ConstantsEnum } from '../../shared/enums/constants.enum';
import { ExamInputSchema } from '../schemas/exam-input.schema';
import { TablesEnum } from '../../shared/enums/tables.enum';

@Injectable()
export class ExamRepository implements RepositoryInterface<Exam> {
  // eslint-disable-next-line no-useless-constructor
  constructor(@Inject(ConstantsEnum.KNEX_TOKEN) private knex: Knex) {}

  async find(exam: Partial<Exam>): Promise<Exam[]> {
    const query = this.knex<Exam>(TablesEnum.EXAM_TABLE).where({
      status: StatusEnum.ACTIVE,
    });
    if (exam.name) {
      query.where({ name: exam.name });
    }
    if (exam.type) {
      query.where({ type: exam.type });
    }
    return query;
  }

  async findOne(id: string): Promise<Exam | null> {
    const [exam] = await this.knex<Exam>(TablesEnum.EXAM_TABLE)
      .select()
      .where({ id, status: StatusEnum.ACTIVE });

    return exam ?? null;
  }

  async update(values: ExamInputSchema): Promise<Exam> {
    const [exam] = await this.knex<Exam>(TablesEnum.EXAM_TABLE)
      .update(values)
      .where({
        id: values.id,
      })
      .returning('*');

    return exam;
  }

  @ConvertPostgresError()
  async create(values: ExamInputSchema): Promise<Exam> {
    const [exam] = await this.knex<Exam>(TablesEnum.EXAM_TABLE)
      .insert(values)
      .returning('*');

    return exam;
  }

  @ConvertPostgresError()
  async createMany(values: ExamInputSchema[]): Promise<Exam[]> {
    const exam = await this.knex<Exam>(TablesEnum.EXAM_TABLE)
      .insert(values)
      .returning('*');

    return exam;
  }

  async delete(exam: Partial<Exam>): Promise<void> {
    await this.knex<Exam>(TablesEnum.EXAM_TABLE)
      .update({ deleted_at: this.knex.fn.now(), status: StatusEnum.INACTIVE })
      .where({ id: exam.id });
  }
}
