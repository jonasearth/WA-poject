import { Knex } from 'knex';
import { TablesEnum } from '../../../shared/enums/tables.enum';

export async function seed(knex: Knex): Promise<void> {
  await knex(TablesEnum.LABORATORY_EXAMS_TABLE).del();

  await knex(TablesEnum.LABORATORY_EXAMS_TABLE).insert([
    {
      id: '1a119b57-581b-4b98-9382-3db110bffdb7',
      laboratory_id: '1a119b57-581b-4b98-9382-3db110bffdb6',
      exam_id: '1a119b57-581b-4b98-9382-3db110bffdb5',
    },
  ]);
}
