import { z } from 'zod';
import { AdminRole } from '@prisma/client';

/**
 * Schema de validation pour le login
 */
export const loginSchema = z.object({
  body: z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

/**
 * Schema de validation pour le register
 */
export const registerSchema = z.object({
  body: z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.nativeEnum(AdminRole, {
      errorMap: () => ({ message: 'Role must be SUPER_ADMIN or MANAGER' }),
    }),
  }),
});

export type LoginInput = z.infer<typeof loginSchema>['body'];
export type RegisterInput = z.infer<typeof registerSchema>['body'];