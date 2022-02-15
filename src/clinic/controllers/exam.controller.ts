/* eslint-disable class-methods-use-this */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { IdSchema } from '../../shared/schemas/id.schema';
import { Exam } from '../entities/exam.entity';
import { ExamService } from '../services/exam.service';
import { ExamInputSchema } from '../schemas/exam-input.schema';
import { Laboratory } from '../entities/laboratory.entity';
import { ExamFilterSchema } from '../schemas/exam-filter.schema';
import { UpdateManyExamInputSchema } from '../schemas/update-many-exam-input.schema';

@Controller('exams')
export class ExamController {
  // eslint-disable-next-line no-useless-constructor
  constructor(private examService: ExamService) {}

  @Post('/many')
  async createMany(@Body() data: ExamInputSchema[]): Promise<Exam[]> {
    return this.examService.createMany(data);
  }

  @Post('')
  async create(@Body() data: ExamInputSchema): Promise<Exam> {
    return this.examService.create(data);
  }

  @Put('/many')
  async updateMany(
    @Body() data: UpdateManyExamInputSchema[],
  ): Promise<Exam[] | unknown[]> {
    return this.examService.updateMany(data);
  }

  @Put(':id')
  async update(
    @Param() idSchema: IdSchema,
    @Body() data: ExamInputSchema,
  ): Promise<Exam> {
    return this.examService.update(data, idSchema.id);
  }

  @Delete('/many')
  async deleteMany(@Body() idSchema: IdSchema[]): Promise<IdSchema[]> {
    return this.examService.deletemany(idSchema);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param() idSchema: IdSchema): Promise<void> {
    return this.examService.delete(idSchema.id);
  }

  @Get('/laboratories')
  async getLaboratories(
    @Query() filter: ExamFilterSchema,
  ): Promise<Laboratory[]> {
    return this.examService.getLaboratories(filter);
  }

  @Get('')
  async find(): Promise<Exam[]> {
    return this.examService.find();
  }

  @Get(':id')
  async findOne(@Param() idSchema: IdSchema): Promise<Exam> {
    return this.examService.findOne(idSchema.id);
  }
}
