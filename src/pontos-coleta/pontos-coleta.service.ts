import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePontoColetaDto } from './dto/create-ponto-coleta.dto';
import { UpdatePontoColetaDto } from './dto/update-ponto-coleta.dto';

@Injectable()
export class PontosColetaService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePontoColetaDto) {
    return this.prisma.pontoColeta.create({
      data: dto,
      include: { cidade: true },
    });
  }

  async findAll() {
    return this.prisma.pontoColeta.findMany({
      include: { cidade: true },
    });
  }

  async findOne(id: string) {
    const ponto = await this.prisma.pontoColeta.findUnique({
      where: { id },
      include: { cidade: true, amostras: true },
    });
    if (!ponto) {
      throw new NotFoundException(`PontoColeta with id ${id} not found`);
    }
    return ponto;
  }

  async update(id: string, dto: UpdatePontoColetaDto) {
    await this.findOne(id);
    return this.prisma.pontoColeta.update({
      where: { id },
      data: dto,
      include: { cidade: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.pontoColeta.delete({ where: { id } });
  }
}
