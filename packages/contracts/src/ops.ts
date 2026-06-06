import { z } from 'zod';

export const auditEventRowSchema = z.object({
  id: z.string().uuid(),
  eventType: z.string(),
  at: z.string(),
  actorId: z.string().nullable().optional(),
  username: z.string().nullable().optional(),
  entityType: z.string().nullable().optional(),
  entityId: z.string().nullable().optional(),
  message: z.string().nullable().optional(),
});

export const auditEventsResponseSchema = z.object({
  readOnly: z.literal(true),
  events: z.array(auditEventRowSchema),
});

export const opsStatusResponseSchema = z.object({
  readOnly: z.literal(true),
  schemaVersion: z.string().optional(),
  counts: z.object({
    patients: z.number().int().nonnegative(),
    openDrafts: z.number().int().nonnegative(),
    approvedNotes: z.number().int().nonnegative(),
    auditEvents24h: z.number().int().nonnegative(),
  }),
  fhir: z.object({
    exportEnabled: z.boolean(),
    importEnabled: z.boolean(),
  }),
  hardening: z
    .object({
      rlsMode: z.enum(['off', 'enforce']),
      rlsProtectedTables: z.array(z.string()),
      rateLimitLogin: z.boolean(),
      rateLimitAi: z.boolean(),
      rateLimitCommands: z.boolean(),
      promptCatalogVersion: z.string().optional(),
      backupCommand: z.string(),
      authMode: z.enum(['demo', 'hybrid']).optional(),
      rlsTransactions: z.boolean().optional(),
    })
    .optional(),
});

export const stagingBatchRowSchema = z.object({
  id: z.string().uuid(),
  sourceSystem: z.string(),
  batchLabel: z.string(),
  status: z.string(),
  recordCount: z.number().int(),
  stagedAt: z.string(),
  notes: z.string().optional(),
});

export const interopStagingResponseSchema = z.object({
  readOnly: z.literal(true),
  batches: z.array(stagingBatchRowSchema),
});

export const hl7ValidateResponseSchema = z.object({
  readOnly: z.literal(true),
  valid: z.boolean(),
  messageType: z.string().optional(),
  errors: z.array(z.string()),
});

export const hl7QuarantineRowSchema = z.object({
  id: z.string().uuid(),
  messageType: z.string().optional(),
  status: z.string(),
  stagedAt: z.string(),
  proposedDraftId: z.string().uuid().optional(),
  hasMapping: z.boolean().optional(),
});

export const hl7QuarantineListResponseSchema = z.object({
  readOnly: z.literal(true),
  messages: z.array(hl7QuarantineRowSchema),
});

export const hl7QuarantineIntakeResponseSchema = z.object({
  readOnly: z.literal(true),
  quarantineId: z.string().uuid(),
  messageType: z.string().optional(),
  status: z.literal('quarantine'),
});

export const hl7MappingPreviewSchema = z.object({
  readOnly: z.literal(true),
  messageType: z.string(),
  patientHint: z.string().optional(),
  suggestedDraftType: z.enum(['lab_request', 'evolution_note', 'admission_note']).optional(),
  fields: z.record(z.string()),
  warnings: z.array(z.string()),
});

export const hl7WritebackProposalResponseSchema = z.object({
  readOnly: z.literal(true),
  requiresHumanApproval: z.literal(true),
  quarantineId: z.string().uuid(),
  draft: z.object({
    id: z.string().uuid(),
    draftType: z.string(),
    status: z.string(),
    title: z.string(),
  }),
  preview: hl7MappingPreviewSchema.omit({ readOnly: true }),
});

export const hl7RevertResponseSchema = z.object({
  readOnly: z.literal(true),
  quarantineId: z.string().uuid(),
  reverted: z.literal(true),
});

export const qualityDashboardResponseSchema = z.object({
  readOnly: z.literal(true),
  recentAudit: z.array(auditEventRowSchema),
  stagingBatches: z.array(stagingBatchRowSchema),
  metrics: z.object({
    openDrafts: z.number().int(),
    approvedNotes: z.number().int(),
    aiRuns: z.number().int(),
    criticalUnacked: z.number().int(),
  }),
  ops: opsStatusResponseSchema.omit({ readOnly: true }),
});

export type AuditEventsResponse = z.infer<typeof auditEventsResponseSchema>;
export type OpsStatusResponse = z.infer<typeof opsStatusResponseSchema>;
export type InteropStagingResponse = z.infer<typeof interopStagingResponseSchema>;
export type Hl7ValidateResponse = z.infer<typeof hl7ValidateResponseSchema>;
export type Hl7QuarantineListResponse = z.infer<typeof hl7QuarantineListResponseSchema>;
export type Hl7QuarantineIntakeResponse = z.infer<typeof hl7QuarantineIntakeResponseSchema>;
export type Hl7MappingPreviewResponse = z.infer<typeof hl7MappingPreviewSchema>;
export type Hl7WritebackProposalResponse = z.infer<typeof hl7WritebackProposalResponseSchema>;
export type Hl7RevertResponse = z.infer<typeof hl7RevertResponseSchema>;
export type QualityDashboardResponse = z.infer<typeof qualityDashboardResponseSchema>;
