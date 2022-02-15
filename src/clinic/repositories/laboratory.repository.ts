import { Inject, Injectable } from '@nestjs/common';

import { Knex } from 'knex';
import { ConvertPostgresError } from '../../shared/decorators/postgres-error-handler.decorator';
import { ConstantsEnum } from '../../shared/enums/constants.enum';
import { StatusEnum } from '../../shared/enums/status.enum';
import { TablesEnum } from '../../shared/enums/tables.enum';
import { RepositoryInterface } from '../../shared/interfaces/repository.interface';
import { Laboratory } from '../entities/laboratory.entity';
import { LaboratoryInputSchema } from '../schemas/laboratory-input.schema';

@Injectable()
export class LaboratoryRepository implements RepositoryInterface<Laboratory> {
  // eslint-disable-next-line no-useless-constructor
  constructor(@Inject(ConstantsEnum.KNEX_TOKEN) private knex: Knex) {}

  async find(): Promise<Laboratory[]> {
    const query = this.knex<Laboratory>(TablesEnum.LABORATORY_TABLE).where({
      status: StatusEnum.ACTIVE,
    });
    return query;
  }

  async findOne(id: string): Promise<Laboratory | null> {
    const [laboratory] = await this.knex<Laboratory>(
      TablesEnum.LABORATORY_TABLE,
    )
      .select()
      .where({ id, status: StatusEnum.ACTIVE });

    return laboratory ?? null;
  }

  async update(values: LaboratoryInputSchema): Promise<Laboratory> {
    const [laboratory] = await this.knex<Laboratory>(
      TablesEnum.LABORATORY_TABLE,
    )
      .update(values)
      .where({
        id: values.id,
      })
      .returning('*');

    return laboratory;
  }

  @ConvertPostgresError()
  async create(values: LaboratoryInputSchema): Promise<Laboratory> {
    const [laboratory] = await this.knex<Laboratory>(
      TablesEnum.LABORATORY_TABLE,
    )
      .insert(values)
      .returning('*');

    return laboratory;
  }

  @ConvertPostgresError()
  async createMany(values: LaboratoryInputSchema[]): Promise<Laboratory[]> {
    const laboratory = await this.knex<Laboratory>(TablesEnum.LABORATORY_TABLE)
      .insert(values)
      .returning('*');

    return laboratory;
  }

  async delete(laboratory: Partial<Laboratory>): Promise<void> {
    await this.knex<Laboratory>(TablesEnum.LABORATORY_TABLE)
      .update({ deleted_at: this.knex.fn.now(), status: StatusEnum.INACTIVE })
      .where({ id: laboratory.id });
  }
}
