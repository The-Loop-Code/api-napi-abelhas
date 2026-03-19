import { z } from 'zod';

export const updateTipoAmostraSchema = z.object({
  nome: z.string().min(1).optional(),
  descricao: z.string().optional().nullable(),
});

export type UpdateTipoAmostraDto = z.infer<typeof updateTipoAmostraSchema>;
