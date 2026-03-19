import { z } from 'zod';

export const createProducerSchema = z.object({
  nome: z.string().min(1),
  cidadeId: z.string().optional(),
});

export type CreateProducerDto = z.infer<typeof createProducerSchema>;
