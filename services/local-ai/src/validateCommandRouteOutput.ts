import { localAiCommandRouteOutputSchema } from '@epis2/contracts';
import { parseJsonFromOllamaText } from './extractOllamaJson.js';

export type CommandRouteParseResult =
  | { ok: true; data: ReturnType<typeof localAiCommandRouteOutputSchema.parse> }
  | { ok: false; reason: string };

export function parseAndValidateCommandRouteJson(text: string): CommandRouteParseResult {
  const extracted = parseJsonFromOllamaText(text);
  if (!extracted.ok) {
    return { ok: false, reason: extracted.reason };
  }

  const validated = localAiCommandRouteOutputSchema.safeParse(extracted.value);
  if (!validated.success) {
    return { ok: false, reason: 'Esquema de ruta de comando inválido' };
  }

  const data = validated.data;
  if (!data.intent && data.suggestedCandidates.length === 0) {
    return { ok: false, reason: 'Sin intent ni candidatos sugeridos' };
  }

  return { ok: true, data };
}
