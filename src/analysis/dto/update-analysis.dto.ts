import { z } from 'zod';

export const updateAnalysisSchema = z.object({
  type: z.string().min(1).optional(),
  parameters: z.record(z.string(), z.unknown()).optional(),
  result: z.string().optional(),
  conclusion: z.string().optional(),
  analyst: z.string().optional(),
  startedAt: z.string().transform((val) => new Date(val)).optional(),
  completedAt: z.string().transform((val) => new Date(val)).optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
});

export type UpdateAnalysisDto = z.infer<typeof updateAnalysisSchema>;
