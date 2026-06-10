import type { AiAssistCommandRouteRequest } from '@epis2/contracts';

export function buildCommandRoutePrompt(input: AiAssistCommandRouteRequest): string {
  const intentLines = input.allowedIntents
    .map((entry) => `- ${entry.intent}: ${entry.labelEs} — ${entry.description}`)
    .join('\n');

  const deterministic =
    input.deterministicCandidates && input.deterministicCandidates.length > 0
      ? input.deterministicCandidates.map((c) => `${c.intent} (${c.score})`).join(', ')
      : 'ninguno';

  return [
    'Clasifica la frase clínica del usuario en UN intent del catálogo EPIS2.',
    'Responde SOLO JSON válido, sin markdown ni texto extra.',
    'No ejecutes acciones, no prescribas, no inventes intents fuera del catálogo.',
    '',
    `Rol: ${input.role}`,
    `Paciente activo: ${input.hasPatient ? 'sí' : 'no'}`,
    `Candidatos determinísticos previos: ${deterministic}`,
    '',
    'Catálogo permitido:',
    intentLines,
    '',
    'Esquema JSON:',
    '{',
    '  "intent": "id_del_catalogo o omitir si ambiguo",',
    '  "confidence": 0.0-1.0,',
    '  "missingContext": ["patient"|"encounter"|"draft"],',
    '  "reason": "breve en español",',
    '  "suggestedCandidates": ["intent1","intent2"]',
    '}',
    '',
    `Frase: ${input.text.trim()}`,
  ].join('\n');
}
