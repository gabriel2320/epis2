import { z } from 'zod';

/** IDs alineados a `apps/web/.../paperChartSections.ts` (ADR-002). */
export const PAPER_CHART_SECTION_IDS = [
  'cover',
  'anamnesis',
  'physicalExam',
  'orders',
  'soap',
  'labs',
  'discharge',
] as const;

export type PaperChartSectionId = (typeof PAPER_CHART_SECTION_IDS)[number];

const sectionField = () => z.string().max(16_000).default('');

/** Cuerpo JSONB del borrador `paper_chart` en PostgreSQL. */
export const paperChartSectionSchema = z.object({
  cover: sectionField(),
  anamnesis: sectionField(),
  physicalExam: sectionField(),
  orders: sectionField(),
  soap: sectionField(),
  labs: sectionField(),
  discharge: sectionField(),
});

export type PaperChartDraftBody = z.infer<typeof paperChartSectionSchema>;

export const paperChartSectionPatchSchema = z.object({
  sectionId: z.enum(PAPER_CHART_SECTION_IDS),
  body: sectionField(),
});

export type PaperChartSectionPatch = z.infer<typeof paperChartSectionPatchSchema>;

export const PAPER_CHART_DRAFT_TYPE = 'paper_chart' as const;

export function emptyPaperChartDraft(): PaperChartDraftBody {
  return paperChartSectionSchema.parse({});
}

export function parsePaperChartBody(body: unknown): PaperChartDraftBody {
  return paperChartSectionSchema.parse(body ?? {});
}

export function parsePaperChartSectionPatch(input: unknown): PaperChartSectionPatch {
  return paperChartSectionPatchSchema.parse(input);
}

export function mergePaperChartSection(
  current: PaperChartDraftBody,
  sectionId: PaperChartSectionId,
  body: string,
): PaperChartDraftBody {
  return paperChartSectionSchema.parse({ ...current, [sectionId]: body });
}
