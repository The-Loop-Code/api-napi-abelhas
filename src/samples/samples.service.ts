import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSampleDto } from './dto/create-sample.dto';
import { UpdateSampleDto } from './dto/update-sample.dto';

@Injectable()
export class SamplesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSampleDto) {
    return this.prisma.amostra.create({
      data: dto,
      include: {
        produtor: true,
        pontoColeta: true,
        abelha: true,
        tipoAmostra: true,
      },
    });
  }

  async findAll() {
    return this.prisma.amostra.findMany({
      include: {
        produtor: true,
        pontoColeta: true,
        abelha: true,
        tipoAmostra: true,
      },
    });
  }

  async findOne(id: string) {
    const sample = await this.prisma.amostra.findUnique({
      where: { id },
      include: {
        produtor: true,
        pontoColeta: true,
        abelha: true,
        tipoAmostra: true,
        analises: true,
      },
    });
    if (!sample) {
      throw new NotFoundException(`Amostra with id ${id} not found`);
    }
    return sample;
  }

  async update(id: string, dto: UpdateSampleDto) {
    await this.findOne(id);
    return this.prisma.amostra.update({
      where: { id },
      data: dto,
      include: {
        produtor: true,
        pontoColeta: true,
        abelha: true,
        tipoAmostra: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.amostra.delete({ where: { id } });
  }
}
