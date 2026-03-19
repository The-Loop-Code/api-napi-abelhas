import { z } from 'zod';

export const updatePontoColetaSchema = z.object({
  nome: z.string().min(1).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  raio: z.number().optional().nullable(),
  cidadeId: z.string().min(1).optional(),
});

export type UpdatePontoColetaDto = z.infer<typeof updatePontoColetaSchema>;
