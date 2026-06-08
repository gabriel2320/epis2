import { z } from 'zod';

/** Plan de sesión dev — Ollama devuelve JSON validado; no ejecuta acciones. */
export const devSessionPlanSchema = z.object({
  activePhase: z.string().min(1),
  nextMicrophase: z.string().min(1),
  objective: z.string().min(1),
  allowedPaths: z.array(z.string()).min(1),
  forbiddenPatterns: z.array(z.string()).default([]),
  gatesToRun: z.array(z.string()).min(1),
  subagentSequence: z.array(z.string()).min(1),
  risks: z.array(z.string()).default([]),
  requiresHumanReview: z.literal(true),
});

export function parseDevSessionPlan(raw) {
  const parsed = devSessionPlanSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.message };
  }
  return { ok: true, data: parsed.data };
}
