import { z } from 'zod';

export const createProducerSchema = z.object({
  name: z.string().min(1),
  document: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  type: z.enum(['APICULTOR', 'MELIPONICULTOR']),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(2),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  radius: z.number().optional(),
});

export type CreateProducerDto = z.infer<typeof createProducerSchema>;
