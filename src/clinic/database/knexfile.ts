import { Knex } from 'knex';
import * as path from 'path';
import { ConnectionOptions } from 'tls';
import env from '../../app.env';

let ssl: ConnectionOptions | boolean = env.CLINIC_DB_SSL;

if (ssl && env.CLINIC_DB_IGNORE_SERVER_IDENTITY) {
  ssl = {
    checkServerIdentity: () => undefined,
  };
}

const knexConfigs: Knex.Config = {
  client: 'pg',
  connection: {
    host: env.CLINIC_DB_HOST,
    user: env.CLINIC_DB_USERNAME,
    password: env.CLINIC_DB_PASSWORD,
    database: env.CLINIC_DB_DATABASE,
    port: env.CLINIC_DB_PORT,
    pool: {
      testOnBorrow: true,
      min: env.CLINIC_DB_POOL_MIN,
      max: env.CLINIC_DB_POOL_MAX,
    },
    ssl,
  },
  migrations: {
    tableName: 'migrations',
    directory: path.join(__dirname, 'migrations'),
  },
  seeds: {
    timestampFilenamePrefix: false,
    directory: path.join(__dirname, 'seeds'),
  },
};

export default Object.freeze(knexConfigs);
