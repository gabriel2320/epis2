import { z } from 'zod';

export const inpatientAdmissionCreateSchema = z.object({
  patientId: z.string().uuid(),
  bedId: z.string().uuid(),
  unitCode: z.string().optional(),
});

export const inpatientAdmissionCreateResponseSchema = z.object({
  admission: z.object({
    id: z.string().uuid(),
    patientId: z.string().uuid(),
    bedId: z.string().uuid(),
    bedLabel: z.string(),
    unitCode: z.string(),
    status: z.string(),
    expectedDischargeAt: z.string().optional(),
  }),
  requiresHumanReview: z.literal(true),
});

export const inpatientTransferSchema = z.object({
  targetBedId: z.string().uuid(),
});

export const inpatientTransferResponseSchema = z.object({
  admissionId: z.string().uuid(),
  patientId: z.string().uuid(),
  fromBedLabel: z.string().optional(),
  toBedLabel: z.string(),
  requiresHumanReview: z.literal(true),
});

export const inpatientDischargeResponseSchema = z.object({
  admissionId: z.string().uuid(),
  patientId: z.string().uuid(),
  dischargedAt: z.string(),
  epicrisisRoute: z.string(),
  requiresHumanReview: z.literal(true),
});

export const documentOcrResponseSchema = z.object({
  documentId: z.string().uuid(),
  patientId: z.string().uuid().optional(),
  ocrMode: z.enum(['extracted', 'synthetic']).optional(),
  chunkCount: z.number().int().nonnegative().optional(),
  skipped: z.boolean().optional(),
  reason: z.string().optional(),
  requiresHumanReview: z.literal(true).optional(),
});

export type InpatientAdmissionCreate = z.infer<typeof inpatientAdmissionCreateSchema>;
export type InpatientTransfer = z.infer<typeof inpatientTransferSchema>;
