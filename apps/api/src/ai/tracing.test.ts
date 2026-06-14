/**
 * MF-IM-09 — span `ai.run` con atributos blueprintId, model, latencyMs, provider.
 */
import { trace } from '@opentelemetry/api';
import {
  BasicTracerProvider,
  InMemorySpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AI_RUN_SPAN_NAME, AI_TRACER_NAME, withAiRunSpan } from './tracing.js';

let provider: BasicTracerProvider | null = null;
let exporter: InMemorySpanExporter | null = null;

beforeEach(() => {
  exporter = new InMemorySpanExporter();
  provider = new BasicTracerProvider({
    spanProcessors: [new SimpleSpanProcessor(exporter)],
  });
  trace.setGlobalTracerProvider(provider);
});

afterEach(async () => {
  await provider?.shutdown();
  provider = null;
  exporter = null;
});

describe('withAiRunSpan (MF-IM-09)', () => {
  it('emite span ai.run con atributos de latencia y modelo', async () => {
    await withAiRunSpan(
      'evolution_note',
      async () => ({
        httpStatus: 200,
        body: {
          status: 'success' as const,
          model: 'test-model',
          latencyMs: 42,
          provider: 'ollama' as const,
        },
      }),
      (result) => ({
        model: result.body.model,
        latencyMs: result.body.latencyMs,
        provider: result.body.provider,
      }),
    );

    await provider!.forceFlush();
    const spans = exporter!.getFinishedSpans();
    expect(spans).toHaveLength(1);
    const span = spans[0]!;
    expect(span.name).toBe(AI_RUN_SPAN_NAME);
    expect(span.instrumentationScope.name).toBe(AI_TRACER_NAME);
    expect(span.attributes.blueprintId).toBe('evolution_note');
    expect(span.attributes.model).toBe('test-model');
    expect(span.attributes.latencyMs).toBe(42);
    expect(span.attributes.provider).toBe('ollama');
  });
});
