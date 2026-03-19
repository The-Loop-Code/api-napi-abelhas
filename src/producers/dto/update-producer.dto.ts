import { z } from 'zod';

export const updateProducerSchema = z.object({
  nome: z.string().min(1).optional(),
  cidadeId: z.string().optional(),
});

export type UpdateProducerDto = z.infer<typeof updateProducerSchema>;
