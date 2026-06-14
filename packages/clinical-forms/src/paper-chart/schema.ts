import { z } from 'zod';
import {
  confirmAiSuggestion,
  insertAiSuggestion,
  paperFieldStateSchema,
  type PaperFieldState,
} from './paperAiState.js';

/** IDs alineados a `apps/web/.../paperChartSections.ts` (ADR-002). */
export const PAPER_CHART_SECTION_IDS = [
  'cover',
  'anamnesis',
  'physicalExam',
  'orders',
  'soap',
  'labs',
  'discharge',
  'nursing',
  'fluidBalance',
  'consults',
  'procedures',
  'imaging',
  'consent',
  'socialWork',
] as const;

export type PaperChartSectionId = (typeof PAPER_CHART_SECTION_IDS)[number];

const sectionValue = () => z.string().max(16_000);

const legacyOrFieldSchema = z.union([sectionValue(), paperFieldStateSchema]);

const paperChartRawBodySchema = z.object({
  cover: legacyOrFieldSchema.optional(),
  anamnesis: legacyOrFieldSchema.optional(),
  physicalExam: legacyOrFieldSchema.optional(),
  orders: legacyOrFieldSchema.optional(),
  soap: legacyOrFieldSchema.optional(),
  labs: legacyOrFieldSchema.optional(),
  discharge: legacyOrFieldSchema.optional(),
  nursing: legacyOrFieldSchema.optional(),
  fluidBalance: legacyOrFieldSchema.optional(),
  consults: legacyOrFieldSchema.optional(),
  procedures: legacyOrFieldSchema.optional(),
  imaging: legacyOrFieldSchema.optional(),
  consent: legacyOrFieldSchema.optional(),
  socialWork: legacyOrFieldSchema.optional(),
});

/** Cuerpo normalizado del borrador `paper_chart` en PostgreSQL. */
export type PaperChartDraftBody = Record<PaperChartSectionId, PaperFieldState>;

export const paperChartSectionPatchSchema = z.object({
  sectionId: z.enum(PAPER_CHART_SECTION_IDS),
  body: sectionValue(),
  source: z.enum(['human', 'ai_draft', 'template', 'system']).optional(),
  confirmed: z.boolean().optional(),
});

export type PaperChartSectionPatch = z.infer<typeof paperChartSectionPatchSchema>;

export const PAPER_CHART_DRAFT_TYPE = 'paper_chart' as const;

/** @deprecated Preferir PaperChartDraftBody — alias parse JSONB legacy/v2. */
export const paperChartSectionSchema = paperChartRawBodySchema;

export function normalizePaperField(raw: unknown): PaperFieldState {
  if (typeof raw === 'string') {
    return { value: raw, source: 'human', confirmed: true };
  }
  if (raw && typeof raw === 'object' && 'value' in raw) {
    return paperFieldStateSchema.parse(raw);
  }
  return { value: '', source: 'human', confirmed: true };
}

export function emptyPaperChartDraft(): PaperChartDraftBody {
  return parsePaperChartBody({});
}

export function parsePaperChartBody(body: unknown): PaperChartDraftBody {
  const raw = paperChartRawBodySchema.parse(body ?? {});
  return Object.fromEntries(
    PAPER_CHART_SECTION_IDS.map((id) => [id, normalizePaperField(raw[id])]),
  ) as PaperChartDraftBody;
}

export function parsePaperChartSectionPatch(input: unknown): PaperChartSectionPatch {
  return paperChartSectionPatchSchema.parse(input);
}

export function applyPaperChartSectionPatch(
  current: PaperChartDraftBody,
  patch: PaperChartSectionPatch,
): PaperChartDraftBody {
  const prev = current[patch.sectionId];
  let next: PaperFieldState;

  if (patch.source === 'ai_draft') {
    next = insertAiSuggestion(prev, patch.body);
  } else if (patch.confirmed === true && prev.source === 'ai_draft') {
    next = confirmAiSuggestion({ ...prev, value: patch.body });
  } else if (patch.source !== undefined || patch.confirmed !== undefined) {
    next = paperFieldStateSchema.parse({
      ...prev,
      value: patch.body,
      source: patch.source ?? prev.source,
      confirmed: patch.confirmed ?? prev.confirmed,
    });
  } else {
    next = { value: patch.body, source: 'human', confirmed: true };
  }

  return { ...current, [patch.sectionId]: next };
}

export function mergePaperChartSection(
  current: PaperChartDraftBody,
  sectionId: PaperChartSectionId,
  body: string,
): PaperChartDraftBody {
  return applyPaperChartSectionPatch(current, { sectionId, body });
}

export function paperChartFieldValues(
  body: PaperChartDraftBody,
): Record<PaperChartSectionId, string> {
  return Object.fromEntries(PAPER_CHART_SECTION_IDS.map((id) => [id, body[id].value])) as Record<
    PaperChartSectionId,
    string
  >;
}

export function canSignPaperChart(body: PaperChartDraftBody): {
  ok: boolean;
  errors: Array<{
    ruleId: 'requires_no_unconfirmed_ai';
    message: string;
    sectionId?: PaperChartSectionId;
  }>;
} {
  const errors: Array<{
    ruleId: 'requires_no_unconfirmed_ai';
    message: string;
    sectionId?: PaperChartSectionId;
  }> = [];

  for (const sectionId of PAPER_CHART_SECTION_IDS) {
    const field = body[sectionId];
    if (field.source === 'ai_draft' && !field.confirmed) {
      errors.push({
        ruleId: 'requires_no_unconfirmed_ai',
        message: 'Existen sugerencias de IA no confirmadas.',
        sectionId,
      });
    }
  }

  return { ok: errors.length === 0, errors };
}

export function paperChartSignBlockMessage(body: PaperChartDraftBody): string | undefined {
  const count = PAPER_CHART_SECTION_IDS.filter(
    (id) => body[id].source === 'ai_draft' && !body[id].confirmed,
  ).length;
  if (count === 0) return undefined;
  return count === 1
    ? 'Hay 1 sugerencia de IA sin confirmar. Revise el documento antes de firmar.'
    : `Hay ${count} sugerencias de IA sin confirmar. Revise el documento antes de firmar.`;
}

export type { PaperFieldState, PaperFieldSource } from './paperAiState.js';
export { PAPER_FIELD_SOURCES, paperFieldStateSchema } from './paperAiState.js';
