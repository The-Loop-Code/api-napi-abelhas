import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTipoAnaliseDto } from './dto/create-tipo-analise.dto';
import { UpdateTipoAnaliseDto } from './dto/update-tipo-analise.dto';

@Injectable()
export class TiposAnaliseService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTipoAnaliseDto) {
    return this.prisma.tipoAnalise.create({ data: dto });
  }

  async findAll() {
    return this.prisma.tipoAnalise.findMany();
  }

  async findOne(id: string) {
    const tipoAnalise = await this.prisma.tipoAnalise.findUnique({
      where: { id },
    });
    if (!tipoAnalise) {
      throw new NotFoundException(`TipoAnalise with id ${id} not found`);
    }
    return tipoAnalise;
  }

  async update(id: string, dto: UpdateTipoAnaliseDto) {
    await this.findOne(id);
    return this.prisma.tipoAnalise.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.tipoAnalise.delete({ where: { id } });
  }
}
