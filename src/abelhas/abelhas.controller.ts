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
import { AbelhasService } from './abelhas.service';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { createAbelhaSchema } from './dto/create-abelha.dto';
import type { CreateAbelhaDto } from './dto/create-abelha.dto';
import { updateAbelhaSchema } from './dto/update-abelha.dto';
import type { UpdateAbelhaDto } from './dto/update-abelha.dto';

@Controller('abelhas')
@UseGuards(ClerkAuthGuard)
export class AbelhasController {
  constructor(private readonly abelhasService: AbelhasService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createAbelhaSchema)) dto: CreateAbelhaDto,
  ) {
    return this.abelhasService.create(dto);
  }

  @Get()
  findAll() {
    return this.abelhasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.abelhasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateAbelhaSchema)) dto: UpdateAbelhaDto,
  ) {
    return this.abelhasService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.abelhasService.remove(id);
  }
}
