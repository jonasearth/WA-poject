import {
  ClassSerializerInterceptor,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as sinon from 'sinon';
import * as winston from 'winston';
import { Test } from '@nestjs/testing';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as request from 'supertest';
import { assert } from 'chai';
import validationPipeConfigs from '../../../config/class-validator/validation.config';
import { ApplicationExceptionFilter } from '../../../shared/filters/application-exception.filter';
import { AxiosErrorInterceptor } from '../../../shared/interceptors/axios-error.interceptor';
import { ExamController } from '../../controllers/exam.controller';
import { ExamInputSchemaHelper } from '../helpers/exam-input.helper';
import { ExamService } from '../../services/exam.service';
import { ExamResponseSchemaHelper } from '../helpers/exam-response.helper';
import { LaboratoryResponseSchemaHelper } from '../helpers/laboratory-response.helper';

describe('Exam Controller', () => {
  const logger = sinon.stub(winston.createLogger());

  const examService = sinon.createStubInstance(ExamService);

  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ExamController],
      providers: [
        {
          provide: ExamService,
          useValue: examService,
        },
        {
          provide: APP_FILTER,
          useClass: ApplicationExceptionFilter,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: AxiosErrorInterceptor,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: ClassSerializerInterceptor,
        },
        {
          provide: APP_PIPE,
          useValue: new ValidationPipe(validationPipeConfigs),
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: logger,
        },
      ],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    sinon.reset();
  });

  it('Should create a Exam', async () => {
    const examInputSchema = ExamInputSchemaHelper.createClass();
    const examResponseSchema = ExamResponseSchemaHelper.createPlain();

    examService.create.withArgs(examInputSchema).resolves(examResponseSchema);

    return request(app.getHttpServer())
      .post('/exams')
      .send(examInputSchema)
      .then((response) => {
        assert.equal(response.status, HttpStatus.CREATED);

        const { body } = response;
        assert.deepEqual(body, examResponseSchema);
      });
  });
  it('Should create many Exams', async () => {
    const examInputSchema = ExamInputSchemaHelper.createPlain();
    const examResponseSchema = ExamResponseSchemaHelper.createPlain();

    examService.createMany
      .withArgs([examInputSchema])
      .resolves([examResponseSchema]);

    return request(app.getHttpServer())
      .post('/exams/many')
      .send([examInputSchema])
      .then((response) => {
        assert.equal(response.status, HttpStatus.CREATED);
        const { body } = response;
        assert.deepEqual(body, [examResponseSchema]);
      });
  });
  it('Should update a Exam', async () => {
    const examInputSchema = ExamInputSchemaHelper.createClass();
    const examResponseSchema = ExamResponseSchemaHelper.createPlain();

    examService.update
      .withArgs(examInputSchema, examResponseSchema.id)
      .resolves(examResponseSchema);

    return request(app.getHttpServer())
      .put(`/exams/${examResponseSchema.id}`)
      .send(examInputSchema)
      .then((response) => {
        assert.equal(response.status, HttpStatus.OK);

        const { body } = response;
        assert.deepEqual(body, examResponseSchema);
      });
  });

  it('Should update many Exams', async () => {
    const examResponseSchema = ExamResponseSchemaHelper.createPlain();

    examService.updateMany
      .withArgs([examResponseSchema])
      .resolves([examResponseSchema]);

    return request(app.getHttpServer())
      .put(`/exams/many`)
      .send([examResponseSchema])
      .then((response) => {
        assert.equal(response.status, HttpStatus.OK);

        const { body } = response;
        assert.deepEqual(body, [examResponseSchema]);
      });
  });

  it('Should delete a Exam', async () => {
    const examResponseSchema = ExamResponseSchemaHelper.createPlain();

    return request(app.getHttpServer())
      .delete(`/exams/${examResponseSchema.id}`)
      .then((response) => {
        assert.equal(response.status, HttpStatus.NO_CONTENT);
      });
  });
  it('Should delete many Exam', async () => {
    const examResponseSchema = ExamResponseSchemaHelper.createPlain();
    examService.deletemany
      .withArgs([examResponseSchema])
      .resolves([examResponseSchema]);
    return request(app.getHttpServer())
      .delete(`/exams/many`)
      .send([examResponseSchema])
      .then((response) => {
        assert.equal(response.status, HttpStatus.OK);
        const { body } = response;
        assert.deepEqual(body, [examResponseSchema]);
      });
  });

  it('Should get a Exam', async () => {
    const examResponseSchema = ExamResponseSchemaHelper.createPlain();

    examService.findOne
      .withArgs(examResponseSchema.id)
      .resolves(examResponseSchema);

    return request(app.getHttpServer())
      .get(`/exams/${examResponseSchema.id}`)
      .then((response) => {
        assert.equal(response.status, HttpStatus.OK);

        const { body } = response;
        assert.deepEqual(body, examResponseSchema);
      });
  });
  it('Should get all Laboratories by exam name', async () => {
    const examResponseSchema = ExamResponseSchemaHelper.createPlain();
    const laboratoryResponseSchema =
      LaboratoryResponseSchemaHelper.createPlain();
    examService.getLaboratories
      .withArgs(sinon.match({ name: examResponseSchema.name }))
      .resolves([laboratoryResponseSchema]);

    return request(app.getHttpServer())
      .get(`/exams/laboratories?name=${examResponseSchema.name}`)
      .then((response) => {
        assert.equal(response.status, HttpStatus.OK);

        const { body } = response;
        assert.deepEqual(body, [laboratoryResponseSchema]);
      });
  });

  it('Should get all Exams', async () => {
    const examResponseSchema = ExamResponseSchemaHelper.createPlain();

    examService.find.resolves([examResponseSchema]);

    return request(app.getHttpServer())
      .get(`/exams`)
      .then((response) => {
        assert.equal(response.status, HttpStatus.OK);

        const { body } = response;
        assert.deepEqual(body, [examResponseSchema]);
      });
  });
});
