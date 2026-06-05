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
  searchMode: z.enum(['semantic', 'keyword']).optional(),
  hits: z.array(documentSearchHitSchema),
});

export const documentIntakeRequestSchema = z.object({
  title: z.string().min(1),
  documentType: z.enum(['pdf', 'txt', 'image', 'referral', 'lab_report', 'other']),
  mimeType: z.string().optional(),
  textContent: z.string().optional(),
  filename: z.string().optional(),
});

export const documentIntakeResponseSchema = z.object({
  document: z.object({
    id: z.string().uuid(),
    title: z.string(),
    documentType: z.string(),
    mimeType: z.string().nullable().optional(),
    storageRef: z.string(),
    intakeStatus: z.enum(['staged', 'ocr_pending', 'indexed', 'failed']),
    chunkCount: z.number().int().nonnegative(),
    requiresHumanReview: z.literal(true),
    ocrPending: z.boolean(),
  }),
});

export type DocumentSearchResponse = z.infer<typeof documentSearchResponseSchema>;
export type DocumentIntakeRequest = z.infer<typeof documentIntakeRequestSchema>;
export type DocumentIntakeResponse = z.infer<typeof documentIntakeResponseSchema>;
