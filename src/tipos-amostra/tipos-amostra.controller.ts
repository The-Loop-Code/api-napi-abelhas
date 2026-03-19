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
import { TiposAmostraService } from './tipos-amostra.service';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { createTipoAmostraSchema } from './dto/create-tipo-amostra.dto';
import type { CreateTipoAmostraDto } from './dto/create-tipo-amostra.dto';
import { updateTipoAmostraSchema } from './dto/update-tipo-amostra.dto';
import type { UpdateTipoAmostraDto } from './dto/update-tipo-amostra.dto';

@Controller('tipos-amostra')
@UseGuards(ClerkAuthGuard)
export class TiposAmostraController {
  constructor(private readonly tiposAmostraService: TiposAmostraService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createTipoAmostraSchema))
    dto: CreateTipoAmostraDto,
  ) {
    return this.tiposAmostraService.create(dto);
  }

  @Get()
  findAll() {
    return this.tiposAmostraService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tiposAmostraService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateTipoAmostraSchema))
    dto: UpdateTipoAmostraDto,
  ) {
    return this.tiposAmostraService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tiposAmostraService.remove(id);
  }
}
