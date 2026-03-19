import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SamplesService } from './samples.service';
import { PrismaService } from '../prisma/prisma.service';
import { BeeType, SampleStatus, SampleType } from '@prisma/client';

const mockSample = {
  id: 'test-uuid-1234',
  registrationCode: 'NAPI-2024-ABC123',
  beeType: BeeType.APIS_MELLIFERA,
  sampleType: SampleType.MEL,
  status: SampleStatus.RECEIVED,
  collectionDate: new Date(),
  receivedAt: new Date(),
  producerId: 'producer-id',
  apiaryId: null,
  storageLocation: null,
  notes: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  producer: { id: 'producer-id', name: 'Test Producer' },
  apiary: null,
};

const mockPrismaService = {
  sample: {
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

  describe('generateRegistrationCode (via create)', () => {
    it('should generate a code matching NAPI-YYYY-XXXXXX format', async () => {
      mockPrismaService.sample.findUnique.mockResolvedValueOnce(null);
      mockPrismaService.sample.create.mockResolvedValueOnce(mockSample);

      const dto = {
        beeType: BeeType.APIS_MELLIFERA,
        sampleType: SampleType.MEL,
        collectionDate: new Date(),
        producerId: 'producer-id',
      };

      await service.create(dto);

      const createCalls = mockPrismaService.sample.create.mock.calls as Array<
        Array<{ data: { registrationCode: string } }>
      >;
      const registrationCode = createCalls[0][0].data.registrationCode;
      expect(registrationCode).toMatch(/^NAPI-\d{4}-[A-Z0-9]{6}$/);
    });

    it('should retry if registration code already exists', async () => {
      mockPrismaService.sample.findUnique
        .mockResolvedValueOnce({ id: 'existing' })
        .mockResolvedValueOnce(null);
      mockPrismaService.sample.create.mockResolvedValueOnce(mockSample);

      const dto = {
        beeType: BeeType.APIS_MELLIFERA,
        sampleType: SampleType.MEL,
        collectionDate: new Date(),
        producerId: 'producer-id',
      };

      await service.create(dto);

      expect(mockPrismaService.sample.findUnique).toHaveBeenCalledTimes(2);
    });
  });

  describe('findAll', () => {
    it('should return all samples ordered by receivedAt desc', async () => {
      mockPrismaService.sample.findMany.mockResolvedValueOnce([mockSample]);

      const result = await service.findAll();

      expect(result).toEqual([mockSample]);
      expect(mockPrismaService.sample.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { receivedAt: 'desc' },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a sample by id', async () => {
      mockPrismaService.sample.findUnique.mockResolvedValueOnce({
        ...mockSample,
        analyses: [],
      });

      const result = await service.findOne('test-uuid-1234');
      expect(result.id).toBe('test-uuid-1234');
    });

    it('should throw NotFoundException when sample not found', async () => {
      mockPrismaService.sample.findUnique.mockResolvedValueOnce(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a sample', async () => {
      const updated = { ...mockSample, status: SampleStatus.IN_ANALYSIS };
      mockPrismaService.sample.findUnique
        .mockResolvedValueOnce({ ...mockSample, analyses: [] })
        .mockResolvedValueOnce({ ...mockSample, analyses: [] });
      mockPrismaService.sample.update.mockResolvedValueOnce(updated);

      const result = await service.update('test-uuid-1234', {
        status: SampleStatus.IN_ANALYSIS,
      });
      expect(result.status).toBe(SampleStatus.IN_ANALYSIS);
    });
  });

  describe('remove', () => {
    it('should delete a sample', async () => {
      mockPrismaService.sample.findUnique.mockResolvedValueOnce({
        ...mockSample,
        analyses: [],
      });
      mockPrismaService.sample.delete.mockResolvedValueOnce(mockSample);

      const result = await service.remove('test-uuid-1234');
      expect(result).toEqual(mockSample);
    });

    it('should throw NotFoundException when trying to delete non-existent sample', async () => {
      mockPrismaService.sample.findUnique.mockResolvedValueOnce(null);

      await expect(service.remove('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
