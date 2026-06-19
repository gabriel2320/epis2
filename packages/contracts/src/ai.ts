import { z } from 'zod';
import { aiDocumentCitationsSchema } from './rag.js';

const inferenceProviderIdSchema = z.enum(['ollama', 'openai']);
const inferenceModeSchema = z.enum(['ollama', 'openai', 'router']);
const inferenceDataTierSchema = z.enum(['L0_synthetic', 'L1_deidentified', 'L2_phi']);

export const aiStatusResponseSchema = z.object({
  available: z.boolean(),
  ollama: z.enum(['up', 'down', 'unknown']),
  localAi: z.enum(['up', 'down']),
  message: z.string(),
  /** ADR-005 — enriquecimiento opcional sin romper clientes existentes */
  inferenceMode: inferenceModeSchema.optional(),
  cloud: z
    .object({
      openai: z.enum(['up', 'down', 'disabled']),
    })
    .optional(),
  activeProvider: inferenceProviderIdSchema.optional(),
});

export const aiAssistDraftRequestSchema = z.object({
  blueprintId: z.string().min(1),
  patientId: z.string().uuid().optional(),
  dataTier: inferenceDataTierSchema.optional(),
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
    provider: inferenceProviderIdSchema.optional(),
    dataTier: inferenceDataTierSchema.optional(),
    documentCitations: aiDocumentCitationsSchema.optional(),
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

export const aiAssistCommandRouteCatalogEntrySchema = z.object({
  intent: z.string().min(1),
  labelEs: z.string().min(1),
  description: z.string().min(1),
});

export const aiAssistCommandRouteDeterministicSchema = z.object({
  intent: z.string().min(1),
  score: z.number(),
});

export const aiAssistCommandRouteRequestSchema = z.object({
  text: z.string().min(1).max(2000),
  role: z.string().min(1),
  hasPatient: z.boolean(),
  allowedIntents: z.array(aiAssistCommandRouteCatalogEntrySchema).min(1).max(40),
  deterministicCandidates: z.array(aiAssistCommandRouteDeterministicSchema).max(5).optional(),
});

/** Payload interno validado en local-ai antes de devolver hint de ruta. */
export const localAiCommandRouteOutputSchema = z.object({
  intent: z.string().optional(),
  confidence: z.number().min(0).max(1),
  missingContext: z
    .array(z.enum(['patient', 'encounter', 'draft']))
    .max(3)
    .default([]),
  reason: z.string().max(240),
  suggestedCandidates: z.array(z.string()).max(4).default([]),
});

export const aiAssistCommandRouteResponseSchema = z.discriminatedUnion('status', [
  z.object({
    status: z.literal('success'),
    hint: localAiCommandRouteOutputSchema,
    model: z.string(),
    latencyMs: z.number().int().nonnegative(),
    promptHash: z.string(),
  }),
  z.object({
    status: z.literal('unavailable'),
    message: z.string(),
  }),
  z.object({
    status: z.literal('rejected'),
    message: z.string(),
    promptHash: z.string().optional(),
    model: z.string().optional(),
    latencyMs: z.number().int().nonnegative().optional(),
  }),
]);

export type AiAssistCommandRouteRequest = z.infer<typeof aiAssistCommandRouteRequestSchema>;
export type AiAssistCommandRouteResponse = z.infer<typeof aiAssistCommandRouteResponseSchema>;
export type LocalAiCommandRouteOutput = z.infer<typeof localAiCommandRouteOutputSchema>;

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

export const clinicalTextSpellcheckRequestSchema = z.object({
  text: z.string().max(8000),
});

export const clinicalTextSpellcheckIssueSchema = z.object({
  token: z.string(),
  suggestions: z.array(z.string()),
});

export const clinicalTextSpellcheckResponseSchema = z.object({
  issues: z.array(clinicalTextSpellcheckIssueSchema),
});

export const aiTextboxAssistRequestSchema = z.object({
  action: z.enum(['reformulate', 'soap', 'omissions']),
  text: z.string().min(1).max(8000),
  patientId: z.string().uuid().optional(),
});

export const localAiTextboxAssistOutputSchema = z.object({
  resultText: z.string(),
  requiresHumanReview: z.literal(true),
});

export const aiTextboxAssistResponseSchema = z.discriminatedUnion('status', [
  z.object({
    status: z.literal('success'),
    resultText: z.string(),
    requiresHumanReview: z.literal(true),
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
  }),
]);

export type ClinicalTextSpellcheckRequest = z.infer<typeof clinicalTextSpellcheckRequestSchema>;
export type ClinicalTextSpellcheckResponse = z.infer<typeof clinicalTextSpellcheckResponseSchema>;
export type AiTextboxAssistRequest = z.infer<typeof aiTextboxAssistRequestSchema>;
export type AiTextboxAssistResponse = z.infer<typeof aiTextboxAssistResponseSchema>;
export type LocalAiTextboxAssistOutput = z.infer<typeof localAiTextboxAssistOutputSchema>;
