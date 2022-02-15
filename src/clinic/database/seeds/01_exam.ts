import { Knex } from 'knex';
import { StatusEnum } from '../../../shared/enums/status.enum';
import { TablesEnum } from '../../../shared/enums/tables.enum';
import { ExamEnum } from '../../enum/exam.enum';

export async function seed(knex: Knex): Promise<void> {
  await knex(TablesEnum.EXAM_TABLE).del();

  await knex(TablesEnum.EXAM_TABLE).insert([
    {
      id: '1a119b57-581b-4b98-9382-3db110bffdb5',
      type: ExamEnum.CLINICAL_ANALYSIS,
      status: StatusEnum.ACTIVE,
      name: 'Exame de sangue',
    },
  ]);
}
