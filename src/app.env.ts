import * as dotenv from 'dotenv';

dotenv.config();

const env = {
  HOST: process.env.HOST ?? '0.0.0.0',
  PORT: process.env.PORT ?? 3000,
  LOG_CONSOLE_LEVEL: process.env.LOG_CONSOLE_LEVEL as string,
  LOG_FILE_ACTIVE: (process.env.LOG_FILE_ACTIVE ?? 'false') === 'true',
  LOG_FILE_LEVEL: process.env.LOG_FILE_LEVEL as string,
  LOG_FILE_NAME: process.env.LOG_FILE_NAME as string,
  BASE_PATH: (process.env.BASE_PATH ?? '') as string,
  CLINIC_DB_HOST: process.env.CLINIC_DB_HOST as string,
  CLINIC_DB_PORT: parseInt(process.env.CLINIC_DB_PORT ?? '5432', 10),
  CLINIC_DB_USERNAME: process.env.CLINIC_DB_USERNAME as string,
  CLINIC_DB_PASSWORD: process.env.CLINIC_DB_PASSWORD as string,
  CLINIC_DB_DATABASE: process.env.CLINIC_DB_DATABASE as string,
  CLINIC_DB_SSL: (process.env.CLINIC_DB_SSL ?? 'false') === 'true',
  CLINIC_DB_IGNORE_SERVER_IDENTITY:
    (process.env.CLINIC_DB_IGNORE_SERVER_IDENTITY ?? 'false') === 'true',
  CLINIC_DB_POOL_MAX: parseInt(process.env.CLINIC_DB_POOL_MAX ?? '1', 10),
  CLINIC_DB_POOL_MIN: parseInt(process.env.CLINIC_DB_POOL_MIN ?? '1', 10),
};

export default Object.freeze(env);
