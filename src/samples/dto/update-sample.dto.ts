import { z } from 'zod';

export const updateSampleSchema = z.object({
  nome: z.string().min(1).optional(),
  dataColeta: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
  pontoColetaId: z.string().min(1).optional(),
  abelhaId: z.string().min(1).optional(),
  produtorId: z.string().min(1).optional(),
  tipoAmostraId: z.string().min(1).optional(),
});

export type UpdateSampleDto = z.infer<typeof updateSampleSchema>;
