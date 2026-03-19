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
import { CidadesIbgeService } from './cidades-ibge.service';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { createCidadeIbgeSchema } from './dto/create-cidade-ibge.dto';
import type { CreateCidadeIbgeDto } from './dto/create-cidade-ibge.dto';
import { updateCidadeIbgeSchema } from './dto/update-cidade-ibge.dto';
import type { UpdateCidadeIbgeDto } from './dto/update-cidade-ibge.dto';

@Controller('cidades-ibge')
@UseGuards(ClerkAuthGuard)
export class CidadesIbgeController {
  constructor(private readonly cidadesIbgeService: CidadesIbgeService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createCidadeIbgeSchema))
    dto: CreateCidadeIbgeDto,
  ) {
    return this.cidadesIbgeService.create(dto);
  }

  @Get()
  findAll() {
    return this.cidadesIbgeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cidadesIbgeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateCidadeIbgeSchema))
    dto: UpdateCidadeIbgeDto,
  ) {
    return this.cidadesIbgeService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cidadesIbgeService.remove(id);
  }
}
