import { buildClinicalAssistantPreamble, formatContextBlock } from './clinicalPromptPolicy.js';
import { getDraftPromptSpec } from './draftPromptCatalog.js';

export type DraftAssistPromptInput = {
  blueprintId: string;
  fieldIds: string[];
  context?: Record<string, string>;
  currentFields?: Record<string, string>;
};

export function buildDraftAssistPrompt(input: DraftAssistPromptInput): string {
  const spec = getDraftPromptSpec(input.blueprintId);
  const currentLines = Object.entries(input.currentFields ?? {})
    .filter(([, v]) => v.trim())
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n');

  const taskBlock = spec
    ? [`TAREA: ${spec.taskTitle}`, spec.taskDetail, spec.fieldHints].join('\n')
    : `TAREA: Borrador clínico (${input.blueprintId})`;

  return [
    buildClinicalAssistantPreamble(),
    taskBlock,
    'Responde ÚNICAMENTE con un objeto JSON (sin markdown) con esta forma:',
    '{',
    '  "suggestedFields": { "<fieldId>": "<texto>" },',
    '  "safetyNotes": ["nota breve"],',
    '  "requiresHumanReview": true',
    '}',
    'PROHIBIDO: aprobar, firmar, auto-approve, escribir en historial final.',
    `Blueprint: ${input.blueprintId}`,
    `Campos permitidos: ${input.fieldIds.join(', ')}`,
    formatContextBlock(input.context ?? {}),
    currentLines ? `Borrador actual:\n${currentLines}` : '',
    'Genera sugerencias breves en español para campos vacíos o incompletos.',
  ]
    .filter(Boolean)
    .join('\n');
}
