import { describe, expect, it } from 'vitest';
import { assertExportClean } from './validateExport.js';
import {
  buildEvolutionNoteQuestionnaire,
  EPIS2_QUESTIONNAIRE_PROFILES,
  EVOLUTION_NOTE_QUESTIONNAIRE_FIELD_IDS,
  epis2QuestionnaireResourceSchema,
  validateEvolutionNoteQuestionnaire,
  type QuestionnaireFieldSource,
  type QuestionnaireSectionSource,
} from './questionnaireExport.js';

/** Espejo estable del blueprint evolution_note (UI vive en clinical-forms). */
const EVOLUTION_NOTE_FIXTURE = {
  blueprintId: 'evolution_note' as const,
  label: 'Evolución médica',
  purpose: 'Nota de evolución S/O/A/P con borrador humano',
  sections: [
    { id: 'encounter', label: 'Encuentro', fieldIds: ['encounterDate'] },
    { id: 'soap', label: 'Evolución', fieldIds: ['subjective', 'objective', 'assessment', 'plan'] },
  ] satisfies readonly QuestionnaireSectionSource[],
  fields: [
    { id: 'encounterDate', label: 'Fecha del encuentro', type: 'date', required: true },
    { id: 'subjective', label: 'Subjetivo', type: 'textarea', required: true },
    { id: 'objective', label: 'Objetivo', type: 'textarea' },
    { id: 'assessment', label: 'Análisis', type: 'textarea', required: true },
    { id: 'plan', label: 'Plan', type: 'textarea', required: true },
  ] satisfies readonly QuestionnaireFieldSource[],
};

describe('Questionnaire export (MF-IC-03)', () => {
  it('round-trip evolution_note blueprint fields → Questionnaire schema', () => {
    const { blueprintId, label, purpose, sections, fields } = EVOLUTION_NOTE_FIXTURE;

    const questionnaire = buildEvolutionNoteQuestionnaire(blueprintId, fields, {
      title: label,
      description: purpose,
      sections,
      isSynthetic: true,
    });

    expect(questionnaire.resourceType).toBe('Questionnaire');
    expect(questionnaire.name).toBe('evolution_note');
    expect(questionnaire.meta.profile).toContain(EPIS2_QUESTIONNAIRE_PROFILES.evolutionNote);

    const schemaParse = epis2QuestionnaireResourceSchema.safeParse(questionnaire);
    expect(schemaParse.success).toBe(true);

    const validated = validateEvolutionNoteQuestionnaire(questionnaire);
    expect(validated.ok).toBe(true);

    expect(assertExportClean(questionnaire).ok).toBe(true);
  });

  it('incluye todos los linkId S/O/A/P + encounterDate', () => {
    const questionnaire = buildEvolutionNoteQuestionnaire(
      EVOLUTION_NOTE_FIXTURE.blueprintId,
      EVOLUTION_NOTE_FIXTURE.fields,
      { sections: EVOLUTION_NOTE_FIXTURE.sections },
    );

    const collectIds = (items: { linkId: string; item?: { linkId: string; item?: unknown[] }[] }[]): string[] =>
      items.flatMap((item) => [item.linkId, ...(item.item ? collectIds(item.item as typeof items) : [])]);

    const linkIds = new Set(collectIds(questionnaire.item));
    for (const fieldId of EVOLUTION_NOTE_QUESTIONNAIRE_FIELD_IDS) {
      expect(linkIds.has(fieldId)).toBe(true);
    }
  });

  it('mapea tipos date y textarea correctamente', () => {
    const questionnaire = buildEvolutionNoteQuestionnaire(
      EVOLUTION_NOTE_FIXTURE.blueprintId,
      EVOLUTION_NOTE_FIXTURE.fields,
      { sections: EVOLUTION_NOTE_FIXTURE.sections },
    );

    const flatItems = questionnaire.item.flatMap((entry) =>
      entry.type === 'group' ? entry.item : [entry],
    );
    const encounterDate = flatItems.find((i) => i.linkId === 'encounterDate');
    const subjective = flatItems.find((i) => i.linkId === 'subjective');

    expect(encounterDate?.type).toBe('date');
    expect(encounterDate?.required).toBe(true);
    expect(subjective?.type).toBe('text');
    expect(subjective?.required).toBe(true);
  });

  it('rechaza Questionnaire sin perfil evolution_note', () => {
    const base = buildEvolutionNoteQuestionnaire(
      EVOLUTION_NOTE_FIXTURE.blueprintId,
      EVOLUTION_NOTE_FIXTURE.fields,
      { sections: EVOLUTION_NOTE_FIXTURE.sections },
    );
    const invalid = {
      ...base,
      meta: { profile: ['http://example.org/wrong-profile'] },
    };

    expect(validateEvolutionNoteQuestionnaire(invalid).ok).toBe(false);
  });
});
