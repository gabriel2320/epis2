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

/** Parche de bajo riesgo — Tier L0/L1 según path (ver EPIS2_DEV_AGENT_LOW_RISK_WRITE.md). */
export const devLowRiskPatchSchema = z.object({
  path: z.string().min(1),
  action: z.enum(['create', 'append']),
  content: z.string().min(1),
  summary: z.string().min(1),
});

/** Plan de escritura documentación / reportes vía Ollama dev. */
export const devLowRiskWritePlanSchema = z.object({
  objective: z.string().min(1),
  patches: z.array(devLowRiskPatchSchema).min(1).max(8),
  gatesToRun: z.array(z.string()).default(['npm run check']),
  manualFollowUps: z.array(z.string()).default([]),
  risks: z.array(z.string()).default([]),
  requiresHumanReview: z.literal(true),
});

/** @typedef {z.infer<typeof devLowRiskWritePlanSchema>} DevLowRiskWritePlan */

export function parseDevSessionPlan(raw) {
  const parsed = devSessionPlanSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.message };
  }
  return { ok: true, data: parsed.data };
}

export function parseDevLowRiskWritePlan(raw) {
  const parsed = devLowRiskWritePlanSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.message };
  }
  return { ok: true, data: parsed.data };
}
