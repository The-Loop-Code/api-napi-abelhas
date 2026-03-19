import { z } from 'zod';

export const updateProducerSchema = z.object({
  name: z.string().min(1).optional(),
  document: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(1).optional(),
  type: z.enum(['APICULTOR', 'MELIPONICULTOR']).optional(),
  address: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  state: z.string().min(2).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  radius: z.number().optional(),
});

export type UpdateProducerDto = z.infer<typeof updateProducerSchema>;
