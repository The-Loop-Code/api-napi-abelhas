import { z } from 'zod';

export const updateResponsavelSchema = z.object({
  nome: z.string().min(1).optional(),
  instituicaoId: z.string().min(1).optional(),
  cidadeId: z.string().optional(),
});

export type UpdateResponsavelDto = z.infer<typeof updateResponsavelSchema>;
