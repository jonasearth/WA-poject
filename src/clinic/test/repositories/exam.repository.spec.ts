import { Test } from '@nestjs/testing';
import { assert } from 'chai';
import KnexBuilder, { Knex } from 'knex';

import { WinstonModule, WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as sinon from 'sinon';
import * as winston from 'winston';
import knexConfigs from '../../database/knexfile';
import { ExamRepository } from '../../repositories/exam.repository';
import { ConstantsEnum } from '../../../shared/enums/constants.enum';
import { ExamInputSchemaHelper } from '../helpers/exam-input.helper';
import { Exam } from '../../entities/exam.entity';

describe('Address repository', () => {
  let examRepository: ExamRepository;
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
        ExamRepository,
        {
          provide: ConstantsEnum.KNEX_TOKEN,
          useValue: knex,
        },
      ],
    }).compile();

    examRepository = module.get<ExamRepository>(ExamRepository);
  });

  afterEach(() => {
    sinon.reset();
  });

  it('Should create an exam', async () => {
    const examInputSchema = ExamInputSchemaHelper.createClass();
    const dbExam = await examRepository.create(examInputSchema);

    assert.equal(dbExam.type, examInputSchema.type);
    assert.equal(dbExam.name, examInputSchema.name);
    assert.equal(dbExam.status, examInputSchema.status);
    assert.isDefined(dbExam.id);
  });
  it('Should create many exams', async () => {
    const examInputSchema = ExamInputSchemaHelper.createClass();
    const dbExam = await examRepository.createMany([
      examInputSchema,
      examInputSchema,
    ]);
    assert.lengthOf(dbExam, 2);
    assert.equal(dbExam[0].type, examInputSchema.type);
    assert.equal(dbExam[0].name, examInputSchema.name);
    assert.equal(dbExam[0].status, examInputSchema.status);
    assert.isDefined(dbExam[0].id);
    assert.equal(dbExam[1].type, examInputSchema.type);
    assert.equal(dbExam[1].name, examInputSchema.name);
    assert.equal(dbExam[1].status, examInputSchema.status);
    assert.isDefined(dbExam[1].id);
  });

  it('Should update an exam', async () => {
    const examInputSchema = ExamInputSchemaHelper.createClass();

    const dbExam = await examRepository.update({
      ...examInputSchema,
      id: '1a119b57-581b-4b98-9382-3db110bffdb5',
    });

    assert.equal(dbExam.type, examInputSchema.type);
    assert.equal(dbExam.name, examInputSchema.name);
    assert.equal(dbExam.status, examInputSchema.status);
    assert.isDefined(dbExam.id);
  });
  it('Should get an exam', async () => {
    const examInputSchema = ExamInputSchemaHelper.createClass();

    const dbExam = (await examRepository.findOne(
      '1a119b57-581b-4b98-9382-3db110bffdb5',
    )) as Exam;

    assert.equal(dbExam.type, examInputSchema.type);
    assert.equal(dbExam.name, examInputSchema.name);
    assert.equal(dbExam.status, examInputSchema.status);
    assert.isDefined(dbExam.id);
  });
  it('Should get all exams', async () => {
    const dbExam = await examRepository.find({});

    assert.isArray(dbExam);
    assert.lengthOf(dbExam, 1);
  });
  it('Should get all exams with filters', async () => {
    const examInputSchema = ExamInputSchemaHelper.createClass();
    const dbExam = await examRepository.find({
      name: examInputSchema.name,
      type: examInputSchema.type,
    });

    assert.isArray(dbExam);
    assert.lengthOf(dbExam, 1);
  });
  it('Should delete an exam', async () => {
    const dbExam = await examRepository.delete({
      id: '1a119b57-581b-4b98-9382-3db110bffdb5',
    });

    assert.isUndefined(dbExam);
  });
});
