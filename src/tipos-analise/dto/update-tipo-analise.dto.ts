import { z } from 'zod';

export const updateTipoAnaliseSchema = z.object({
  nome: z.string().min(1).optional(),
});

export type UpdateTipoAnaliseDto = z.infer<typeof updateTipoAnaliseSchema>;
