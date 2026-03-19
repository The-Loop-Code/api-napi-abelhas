import { z } from 'zod';

export const updateAnalysisSchema = z.object({
  tipoAnaliseId: z.string().min(1).optional(),
  responsavelId: z.string().min(1).optional(),
});

export type UpdateAnalysisDto = z.infer<typeof updateAnalysisSchema>;
