/**
 * MF-TOOL-06 — Langfuse opt-in para trazas de inferencia local-ai.
 * Off por defecto. Nunca bloquea inferencia clínica si Langfuse falla.
 */
import type { AiConfig } from './config.js';
import type { InferenceDataTier, StructuredGenerateResult } from './inference/types.js';

export type LangfuseConfig = Pick<
  AiConfig,
  | 'LANGFUSE_ENABLED'
  | 'LANGFUSE_BASE_URL'
  | 'LANGFUSE_PUBLIC_KEY'
  | 'LANGFUSE_SECRET_KEY'
  | 'LANGFUSE_TRACE_INPUT'
>;

export type InferenceTraceInput = {
  config: LangfuseConfig;
  prompt: string;
  requestContext: Record<string, string> | undefined;
  dataTier: InferenceDataTier;
  latencyMs: number;
  result: StructuredGenerateResult & { dataTier?: InferenceDataTier };
};

type LangfuseClient = {
  trace: (args: {
    name: string;
    metadata?: Record<string, string | boolean>;
  }) => LangfuseTrace;
  flushAsync: () => Promise<void>;
  shutdownAsync: () => Promise<void>;
};

type LangfuseTrace = {
  generation: (args: {
    name: string;
    model: string;
    input: unknown;
    metadata?: Record<string, string | number>;
  }) => LangfuseGeneration;
};

type LangfuseGeneration = {
  end: (args?: { output?: unknown; level?: string; statusMessage?: string }) => void;
};

let clientPromise: Promise<LangfuseClient | null> | null = null;

async function getClient(config: LangfuseConfig): Promise<LangfuseClient | null> {
  if (!config.LANGFUSE_ENABLED) {
    return null;
  }
  const publicKey = config.LANGFUSE_PUBLIC_KEY?.trim();
  const secretKey = config.LANGFUSE_SECRET_KEY?.trim();
  if (!publicKey || !secretKey) {
    return null;
  }

  if (!clientPromise) {
    clientPromise = (async () => {
      const { Langfuse } = await import('langfuse');
      return new Langfuse({
        publicKey,
        secretKey,
        baseUrl: config.LANGFUSE_BASE_URL,
      }) as LangfuseClient;
    })();
  }

  return clientPromise;
}

function shouldTraceInput(config: LangfuseConfig, dataTier: InferenceDataTier): boolean {
  return config.LANGFUSE_TRACE_INPUT && dataTier === 'L0_synthetic';
}

function redactText(text: string): string {
  return `[redacted ${text.length} chars]`;
}

export async function recordInferenceTrace(input: InferenceTraceInput): Promise<void> {
  const { config, prompt, requestContext, dataTier, latencyMs, result } = input;
  if (!config.LANGFUSE_ENABLED) {
    return;
  }

  try {
    const client = await getClient(config);
    if (!client) {
      return;
    }

    const trace = client.trace({
      name: 'ai.inference',
      metadata: {
        dataTier,
        source: requestContext?.source ?? 'unknown',
        provider: result.provider,
        ok: result.ok,
      },
    });

    const generation = trace.generation({
      name: 'structured-json',
      model: result.ok ? result.model : result.provider,
      input: shouldTraceInput(config, dataTier) ? { prompt } : { prompt: redactText(prompt) },
      metadata: { latencyMs, dataTier },
    });

    if (result.ok) {
      generation.end({
        output: shouldTraceInput(config, dataTier)
          ? { text: result.text }
          : { text: redactText(result.text) },
      });
    } else {
      generation.end({
        level: 'ERROR',
        statusMessage: result.reason,
      });
    }

    await client.flushAsync();
  } catch {
    // Observabilidad opt-in — no propagar errores al flujo clínico
  }
}

export async function shutdownLangfuse(): Promise<void> {
  if (!clientPromise) {
    return;
  }
  try {
    const client = await clientPromise;
    await client?.flushAsync();
    await client?.shutdownAsync();
  } catch {
    // ignore
  } finally {
    clientPromise = null;
  }
}
