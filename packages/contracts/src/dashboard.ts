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
  myOpenDrafts: z.array(dashboardDraftRowSchema),
  pendingReview: z.array(dashboardDraftRowSchema),
  demoTasks: z.array(dashboardDemoTaskSchema),
});

export type DashboardWorkResponse = z.infer<typeof dashboardWorkResponseSchema>;

export const censusBedRowSchema = z.object({
  bedId: z.string().uuid(),
  bedLabel: z.string(),
  status: z.enum(['available', 'occupied', 'blocked']),
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

export const serviceDashboardResponseSchema = z.object({
  readOnly: z.literal(true),
  unitCode: z.string(),
  unitName: z.string(),
  census: z.array(censusBedRowSchema),
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

export type CensusBedRow = z.infer<typeof censusBedRowSchema>;
export type CriticalResultRow = z.infer<typeof criticalResultRowSchema>;
export type ProbableDischargeRow = z.infer<typeof probableDischargeRowSchema>;
export type ServiceDashboardResponse = z.infer<typeof serviceDashboardResponseSchema>;
