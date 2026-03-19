import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';

@Injectable()
export class ProducersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProducerDto) {
    return this.prisma.producer.create({ data: dto });
  }

  async findAll() {
    return this.prisma.producer.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const producer = await this.prisma.producer.findUnique({
      where: { id },
      include: { samples: true, apiaries: true },
    });
    if (!producer) {
      throw new NotFoundException(`Producer with id ${id} not found`);
    }
    return producer;
  }

  async update(id: string, dto: UpdateProducerDto) {
    await this.findOne(id);
    return this.prisma.producer.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.producer.delete({ where: { id } });
  }
}
