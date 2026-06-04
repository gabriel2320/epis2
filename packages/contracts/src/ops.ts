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
export type QualityDashboardResponse = z.infer<typeof qualityDashboardResponseSchema>;
