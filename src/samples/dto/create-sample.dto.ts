import { z } from 'zod';

export const createSampleSchema = z.object({
  nome: z.string().min(1),
  dataColeta: z.string().transform((val) => new Date(val)),
  pontoColetaId: z.string().min(1),
  abelhaId: z.string().min(1),
  produtorId: z.string().min(1),
  tipoAmostraId: z.string().min(1),
});

export type CreateSampleDto = z.infer<typeof createSampleSchema>;
