import { z } from 'zod';

export const healthResponseSchema = z.object({
  status: z.enum(['ok', 'degraded', 'error']),
  service: z.string(),
  version: z.string(),
  timestamp: z.string().datetime(),
  checks: z.record(z.enum(['up', 'down', 'skipped'])).optional(),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
