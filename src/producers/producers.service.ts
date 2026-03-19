import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';

@Injectable()
export class ProducersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProducerDto) {
    return this.prisma.produtor.create({ data: dto });
  }

  async findAll() {
    return this.prisma.produtor.findMany({
      include: { cidade: true },
    });
  }

  async findOne(id: string) {
    const producer = await this.prisma.produtor.findUnique({
      where: { id },
      include: { cidade: true, amostras: true },
    });
    if (!producer) {
      throw new NotFoundException(`Produtor with id ${id} not found`);
    }
    return producer;
  }

  async update(id: string, dto: UpdateProducerDto) {
    await this.findOne(id);
    return this.prisma.produtor.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.produtor.delete({ where: { id } });
  }
}
