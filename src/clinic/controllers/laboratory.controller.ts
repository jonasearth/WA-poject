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
} from '@nestjs/common';
import { IdSchema } from '../../shared/schemas/id.schema';
import { Laboratory } from '../entities/laboratory.entity';
import { LaboratoryExams } from '../entities/laboratory-exam.entity';
import { ConnectExamInputSchema } from '../schemas/connect-exam-input.schema';
import { DisconnectExamInputSchema } from '../schemas/disconect-exam-input.schema';
import { LaboratoryInputSchema } from '../schemas/laboratory-input.schema';
import { LaboratoryService } from '../services/laboratory.service';
import { UpdateManyLaboratoryInputSchema } from '../schemas/update-many-laboratory-input.schema';

@Controller('laboratories')
export class LaboratoryController {
  // eslint-disable-next-line no-useless-constructor
  constructor(private laboratoryService: LaboratoryService) {}

  @Post('')
  async create(@Body() data: LaboratoryInputSchema): Promise<Laboratory> {
    return this.laboratoryService.create(data);
  }

  @Post('/many')
  async createMany(
    @Body() data: LaboratoryInputSchema[],
  ): Promise<Laboratory[]> {
    return this.laboratoryService.createMany(data);
  }

  @Put('/many')
  async updateMany(
    @Body() data: UpdateManyLaboratoryInputSchema[],
  ): Promise<Laboratory[] | unknown[]> {
    return this.laboratoryService.updateMany(data);
  }

  @Delete('many')
  async deleteMany(@Body() idSchema: IdSchema[]): Promise<IdSchema[]> {
    return this.laboratoryService.deleteMany(idSchema);
  }

  @Put(':id')
  async update(
    @Param() idSchema: IdSchema,
    @Body() data: LaboratoryInputSchema,
  ): Promise<Laboratory> {
    return this.laboratoryService.update(data, idSchema.id);
  }

  @Get(':id')
  async findOne(@Param() idSchema: IdSchema): Promise<Laboratory> {
    return this.laboratoryService.findOne(idSchema.id);
  }

  @Get('')
  async find(): Promise<Laboratory[]> {
    return this.laboratoryService.find();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param() idSchema: IdSchema): Promise<void> {
    return this.laboratoryService.delete(idSchema.id);
  }

  @Post(':id/exams')
  async connectExam(
    @Param() idSchema: IdSchema,
    @Body() data: ConnectExamInputSchema,
  ): Promise<LaboratoryExams> {
    return this.laboratoryService.connectExam(idSchema.id, data.exam_id);
  }

  @Delete(':id/exams/:exam_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async disconectExam(
    @Param() disconnectExamInputSchema: DisconnectExamInputSchema,
  ): Promise<void> {
    return this.laboratoryService.disconnectExam(
      disconnectExamInputSchema.id,
      disconnectExamInputSchema.exam_id,
    );
  }
}
