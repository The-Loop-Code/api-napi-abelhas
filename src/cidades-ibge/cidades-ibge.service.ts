import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCidadeIbgeDto } from './dto/create-cidade-ibge.dto';
import { UpdateCidadeIbgeDto } from './dto/update-cidade-ibge.dto';

@Injectable()
export class CidadesIbgeService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCidadeIbgeDto) {
    return this.prisma.cidadesIBGE.create({ data: dto });
  }

  async findAll() {
    return this.prisma.cidadesIBGE.findMany();
  }

  async findOne(id: string) {
    const cidade = await this.prisma.cidadesIBGE.findUnique({
      where: { id },
      include: { produtores: true, responsaveis: true, pontosDeColeta: true },
    });
    if (!cidade) {
      throw new NotFoundException(`CidadesIBGE with id ${id} not found`);
    }
    return cidade;
  }

  async update(id: string, dto: UpdateCidadeIbgeDto) {
    await this.findOne(id);
    return this.prisma.cidadesIBGE.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.cidadesIBGE.delete({ where: { id } });
  }
}
