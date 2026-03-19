import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResponsavelDto } from './dto/create-responsavel.dto';
import { UpdateResponsavelDto } from './dto/update-responsavel.dto';

@Injectable()
export class ResponsaveisService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateResponsavelDto) {
    return this.prisma.responsavel.create({ data: dto });
  }

  async findAll() {
    return this.prisma.responsavel.findMany({
      include: { cidade: true },
    });
  }

  async findOne(id: string) {
    const responsavel = await this.prisma.responsavel.findUnique({
      where: { id },
      include: { cidade: true, analises: true },
    });
    if (!responsavel) {
      throw new NotFoundException(`Responsavel with id ${id} not found`);
    }
    return responsavel;
  }

  async update(id: string, dto: UpdateResponsavelDto) {
    await this.findOne(id);
    return this.prisma.responsavel.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.responsavel.delete({ where: { id } });
  }
}
