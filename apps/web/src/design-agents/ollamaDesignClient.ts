import type { z } from 'zod';
import { getDesignAgentsConfig } from './designAgentsEnv.js';
import type { DesignAgentRunOutcome } from './schemas.js';

export async function fetchOllamaDesignJson<T>(
  prompt: string,
  schema: z.ZodType<T>,
): Promise<DesignAgentRunOutcome<T>> {
  const { enabled, baseUrl, model } = getDesignAgentsConfig();
  if (!enabled) {
    return { ok: false, source: 'ollama', error: 'design agents disabled', degraded: true };
  }

  try {
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt: `${prompt}\n\nResponde SOLO JSON válido, sin markdown.`,
        stream: false,
        format: 'json',
        options: { temperature: 0.1 },
      }),
    });
    if (!response.ok) {
      return {
        ok: false,
        source: 'ollama',
        error: `ollama HTTP ${response.status}`,
        degraded: true,
      };
    }
    const body = (await response.json()) as { response?: string };
    const raw = body.response?.trim();
    if (!raw) {
      return { ok: false, source: 'ollama', error: 'empty ollama response', degraded: true };
    }
    const parsed = schema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      return {
        ok: false,
        source: 'ollama',
        error: parsed.error.message,
        degraded: true,
      };
    }
    return { ok: true, source: 'ollama', result: parsed.data };
  } catch (e) {
    return {
      ok: false,
      source: 'ollama',
      error: e instanceof Error ? e.message : 'ollama error',
      degraded: true,
    };
  }
}
