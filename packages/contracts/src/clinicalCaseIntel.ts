import { z } from 'zod';

/**
 * Clinical-Case-Intel (MF-CASE-01): registro canónico de casos clínicos sintéticos
 * para alimentar staging de pruebas EPIS2 y catálogo Evolab.
 *
 * Pipeline: scrape/normalize → `clinical_case_staging` (no SoT) → revisión humana
 * → promote a fixtures/migraciones. La IA solo sintetiza o enriquece; nunca
 * aprueba ni escribe datos clínicos finales (invariante 11).
 */

export const clinicalCaseReviewStatusSchema = z.enum(['pending', 'approved', 'rejected']);

export const clinicalCaseSourceTypeSchema = z.enum(['scraped', 'synthetic', 'hybrid']);

export const clinicalCaseDataTierSchema = z.literal('L0_synthetic');

export const clinicalCaseProvenanceSchema = z.object({
  sourceType: clinicalCaseSourceTypeSchema,
  /** Identificador de fuente: synthea, pmc, fixture, etc. */
  sourceName: z.string().min(1),
  sourceUrl: z.string().optional(),
  license: z.string().min(1),
  scrapedAt: z.string().min(1),
  /** ID externo (FHIR Patient.id) solo para trazabilidad; nunca se promueve a SoT. */
  externalPatientId: z.string().optional(),
});

export const clinicalCasePatientSchema = z.object({
  displayName: z.string().min(1),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'birthDate debe ser YYYY-MM-DD'),
  sex: z.enum(['F', 'M']),
  isSynthetic: z.literal(true),
});

export const clinicalCaseObservationSchema = z.object({
  label: z.string().min(1),
  valueText: z.string().min(1),
});

export const clinicalCaseMedicationSchema = z.object({
  name: z.string().min(1),
  doseText: z.string().optional(),
  route: z.string().optional(),
  status: z.enum(['active', 'stopped']).default('active'),
});

export const clinicalCaseAllergySchema = z.object({
  substance: z.string().min(1),
  severity: z.enum(['low', 'moderate', 'high']).optional(),
});

export const clinicalCaseClinicalSchema = z.object({
  scenario: z.string().min(1),
  problems: z.array(z.string().min(1)).min(1),
  observations: z.array(clinicalCaseObservationSchema),
  medications: z.array(clinicalCaseMedicationSchema).optional(),
  allergies: z.array(clinicalCaseAllergySchema).optional(),
});

export const clinicalCaseEpis2MappingSchema = z.object({
  patientId: z.string().uuid().optional(),
  encounterId: z.string().uuid().optional(),
  encounterStatus: z.enum(['open', 'closed']).default('open'),
  summaryFields: z.record(z.string()),
  identifierSystem: z.literal('EPIS2-SIM'),
});

export const clinicalCaseEvolabHintsSchema = z.object({
  capabilities: z.array(z.string().min(1)),
  suggestedGoals: z.array(z.string().min(1)),
  risk: z.enum(['low', 'medium', 'high']),
});

export const clinicalCaseGenerationSchema = z.object({
  model: z.string().optional(),
  promptVersion: z.string().min(1),
  requiresHumanReview: z.literal(true),
  contentHash: z.string().min(1),
});

export const clinicalCaseRecordSchema = z.object({
  /** Clave estable del caso (ej. SIM-HTA-7f3a). */
  caseCode: z.string().min(1),
  tier: clinicalCaseDataTierSchema,
  provenance: clinicalCaseProvenanceSchema,
  patient: clinicalCasePatientSchema,
  clinical: clinicalCaseClinicalSchema,
  epis2Mapping: clinicalCaseEpis2MappingSchema,
  evolabHints: clinicalCaseEvolabHintsSchema.optional(),
  generation: clinicalCaseGenerationSchema,
  fetchedAt: z.string().min(1),
});

export const clinicalCaseStagingRowSchema = z.object({
  id: z.string(),
  caseCode: z.string(),
  scenario: z.string(),
  reviewStatus: clinicalCaseReviewStatusSchema,
  requiresHumanReview: z.boolean(),
  record: clinicalCaseRecordSchema,
  sourceHash: z.string(),
  fetchedAt: z.string(),
  reviewedBy: z.string().nullable(),
  reviewedAt: z.string().nullable(),
});

export type ClinicalCaseReviewStatus = z.infer<typeof clinicalCaseReviewStatusSchema>;
export type ClinicalCaseSourceType = z.infer<typeof clinicalCaseSourceTypeSchema>;
export type ClinicalCaseProvenance = z.infer<typeof clinicalCaseProvenanceSchema>;
export type ClinicalCasePatient = z.infer<typeof clinicalCasePatientSchema>;
export type ClinicalCaseObservation = z.infer<typeof clinicalCaseObservationSchema>;
export type ClinicalCaseMedication = z.infer<typeof clinicalCaseMedicationSchema>;
export type ClinicalCaseAllergy = z.infer<typeof clinicalCaseAllergySchema>;
export type ClinicalCaseClinical = z.infer<typeof clinicalCaseClinicalSchema>;
export type ClinicalCaseEpis2Mapping = z.infer<typeof clinicalCaseEpis2MappingSchema>;
export type ClinicalCaseEvolabHints = z.infer<typeof clinicalCaseEvolabHintsSchema>;
export type ClinicalCaseGeneration = z.infer<typeof clinicalCaseGenerationSchema>;
export type ClinicalCaseRecord = z.infer<typeof clinicalCaseRecordSchema>;
export type ClinicalCaseStagingRow = z.infer<typeof clinicalCaseStagingRowSchema>;

export const clinicalCaseReviewRequestSchema = z.object({
  decision: z.enum(['approved', 'rejected']),
  note: z.string().optional(),
});

export const clinicalCaseListResponseSchema = z.object({
  readOnly: z.literal(false),
  entries: z.array(clinicalCaseStagingRowSchema),
});

export const clinicalCasePromoteResponseSchema = z.object({
  promoted: z.number().int().nonnegative(),
  skipped: z.number().int().nonnegative(),
});

export type ClinicalCaseReviewRequest = z.infer<typeof clinicalCaseReviewRequestSchema>;
export type ClinicalCaseListResponse = z.infer<typeof clinicalCaseListResponseSchema>;
export type ClinicalCasePromoteResponse = z.infer<typeof clinicalCasePromoteResponseSchema>;
