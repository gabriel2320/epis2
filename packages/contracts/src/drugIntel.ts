import { z } from 'zod';

/**
 * Drug-Intel (MF-183): registro canónico de fármacos disponibles en Chile,
 * producido por el pipeline `services/drug-intel` a partir de fuentes públicas
 * (ISP, precios referenciales MINSAL/CENABAST) correlacionadas con fuentes
 * internacionales (OpenFDA, RxNorm/ATC).
 *
 * Estos registros viven en `drug_intel_staging` (staging, no SoT clínico) y
 * solo llegan al catálogo consumible por farmacia ambulatoria/hospitalizado
 * tras revisión y promoción humana auditada. La IA solo correlaciona y marca
 * discrepancias; nunca aprueba (invariante 11).
 */

export const drugIntelReviewStatusSchema = z.enum(['pending', 'approved', 'rejected']);

/** Precio referencial: nunca un precio transaccional; siempre con fuente y fecha. */
export const drugIntelPriceSchema = z.object({
  amountClp: z.number().nonnegative(),
  currency: z.literal('CLP'),
  source: z.string().min(1),
  fetchedAt: z.string().min(1),
  referential: z.literal(true),
});

export const drugIntelDiscrepancySeveritySchema = z.enum(['info', 'warning', 'critical']);

export const drugIntelDiscrepancySchema = z.object({
  field: z.string().min(1),
  severity: drugIntelDiscrepancySeveritySchema,
  message: z.string().min(1),
  /** Identificadores de fuente involucrados (ej: 'isp', 'openfda'). */
  sources: z.array(z.string()),
});

export const drugIntelCorrelationSchema = z.object({
  status: z.enum(['not_correlated', 'consistent', 'discrepant']),
  /** true cuando hay discrepancias o la correlación está incompleta. */
  requiresHumanReview: z.boolean(),
  discrepancies: z.array(drugIntelDiscrepancySchema),
  /** Modelo Ollama usado para resumir discrepancias, si hubo IA disponible. */
  aiModel: z.string().optional(),
  aiSummary: z.string().optional(),
  correlatedAt: z.string().optional(),
});

export const drugIntelDoseSchema = z.object({
  population: z.enum(['adult', 'pediatric', 'renal', 'unspecified']),
  text: z.string().min(1),
  source: z.string().min(1),
});

export const drugIntelTextWithSourceSchema = z.object({
  text: z.string().min(1),
  source: z.string().min(1),
});

export const drugIntelIspAlertSchema = z.object({
  title: z.string().min(1),
  url: z.string().optional(),
  publishedAt: z.string().optional(),
});

export const drugIntelRecordSchema = z.object({
  /** Clave estable del registro (registro ISP o slug del producto). */
  recordKey: z.string().min(1),
  productName: z.string().min(1),
  activeIngredient: z.string().optional(),
  atcCode: z.string().optional(),
  ispRegistry: z
    .object({
      registryId: z.string().min(1),
      status: z.string().optional(),
      saleCondition: z.string().optional(),
      holder: z.string().optional(),
    })
    .optional(),
  pharmaceuticalForms: z.array(z.string()),
  recommendedDoses: z.array(drugIntelDoseSchema),
  prices: z.array(drugIntelPriceSchema),
  warnings: z.array(drugIntelTextWithSourceSchema),
  ispAlerts: z.array(drugIntelIspAlertSchema),
  adverseReactions: z.array(drugIntelTextWithSourceSchema),
  /** URLs de las fuentes consultadas para auditoría. */
  sources: z.array(z.string()),
  correlation: drugIntelCorrelationSchema,
  fetchedAt: z.string().min(1),
});

/** Fila de staging expuesta por la API admin para revisión humana. */
export const drugIntelStagingRowSchema = z.object({
  id: z.string(),
  recordKey: z.string(),
  productName: z.string(),
  activeIngredient: z.string().nullable(),
  atcCode: z.string().nullable(),
  reviewStatus: drugIntelReviewStatusSchema,
  requiresHumanReview: z.boolean(),
  record: drugIntelRecordSchema,
  fetchedAt: z.string(),
  reviewedBy: z.string().nullable(),
  reviewedAt: z.string().nullable(),
});

export const drugIntelListResponseSchema = z.object({
  readOnly: z.literal(false),
  entries: z.array(drugIntelStagingRowSchema),
});

export const drugIntelReviewRequestSchema = z.object({
  decision: z.enum(['approved', 'rejected']),
  note: z.string().optional(),
});

export const drugIntelPromoteResponseSchema = z.object({
  promoted: z.number().int().nonnegative(),
  skipped: z.number().int().nonnegative(),
  catalogCode: z.literal('medication'),
});

export type DrugIntelReviewStatus = z.infer<typeof drugIntelReviewStatusSchema>;
export type DrugIntelPrice = z.infer<typeof drugIntelPriceSchema>;
export type DrugIntelDiscrepancy = z.infer<typeof drugIntelDiscrepancySchema>;
export type DrugIntelCorrelation = z.infer<typeof drugIntelCorrelationSchema>;
export type DrugIntelDose = z.infer<typeof drugIntelDoseSchema>;
export type DrugIntelIspAlert = z.infer<typeof drugIntelIspAlertSchema>;
export type DrugIntelRecord = z.infer<typeof drugIntelRecordSchema>;
export type DrugIntelStagingRow = z.infer<typeof drugIntelStagingRowSchema>;
export type DrugIntelListResponse = z.infer<typeof drugIntelListResponseSchema>;
export type DrugIntelReviewRequest = z.infer<typeof drugIntelReviewRequestSchema>;
export type DrugIntelPromoteResponse = z.infer<typeof drugIntelPromoteResponseSchema>;
