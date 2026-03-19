import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SamplesService } from './samples.service';
import { PrismaService } from '../prisma/prisma.service';

const mockSample = {
  id: 'test-uuid-1234',
  nome: 'Amostra Mel SP',
  dataColeta: new Date(),
  pontoColetaId: 'ponto-id',
  abelhaId: 'abelha-id',
  produtorId: 'produtor-id',
  tipoAmostraId: 'tipo-amostra-id',
  produtor: { id: 'produtor-id', nome: 'Test Producer' },
  pontoColeta: { id: 'ponto-id', nome: 'Ponto 1' },
  abelha: { id: 'abelha-id', nomeCientifico: 'Apis mellifera' },
  tipoAmostra: { id: 'tipo-amostra-id', nome: 'Mel' },
};

const mockPrismaService = {
  amostra: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('SamplesService', () => {
  let service: SamplesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SamplesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<SamplesService>(SamplesService);
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('should create a sample', async () => {
      mockPrismaService.amostra.create.mockResolvedValueOnce(mockSample);

      const dto = {
        nome: 'Amostra Mel SP',
        dataColeta: new Date(),
        pontoColetaId: 'ponto-id',
        abelhaId: 'abelha-id',
        produtorId: 'produtor-id',
        tipoAmostraId: 'tipo-amostra-id',
      };

      const result = await service.create(dto);
      expect(result).toEqual(mockSample);
      expect(mockPrismaService.amostra.create).toHaveBeenCalledWith({
        data: dto,
        include: {
          produtor: true,
          pontoColeta: true,
          abelha: true,
          tipoAmostra: true,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all samples with relations', async () => {
      mockPrismaService.amostra.findMany.mockResolvedValueOnce([mockSample]);

      const result = await service.findAll();

      expect(result).toEqual([mockSample]);
      expect(mockPrismaService.amostra.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: {
            produtor: true,
            pontoColeta: true,
            abelha: true,
            tipoAmostra: true,
          },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a sample by id', async () => {
      mockPrismaService.amostra.findUnique.mockResolvedValueOnce({
        ...mockSample,
        analises: [],
      });

      const result = await service.findOne('test-uuid-1234');
      expect(result.id).toBe('test-uuid-1234');
    });

    it('should throw NotFoundException when sample not found', async () => {
      mockPrismaService.amostra.findUnique.mockResolvedValueOnce(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a sample', async () => {
      const updated = { ...mockSample, nome: 'Amostra Updated' };
      mockPrismaService.amostra.findUnique.mockResolvedValueOnce({
        ...mockSample,
        analises: [],
      });
      mockPrismaService.amostra.update.mockResolvedValueOnce(updated);

      const result = await service.update('test-uuid-1234', {
        nome: 'Amostra Updated',
      });
      expect(result.nome).toBe('Amostra Updated');
    });
  });

  describe('remove', () => {
    it('should delete a sample', async () => {
      mockPrismaService.amostra.findUnique.mockResolvedValueOnce({
        ...mockSample,
        analises: [],
      });
      mockPrismaService.amostra.delete.mockResolvedValueOnce(mockSample);

      const result = await service.remove('test-uuid-1234');
      expect(result).toEqual(mockSample);
    });

    it('should throw NotFoundException when trying to delete non-existent sample', async () => {
      mockPrismaService.amostra.findUnique.mockResolvedValueOnce(null);

      await expect(service.remove('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
