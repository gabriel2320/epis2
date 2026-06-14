import { z } from 'zod';
import { clinicalAlertSchema } from './clinicalAlerts.js';

/** MF-CU-04 — hooks CDS soportados en API interna `/cds/cards`. */
export const cdsHookIdSchema = z.enum(['patient-view', 'order-select']);

export const cdsCardSchema = z.object({
  id: z.string(),
  variant: z.enum(['info', 'suggestion', 'warning']),
  label: z.string(),
  detail: z.string().optional(),
  hook: cdsHookIdSchema,
  ruleId: z.string(),
  source: clinicalAlertSchema.shape.source.optional(),
});

export const cdsCardsRequestSchema = z.object({
  patientId: z.string(),
  hook: cdsHookIdSchema,
  blueprintId: z.string().optional(),
  fields: z.record(z.string()).optional(),
  prefetch: z.boolean().optional(),
});

export const cdsCardsResponseSchema = z.object({
  patientId: z.string(),
  readOnly: z.literal(true),
  evaluatedAt: z.string(),
  hook: cdsHookIdSchema,
  cards: z.array(cdsCardSchema),
});

export type CdsHookId = z.infer<typeof cdsHookIdSchema>;
export type CdsCard = z.infer<typeof cdsCardSchema>;
export type CdsCardsRequest = z.infer<typeof cdsCardsRequestSchema>;
export type CdsCardsResponse = z.infer<typeof cdsCardsResponseSchema>;
