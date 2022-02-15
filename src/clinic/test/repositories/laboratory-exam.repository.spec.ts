import { Test } from '@nestjs/testing';
import { assert } from 'chai';
import KnexBuilder, { Knex } from 'knex';

import { WinstonModule, WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as sinon from 'sinon';
import * as winston from 'winston';
import { LaboratoryExamRepository } from '../../repositories/laboratory-exam.repository';
import knexConfigs from '../../database/knexfile';
import { ConstantsEnum } from '../../../shared/enums/constants.enum';
import { LaboratoryExamResponseSchemaHelper } from '../helpers/laboratory-exam-response.helper';
import { LaboratoryExams } from '../../entities/laboratory-exam.entity';

describe('LaboratoryExam repository', () => {
  let laboratoryExamRepository: LaboratoryExamRepository;
  let knex: Knex;
  const logger = sinon.stub(winston.createLogger());

  beforeAll(async () => {
    knex = KnexBuilder(knexConfigs);
    await knex.migrate.rollback(undefined, true);
    await knex.migrate.latest();
  });

  afterAll(async () => {
    await knex.migrate.rollback(undefined, true);
    await knex.destroy();
  });

  beforeEach(async () => {
    sinon.reset();

    await knex.seed.run();

    const module = await Test.createTestingModule({
      imports: [
        {
          module: WinstonModule,
          providers: [
            {
              provide: WINSTON_MODULE_PROVIDER,
              useValue: logger,
            },
          ],
          exports: [WINSTON_MODULE_PROVIDER],
        },
      ],
      providers: [
        LaboratoryExamRepository,
        {
          provide: ConstantsEnum.KNEX_TOKEN,
          useValue: knex,
        },
      ],
    }).compile();

    laboratoryExamRepository = module.get<LaboratoryExamRepository>(
      LaboratoryExamRepository,
    );
  });

  afterEach(() => {
    sinon.reset();
  });

  it('Should create an laboratory exam', async () => {
    const laboratoryExamInputSchema =
      LaboratoryExamResponseSchemaHelper.createClass();
    laboratoryExamInputSchema.exam_id = '1a119b57-581b-4b98-9382-3db110bffff2';
    const dbLaboratoryExam = await laboratoryExamRepository.create({
      exam_id: laboratoryExamInputSchema.exam_id,
      laboratory_id: laboratoryExamInputSchema.laboratory_id,
    });

    assert.equal(
      dbLaboratoryExam.laboratory_id,
      laboratoryExamInputSchema.laboratory_id,
    );
    assert.equal(dbLaboratoryExam.exam_id, laboratoryExamInputSchema.exam_id);
    assert.isDefined(dbLaboratoryExam.id);
  });

  it('Should update an laboratory exam', async () => {
    const laboratoryExamInputSchema =
      LaboratoryExamResponseSchemaHelper.createClass();

    const dbLaboratoryExam = await laboratoryExamRepository.update({
      ...laboratoryExamInputSchema,
      id: '1a119b57-581b-4b98-9382-3db110bffdb7',
    });

    assert.equal(
      dbLaboratoryExam.laboratory_id,
      laboratoryExamInputSchema.laboratory_id,
    );
    assert.equal(dbLaboratoryExam.exam_id, laboratoryExamInputSchema.exam_id);
    assert.isDefined(dbLaboratoryExam.id);
  });
  it('Should get an laboratory exam', async () => {
    const laboratoryExamInputSchema =
      LaboratoryExamResponseSchemaHelper.createClass();

    const dbLaboratoryExam = (await laboratoryExamRepository.findOne(
      '1a119b57-581b-4b98-9382-3db110bffdb7',
    )) as LaboratoryExams;

    assert.equal(
      dbLaboratoryExam.laboratory_id,
      laboratoryExamInputSchema.laboratory_id,
    );
    assert.equal(dbLaboratoryExam.exam_id, laboratoryExamInputSchema.exam_id);
    assert.isDefined(dbLaboratoryExam.id);
  });
  it('Should get all laboratory exams', async () => {
    const dbLaboratoryExam = await laboratoryExamRepository.find({});

    assert.isArray(dbLaboratoryExam);
    assert.lengthOf(dbLaboratoryExam, 1);
  });
  it('Should get all laboratory exams with filters', async () => {
    const laboratoryExamInputSchema =
      LaboratoryExamResponseSchemaHelper.createClass();
    const dbLaboratoryExam = await laboratoryExamRepository.find(
      laboratoryExamInputSchema,
    );

    assert.isArray(dbLaboratoryExam);
    assert.lengthOf(dbLaboratoryExam, 1);
  });
  it('Should delete an laboratory exam', async () => {
    const dbLaboratoryExam = await laboratoryExamRepository.delete({
      id: '1a119b57-581b-4b98-9382-3db110bffdb7',
    });

    assert.isUndefined(dbLaboratoryExam);
  });
});
