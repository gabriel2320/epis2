export type DraftAssistPromptInput = {
  blueprintId: string;
  fieldIds: string[];
  context?: Record<string, string>;
  currentFields?: Record<string, string>;
};

export function buildDraftAssistPrompt(input: DraftAssistPromptInput): string {
  const contextLines = Object.entries(input.context ?? {})
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n');
  const currentLines = Object.entries(input.currentFields ?? {})
    .filter(([, v]) => v.trim())
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n');

  return [
    'Eres un asistente clínico DEMO de EPIS2. Solo datos sintéticos.',
    'Responde ÚNICAMENTE con un objeto JSON (sin markdown) con esta forma:',
    '{',
    '  "suggestedFields": { "<fieldId>": "<texto>" },',
    '  "safetyNotes": ["nota breve"],',
    '  "requiresHumanReview": true',
    '}',
    'PROHIBIDO: aprobar, firmar, auto-approve, escribir en historial final.',
    `Blueprint: ${input.blueprintId}`,
    `Campos permitidos: ${input.fieldIds.join(', ')}`,
    contextLines ? `Contexto:\n${contextLines}` : '',
    currentLines ? `Borrador actual:\n${currentLines}` : '',
    'Genera sugerencias breves en español para campos vacíos o incompletos.',
  ]
    .filter(Boolean)
    .join('\n');
}
