import { z } from 'zod';

export const PAPER_FIELD_SOURCES = ['human', 'ai_draft', 'template', 'system'] as const;
export type PaperFieldSource = (typeof PAPER_FIELD_SOURCES)[number];

export type PaperFieldState = {
  value: string;
  source: PaperFieldSource;
  confirmed: boolean;
};

export const paperFieldStateSchema = z.object({
  value: z.string().max(16_000).default(''),
  source: z.enum(PAPER_FIELD_SOURCES).default('human'),
  confirmed: z.boolean().default(true),
});

export type PaperSignValidationError = {
  ruleId: 'requires_no_unconfirmed_ai';
  message: string;
  sectionId?: string;
};

export function insertAiSuggestion(_field: PaperFieldState, suggestion: string): PaperFieldState {
  return {
    value: suggestion,
    source: 'ai_draft',
    confirmed: false,
  };
}

export function confirmAiSuggestion(field: PaperFieldState): PaperFieldState {
  return {
    ...field,
    source: 'human',
    confirmed: true,
  };
}

export function rejectAiSuggestion(_field: PaperFieldState): PaperFieldState {
  return {
    value: '',
    source: 'human',
    confirmed: true,
  };
}

export function canSignPaperChartFields(
  fields: readonly PaperFieldState[],
): {
  ok: boolean;
  errors: PaperSignValidationError[];
} {
  const errors: PaperSignValidationError[] = [];

  for (const field of fields) {
    if (field.source === 'ai_draft' && !field.confirmed) {
      errors.push({
        ruleId: 'requires_no_unconfirmed_ai',
        message: 'Existen sugerencias de IA no confirmadas.',
      });
      break;
    }
  }

  return { ok: errors.length === 0, errors };
}

export function countUnconfirmedAiFields(fields: readonly PaperFieldState[]): number {
  return fields.filter((f) => f.source === 'ai_draft' && !f.confirmed).length;
}

export function paperChartSignBlockMessage(fields: readonly PaperFieldState[]): string | undefined {
  const count = countUnconfirmedAiFields(fields);
  if (count === 0) return undefined;
  return count === 1
    ? 'Hay 1 sugerencia de IA sin confirmar. Revise el documento antes de firmar.'
    : `Hay ${count} sugerencias de IA sin confirmar. Revise el documento antes de firmar.`;
}
