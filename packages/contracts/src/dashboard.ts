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
