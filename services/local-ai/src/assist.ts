import type { AiAssistDraftRequest } from '@epis2/contracts';
import { getAssistBlueprintFields } from './assistSchemas.js';
import { hashPrompt } from './hash.js';
import { generateOllamaJson, pingOllama } from './ollama.js';
import { buildDraftAssistPrompt } from './prompt.js';
import { parseAndValidateAssistJson } from './validateOutput.js';

export type AssistSuccess = {
  status: 'success';
  suggestedFields: Record<string, string>;
  safetyNotes: string[];
  requiresHumanReview: true;
  model: string;
  latencyMs: number;
  promptHash: string;
};

export type AssistFailure = {
  status: 'unavailable' | 'rejected';
  message: string;
  promptHash?: string;
  model?: string;
  latencyMs?: number;
};

export async function runDraftAssist(
  ollamaBaseUrl: string,
  model: string,
  request: AiAssistDraftRequest,
): Promise<AssistSuccess | AssistFailure> {
  const fieldIds = getAssistBlueprintFields(request.blueprintId);
  if (!fieldIds) {
    return {
      status: 'rejected',
      message: 'Blueprint sin asistencia IA configurada',
    };
  }

  const up = await pingOllama(ollamaBaseUrl);
  if (!up) {
    return {
      status: 'unavailable',
      message: 'Ollama no está disponible. Continúa con el formulario manual.',
    };
  }

  const promptInput: Parameters<typeof buildDraftAssistPrompt>[0] = {
    blueprintId: request.blueprintId,
    fieldIds: [...fieldIds],
  };
  if (request.context !== undefined) promptInput.context = request.context;
  if (request.currentFields !== undefined) promptInput.currentFields = request.currentFields;
  const prompt = buildDraftAssistPrompt(promptInput);
  const promptHash = hashPrompt(prompt);
  const started = Date.now();

  const generated = await generateOllamaJson(ollamaBaseUrl, prompt, model);
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

  const validated = parseAndValidateAssistJson(generated.text);
  if (!validated.ok) {
    return {
      status: 'rejected',
      message: validated.reason,
      promptHash,
      model: generated.model,
      latencyMs,
    };
  }

  const filtered: Record<string, string> = {};
  for (const id of fieldIds) {
    const value = validated.data.suggestedFields[id];
    if (typeof value === 'string' && value.trim()) {
      filtered[id] = value.trim();
    }
  }

  if (Object.keys(filtered).length === 0) {
    return {
      status: 'rejected',
      message: 'La IA no devolvió campos utilizables',
      promptHash,
      model: generated.model,
      latencyMs,
    };
  }

  return {
    status: 'success',
    suggestedFields: filtered,
    safetyNotes: validated.data.safetyNotes,
    requiresHumanReview: true,
    model: generated.model,
    latencyMs,
    promptHash,
  };
}
