import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTipoAmostraDto } from './dto/create-tipo-amostra.dto';
import { UpdateTipoAmostraDto } from './dto/update-tipo-amostra.dto';

@Injectable()
export class TiposAmostraService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTipoAmostraDto) {
    return this.prisma.tipoAmostra.create({ data: dto });
  }

  async findAll() {
    return this.prisma.tipoAmostra.findMany();
  }

  async findOne(id: string) {
    const tipoAmostra = await this.prisma.tipoAmostra.findUnique({
      where: { id },
    });
    if (!tipoAmostra) {
      throw new NotFoundException(`TipoAmostra with id ${id} not found`);
    }
    return tipoAmostra;
  }

  async update(id: string, dto: UpdateTipoAmostraDto) {
    await this.findOne(id);
    return this.prisma.tipoAmostra.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.tipoAmostra.delete({ where: { id } });
  }
}
