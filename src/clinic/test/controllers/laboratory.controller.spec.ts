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
import { LaboratoryService } from '../../services/laboratory.service';
import { ApplicationExceptionFilter } from '../../../shared/filters/application-exception.filter';
import { AxiosErrorInterceptor } from '../../../shared/interceptors/axios-error.interceptor';
import { LaboratoryController } from '../../controllers/laboratory.controller';
import { LaboratoryInputSchemaHelper } from '../helpers/laboratory-input.helper';
import { LaboratoryResponseSchemaHelper } from '../helpers/laboratory-response.helper';
import { LaboratoryExamResponseSchemaHelper } from '../helpers/laboratory-exam-response.helper';

describe('Laboratory Controller', () => {
  const logger = sinon.stub(winston.createLogger());

  const laboratoryService = sinon.createStubInstance(LaboratoryService);

  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [LaboratoryController],
      providers: [
        {
          provide: LaboratoryService,
          useValue: laboratoryService,
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

  it('Should create a Laboratory', async () => {
    const laboratoryInputSchema = LaboratoryInputSchemaHelper.createClass();
    const laboratoryResponseSchema =
      LaboratoryResponseSchemaHelper.createPlain();

    laboratoryService.create
      .withArgs(laboratoryInputSchema)
      .resolves(laboratoryResponseSchema);

    return request(app.getHttpServer())
      .post('/laboratories')
      .send(laboratoryInputSchema)
      .then((response) => {
        assert.equal(response.status, HttpStatus.CREATED);

        const { body } = response;
        assert.deepEqual(body, laboratoryResponseSchema);
      });
  });
  it('Should create many Laboratories', async () => {
    const laboratoryInputSchema = LaboratoryInputSchemaHelper.createPlain();
    const laboratoryResponseSchema =
      LaboratoryResponseSchemaHelper.createPlain();

    laboratoryService.createMany
      .withArgs([laboratoryInputSchema])
      .resolves([laboratoryResponseSchema]);

    return request(app.getHttpServer())
      .post('/laboratories/many')
      .send([laboratoryInputSchema])
      .then((response) => {
        assert.equal(response.status, HttpStatus.CREATED);

        const { body } = response;
        assert.deepEqual(body, [laboratoryResponseSchema]);
      });
  });
  it('Should link a exam and a Laboratory', async () => {
    const laboratoryExamInputSchema =
      LaboratoryExamResponseSchemaHelper.createClass();

    laboratoryService.connectExam
      .withArgs(
        laboratoryExamInputSchema.laboratory_id,
        laboratoryExamInputSchema.exam_id,
      )
      .resolves(laboratoryExamInputSchema);

    return request(app.getHttpServer())
      .post(`/laboratories/${laboratoryExamInputSchema.laboratory_id}/exams`)
      .send({ exam_id: laboratoryExamInputSchema.exam_id })
      .then((response) => {
        assert.equal(response.status, HttpStatus.CREATED);

        const { body } = response;
        assert.deepEqual(body, laboratoryExamInputSchema);
      });
  });

  it('Should remove link between exam and Laboratory', async () => {
    const laboratoryExamInputSchema =
      LaboratoryExamResponseSchemaHelper.createClass();

    return request(app.getHttpServer())
      .delete(
        `/laboratories/${laboratoryExamInputSchema.laboratory_id}/exams/${laboratoryExamInputSchema.exam_id}`,
      )
      .then((response) => {
        assert.equal(response.status, HttpStatus.NO_CONTENT);
      });
  });

  it('Should update a Laboratory', async () => {
    const laboratoryInputSchema = LaboratoryInputSchemaHelper.createClass();
    const laboratoryResponseSchema =
      LaboratoryResponseSchemaHelper.createPlain();

    laboratoryService.update
      .withArgs(laboratoryInputSchema, laboratoryResponseSchema.id)
      .resolves(laboratoryResponseSchema);

    return request(app.getHttpServer())
      .put(`/laboratories/${laboratoryResponseSchema.id}`)
      .send(laboratoryInputSchema)
      .then((response) => {
        assert.equal(response.status, HttpStatus.OK);

        const { body } = response;
        assert.deepEqual(body, laboratoryResponseSchema);
      });
  });

  it('Should update a Laboratory', async () => {
    const laboratoryResponseSchema =
      LaboratoryResponseSchemaHelper.createPlain();

    laboratoryService.updateMany
      .withArgs([laboratoryResponseSchema])
      .resolves([laboratoryResponseSchema]);

    return request(app.getHttpServer())
      .put(`/laboratories/many`)
      .send([laboratoryResponseSchema])
      .then((response) => {
        assert.equal(response.status, HttpStatus.OK);

        const { body } = response;
        assert.deepEqual(body, [laboratoryResponseSchema]);
      });
  });

  it('Should delete a Laboratory', async () => {
    const laboratoryResponseSchema =
      LaboratoryResponseSchemaHelper.createPlain();

    return request(app.getHttpServer())
      .delete(`/laboratories/${laboratoryResponseSchema.id}`)
      .then((response) => {
        assert.equal(response.status, HttpStatus.NO_CONTENT);
      });
  });

  it('Should delete many Laboratories', async () => {
    const laboratoryResponseSchema =
      LaboratoryResponseSchemaHelper.createPlain();

    laboratoryService.deleteMany
      .withArgs(sinon.match([laboratoryResponseSchema]))
      .resolves([laboratoryResponseSchema]);
    return request(app.getHttpServer())
      .delete(`/laboratories/many`)
      .send([laboratoryResponseSchema])
      .then((response) => {
        assert.equal(response.status, HttpStatus.OK);

        const { body } = response;
        assert.deepEqual(body, [laboratoryResponseSchema]);
      });
  });

  it('Should get a Laboratory', async () => {
    const laboratoryResponseSchema =
      LaboratoryResponseSchemaHelper.createPlain();

    laboratoryService.findOne
      .withArgs(laboratoryResponseSchema.id)
      .resolves(laboratoryResponseSchema);

    return request(app.getHttpServer())
      .get(`/laboratories/${laboratoryResponseSchema.id}`)
      .then((response) => {
        assert.equal(response.status, HttpStatus.OK);

        const { body } = response;
        assert.deepEqual(body, laboratoryResponseSchema);
      });
  });

  it('Should get all Laboratories', async () => {
    const laboratoryResponseSchema =
      LaboratoryResponseSchemaHelper.createPlain();

    laboratoryService.find.resolves([laboratoryResponseSchema]);

    return request(app.getHttpServer())
      .get(`/laboratories`)
      .then((response) => {
        assert.equal(response.status, HttpStatus.OK);

        const { body } = response;
        assert.deepEqual(body, [laboratoryResponseSchema]);
      });
  });
});
