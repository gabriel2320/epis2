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

export const aiRunRowSchema = z.object({
  id: z.string().uuid(),
  blueprintId: z.string(),
  patientId: z.string().uuid().nullable().optional(),
  model: z.string(),
  status: z.string(),
  latencyMs: z.number().int(),
  createdAt: z.string(),
  errorMessage: z.string().nullable().optional(),
});

export const aiRunsListResponseSchema = z.object({
  readOnly: z.literal(true),
  runs: z.array(aiRunRowSchema),
});

export const ragCitationSchema = z.object({
  documentId: z.string().uuid(),
  title: z.string(),
  excerpt: z.string(),
  storageRef: z.string().optional(),
});

export const ragQueryRequestSchema = z.object({
  patientId: z.string().uuid(),
  question: z.string().min(2).max(500),
});

export const ragQueryResponseSchema = z.object({
  readOnly: z.literal(true),
  requiresHumanReview: z.literal(true),
  mode: z.enum(['retrieval', 'synthesis']),
  question: z.string(),
  answer: z.string(),
  citations: z.array(ragCitationSchema),
  runId: z.string().uuid().optional(),
  aiAvailable: z.boolean(),
});

export const aiSummarySuggestRequestSchema = z.object({
  patientId: z.string().uuid(),
});

export const aiSummarySuggestResponseSchema = z.object({
  readOnly: z.literal(true),
  requiresHumanReview: z.literal(true),
  summaryText: z.string(),
  source: z.enum(['longitudinal_retrieval', 'ollama_synthesis']),
  eventCount: z.number().int().nonnegative(),
  runId: z.string().uuid().optional(),
  aiAvailable: z.boolean(),
});

export type AiRunRow = z.infer<typeof aiRunRowSchema>;
export type AiRunsListResponse = z.infer<typeof aiRunsListResponseSchema>;
export type RagQueryRequest = z.infer<typeof ragQueryRequestSchema>;
export type RagQueryResponse = z.infer<typeof ragQueryResponseSchema>;
export type AiSummarySuggestRequest = z.infer<typeof aiSummarySuggestRequestSchema>;
export type AiSummarySuggestResponse = z.infer<typeof aiSummarySuggestResponseSchema>;
