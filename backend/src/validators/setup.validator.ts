import { z } from 'zod';

export const createOrganizationSchema = z.object({
  body: z.object({
    organizationName: z.string()
      .min(2, 'Le nom de l\'organisation doit contenir au moins 2 caractères')
      .max(100, 'Le nom de l\'organisation ne peut pas dépasser 100 caractères'),

    adminUsername: z.string()
      .min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères')
      .max(50, 'Le nom d\'utilisateur ne peut pas dépasser 50 caractères')
      .regex(/^[a-zA-Z0-9_]+$/, 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores'),

    adminPassword: z.string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const resetAdminPasswordSchema = z.object({
  body: z.object({
    newPassword: z.string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  }),
  query: z.object({}).optional(),
  params: z.object({
    adminId: z.string().uuid('ID admin invalide'),
  }),
});