import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { ClinicModule } from './clinic/clinic.module';
import validationPipeConfigs from './config/class-validator/validation.config';
import { winstonConfig } from './config/winston/winston.config';
import { ApplicationExceptionFilter } from './shared/filters/application-exception.filter';
import { AxiosErrorInterceptor } from './shared/interceptors/axios-error.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot(),
    WinstonModule.forRoot(winstonConfig),
    ClinicModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AxiosErrorInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ApplicationExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe(validationPipeConfigs),
    },
  ],
})
export class AppModule {}
