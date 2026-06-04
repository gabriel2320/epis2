import { z } from 'zod';

export const aiStatusResponseSchema = z.object({
  available: z.boolean(),
  ollama: z.enum(['up', 'down', 'unknown']),
  localAi: z.enum(['up', 'down']),
  message: z.string(),
});

export const aiAssistDraftRequestSchema = z.object({
  blueprintId: z.string().min(1),
  patientId: z.string().uuid().optional(),
  context: z.record(z.string()).optional(),
  currentFields: z.record(z.string()).optional(),
});

export const aiAssistDraftResponseSchema = z.discriminatedUnion('status', [
  z.object({
    status: z.literal('success'),
    suggestedFields: z.record(z.string()),
    safetyNotes: z.array(z.string()),
    requiresHumanReview: z.literal(true),
    runId: z.string().uuid().optional(),
    model: z.string().optional(),
    latencyMs: z.number().int().nonnegative().optional(),
  }),
  z.object({
    status: z.literal('unavailable'),
    message: z.string(),
    requiresHumanReview: z.literal(true),
  }),
  z.object({
    status: z.literal('rejected'),
    message: z.string(),
    requiresHumanReview: z.literal(true),
    runId: z.string().uuid().optional(),
  }),
]);

export type AiStatusResponse = z.infer<typeof aiStatusResponseSchema>;
export type AiAssistDraftRequest = z.infer<typeof aiAssistDraftRequestSchema>;
export type AiAssistDraftResponse = z.infer<typeof aiAssistDraftResponseSchema>;

/** Payload interno validado en local-ai antes de devolver sugerencias. */
export const localAiDraftAssistOutputSchema = z.object({
  suggestedFields: z.record(z.string()),
  safetyNotes: z.array(z.string()).max(8).default([]),
  requiresHumanReview: z.literal(true),
});

export type LocalAiDraftAssistOutput = z.infer<typeof localAiDraftAssistOutputSchema>;
