import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProducersService } from './producers.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProducerType } from '@prisma/client';

const mockProducer = {
  id: 'producer-id-1',
  name: 'João da Silva',
  document: '123.456.789-00',
  email: 'joao@example.com',
  phone: '(11) 99999-9999',
  type: ProducerType.APICULTOR,
  address: 'Rua das Flores, 123',
  city: 'São Paulo',
  state: 'SP',
  latitude: -23.5489,
  longitude: -46.6388,
  radius: 5.0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrismaService = {
  producer: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ProducersService', () => {
  let service: ProducersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProducersService>(ProducersService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a producer', async () => {
      mockPrismaService.producer.create.mockResolvedValueOnce(mockProducer);

      const dto = {
        name: 'João da Silva',
        document: '123.456.789-00',
        email: 'joao@example.com',
        phone: '(11) 99999-9999',
        type: ProducerType.APICULTOR,
        address: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        latitude: -23.5489,
        longitude: -46.6388,
        radius: 5.0,
      };

      const result = await service.create(dto);
      expect(result).toEqual(mockProducer);
      expect(mockPrismaService.producer.create).toHaveBeenCalledWith({
        data: dto,
      });
    });
  });

  describe('findAll', () => {
    it('should return all producers ordered by createdAt desc', async () => {
      mockPrismaService.producer.findMany.mockResolvedValueOnce([mockProducer]);

      const result = await service.findAll();
      expect(result).toEqual([mockProducer]);
      expect(mockPrismaService.producer.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { createdAt: 'desc' } }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a producer by id', async () => {
      const producerWithRelations = {
        ...mockProducer,
        samples: [],
        apiaries: [],
      };
      mockPrismaService.producer.findUnique.mockResolvedValueOnce(
        producerWithRelations,
      );

      const result = await service.findOne('producer-id-1');
      expect(result.id).toBe('producer-id-1');
    });

    it('should throw NotFoundException when producer not found', async () => {
      mockPrismaService.producer.findUnique.mockResolvedValueOnce(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a producer', async () => {
      const updated = { ...mockProducer, name: 'João Silva Updated' };
      mockPrismaService.producer.findUnique.mockResolvedValueOnce({
        ...mockProducer,
        samples: [],
        apiaries: [],
      });
      mockPrismaService.producer.update.mockResolvedValueOnce(updated);

      const result = await service.update('producer-id-1', {
        name: 'João Silva Updated',
      });
      expect(result.name).toBe('João Silva Updated');
    });
  });

  describe('remove', () => {
    it('should delete a producer', async () => {
      mockPrismaService.producer.findUnique.mockResolvedValueOnce({
        ...mockProducer,
        samples: [],
        apiaries: [],
      });
      mockPrismaService.producer.delete.mockResolvedValueOnce(mockProducer);

      const result = await service.remove('producer-id-1');
      expect(result).toEqual(mockProducer);
    });

    it('should throw NotFoundException when trying to delete non-existent producer', async () => {
      mockPrismaService.producer.findUnique.mockResolvedValueOnce(null);

      await expect(service.remove('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
