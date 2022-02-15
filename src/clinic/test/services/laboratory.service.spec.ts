import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { assert } from 'chai';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as sinon from 'sinon';
import * as winston from 'winston';
import { ExamRepository } from '../../repositories/exam.repository';
import { LaboratoryExamRepository } from '../../repositories/laboratory-exam.repository';
import { LaboratoryRepository } from '../../repositories/laboratory.repository';
import { LaboratoryService } from '../../services/laboratory.service';
import { ExamResponseSchemaHelper } from '../helpers/exam-response.helper';
import { LaboratoryExamResponseSchemaHelper } from '../helpers/laboratory-exam-response.helper';
import { LaboratoryInputSchemaHelper } from '../helpers/laboratory-input.helper';
import { LaboratoryResponseSchemaHelper } from '../helpers/laboratory-response.helper';
import { UpdateManyLaboratoryResponseSchemaHelper } from '../helpers/update-many-laboratory-response.helper';

describe('Address service', () => {
  const examRepository = sinon.createStubInstance(ExamRepository);
  const laboratoryRepository = sinon.createStubInstance(LaboratoryRepository);
  const laboratoryExamRepository = sinon.createStubInstance(
    LaboratoryExamRepository,
  );
  const logger = sinon.stub(winston.createLogger());
  let laboratoryService: LaboratoryService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LaboratoryService,
        {
          provide: LaboratoryRepository,
          useValue: laboratoryRepository,
        },
        {
          provide: ExamRepository,
          useValue: examRepository,
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

    laboratoryService = module.get<LaboratoryService>(LaboratoryService);
  });

  afterEach(() => {
    sinon.reset();
  });

  it('Should create a laboratory', async () => {
    const laboratoryInputSchema = LaboratoryInputSchemaHelper.createClass();
    const laboratoryResponseSchema =
      LaboratoryResponseSchemaHelper.createPlain();

    laboratoryRepository.create
      .withArgs(laboratoryInputSchema)
      .resolves(laboratoryResponseSchema);

    const result = await laboratoryService.create(laboratoryInputSchema);

    assert.deepEqual(result, laboratoryResponseSchema);

    sinon.assert.calledOnce(laboratoryRepository.create);
  });
  it('Should create many laboratories', async () => {
    const laboratoryInputSchema = LaboratoryInputSchemaHelper.createClass();
    const laboratoryResponseSchema =
      LaboratoryResponseSchemaHelper.createPlain();

    laboratoryRepository.createMany
      .withArgs([laboratoryInputSchema])
      .resolves([laboratoryResponseSchema]);

    const result = await laboratoryService.createMany([laboratoryInputSchema]);

    assert.deepEqual(result, [laboratoryResponseSchema]);

    sinon.assert.calledOnce(laboratoryRepository.createMany);
  });
  it('Should link a laboratory and a exam', async () => {
    const laboratoryResponseSchema =
      LaboratoryResponseSchemaHelper.createPlain();
    const examResponseSchema = ExamResponseSchemaHelper.createPlain();
    const laboratoryExamResponseSchema =
      LaboratoryExamResponseSchemaHelper.createPlain();
    laboratoryRepository.findOne
      .withArgs(laboratoryResponseSchema.id)
      .resolves(laboratoryResponseSchema);

    examRepository.findOne
      .withArgs(examResponseSchema.id)
      .resolves(examResponseSchema);
    laboratoryExamRepository.create
      .withArgs({
        exam_id: examResponseSchema.id,
        laboratory_id: laboratoryResponseSchema.id,
      })
      .resolves(laboratoryExamResponseSchema);

    const result = await laboratoryService.connectExam(
      laboratoryResponseSchema.id,
      examResponseSchema.id,
    );

    assert.deepEqual(result, laboratoryExamResponseSchema);

    sinon.assert.calledOnce(laboratoryExamRepository.create);
  });
  it('Should not link a laboratory and a exam because exam not exist', async () => {
    const laboratoryResponseSchema =
      LaboratoryResponseSchemaHelper.createPlain();
    const examResponseSchema = ExamResponseSchemaHelper.createPlain();
    laboratoryRepository.findOne
      .withArgs(laboratoryResponseSchema.id)
      .resolves(laboratoryResponseSchema);

    examRepository.findOne.withArgs(examResponseSchema.id).resolves(null);

    try {
      await laboratoryService.connectExam(
        laboratoryResponseSchema.id,
        examResponseSchema.id,
      );
    } catch (err) {
      assert.instanceOf(err, NotFoundException);
      return;
    }
    throw new Error('Expected error but none found!');
  });
  it('Should remove link between laboratory and a exam', async () => {
    const laboratoryResponseSchema =
      LaboratoryResponseSchemaHelper.createPlain();
    const examResponseSchema = ExamResponseSchemaHelper.createPlain();
    laboratoryRepository.findOne
      .withArgs(laboratoryResponseSchema.id)
      .resolves(laboratoryResponseSchema);

    examRepository.findOne
      .withArgs(examResponseSchema.id)
      .resolves(examResponseSchema);

    const result = await laboratoryService.disconnectExam(
      laboratoryResponseSchema.id,
      examResponseSchema.id,
    );

    assert.isUndefined(result);

    sinon.assert.calledOnce(laboratoryExamRepository.delete);
  });
  it('Should not remove link between laboratory and a exam because exam not exist', async () => {
    const laboratoryResponseSchema =
      LaboratoryResponseSchemaHelper.createPlain();
    const examResponseSchema = ExamResponseSchemaHelper.createPlain();
    laboratoryRepository.findOne
      .withArgs(laboratoryResponseSchema.id)
      .resolves(laboratoryResponseSchema);

    examRepository.findOne.withArgs(examResponseSchema.id).resolves(null);

    try {
      await laboratoryService.disconnectExam(
        laboratoryResponseSchema.id,
        examResponseSchema.id,
      );
    } catch (err) {
      assert.instanceOf(err, NotFoundException);
      return;
    }
    throw new Error('Expected error but none found!');
  });
  it('Should update a laboratory', async () => {
    const laboratoryInputSchema = LaboratoryInputSchemaHelper.createClass();
    const laboratoryResponseSchema =
      LaboratoryResponseSchemaHelper.createPlain();

    laboratoryRepository.update
      .withArgs({ ...laboratoryInputSchema, id: laboratoryResponseSchema.id })
      .resolves(laboratoryResponseSchema);
    laboratoryRepository.findOne
      .withArgs(laboratoryResponseSchema.id)
      .resolves(laboratoryResponseSchema);
    const result = await laboratoryService.update(
      laboratoryInputSchema,
      laboratoryResponseSchema.id,
    );

    assert.deepEqual(result, laboratoryResponseSchema);

    sinon.assert.calledOnce(laboratoryRepository.update);
  });
  it('Should update many laboratories', async () => {
    const laboratoryResponseSchema =
      UpdateManyLaboratoryResponseSchemaHelper.createPlain();

    laboratoryRepository.update
      .withArgs(laboratoryResponseSchema)
      .onFirstCall()
      .resolves(laboratoryResponseSchema);
    laboratoryRepository.update
      .withArgs(laboratoryResponseSchema)
      .onSecondCall()
      .rejects(new Error(''));
    laboratoryRepository.findOne
      .withArgs(laboratoryResponseSchema.id)
      .resolves(laboratoryResponseSchema);
    const result = await laboratoryService.updateMany([
      laboratoryResponseSchema,
      laboratoryResponseSchema,
    ]);

    assert.deepEqual(result, [
      laboratoryResponseSchema,
      { ...laboratoryResponseSchema, error: true },
    ]);

    sinon.assert.calledTwice(laboratoryRepository.update);
  });
  it('Should delete a laboratory', async () => {
    const laboratoryResponseSchema =
      LaboratoryResponseSchemaHelper.createPlain();

    laboratoryRepository.findOne
      .withArgs(laboratoryResponseSchema.id)
      .onFirstCall()
      .resolves(laboratoryResponseSchema);

    laboratoryRepository.findOne
      .withArgs(laboratoryResponseSchema.id)
      .onSecondCall()
      .rejects(new Error(''));

    const result = await laboratoryService.deleteMany([
      laboratoryResponseSchema,
      laboratoryResponseSchema,
    ]);
    assert.deepEqual(result, [
      laboratoryResponseSchema,
      { ...laboratoryResponseSchema, error: true },
    ]);
    sinon.assert.calledOnce(laboratoryRepository.delete);
  });
  it('Should delete many laboratories', async () => {
    const laboratoryResponseSchema =
      LaboratoryResponseSchemaHelper.createPlain();

    laboratoryRepository.findOne
      .withArgs(laboratoryResponseSchema.id)
      .resolves(laboratoryResponseSchema);

    await laboratoryService.delete(laboratoryResponseSchema.id);

    sinon.assert.calledOnce(laboratoryRepository.delete);
  });

  it('Should get a laboratory', async () => {
    const laboratoryResponseSchema =
      LaboratoryResponseSchemaHelper.createPlain();
    laboratoryRepository.findOne
      .withArgs(laboratoryResponseSchema.id)
      .resolves(laboratoryResponseSchema);

    const laboratory = await laboratoryService.findOne(
      laboratoryResponseSchema.id,
    );

    assert.deepEqual(laboratory, laboratoryResponseSchema);
    sinon.assert.calledOnce(laboratoryRepository.findOne);
  });
  it('Should get all laboratories', async () => {
    const laboratoryResponseSchema =
      LaboratoryResponseSchemaHelper.createPlain();
    laboratoryRepository.find.resolves([laboratoryResponseSchema]);

    const laboratory = await laboratoryService.find();

    assert.deepEqual(laboratory, [laboratoryResponseSchema]);

    sinon.assert.calledOnce(laboratoryRepository.find);
  });

  it('Should throw a error because laboratory not exist', async () => {
    const laboratoryResponseSchema =
      LaboratoryResponseSchemaHelper.createPlain();
    laboratoryRepository.findOne
      .withArgs(laboratoryResponseSchema.id)
      .resolves(null);

    try {
      await laboratoryService.findOne(laboratoryResponseSchema.id);
    } catch (err) {
      assert.instanceOf(err, NotFoundException);
      return;
    }
    throw new Error('Expected Error but none Found!');
  });
});
