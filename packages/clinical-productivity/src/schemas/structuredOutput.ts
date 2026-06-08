import { z } from 'zod';

/** Fase D — sugerencias IA estructuradas (validación Zod obligatoria). */
export const suggestProblemsSchema = z.object({
  problems: z.array(
    z.object({
      label: z.string().min(1),
      confidence: z.number().min(0).max(1).optional(),
      source: z.string().optional(),
    }),
  ),
});

export const suggestOrdersSchema = z.object({
  orders: z.array(
    z.object({
      label: z.string().min(1),
      category: z.enum(['lab', 'imaging', 'medication', 'procedure', 'other']),
      requiresConfirmation: z.literal(true),
    }),
  ),
});

export type SuggestProblemsOutput = z.infer<typeof suggestProblemsSchema>;
export type SuggestOrdersOutput = z.infer<typeof suggestOrdersSchema>;

export function parseStructuredAiOutput<T>(
  schema: z.ZodType<T>,
  raw: unknown,
): { ok: true; data: T } | { ok: false; error: string } {
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.message };
  }
  return { ok: true, data: parsed.data };
}
