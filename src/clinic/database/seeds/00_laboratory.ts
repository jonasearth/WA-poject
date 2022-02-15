import { Knex } from 'knex';
import { TablesEnum } from '../../../shared/enums/tables.enum';
import { StatusEnum } from '../../../shared/enums/status.enum';

export async function seed(knex: Knex): Promise<void> {
  await knex(TablesEnum.LABORATORY_TABLE).del();

  await knex(TablesEnum.LABORATORY_TABLE).insert([
    {
      id: '1a119b57-581b-4b98-9382-3db110bffdb6',
      address: 'Av Getulio vargas, 4462',
      status: StatusEnum.ACTIVE,
      name: 'IHEF',
    },
  ]);
}
