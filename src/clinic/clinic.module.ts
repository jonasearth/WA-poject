import { HttpModule, Module } from '@nestjs/common';
import { ConstantsEnum } from '../shared/enums/constants.enum';
import { KnexModule } from '../knex/knex.module';
import knexConfigs from './database/knexfile';
import { ExamService } from './services/exam.service';
import { ExamRepository } from './repositories/exam.repository';
import { ExamController } from './controllers/exam.controller';
import { LaboratoryController } from './controllers/laboratory.controller';
import { LaboratoryRepository } from './repositories/laboratory.repository';
import { LaboratoryService } from './services/laboratory.service';
import { LaboratoryExamRepository } from './repositories/laboratory-exam.repository';

@Module({
  imports: [
    HttpModule,
    KnexModule.register(ConstantsEnum.KNEX_TOKEN, knexConfigs),
  ],
  providers: [
    LaboratoryService,
    LaboratoryRepository,
    ExamService,
    ExamRepository,
    LaboratoryExamRepository,
  ],
  controllers: [LaboratoryController, ExamController],
  exports: [
    LaboratoryService,
    LaboratoryRepository,
    ExamService,
    ExamRepository,
    LaboratoryExamRepository,
  ],
})
export class ClinicModule {}
