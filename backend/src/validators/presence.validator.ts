import { z } from 'zod';

/**
 * Schema pour enregistrer une présence
 */
export const recordPresenceSchema = z.object({
  body: z.object({
    uuidCode: z.string().regex(/^BE-[A-Z0-9]{7}$/, 'Invalid UUID format (expected: BE-XXXXXXX)'),
    formTemplateId: z.string().uuid('Invalid form ID'),
  }),
});

export type RecordPresenceInput = z.infer<typeof recordPresenceSchema>['body'];