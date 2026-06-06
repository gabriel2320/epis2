import { z } from 'zod';

export const resultsInboxObservationSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  valueText: z.string(),
  observedAt: z.string(),
  orderId: z.string().uuid().optional(),
  orderTitle: z.string().optional(),
});

export const resultsInboxCriticalSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  valueText: z.string(),
  severity: z.enum(['high', 'critical']),
  observedAt: z.string(),
  acknowledged: z.boolean(),
  acknowledgedAt: z.string().nullable().optional(),
  orderId: z.string().uuid().optional(),
  orderTitle: z.string().optional(),
});

export const resultsInboxPendingOrderSchema = z.object({
  id: z.string().uuid(),
  orderType: z.string(),
  title: z.string(),
  priority: z.string(),
  orderedAt: z.string(),
});

export const patientResultsInboxResponseSchema = z.object({
  patientId: z.string().uuid(),
  readOnly: z.literal(true),
  demoCaseCode: z.string().optional(),
  observations: z.array(resultsInboxObservationSchema),
  criticalResults: z.array(resultsInboxCriticalSchema),
  pendingOrders: z.array(resultsInboxPendingOrderSchema),
});

export type PatientResultsInboxResponse = z.infer<typeof patientResultsInboxResponseSchema>;
export type ResultsInboxObservation = z.infer<typeof resultsInboxObservationSchema>;
