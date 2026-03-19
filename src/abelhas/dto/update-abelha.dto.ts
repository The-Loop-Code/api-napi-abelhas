import { z } from 'zod';

export const updateAbelhaSchema = z.object({
  nomeCientifico: z.string().min(1).optional(),
  nomePopular: z.string().optional().nullable(),
  semFerrao: z.boolean().optional(),
  nativa: z.boolean().optional(),
  descricao: z.string().optional().nullable(),
});

export type UpdateAbelhaDto = z.infer<typeof updateAbelhaSchema>;
