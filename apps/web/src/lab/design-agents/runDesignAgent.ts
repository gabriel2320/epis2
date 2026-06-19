import type { z } from 'zod';
import { areDesignAgentsEnabled } from './designAgentsEnv.js';
import { fetchOllamaDesignJson } from './ollamaDesignClient.js';
import type { DesignAgentRunOutcome } from './schemas.js';

export async function runDesignAgent<T>(
  agentId: string,
  schema: z.ZodType<T>,
  heuristic: () => T,
  ollamaPrompt: string,
): Promise<DesignAgentRunOutcome<T>> {
  const heuristicResult = schema.safeParse(heuristic());
  if (!heuristicResult.success) {
    return {
      ok: false,
      source: 'heuristic',
      error: `${agentId}: ${heuristicResult.error.message}`,
      degraded: true,
    };
  }

  if (!areDesignAgentsEnabled()) {
    return { ok: true, source: 'heuristic', result: heuristicResult.data };
  }

  const ollama = await fetchOllamaDesignJson(ollamaPrompt, schema);
  if (ollama.ok) return ollama;
  return { ok: true, source: 'heuristic', result: heuristicResult.data };
}
