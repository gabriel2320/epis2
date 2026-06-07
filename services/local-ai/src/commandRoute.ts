import type { AiAssistCommandRouteRequest } from '@epis2/contracts';
import { buildCommandRoutePrompt } from './commandRoutePrompt.js';
import { hashPrompt } from './hash.js';
import { generateOllamaJson, pingOllama } from './ollama.js';
import { parseAndValidateCommandRouteJson } from './validateCommandRouteOutput.js';

const COMMAND_ROUTE_TIMEOUT_MS = 8_000;

export type CommandRouteSuccess = {
  status: 'success';
  hint: {
    intent?: string;
    confidence: number;
    missingContext: ('patient' | 'encounter' | 'draft')[];
    reason: string;
    suggestedCandidates: string[];
  };
  model: string;
  latencyMs: number;
  promptHash: string;
};

export type CommandRouteFailure = {
  status: 'unavailable' | 'rejected';
  message: string;
  promptHash?: string;
  model?: string;
  latencyMs?: number;
};

export async function runCommandRouteAssist(
  ollamaBaseUrl: string,
  model: string,
  request: AiAssistCommandRouteRequest,
): Promise<CommandRouteSuccess | CommandRouteFailure> {
  const up = await pingOllama(ollamaBaseUrl);
  if (!up) {
    return {
      status: 'unavailable',
      message: 'Ollama no está disponible. Usa sugerencias guiadas.',
    };
  }

  const allowedIds = new Set(request.allowedIntents.map((entry) => entry.intent));
  const prompt = buildCommandRoutePrompt(request);
  const promptHash = hashPrompt(prompt);
  const started = Date.now();

  const generated = await generateOllamaJson(
    ollamaBaseUrl,
    prompt,
    model,
    COMMAND_ROUTE_TIMEOUT_MS,
  );
  const latencyMs = Date.now() - started;

  if (!generated.ok) {
    return {
      status: 'unavailable',
      message: generated.reason,
      promptHash,
      model,
      latencyMs,
    };
  }

  const validated = parseAndValidateCommandRouteJson(generated.text);
  if (!validated.ok) {
    return {
      status: 'rejected',
      message: validated.reason,
      promptHash,
      model: generated.model,
      latencyMs,
    };
  }

  const hint = validated.data;
  if (hint.intent && !allowedIds.has(hint.intent)) {
    return {
      status: 'rejected',
      message: 'Intent fuera del catálogo permitido',
      promptHash,
      model: generated.model,
      latencyMs,
    };
  }

  const filteredCandidates = hint.suggestedCandidates.filter((id) => allowedIds.has(id));
  if (!hint.intent && filteredCandidates.length === 0) {
    return {
      status: 'rejected',
      message: 'Candidatos sugeridos fuera del catálogo',
      promptHash,
      model: generated.model,
      latencyMs,
    };
  }

  return {
    status: 'success',
    hint: {
      ...(hint.intent ? { intent: hint.intent } : {}),
      confidence: hint.confidence,
      missingContext: hint.missingContext,
      reason: hint.reason,
      suggestedCandidates: filteredCandidates,
    },
    model: generated.model,
    latencyMs,
    promptHash,
  };
}
