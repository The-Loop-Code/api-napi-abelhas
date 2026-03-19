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
import { ProducersService } from './producers.service';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { createProducerSchema } from './dto/create-producer.dto';
import type { CreateProducerDto } from './dto/create-producer.dto';
import { updateProducerSchema } from './dto/update-producer.dto';
import type { UpdateProducerDto } from './dto/update-producer.dto';

@Controller('producers')
@UseGuards(ClerkAuthGuard)
export class ProducersController {
  constructor(private readonly producersService: ProducersService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createProducerSchema)) dto: CreateProducerDto,
  ) {
    return this.producersService.create(dto);
  }

  @Get()
  findAll() {
    return this.producersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.producersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateProducerSchema)) dto: UpdateProducerDto,
  ) {
    return this.producersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.producersService.remove(id);
  }
}
