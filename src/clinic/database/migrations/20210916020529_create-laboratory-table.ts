import { Knex } from 'knex';
import { TablesEnum } from '../../../shared/enums/tables.enum';
import { StatusEnum } from '../../../shared/enums/status.enum';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    TablesEnum.LABORATORY_TABLE,
    (table: Knex.CreateTableBuilder) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.text('name').notNullable();
      table.text('address').notNullable();
      table.text('status').notNullable().defaultTo(StatusEnum.ACTIVE);
      table.timestamp('deleted_at');
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TablesEnum.LABORATORY_TABLE);
}
