import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import type { CreateAnalysisDto } from './dto/create-analysis.dto';
import type { UpdateAnalysisDto } from './dto/update-analysis.dto';

@Injectable()
export class AnalysisService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAnalysisDto) {
    return this.prisma.analysis.create({
      data: {
        ...dto,
        parameters: dto.parameters as Prisma.InputJsonValue,
      },
      include: { sample: true },
    });
  }

  async findAll() {
    return this.prisma.analysis.findMany({
      orderBy: { createdAt: 'desc' },
      include: { sample: true },
    });
  }

  async findBySample(sampleId: string) {
    return this.prisma.analysis.findMany({
      where: { sampleId },
      orderBy: { createdAt: 'desc' },
      include: { reports: true },
    });
  }

  async findOne(id: string) {
    const analysis = await this.prisma.analysis.findUnique({
      where: { id },
      include: { sample: true, reports: true },
    });
    if (!analysis) {
      throw new NotFoundException(`Analysis with id ${id} not found`);
    }
    return analysis;
  }

  async update(id: string, dto: UpdateAnalysisDto) {
    await this.findOne(id);
    return this.prisma.analysis.update({
      where: { id },
      data: {
        ...dto,
        parameters: dto.parameters as Prisma.InputJsonValue,
      },
      include: { sample: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.analysis.delete({ where: { id } });
  }
}
