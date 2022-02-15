import { Knex } from 'knex';
import { TablesEnum } from '../../../shared/enums/tables.enum';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    TablesEnum.LABORATORY_EXAMS_TABLE,
    (table: Knex.CreateTableBuilder) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('laboratory_id').notNullable();
      table.uuid('exam_id').notNullable();

      table.unique(['laboratory_id', 'exam_id'], {
        indexName: 'laboratory_exams_laboratory_id_exam_id_unique_idx',
      });
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TablesEnum.LABORATORY_EXAMS_TABLE);
}
