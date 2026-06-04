import { z } from 'zod';

export const documentSearchHitSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  documentType: z.string(),
  storageRef: z.string(),
  snippet: z.string(),
});

export const documentSearchResponseSchema = z.object({
  readOnly: z.literal(true),
  patientId: z.string().uuid(),
  query: z.string(),
  hits: z.array(documentSearchHitSchema),
});

export type DocumentSearchResponse = z.infer<typeof documentSearchResponseSchema>;
