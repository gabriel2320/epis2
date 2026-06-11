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
