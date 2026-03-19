import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { SamplesService } from './samples.service';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { createSampleSchema } from './dto/create-sample.dto';
import type { CreateSampleDto } from './dto/create-sample.dto';
import { updateSampleSchema } from './dto/update-sample.dto';
import type { UpdateSampleDto } from './dto/update-sample.dto';

@Controller('samples')
@UseGuards(ClerkAuthGuard)
export class SamplesController {
  constructor(private readonly samplesService: SamplesService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createSampleSchema)) dto: CreateSampleDto,
  ) {
    return this.samplesService.create(dto);
  }

  @Get()
  findAll() {
    return this.samplesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.samplesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateSampleSchema)) dto: UpdateSampleDto,
  ) {
    return this.samplesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.samplesService.remove(id);
  }
}
