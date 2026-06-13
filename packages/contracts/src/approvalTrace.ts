import { z } from 'zod';

/** Meta reservada en body de borrador — no se copia a nota clínica aprobada. */
export const EPIS2_DRAFT_ASSIST_TRACE_KEY = '_epis2AssistTrace' as const;

export const draftAssistTraceSchema = z.object({
  aiRunId: z.string().uuid().optional(),
});

export type DraftAssistTrace = z.infer<typeof draftAssistTraceSchema>;

export function readAssistTraceFromDraftBody(
  body: Record<string, unknown>,
): DraftAssistTrace | undefined {
  const raw = body[EPIS2_DRAFT_ASSIST_TRACE_KEY];
  if (raw === undefined) return undefined;
  const parsed = draftAssistTraceSchema.safeParse(raw);
  return parsed.success ? parsed.data : undefined;
}

export function stripAssistTraceFromDraftBody(
  body: Record<string, unknown>,
): Record<string, unknown> {
  const next = { ...body };
  delete next[EPIS2_DRAFT_ASSIST_TRACE_KEY];
  return next;
}

export function mergeAssistTraceIntoDraftBody(
  body: Record<string, unknown>,
  trace: DraftAssistTrace,
): Record<string, unknown> {
  const parsed = draftAssistTraceSchema.safeParse(trace);
  if (!parsed.success) return body;
  const existing = readAssistTraceFromDraftBody(body) ?? {};
  const merged = { ...existing, ...parsed.data };
  if (!merged.aiRunId) {
    const next = { ...body };
    delete next[EPIS2_DRAFT_ASSIST_TRACE_KEY];
    return next;
  }
  return { ...body, [EPIS2_DRAFT_ASSIST_TRACE_KEY]: merged };
}
