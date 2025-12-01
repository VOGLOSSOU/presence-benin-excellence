import { z } from 'zod';

export const createOrganizationSchema = z.object({
  organizationName: z.string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(100, 'Organization name must be less than 100 characters'),
  adminUsername: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  adminPassword: z.string()
    .min(6, 'Password must be at least 6 characters'),
  adminEmail: z.string()
    .email('Invalid email format')
    .optional(),
});