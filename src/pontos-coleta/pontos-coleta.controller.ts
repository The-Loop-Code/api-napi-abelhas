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
import { PontosColetaService } from './pontos-coleta.service';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { createPontoColetaSchema } from './dto/create-ponto-coleta.dto';
import type { CreatePontoColetaDto } from './dto/create-ponto-coleta.dto';
import { updatePontoColetaSchema } from './dto/update-ponto-coleta.dto';
import type { UpdatePontoColetaDto } from './dto/update-ponto-coleta.dto';

@Controller('pontos-coleta')
@UseGuards(ClerkAuthGuard)
export class PontosColetaController {
  constructor(private readonly pontosColetaService: PontosColetaService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createPontoColetaSchema))
    dto: CreatePontoColetaDto,
  ) {
    return this.pontosColetaService.create(dto);
  }

  @Get()
  findAll() {
    return this.pontosColetaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pontosColetaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updatePontoColetaSchema))
    dto: UpdatePontoColetaDto,
  ) {
    return this.pontosColetaService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pontosColetaService.remove(id);
  }
}
