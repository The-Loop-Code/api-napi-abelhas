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
import { TiposAnaliseService } from './tipos-analise.service';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { createTipoAnaliseSchema } from './dto/create-tipo-analise.dto';
import type { CreateTipoAnaliseDto } from './dto/create-tipo-analise.dto';
import { updateTipoAnaliseSchema } from './dto/update-tipo-analise.dto';
import type { UpdateTipoAnaliseDto } from './dto/update-tipo-analise.dto';

@Controller('tipos-analise')
@UseGuards(ClerkAuthGuard)
export class TiposAnaliseController {
  constructor(private readonly tiposAnaliseService: TiposAnaliseService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createTipoAnaliseSchema))
    dto: CreateTipoAnaliseDto,
  ) {
    return this.tiposAnaliseService.create(dto);
  }

  @Get()
  findAll() {
    return this.tiposAnaliseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tiposAnaliseService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateTipoAnaliseSchema))
    dto: UpdateTipoAnaliseDto,
  ) {
    return this.tiposAnaliseService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tiposAnaliseService.remove(id);
  }
}
