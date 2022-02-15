import { Injectable, NotFoundException } from '@nestjs/common';
import { Laboratory } from '../entities/laboratory.entity';
import { LaboratoryExams } from '../entities/laboratory-exam.entity';
import { ExamRepository } from '../repositories/exam.repository';
import { LaboratoryExamRepository } from '../repositories/laboratory-exam.repository';
import { LaboratoryRepository } from '../repositories/laboratory.repository';
import { LaboratoryInputSchema } from '../schemas/laboratory-input.schema';
import { UpdateManyLaboratoryInputSchema } from '../schemas/update-many-laboratory-input.schema';
import { IdSchema } from '../../shared/schemas/id.schema';

@Injectable()
export class LaboratoryService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private laboratoryRepository: LaboratoryRepository,
    private laboratoryExamRepository: LaboratoryExamRepository,
    private examRepository: ExamRepository,
  ) {}

  async createMany(
    examInputSchema: LaboratoryInputSchema[],
  ): Promise<Laboratory[]> {
    return this.laboratoryRepository.createMany(examInputSchema);
  }

  async updateMany(
    updateManyExamInputSchema: UpdateManyLaboratoryInputSchema[],
  ): Promise<Laboratory[] | unknown[]> {
    const exams = await Promise.all(
      updateManyExamInputSchema.map(async (exam) => {
        try {
          return await this.update(exam, exam.id);
        } catch (err) {
          return { ...exam, error: true };
        }
      }),
    );
    return exams;
  }

  async deleteMany(ids: IdSchema[]): Promise<IdSchema[]> {
    return Promise.all(
      ids.map(async (idSchema) => {
        try {
          await this.delete(idSchema.id);
          return idSchema;
        } catch (err) {
          return { ...idSchema, error: true };
        }
      }),
    );
  }

  async create(
    laboratoryInputSchema: LaboratoryInputSchema,
  ): Promise<Laboratory> {
    return this.laboratoryRepository.create(laboratoryInputSchema);
  }

  async update(
    laboratoryInputSchema: LaboratoryInputSchema,
    id: string,
  ): Promise<Laboratory> {
    await this.findOneOrFail(id);
    return this.laboratoryRepository.update({ ...laboratoryInputSchema, id });
  }

  async findOne(id: string): Promise<Laboratory> {
    return this.findOneOrFail(id);
  }

  async find(): Promise<Laboratory[]> {
    return this.laboratoryRepository.find();
  }

  async delete(id: string): Promise<void> {
    await this.findOneOrFail(id);
    await this.laboratoryExamRepository.delete({
      laboratory_id: id,
    });
    return this.laboratoryRepository.delete({ id });
  }

  async connectExam(
    laboratoryId: string,
    examId: string,
  ): Promise<LaboratoryExams> {
    await this.findOneOrFail(laboratoryId);
    const exam = await this.examRepository.findOne(examId);
    if (!exam) {
      throw new NotFoundException('The exam does not exist');
    }
    return this.laboratoryExamRepository.create({
      laboratory_id: laboratoryId,
      exam_id: examId,
    });
  }

  async disconnectExam(laboratoryId: string, examId: string): Promise<void> {
    await this.findOneOrFail(laboratoryId);
    const exam = await this.examRepository.findOne(examId);
    if (!exam) {
      throw new NotFoundException('The exam does not exist');
    }
    return this.laboratoryExamRepository.delete({
      laboratory_id: laboratoryId,
      exam_id: examId,
    });
  }

  private async findOneOrFail(id: string): Promise<Laboratory> {
    const entity = await this.laboratoryRepository.findOne(id);

    if (!entity) {
      throw new NotFoundException('The laboratory does not exist');
    }

    return entity;
  }
}
