import { z } from 'zod';

export const patientClinicalSummaryResponseSchema = z.object({
  patientId: z.string().uuid(),
  displayName: z.string(),
  birthDate: z.string().nullable(),
  sex: z.string().nullable(),
  edadAnios: z.number().int().nullable(),
  previsionResumen: z.string().nullable(),
  alergiasCriticas: z.string().nullable(),
  problemasActivos: z.string().nullable(),
  medicamentosActivos: z.string().nullable(),
  ultimoEncuentroAt: z.string().datetime().nullable(),
  hospitalizado: z.boolean(),
  refreshedAt: z.string().datetime(),
});

export type PatientClinicalSummaryResponse = z.infer<typeof patientClinicalSummaryResponseSchema>;

export const clinicalContextDenseLabHighlightSchema = z.object({
  label: z.string(),
  value: z.string(),
  observedAt: z.string(),
  relativeAgeEs: z.string(),
});

export const clinicalContextDenseResponseSchema = z.object({
  activeProblems: z.array(z.string()),
  medicationSummary: z.string().nullable(),
  lastEncounterAt: z.string().datetime().nullable(),
  lastEncounterRelativeEs: z.string().nullable(),
  labHighlights: z.array(clinicalContextDenseLabHighlightSchema),
  episodeOpen: z.boolean(),
  careSettingLabel: z.string().nullable(),
});

export type ClinicalContextDenseResponse = z.infer<typeof clinicalContextDenseResponseSchema>;
