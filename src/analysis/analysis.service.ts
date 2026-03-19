import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateAnalysisDto } from './dto/create-analysis.dto';
import type { UpdateAnalysisDto } from './dto/update-analysis.dto';

@Injectable()
export class AnalysisService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAnalysisDto) {
    return this.prisma.analise.create({
      data: dto,
      include: { amostra: true, tipoAnalise: true, responsavel: true },
    });
  }

  async findAll() {
    return this.prisma.analise.findMany({
      include: { amostra: true, tipoAnalise: true, responsavel: true },
    });
  }

  async findByAmostra(amostraId: string) {
    return this.prisma.analise.findMany({
      where: { amostraId },
      include: { tipoAnalise: true, responsavel: true },
    });
  }

  async findOne(id: string) {
    const analysis = await this.prisma.analise.findUnique({
      where: { id },
      include: { amostra: true, tipoAnalise: true, responsavel: true, fileGroup: true },
    });
    if (!analysis) {
      throw new NotFoundException(`Analise with id ${id} not found`);
    }
    return analysis;
  }

  async update(id: string, dto: UpdateAnalysisDto) {
    await this.findOne(id);
    return this.prisma.analise.update({
      where: { id },
      data: dto,
      include: { amostra: true, tipoAnalise: true, responsavel: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.analise.delete({ where: { id } });
  }
}
