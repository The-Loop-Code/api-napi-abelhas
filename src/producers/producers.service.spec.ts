import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProducersService } from './producers.service';
import { PrismaService } from '../prisma/prisma.service';

const mockProducer = {
  id: 'producer-id-1',
  nome: 'João da Silva',
  cidadeId: 'cidade-id-1',
  cidade: {
    id: 'cidade-id-1',
    codigoIBGE: '3550308',
    cidade: 'São Paulo',
    estado: 'SP',
    regiao: 'SUDESTE',
    bioma: 'MATA_ATLANTICA',
  },
};

const mockPrismaService = {
  produtor: {
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
      mockPrismaService.produtor.create.mockResolvedValueOnce(mockProducer);

      const dto = {
        nome: 'João da Silva',
        cidadeId: 'cidade-id-1',
      };

      const result = await service.create(dto);
      expect(result).toEqual(mockProducer);
      expect(mockPrismaService.produtor.create).toHaveBeenCalledWith({
        data: dto,
      });
    });
  });

  describe('findAll', () => {
    it('should return all producers with cidade included', async () => {
      mockPrismaService.produtor.findMany.mockResolvedValueOnce([mockProducer]);

      const result = await service.findAll();
      expect(result).toEqual([mockProducer]);
      expect(mockPrismaService.produtor.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ include: { cidade: true } }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a producer by id', async () => {
      const producerWithRelations = {
        ...mockProducer,
        amostras: [],
      };
      mockPrismaService.produtor.findUnique.mockResolvedValueOnce(
        producerWithRelations,
      );

      const result = await service.findOne('producer-id-1');
      expect(result.id).toBe('producer-id-1');
    });

    it('should throw NotFoundException when producer not found', async () => {
      mockPrismaService.produtor.findUnique.mockResolvedValueOnce(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a producer', async () => {
      const updated = { ...mockProducer, nome: 'João Silva Updated' };
      mockPrismaService.produtor.findUnique.mockResolvedValueOnce({
        ...mockProducer,
        amostras: [],
      });
      mockPrismaService.produtor.update.mockResolvedValueOnce(updated);

      const result = await service.update('producer-id-1', {
        nome: 'João Silva Updated',
      });
      expect(result.nome).toBe('João Silva Updated');
    });
  });

  describe('remove', () => {
    it('should delete a producer', async () => {
      mockPrismaService.produtor.findUnique.mockResolvedValueOnce({
        ...mockProducer,
        amostras: [],
      });
      mockPrismaService.produtor.delete.mockResolvedValueOnce(mockProducer);

      const result = await service.remove('producer-id-1');
      expect(result).toEqual(mockProducer);
    });

    it('should throw NotFoundException when trying to delete non-existent producer', async () => {
      mockPrismaService.produtor.findUnique.mockResolvedValueOnce(null);

      await expect(service.remove('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
