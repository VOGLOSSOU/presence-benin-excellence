import { z } from 'zod';
import { UserTitle } from '@prisma/client';

/**
 * Schema pour l'enrôlement d'un visiteur
 */
export const enrollmentSchema = z.object({
  body: z.object({
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    title: z.nativeEnum(UserTitle, {
      errorMap: () => ({ message: 'Invalid title' }),
    }),
    institution: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Invalid email format').optional(),
    formTemplateId: z.string().uuid('Invalid form ID'),
    fieldValues: z.array(
      z.object({
        fieldTemplateId: z.string().uuid('Invalid field ID'),
        value: z.string(), // Permettre les chaînes vides pour les champs optionnels
      })
    ),
  }),
});

/**
 * Schema pour mettre à jour un utilisateur
 */
export const updateUserSchema = z.object({
  body: z.object({
    lastName: z.string().min(2).optional(),
    firstName: z.string().min(2).optional(),
    title: z.nativeEnum(UserTitle).optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    status: z.enum(['ACTIF', 'INACTIF']).optional(),
  }),
});

export type EnrollmentInput = z.infer<typeof enrollmentSchema>['body'];
export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];