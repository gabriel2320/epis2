import { localAiCommandRouteOutputSchema } from '@epis2/contracts';

export type CommandRouteParseResult =
  | { ok: true; data: ReturnType<typeof localAiCommandRouteOutputSchema.parse> }
  | { ok: false; reason: string };

export function parseAndValidateCommandRouteJson(text: string): CommandRouteParseResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'JSON inválido del modelo' };
  }

  const validated = localAiCommandRouteOutputSchema.safeParse(parsed);
  if (!validated.success) {
    return { ok: false, reason: 'Esquema de ruta de comando inválido' };
  }

  const data = validated.data;
  if (!data.intent && data.suggestedCandidates.length === 0) {
    return { ok: false, reason: 'Sin intent ni candidatos sugeridos' };
  }

  return { ok: true, data };
}
