import type { AiTextboxAssistRequest } from '@epis2/contracts';
import { localAiTextboxAssistOutputSchema } from '@epis2/contracts';
import { hashPrompt } from './hash.js';
import { generateOllamaJson, pingOllama } from './ollama.js';
import { parseJsonFromOllamaText } from './extractOllamaJson.js';

const FORBIDDEN = [/auto[\s_-]?approve/i, /firma\s+automatica/i, /"status"\s*:\s*"approved"/i];

function buildTextboxAssistPrompt(request: AiTextboxAssistRequest): string {
  const actionLabel =
    request.action === 'reformulate'
      ? 'Reformula el texto clínico en español formal, sin inventar datos.'
      : request.action === 'soap'
        ? 'Convierte el texto a formato SOAP (S/O/A/P) sin inventar datos clínicos.'
        : 'Lista omisiones clínicas heurísticas (alergias, plan) sin bloquear guardado.';
  return `${actionLabel}

Texto:
"""
${request.text.slice(0, 6000)}
"""

Responde SOLO JSON:
{"resultText":"...","requiresHumanReview":true}
Incluye al final de resultText: "[Sugerencia IA — revisar]"`;
}

export async function runTextboxAssist(
  ollamaBaseUrl: string,
  model: string,
  request: AiTextboxAssistRequest,
) {
  const up = await pingOllama(ollamaBaseUrl);
  if (!up) {
    return {
      status: 'unavailable' as const,
      message: 'Ollama no disponible — usar sugerencia local.',
    };
  }

  const prompt = buildTextboxAssistPrompt(request);
  const promptHash = hashPrompt(prompt);
  const started = Date.now();
  const generated = await generateOllamaJson(ollamaBaseUrl, prompt, model);
  const latencyMs = Date.now() - started;

  if (!generated.ok) {
    return {
      status: 'unavailable' as const,
      message: generated.reason,
      latencyMs,
    };
  }

  for (const pattern of FORBIDDEN) {
    if (pattern.test(generated.text)) {
      return {
        status: 'rejected' as const,
        message: 'Respuesta IA rechazada por política de seguridad',
      };
    }
  }

  const extracted = parseJsonFromOllamaText(generated.text);
  if (!extracted.ok) {
    return { status: 'rejected' as const, message: extracted.reason, latencyMs };
  }

  const parsed = localAiTextboxAssistOutputSchema.safeParse(extracted.value);
  if (!parsed.success) {
    return { status: 'rejected' as const, message: 'Schema IA textbox inválido', latencyMs };
  }

  return {
    status: 'success' as const,
    resultText: parsed.data.resultText,
    requiresHumanReview: true as const,
    model: generated.model,
    latencyMs,
    promptHash,
  };
}
