import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAbelhaDto } from './dto/create-abelha.dto';
import { UpdateAbelhaDto } from './dto/update-abelha.dto';

@Injectable()
export class AbelhasService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAbelhaDto) {
    return this.prisma.abelha.create({ data: dto });
  }

  async findAll() {
    return this.prisma.abelha.findMany();
  }

  async findOne(id: string) {
    const abelha = await this.prisma.abelha.findUnique({
      where: { id },
    });
    if (!abelha) {
      throw new NotFoundException(`Abelha with id ${id} not found`);
    }
    return abelha;
  }

  async update(id: string, dto: UpdateAbelhaDto) {
    await this.findOne(id);
    return this.prisma.abelha.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.abelha.delete({ where: { id } });
  }
}
