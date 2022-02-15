import { Test } from '@nestjs/testing';
import { assert } from 'chai';
import KnexBuilder, { Knex } from 'knex';

import { WinstonModule, WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as sinon from 'sinon';
import * as winston from 'winston';
import knexConfigs from '../../database/knexfile';
import { Laboratory } from '../../entities/laboratory.entity';
import { LaboratoryRepository } from '../../repositories/laboratory.repository';
import { ConstantsEnum } from '../../../shared/enums/constants.enum';
import { LaboratoryInputSchemaHelper } from '../helpers/laboratory-input.helper';

describe('Laboratory repository', () => {
  let laboratoryRepository: LaboratoryRepository;
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
        LaboratoryRepository,
        {
          provide: ConstantsEnum.KNEX_TOKEN,
          useValue: knex,
        },
      ],
    }).compile();

    laboratoryRepository =
      module.get<LaboratoryRepository>(LaboratoryRepository);
  });

  afterEach(() => {
    sinon.reset();
  });

  it('Should create an laboratory', async () => {
    const laboratoryInputSchema = LaboratoryInputSchemaHelper.createClass();

    const dbLaboratory = await laboratoryRepository.create(
      laboratoryInputSchema,
    );

    assert.equal(dbLaboratory.address, laboratoryInputSchema.address);
    assert.equal(dbLaboratory.name, laboratoryInputSchema.name);
    assert.equal(dbLaboratory.status, laboratoryInputSchema.status);
    assert.isDefined(dbLaboratory.id);
  });

  it('Should create many laboratories', async () => {
    const laboratoryInputSchema = LaboratoryInputSchemaHelper.createClass();

    const dbLaboratory = await laboratoryRepository.createMany([
      laboratoryInputSchema,
      laboratoryInputSchema,
    ]);
    assert.lengthOf(dbLaboratory, 2);
    assert.equal(dbLaboratory[0].address, laboratoryInputSchema.address);
    assert.equal(dbLaboratory[0].name, laboratoryInputSchema.name);
    assert.equal(dbLaboratory[0].status, laboratoryInputSchema.status);
    assert.isDefined(dbLaboratory[0].id);
    assert.equal(dbLaboratory[1].address, laboratoryInputSchema.address);
    assert.equal(dbLaboratory[1].name, laboratoryInputSchema.name);
    assert.equal(dbLaboratory[1].status, laboratoryInputSchema.status);
    assert.isDefined(dbLaboratory[1].id);
  });

  it('Should update an laboratory', async () => {
    const laboratoryInputSchema = LaboratoryInputSchemaHelper.createClass();

    const dbLaboratory = await laboratoryRepository.update({
      ...laboratoryInputSchema,
      id: '1a119b57-581b-4b98-9382-3db110bffdb6',
    });

    assert.equal(dbLaboratory.address, laboratoryInputSchema.address);
    assert.equal(dbLaboratory.name, laboratoryInputSchema.name);
    assert.equal(dbLaboratory.status, laboratoryInputSchema.status);
    assert.isDefined(dbLaboratory.id);
  });
  it('Should get an laboratory', async () => {
    const laboratoryInputSchema = LaboratoryInputSchemaHelper.createClass();

    const dbLaboratory = (await laboratoryRepository.findOne(
      '1a119b57-581b-4b98-9382-3db110bffdb6',
    )) as Laboratory;

    assert.equal(dbLaboratory.address, laboratoryInputSchema.address);
    assert.equal(dbLaboratory.name, laboratoryInputSchema.name);
    assert.equal(dbLaboratory.status, laboratoryInputSchema.status);
    assert.isDefined(dbLaboratory.id);
  });
  it('Should get all laboratories', async () => {
    const dbLaboratory = await laboratoryRepository.find();

    assert.isArray(dbLaboratory);
    assert.lengthOf(dbLaboratory, 1);
  });
  it('Should delete an laboratory', async () => {
    const dbLaboratory = await laboratoryRepository.delete({
      id: '1a119b57-581b-4b98-9382-3db110bffdb6',
    });

    assert.isUndefined(dbLaboratory);
  });
});
