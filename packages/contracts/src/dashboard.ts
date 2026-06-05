import { z } from 'zod';

export const dashboardDraftRowSchema = z.object({
  id: z.string().uuid(),
  patientId: z.string().uuid(),
  patientDisplayName: z.string(),
  draftType: z.string(),
  status: z.string(),
  title: z.string(),
  updatedAt: z.string(),
});

export const dashboardDemoTaskSchema = z.object({
  id: z.string(),
  label: z.string(),
  commandSample: z.string(),
  disabled: z.boolean().optional(),
});

export const dashboardWorkResponseSchema = z.object({
  readOnly: z.literal(true),
  roleView: z.enum(['physician', 'nurse', 'pharmacist', 'admin', 'auditor']).optional(),
  myOpenDrafts: z.array(dashboardDraftRowSchema),
  pendingReview: z.array(dashboardDraftRowSchema),
  demoTasks: z.array(dashboardDemoTaskSchema),
});

export type DashboardWorkResponse = z.infer<typeof dashboardWorkResponseSchema>;

export const marScheduledDoseRowSchema = z.object({
  id: z.string().uuid(),
  patientId: z.string().uuid(),
  patientDisplayName: z.string(),
  medication: z.string(),
  doseText: z.string(),
  route: z.string(),
  scheduledAt: z.string(),
  windowStart: z.string(),
  windowEnd: z.string(),
  requiresDoubleCheck: z.boolean(),
  status: z.enum(['scheduled', 'administered', 'missed', 'held']),
});

export const nursingDashboardResponseSchema = z.object({
  readOnly: z.literal(true),
  roleView: z.literal('nurse'),
  scheduledMar: z.array(marScheduledDoseRowSchema),
  nursingDrafts: z.array(dashboardDraftRowSchema),
  demoTasks: z.array(dashboardDemoTaskSchema),
});

export const pharmacyDashboardResponseSchema = z.object({
  readOnly: z.literal(true),
  roleView: z.literal('pharmacist'),
  pendingValidations: z.array(
    z.object({
      id: z.string().uuid(),
      patientId: z.string().uuid(),
      patientDisplayName: z.string(),
      title: z.string(),
      status: z.string(),
      updatedAt: z.string(),
    }),
  ),
  reconciliationCandidates: z.array(
    z.object({
      patientId: z.string().uuid(),
      patientDisplayName: z.string(),
      activeMedicationCount: z.number().int().positive(),
      medications: z.array(z.string()),
      reason: z.string(),
    }),
  ),
  demoTasks: z.array(dashboardDemoTaskSchema),
});

export type NursingDashboardResponse = z.infer<typeof nursingDashboardResponseSchema>;
export type PharmacyDashboardResponse = z.infer<typeof pharmacyDashboardResponseSchema>;

export const censusBedRowSchema = z.object({
  bedId: z.string().uuid(),
  bedLabel: z.string(),
  status: z.enum(['available', 'occupied', 'blocked']),
  admissionId: z.string().uuid().optional(),
  patientId: z.string().uuid().optional(),
  patientDisplayName: z.string().optional(),
  demoCaseCode: z.string().optional(),
});

export const criticalResultRowSchema = z.object({
  id: z.string().uuid(),
  patientId: z.string().uuid(),
  patientDisplayName: z.string(),
  label: z.string(),
  valueText: z.string(),
  severity: z.enum(['high', 'critical']),
  observedAt: z.string(),
});

export const probableDischargeRowSchema = z.object({
  patientId: z.string().uuid(),
  patientDisplayName: z.string(),
  bedLabel: z.string(),
  reason: z.string(),
});

export const clinicalOrderRowSchema = z.object({
  id: z.string().uuid(),
  patientId: z.string().uuid(),
  patientDisplayName: z.string(),
  orderType: z.string(),
  title: z.string(),
  priority: z.string(),
});

export const serviceDashboardResponseSchema = z.object({
  readOnly: z.literal(true),
  unitCode: z.string(),
  unitName: z.string(),
  census: z.array(censusBedRowSchema),
  activeOrders: z.array(clinicalOrderRowSchema),
  unacknowledgedCriticals: z.array(criticalResultRowSchema),
  probableDischarges: z.array(probableDischargeRowSchema),
  pendingWorkItems: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      patientId: z.string().uuid().optional(),
      commandSample: z.string().optional(),
    }),
  ),
});

export type ClinicalOrderRow = z.infer<typeof clinicalOrderRowSchema>;
export type CensusBedRow = z.infer<typeof censusBedRowSchema>;
export type CriticalResultRow = z.infer<typeof criticalResultRowSchema>;
export type ProbableDischargeRow = z.infer<typeof probableDischargeRowSchema>;
export type ServiceDashboardResponse = z.infer<typeof serviceDashboardResponseSchema>;
