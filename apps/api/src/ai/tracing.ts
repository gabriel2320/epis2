/**
 * MF-IM-09 — Span manual `ai.run` para pipeline assist (draft-suggestion).
 * Usa el tracer global iniciado por `startOtel` (MF-NORM-203); sin SDK activo
 * las llamadas son no-op seguro vía @opentelemetry/api.
 */
import { SpanStatusCode, trace } from '@opentelemetry/api';

export const AI_TRACER_NAME = 'epis2-ai';
export const AI_RUN_SPAN_NAME = 'ai.run';

export type AiRunSpanResultAttrs = {
  model?: string | undefined;
  latencyMs?: number | undefined;
  provider?: string | undefined;
};

export async function withAiRunSpan<T>(
  blueprintId: string,
  run: () => Promise<T>,
  extractAttrs: (result: T) => AiRunSpanResultAttrs,
): Promise<T> {
  const tracer = trace.getTracer(AI_TRACER_NAME);
  return tracer.startActiveSpan(AI_RUN_SPAN_NAME, async (span) => {
    span.setAttribute('blueprintId', blueprintId);
    try {
      const result = await run();
      const attrs = extractAttrs(result);
      if (attrs.model !== undefined) span.setAttribute('model', attrs.model);
      if (attrs.latencyMs !== undefined) span.setAttribute('latencyMs', attrs.latencyMs);
      if (attrs.provider !== undefined) span.setAttribute('provider', attrs.provider);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (err) {
      span.recordException(err instanceof Error ? err : new Error(String(err)));
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw err;
    } finally {
      span.end();
    }
  });
}
