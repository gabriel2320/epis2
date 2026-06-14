import type { AiAssistDraftRequest, AiDocumentCitation } from '@epis2/contracts';
import type { AiConfig } from './config.js';
import { getAssistBlueprintFields } from './assistSchemas.js';
import { hashPrompt } from './hash.js';
import type { InferenceProviderId } from './inference/types.js';
import { generateWithInferenceRouter } from './inference/router.js';
import { buildDraftAssistPrompt } from './prompt.js';
import { resolveAssistDocumentCitations } from './rag/assistCitations.js';
import { parseAndValidateAssistJson } from './validateOutput.js';

export type AssistSuccess = {
  status: 'success';
  suggestedFields: Record<string, string>;
  safetyNotes: string[];
  requiresHumanReview: true;
  model: string;
  latencyMs: number;
  promptHash: string;
  provider: InferenceProviderId;
  dataTier: string;
  documentCitations?: AiDocumentCitation[];
};

export type AssistFailure = {
  status: 'unavailable' | 'rejected';
  message: string;
  promptHash?: string;
  model?: string;
  latencyMs?: number;
  provider?: InferenceProviderId;
};

export async function runDraftAssist(
  config: AiConfig,
  request: AiAssistDraftRequest,
): Promise<AssistSuccess | AssistFailure> {
  const fieldIds = getAssistBlueprintFields(request.blueprintId);
  if (!fieldIds) {
    return {
      status: 'rejected',
      message: 'Blueprint sin asistencia IA configurada',
    };
  }

  const promptInput: Parameters<typeof buildDraftAssistPrompt>[0] = {
    blueprintId: request.blueprintId,
    fieldIds: [...fieldIds],
  };
  if (request.context !== undefined) promptInput.context = request.context;
  if (request.currentFields !== undefined) promptInput.currentFields = request.currentFields;

  const retrievalQuery = [
    request.blueprintId.replace(/_/g, ' '),
    request.context?.clinicalReason,
    request.context?.chiefComplaint,
    request.context?.eval,
  ]
    .filter((part): part is string => typeof part === 'string' && part.trim().length > 0)
    .join(' ');

  const citationBundle = resolveAssistDocumentCitations(request.patientId, retrievalQuery);
  if (citationBundle?.contextText) {
    promptInput.documentContext = citationBundle.contextText;
  }

  const prompt = buildDraftAssistPrompt(promptInput);
  const promptHash = hashPrompt(prompt);
  const started = Date.now();

  const generated = await generateWithInferenceRouter(config, prompt, request.context);
  const latencyMs = Date.now() - started;

  if (!generated.ok) {
    return {
      status: 'unavailable',
      message: generated.reason,
      promptHash,
      provider: generated.provider,
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
      provider: generated.provider,
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
      provider: generated.provider,
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
    provider: generated.provider,
    dataTier: generated.dataTier,
    ...(citationBundle?.citations.length ? { documentCitations: citationBundle.citations } : {}),
  };
}
