import { z } from 'zod';

export const clinicalAlertSchema = z.object({
  ruleId: z.string(),
  severity: z.enum(['warning', 'critical']),
  message: z.string(),
  detail: z.string(),
  source: z.enum(['cds', 'cdr']),
});

export const patientClinicalAlertsResponseSchema = z.object({
  patientId: z.string().uuid(),
  readOnly: z.literal(true),
  evaluatedAt: z.string(),
  alerts: z.array(clinicalAlertSchema),
});

export type ClinicalAlert = z.infer<typeof clinicalAlertSchema>;
export type PatientClinicalAlertsResponse = z.infer<
  typeof patientClinicalAlertsResponseSchema
>;
