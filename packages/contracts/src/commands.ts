import { z } from 'zod';

export const commandResolveRequestSchema = z.object({
  text: z.string().max(2000),
  patientId: z.string().uuid().optional(),
});

export const commandResolveResponseSchema = z.discriminatedUnion('status', [
  z.object({
    status: z.literal('resolved'),
    intent: z.string(),
    labelEs: z.string(),
    routePath: z.string(),
    slots: z.object({
      patientHint: z.string().optional(),
      medicationHint: z.string().optional(),
      studyHint: z.string().optional(),
    }),
  }),
  z.object({
    status: z.literal('needs_clarification'),
    message: z.string(),
    candidates: z.array(
      z.object({
        intent: z.string(),
        labelEs: z.string(),
      }),
    ),
  }),
  z.object({
    status: z.literal('needs_patient'),
    message: z.string(),
    intent: z.string(),
    labelEs: z.string(),
  }),
  z.object({
    status: z.literal('forbidden'),
    message: z.string(),
    permission: z.string(),
  }),
  z.object({
    status: z.literal('empty'),
    message: z.string(),
  }),
]);

export type CommandResolveRequest = z.infer<typeof commandResolveRequestSchema>;
export type CommandResolveResponse = z.infer<typeof commandResolveResponseSchema>;

export const commandSuggestRequestSchema = z.object({
  text: z.string().max(2000),
});

export const commandSuggestResponseSchema = z.object({
  readOnly: z.literal(true),
  suggestions: z.array(
    z.object({
      intent: z.string(),
      labelEs: z.string(),
      score: z.number(),
      sampleEs: z.string().optional(),
    }),
  ),
});

export type CommandSuggestRequest = z.infer<typeof commandSuggestRequestSchema>;
export type CommandSuggestResponse = z.infer<typeof commandSuggestResponseSchema>;
