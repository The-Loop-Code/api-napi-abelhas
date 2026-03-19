import { z } from 'zod';

export const updateSampleSchema = z.object({
  status: z
    .enum(['RECEIVED', 'IN_ANALYSIS', 'COMPLETED', 'REJECTED'])
    .optional(),
  storageLocation: z.string().optional(),
  notes: z.string().optional(),
  apiaryId: z.string().optional(),
});

export type UpdateSampleDto = z.infer<typeof updateSampleSchema>;
