import { Knex } from 'knex';
import { TablesEnum } from '../../../shared/enums/tables.enum';
import { StatusEnum } from '../../../shared/enums/status.enum';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    TablesEnum.EXAM_TABLE,
    (table: Knex.CreateTableBuilder) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.text('name').notNullable();
      table.text('type').notNullable();
      table.text('status').notNullable().defaultTo(StatusEnum.ACTIVE);
      table.timestamp('deleted_at');
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TablesEnum.EXAM_TABLE);
}
