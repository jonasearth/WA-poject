import { Test } from '@nestjs/testing';
import { assert } from 'chai';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as sinon from 'sinon';
import * as winston from 'winston';
import { LaboratoryExamRepository } from '../../repositories/laboratory-exam.repository';
import { NotFoundException } from '../../../shared/exceptions/not-found.exception';
import { ExamRepository } from '../../repositories/exam.repository';
import { ExamService } from '../../services/exam.service';
import { ExamInputSchemaHelper } from '../helpers/exam-input.helper';
import { ExamResponseSchemaHelper } from '../helpers/exam-response.helper';
import { LaboratoryRepository } from '../../repositories/laboratory.repository';
import { LaboratoryResponseSchemaHelper } from '../helpers/laboratory-response.helper';
import { LaboratoryExamResponseSchemaHelper } from '../helpers/laboratory-exam-response.helper';
import { UpdateManyExamResponseSchemaHelper } from '../helpers/update-many-exam-response.helper';

describe('Address service', () => {
  const examRepository = sinon.createStubInstance(ExamRepository);
  const laboratoryRepository = sinon.createStubInstance(LaboratoryRepository);
  const laboratoryExamRepository = sinon.createStubInstance(
    LaboratoryExamRepository,
  );
  const logger = sinon.stub(winston.createLogger());
  let examService: ExamService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ExamService,
        {
          provide: ExamRepository,
          useValue: examRepository,
        },
        {
          provide: LaboratoryRepository,
          useValue: laboratoryRepository,
        },
        {
          provide: LaboratoryExamRepository,
          useValue: laboratoryExamRepository,
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: logger,
        },
      ],
    }).compile();

    examService = module.get<ExamService>(ExamService);
  });

  afterEach(() => {
    sinon.reset();
  });

  it('Should create a exam', async () => {
    const examInputSchema = ExamInputSchemaHelper.createClass();
    const examResponseSchema = ExamResponseSchemaHelper.createPlain();

    examRepository.create
      .withArgs(examInputSchema)
      .resolves(examResponseSchema);

    const result = await examService.create(examInputSchema);

    assert.deepEqual(result, examResponseSchema);

    sinon.assert.calledOnce(examRepository.create);
  });
  it('Should create many exams', async () => {
    const examInputSchema = ExamInputSchemaHelper.createClass();
    const examResponseSchema = ExamResponseSchemaHelper.createPlain();

    examRepository.createMany
      .withArgs([examInputSchema])
      .resolves([examResponseSchema]);

    const result = await examService.createMany([examInputSchema]);

    assert.deepEqual(result, [examResponseSchema]);

    sinon.assert.calledOnce(examRepository.createMany);
  });
  it('Should update a exam', async () => {
    const examInputSchema = ExamInputSchemaHelper.createClass();
    const examResponseSchema = ExamResponseSchemaHelper.createPlain();

    examRepository.update
      .withArgs({ ...examInputSchema, id: examResponseSchema.id })
      .resolves(examResponseSchema);
    examRepository.findOne
      .withArgs(examResponseSchema.id)
      .resolves(examResponseSchema);
    const result = await examService.update(
      examInputSchema,
      examResponseSchema.id,
    );

    assert.deepEqual(result, examResponseSchema);

    sinon.assert.calledOnce(examRepository.update);
  });

  it('Should update many exams', async () => {
    const examResponseSchema = UpdateManyExamResponseSchemaHelper.createPlain();

    examRepository.update
      .withArgs(examResponseSchema)
      .onFirstCall()
      .resolves(examResponseSchema);
    examRepository.update
      .withArgs(examResponseSchema)
      .onSecondCall()
      .rejects(new Error(''));
    examRepository.findOne
      .withArgs(examResponseSchema.id)
      .resolves(examResponseSchema);
    const result = await examService.updateMany([
      examResponseSchema,
      examResponseSchema,
    ]);

    assert.deepEqual(result, [
      examResponseSchema,
      { ...examResponseSchema, error: true },
    ]);

    sinon.assert.calledTwice(examRepository.update);
  });
  it('Should delete a exam', async () => {
    const examResponseSchema = ExamResponseSchemaHelper.createPlain();

    examRepository.findOne
      .withArgs(examResponseSchema.id)
      .resolves(examResponseSchema);

    await examService.delete(examResponseSchema.id);

    sinon.assert.calledOnce(examRepository.delete);
  });

  it('Should delete many exams', async () => {
    const examResponseSchema = ExamResponseSchemaHelper.createPlain();
    examRepository.findOne
      .withArgs(examResponseSchema.id)
      .onFirstCall()
      .resolves(examResponseSchema);
    examRepository.findOne
      .withArgs(examResponseSchema.id)
      .onSecondCall()
      .rejects(new Error(''));

    const result = await examService.deletemany([
      examResponseSchema,
      examResponseSchema,
    ]);
    assert.deepEqual(result, [
      examResponseSchema,
      { ...examResponseSchema, error: true },
    ]);
    sinon.assert.calledOnce(examRepository.delete);
  });

  it('Should get a exam', async () => {
    const examResponseSchema = ExamResponseSchemaHelper.createPlain();
    examRepository.findOne
      .withArgs(examResponseSchema.id)
      .resolves(examResponseSchema);

    const exam = await examService.findOne(examResponseSchema.id);

    assert.deepEqual(exam, examResponseSchema);
    sinon.assert.calledOnce(examRepository.findOne);
  });
  it('Should get all exams', async () => {
    const examResponseSchema = ExamResponseSchemaHelper.createPlain();
    examRepository.find.resolves([examResponseSchema]);

    const exam = await examService.find();

    assert.deepEqual(exam, [examResponseSchema]);

    sinon.assert.calledOnce(examRepository.find);
  });

  it('Should get all laboratories by exam', async () => {
    const examResponseSchema = ExamResponseSchemaHelper.createPlain();
    const laboratoryResponseSchema =
      LaboratoryResponseSchemaHelper.createPlain();
    const laboratoryExamResponseSchema =
      LaboratoryExamResponseSchemaHelper.createPlain();

    examRepository.find.resolves([examResponseSchema]);
    laboratoryExamRepository.find
      .withArgs({ exam_id: examResponseSchema.id })
      .resolves([laboratoryExamResponseSchema, laboratoryExamResponseSchema]);

    laboratoryRepository.findOne
      .withArgs(laboratoryExamResponseSchema.laboratory_id)
      .resolves(laboratoryResponseSchema);
    const laboratories = await examService.getLaboratories({
      name: examResponseSchema.name,
    });

    assert.deepEqual(laboratories, [laboratoryResponseSchema]);
  });

  it('Should throw a error because exam not exist', async () => {
    const examResponseSchema = ExamResponseSchemaHelper.createPlain();
    examRepository.findOne.withArgs(examResponseSchema.id).resolves(null);

    try {
      await examService.findOne(examResponseSchema.id);
    } catch (err) {
      assert.instanceOf(err, NotFoundException);
      return;
    }
    throw new Error('Expected Error but none Found!');
  });
});
