/**
 * MF-IC-03 — FHIR Questionnaire export piloto (evolution_note blueprint, sin servidor FHIR).
 */
import { z } from 'zod';
import { buildChileProfileMeta } from './chileInteropMeta.js';
import { EPIS2_CL_FHIR_BASE } from './constants.js';

export const EPIS2_QUESTIONNAIRE_PROFILES = {
  evolutionNote: `${EPIS2_CL_FHIR_BASE}/StructureDefinition/epis2-evolution-note-questionnaire`,
} as const;

export const EVOLUTION_NOTE_BLUEPRINT_ID = 'evolution_note' as const;

/** Campos S/O/A/P + encuentro esperados en el piloto evolution_note. */
export const EVOLUTION_NOTE_QUESTIONNAIRE_FIELD_IDS = [
  'encounterDate',
  'subjective',
  'objective',
  'assessment',
  'plan',
] as const;

export type EvolutionNoteQuestionnaireFieldId =
  (typeof EVOLUTION_NOTE_QUESTIONNAIRE_FIELD_IDS)[number];

export type QuestionnaireFieldSource = {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'checkbox';
  required?: boolean;
};

export type QuestionnaireSectionSource = {
  id: string;
  label: string;
  fieldIds: readonly string[];
};

const questionnaireItemTypeSchema = z.enum([
  'group',
  'display',
  'question',
  'boolean',
  'decimal',
  'integer',
  'date',
  'dateTime',
  'time',
  'string',
  'text',
  'url',
  'choice',
  'open-choice',
  'attachment',
  'reference',
  'quantity',
]);

type QuestionnaireLeafItem = z.infer<typeof questionnaireLeafItemSchema>;

const questionnaireLeafItemTypeSchema = questionnaireItemTypeSchema.exclude(['group']);

const questionnaireLeafItemSchema = z.object({
  linkId: z.string().min(1),
  text: z.string().optional(),
  type: questionnaireLeafItemTypeSchema,
  required: z.boolean().optional(),
});

const questionnaireGroupItemSchema = z.object({
  linkId: z.string().min(1),
  text: z.string().optional(),
  type: z.literal('group'),
  item: z.array(questionnaireLeafItemSchema).min(1),
});

const questionnaireItemSchema = z.union([
  questionnaireGroupItemSchema,
  questionnaireLeafItemSchema,
]);

const metaSchema = z.object({
  profile: z.array(z.string()).optional(),
  tag: z
    .array(
      z.object({
        system: z.string(),
        code: z.string(),
        display: z.string().optional(),
      }),
    )
    .optional(),
});

export const epis2QuestionnaireResourceSchema = z.object({
  resourceType: z.literal('Questionnaire'),
  id: z.string().min(1),
  meta: metaSchema,
  status: z.enum(['draft', 'active', 'retired', 'unknown']),
  name: z.string().min(1),
  title: z.string().optional(),
  description: z.string().optional(),
  item: z.array(questionnaireItemSchema).min(1),
});

export type Epis2QuestionnaireResource = z.infer<typeof epis2QuestionnaireResourceSchema>;

function mapFieldTypeToQuestionnaireItemType(
  type: QuestionnaireFieldSource['type'],
): QuestionnaireLeafItem['type'] {
  switch (type) {
    case 'date':
      return 'date';
    case 'textarea':
      return 'text';
    case 'select':
      return 'choice';
    case 'checkbox':
      return 'boolean';
    case 'text':
    default:
      return 'string';
  }
}

function fieldToQuestionnaireItem(field: QuestionnaireFieldSource): QuestionnaireLeafItem {
  const item: QuestionnaireLeafItem = {
    linkId: field.id,
    text: field.label,
    type: mapFieldTypeToQuestionnaireItemType(field.type),
  };
  if (field.required) item.required = true;
  return item;
}

function collectLinkIds(items: Epis2QuestionnaireResource['item']): string[] {
  const ids: string[] = [];
  for (const item of items) {
    ids.push(item.linkId);
    if (item.type === 'group') {
      ids.push(...item.item.map((leaf) => leaf.linkId));
    }
  }
  return ids;
}

export type BuildEvolutionNoteQuestionnaireOptions = {
  title?: string;
  description?: string;
  sections?: readonly QuestionnaireSectionSource[];
  isSynthetic?: boolean;
};

/** Construye Questionnaire FHIR desde campos del blueprint evolution_note (o compatible). */
export function buildEvolutionNoteQuestionnaire(
  blueprintId: string,
  fields: readonly QuestionnaireFieldSource[],
  options?: BuildEvolutionNoteQuestionnaireOptions,
): Epis2QuestionnaireResource {
  const fieldById = new Map(fields.map((f) => [f.id, f]));
  const sections = options?.sections;
  let items: Epis2QuestionnaireResource['item'];

  if (sections?.length) {
    items = sections.map((section) => ({
      linkId: section.id,
      text: section.label,
      type: 'group' as const,
      item: section.fieldIds
        .map((fieldId) => fieldById.get(fieldId))
        .filter((field): field is QuestionnaireFieldSource => field !== undefined)
        .map(fieldToQuestionnaireItem),
    }));
  } else {
    items = fields.map(fieldToQuestionnaireItem);
  }

  return {
    resourceType: 'Questionnaire',
    id: `questionnaire-${blueprintId}`,
    meta: buildChileProfileMeta(EPIS2_QUESTIONNAIRE_PROFILES.evolutionNote, {
      isSynthetic: options?.isSynthetic ?? true,
    }),
    status: 'draft',
    name: blueprintId,
    title: options?.title ?? 'Evolución médica',
    description: options?.description,
    item: items,
  };
}

export function validateEvolutionNoteQuestionnaire(resource: unknown) {
  const parsed = epis2QuestionnaireResourceSchema.safeParse(resource);
  if (!parsed.success) return { ok: false as const, errors: parsed.error.flatten() };

  if (!parsed.data.meta.profile?.includes(EPIS2_QUESTIONNAIRE_PROFILES.evolutionNote)) {
    return {
      ok: false as const,
      errors: { formErrors: ['meta.profile epis2-evolution-note-questionnaire requerido'] },
    };
  }

  if (parsed.data.name !== EVOLUTION_NOTE_BLUEPRINT_ID) {
    return {
      ok: false as const,
      errors: { formErrors: [`name debe ser ${EVOLUTION_NOTE_BLUEPRINT_ID}`] },
    };
  }

  const linkIds = new Set(collectLinkIds(parsed.data.item));
  const missing = EVOLUTION_NOTE_QUESTIONNAIRE_FIELD_IDS.filter((id) => !linkIds.has(id));
  if (missing.length > 0) {
    return {
      ok: false as const,
      errors: { formErrors: [`linkId faltantes: ${missing.join(', ')}`] },
    };
  }

  return { ok: true as const, resource: parsed.data };
}
