import { z } from 'zod';

export const createSampleSchema = z.object({
  beeType: z.enum(['APIS_MELLIFERA', 'MELIPONINI', 'OTHER']),
  sampleType: z.enum(['MEL', 'POLEN', 'PROPOLIS', 'CERA']),
  collectionDate: z.string().transform((val) => new Date(val)),
  producerId: z.string().min(1),
  apiaryId: z.string().optional(),
  storageLocation: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateSampleDto = z.infer<typeof createSampleSchema>;
