import { WinstonModuleOptions, utilities } from 'nest-winston';
import { transports } from 'winston';
import * as winston from 'winston';

import {
  ConsoleTransportOptions,
  FileTransportOptions,
} from 'winston/lib/winston/transports';

import env from '../../app.env';

const winstonTrasports: winston.transport[] = [];

const consoleLoggerOptions: ConsoleTransportOptions = {
  level: env.LOG_CONSOLE_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    utilities.format.nestLike(),
  ),
};

winstonTrasports.push(new transports.Console(consoleLoggerOptions));

if (env.LOG_FILE_ACTIVE) {
  const fileLoggerOptions: FileTransportOptions = {
    level: env.LOG_FILE_LEVEL,
    filename: env.LOG_FILE_NAME,
    format: winston.format.json(),
  };

  winstonTrasports.push(new transports.File(fileLoggerOptions));
}

export const winstonConfig: WinstonModuleOptions = {
  transports: winstonTrasports,
  handleExceptions: true,
};
