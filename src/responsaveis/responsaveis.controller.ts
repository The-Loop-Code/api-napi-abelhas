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
import { ResponsaveisService } from './responsaveis.service';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { createResponsavelSchema } from './dto/create-responsavel.dto';
import type { CreateResponsavelDto } from './dto/create-responsavel.dto';
import { updateResponsavelSchema } from './dto/update-responsavel.dto';
import type { UpdateResponsavelDto } from './dto/update-responsavel.dto';

@Controller('responsaveis')
@UseGuards(ClerkAuthGuard)
export class ResponsaveisController {
  constructor(private readonly responsaveisService: ResponsaveisService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createResponsavelSchema))
    dto: CreateResponsavelDto,
  ) {
    return this.responsaveisService.create(dto);
  }

  @Get()
  findAll() {
    return this.responsaveisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.responsaveisService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateResponsavelSchema))
    dto: UpdateResponsavelDto,
  ) {
    return this.responsaveisService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.responsaveisService.remove(id);
  }
}
