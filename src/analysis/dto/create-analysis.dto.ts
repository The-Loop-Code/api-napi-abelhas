import { z } from 'zod';

export const createAnalysisSchema = z.object({
  sampleId: z.string().min(1),
  type: z.string().min(1),
  parameters: z.record(z.string(), z.unknown()).optional(),
  analyst: z.string().optional(),
});

export type CreateAnalysisDto = z.infer<typeof createAnalysisSchema>;
