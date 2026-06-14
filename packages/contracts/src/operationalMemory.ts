import { z } from 'zod';

export const operationalCatalogUsageSchema = z.object({
  medication: z.record(z.string(), z.number()).default({}),
  laboratory: z.record(z.string(), z.number()).default({}),
  diagnosis: z.record(z.string(), z.number()).default({}),
});

export const operationalRecentPatientSchema = z.object({
  id: z.string().uuid(),
  displayName: z.string().min(1),
  accessedAt: z.string().optional(),
  demoCaseCode: z.string().optional(),
});

export const operationalMemoryGlobalPayloadSchema = z.object({
  recentPatients: z.array(operationalRecentPatientSchema).default([]),
  favoriteBlueprintIds: z.array(z.string().min(1)).default([]),
  catalogUsage: operationalCatalogUsageSchema.default({
    medication: {},
    laboratory: {},
    diagnosis: {},
  }),
});

export const operationalMemoryPatientPayloadSchema = z.object({
  traditionalSection: z.string().min(1).optional(),
  chartMode: z.enum(['traditional', 'paper']).optional(),
});

export const operationalMemoryRowSchema = z.object({
  scope: z.string(),
  payload: z.record(z.unknown()),
  updatedAt: z.string(),
});

export const operationalMemoryResponseSchema = z.object({
  userId: z.string(),
  global: operationalMemoryGlobalPayloadSchema,
  patient: operationalMemoryPatientPayloadSchema.nullable(),
  updatedAt: z.string().nullable(),
});

export const bumpCatalogUsageRequestSchema = z.object({
  domain: z.enum(['medication', 'laboratory', 'diagnosis']),
  key: z.string().min(1),
});

export const patchOperationalMemoryRequestSchema = z.object({
  recentPatients: z.array(operationalRecentPatientSchema).optional(),
  favoriteBlueprintIds: z.array(z.string().min(1)).optional(),
  traditionalSection: z.string().min(1).optional(),
  chartMode: z.enum(['traditional', 'paper']).optional(),
  catalogUsage: operationalCatalogUsageSchema.optional(),
});

export type OperationalRecentPatient = z.infer<typeof operationalRecentPatientSchema>;
export type OperationalMemoryGlobalPayload = z.infer<typeof operationalMemoryGlobalPayloadSchema>;
export type OperationalMemoryPatientPayload = z.infer<typeof operationalMemoryPatientPayloadSchema>;
export type OperationalMemoryResponse = z.infer<typeof operationalMemoryResponseSchema>;
export type PatchOperationalMemoryRequest = z.infer<typeof patchOperationalMemoryRequestSchema>;
export type OperationalCatalogUsage = z.infer<typeof operationalCatalogUsageSchema>;
export type BumpCatalogUsageRequest = z.infer<typeof bumpCatalogUsageRequestSchema>;
