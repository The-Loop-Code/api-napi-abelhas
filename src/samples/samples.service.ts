import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSampleDto } from './dto/create-sample.dto';
import { UpdateSampleDto } from './dto/update-sample.dto';

@Injectable()
export class SamplesService {
  constructor(private prisma: PrismaService) {}

  private generateRegistrationCode(): string {
    const year = new Date().getFullYear();
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `NAPI-${year}-${code}`;
  }

  async create(dto: CreateSampleDto) {
    const MAX_RETRIES = 10;
    let registrationCode: string;
    let isUnique = false;
    let attempts = 0;

    do {
      if (attempts >= MAX_RETRIES) {
        throw new Error(
          `Failed to generate a unique registration code after ${MAX_RETRIES} retries. Please try again or contact support.`,
        );
      }
      registrationCode = this.generateRegistrationCode();
      const existing = await this.prisma.sample.findUnique({
        where: { registrationCode },
      });
      isUnique = !existing;
      attempts++;
    } while (!isUnique);

    return this.prisma.sample.create({
      data: {
        ...dto,
        registrationCode,
      },
      include: {
        producer: true,
        apiary: true,
      },
    });
  }

  async findAll() {
    return this.prisma.sample.findMany({
      orderBy: { receivedAt: 'desc' },
      include: {
        producer: true,
        apiary: true,
      },
    });
  }

  async findOne(id: string) {
    const sample = await this.prisma.sample.findUnique({
      where: { id },
      include: {
        producer: true,
        apiary: true,
        analyses: true,
      },
    });
    if (!sample) {
      throw new NotFoundException(`Sample with id ${id} not found`);
    }
    return sample;
  }

  async update(id: string, dto: UpdateSampleDto) {
    await this.findOne(id);
    return this.prisma.sample.update({
      where: { id },
      data: dto,
      include: {
        producer: true,
        apiary: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.sample.delete({ where: { id } });
  }
}
