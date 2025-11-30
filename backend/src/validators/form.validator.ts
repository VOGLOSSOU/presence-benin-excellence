import { z } from 'zod';
import { FormType, FieldType } from '@prisma/client';

/**
 * Schema pour créer un formulaire
 */
export const createFormSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    description: z.string().optional(),
    type: z.nativeEnum(FormType, {
      errorMap: () => ({ message: 'Type must be SIMPLE_PRESENCE or ARRIVAL_DEPARTURE' }),
    }),
    active: z.boolean().default(true),
  }),
});

/**
 * Schema pour mettre à jour un formulaire
 */
export const updateFormSchema = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    description: z.string().optional(),
    type: z.nativeEnum(FormType).optional(),
    active: z.boolean().optional(),
  }),
});

/**
 * Schema pour créer un champ de formulaire
 */
export const createFieldSchema = z.object({
  body: z.object({
    label: z.string().min(2, 'Label must be at least 2 characters'),
    fieldType: z.nativeEnum(FieldType, {
      errorMap: () => ({ message: 'Invalid field type' }),
    }),
    isRequired: z.boolean().default(false),
    options: z.array(z.string()).optional(), // Pour les selects
    order: z.number().int().min(0).default(0),
  }),
});

/**
 * Schema pour mettre à jour un champ
 */
export const updateFieldSchema = z.object({
  body: z.object({
    label: z.string().min(2).optional(),
    fieldType: z.nativeEnum(FieldType).optional(),
    isRequired: z.boolean().optional(),
    options: z.array(z.string()).optional(),
    order: z.number().int().min(0).optional(),
  }),
});

/**
 * Schema pour créer un intervalle arrivée/départ
 */
export const createIntervalSchema = z.object({
  body: z.object({
    startTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
    endTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
  }),
});

export type CreateFormInput = z.infer<typeof createFormSchema>['body'];
export type UpdateFormInput = z.infer<typeof updateFormSchema>['body'];
export type CreateFieldInput = z.infer<typeof createFieldSchema>['body'];
export type UpdateFieldInput = z.infer<typeof updateFieldSchema>['body'];
export type CreateIntervalInput = z.infer<typeof createIntervalSchema>['body'];