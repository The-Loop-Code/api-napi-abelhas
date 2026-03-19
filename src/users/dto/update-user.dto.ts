import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.enum(['ADMIN', 'TECHNICIAN', 'RESEARCHER']).optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
