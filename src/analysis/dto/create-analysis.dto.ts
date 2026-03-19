import { z } from 'zod';

export const createAnalysisSchema = z.object({
  amostraId: z.string().min(1),
  tipoAnaliseId: z.string().min(1),
  responsavelId: z.string().min(1),
});

export type CreateAnalysisDto = z.infer<typeof createAnalysisSchema>;
