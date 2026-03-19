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
import { AnalysisService } from './analysis.service';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { createAnalysisSchema } from './dto/create-analysis.dto';
import type { CreateAnalysisDto } from './dto/create-analysis.dto';
import { updateAnalysisSchema } from './dto/update-analysis.dto';
import type { UpdateAnalysisDto } from './dto/update-analysis.dto';

@Controller('analysis')
@UseGuards(ClerkAuthGuard)
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createAnalysisSchema)) dto: CreateAnalysisDto,
  ) {
    return this.analysisService.create(dto);
  }

  @Get()
  findAll() {
    return this.analysisService.findAll();
  }

  @Get('amostra/:amostraId')
  findByAmostra(@Param('amostraId') amostraId: string) {
    return this.analysisService.findByAmostra(amostraId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.analysisService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateAnalysisSchema)) dto: UpdateAnalysisDto,
  ) {
    return this.analysisService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.analysisService.remove(id);
  }
}
