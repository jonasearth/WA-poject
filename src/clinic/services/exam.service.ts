import { Injectable } from '@nestjs/common';
import { IdSchema } from '../../shared/schemas/id.schema';
import { NotFoundException } from '../../shared/exceptions/not-found.exception';
import { Exam } from '../entities/exam.entity';
import { Laboratory } from '../entities/laboratory.entity';
import { ExamRepository } from '../repositories/exam.repository';
import { LaboratoryExamRepository } from '../repositories/laboratory-exam.repository';
import { LaboratoryRepository } from '../repositories/laboratory.repository';
import { ExamFilterSchema } from '../schemas/exam-filter.schema';
import { ExamInputSchema } from '../schemas/exam-input.schema';
import { UpdateManyExamInputSchema } from '../schemas/update-many-exam-input.schema';

@Injectable()
export class ExamService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private examRepository: ExamRepository,
    private laboratoryExamRepository: LaboratoryExamRepository,
    private laboratoryRepository: LaboratoryRepository,
  ) {}

  async create(examInputSchema: ExamInputSchema): Promise<Exam> {
    return this.examRepository.create(examInputSchema);
  }

  async createMany(examInputSchema: ExamInputSchema[]): Promise<Exam[]> {
    return this.examRepository.createMany(examInputSchema);
  }

  async updateMany(
    updateManyExamInputSchema: UpdateManyExamInputSchema[],
  ): Promise<Exam[] | unknown[]> {
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

  async deletemany(ids: IdSchema[]): Promise<IdSchema[]> {
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

  async update(examInputSchema: ExamInputSchema, id: string): Promise<Exam> {
    await this.findOneOrFail(id);
    return this.examRepository.update({ ...examInputSchema, id });
  }

  async findOne(id: string): Promise<Exam> {
    return this.findOneOrFail(id);
  }

  async find(): Promise<Exam[]> {
    return this.examRepository.find({});
  }

  async delete(id: string): Promise<void> {
    await this.findOneOrFail(id);

    await this.laboratoryExamRepository.delete({
      exam_id: id,
    });
    return this.examRepository.delete({ id });
  }

  private async findOneOrFail(id: string): Promise<Exam> {
    const entity = await this.examRepository.findOne(id);

    if (!entity) {
      throw new NotFoundException('The exam does not exist');
    }

    return entity;
  }

  async getLaboratories(filter: ExamFilterSchema): Promise<Laboratory[]> {
    const exams = await this.examRepository.find(filter);
    const laboratories: Laboratory[] = [];
    await Promise.all(
      exams.map(async (exam) => {
        const laboratoryExams = await this.laboratoryExamRepository.find({
          exam_id: exam.id,
        });
        await Promise.all(
          laboratoryExams.map(async (laboratoryExam) => {
            const lab = await this.laboratoryRepository.findOne(
              laboratoryExam.laboratory_id,
            );
            if (
              lab &&
              !laboratories.find((l) => l.id === laboratoryExam.laboratory_id)
            ) {
              laboratories.push(lab);
            }
          }),
        );
      }),
    );

    return laboratories;
  }
}
