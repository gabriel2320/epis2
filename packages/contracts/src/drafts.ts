import { z } from 'zod';

/** Query de GET /api/drafts — paginación acotada (norma R-35). */
export const draftsListQuerySchema = z.object({
  patientId: z.string().uuid().optional(),
  status: z.string().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export type DraftsListQuery = z.infer<typeof draftsListQuerySchema>;
