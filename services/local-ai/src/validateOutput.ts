import { parseJsonFromOllamaText } from './extractOllamaJson.js';
import { localAiDraftAssistOutputSchema } from '@epis2/contracts';
import { sanitizeAiSuggestedFields } from '@epis2/clinical-domain';

const FORBIDDEN_AUTO_APPROVAL = [
  /auto[\s_-]?approve/i,
  /aprobar\s+automaticamente/i,
  /firma\s+automatica/i,
  /"status"\s*:\s*"approved"/i,
];

export type ValidateResult =
  | { ok: true; data: ReturnType<typeof localAiDraftAssistOutputSchema.parse> }
  | { ok: false; reason: string };

export function parseAndValidateAssistJson(raw: string): ValidateResult {
  for (const pattern of FORBIDDEN_AUTO_APPROVAL) {
    if (pattern.test(raw)) {
      return { ok: false, reason: 'La IA no puede sugerir aprobación automática' };
    }
  }

  const extracted = parseJsonFromOllamaText(raw);
  if (!extracted.ok) {
    return { ok: false, reason: extracted.reason };
  }

  const zod = localAiDraftAssistOutputSchema.safeParse(extracted.value);
  if (!zod.success) {
    return { ok: false, reason: 'Respuesta IA no cumple el schema de asistencia' };
  }

  const sanitized = sanitizeAiSuggestedFields(zod.data.suggestedFields);
  return {
    ok: true,
    data: {
      ...zod.data,
      suggestedFields: sanitized,
    },
  };
}
