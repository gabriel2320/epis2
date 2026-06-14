import { describe, expect, it } from 'vitest';
import { evolutionNoteBlueprint } from '../blueprints/evolution-note.js';
import {
  buildLiveTemplatePrefill,
  canSuggestLiveTemplate,
  materializeLiveTemplateBlueprint,
} from './resolveLiveTemplate.js';

const DM2_SUMMARY = {
  activeProblems: 'Diabetes mellitus tipo 2',
  activeMedications: 'Metformina 850 mg/día',
  relevantLabs: 'HbA1c 7.2 %',
};

const DM2_ERC_INSULIN = {
  activeProblems: 'Diabetes mellitus tipo 2\nEnfermedad renal crónica estadio 3',
  activeMedications: 'Insulina glargina 20 UI/noche',
  relevantLabs: 'Creatinina 1.4 mg/dL · HbA1c 8.1 %',
};

describe('live template dm2_control', () => {
  it('no sugiere plantilla sin diagnóstico DM2', () => {
    expect(
      canSuggestLiveTemplate('dm2_control', {
        activeProblems: 'Hipertensión arterial',
        activeMedications: 'Losartán 50 mg/día',
      }),
    ).toBe(false);
  });

  it('sugiere plantilla con DM2 activa', () => {
    expect(canSuggestLiveTemplate('dm2_control', DM2_SUMMARY)).toBe(true);
  });

  it('materializa solo campos base sin ERC ni insulina', () => {
    const materialized = materializeLiveTemplateBlueprint(
      'dm2_control',
      evolutionNoteBlueprint,
      DM2_SUMMARY,
    );
    expect(materialized).not.toBeNull();
    expect(materialized!.fields.map((f) => f.id)).not.toContain('renalFunctionReview');
    expect(materialized!.fields.map((f) => f.id)).not.toContain('hypoglycemiaReview');
  });

  it('muestra función renal e hipoglucemias con ERC + insulina', () => {
    const materialized = materializeLiveTemplateBlueprint(
      'dm2_control',
      evolutionNoteBlueprint,
      DM2_ERC_INSULIN,
    );
    const ids = materialized!.fields.map((f) => f.id);
    expect(ids).toContain('renalFunctionReview');
    expect(ids).toContain('hypoglycemiaReview');
    expect(materialized!.sections.some((s) => s.id === 'dm2_comorbidities')).toBe(true);
  });

  it('prefill condicional por comorbilidad', () => {
    expect(buildLiveTemplatePrefill('dm2_control', DM2_SUMMARY)).toEqual({});
    const prefill = buildLiveTemplatePrefill('dm2_control', DM2_ERC_INSULIN);
    expect(prefill.renalFunctionReview).toMatch(/Creatinina/i);
    expect(prefill.hypoglycemiaReview).toMatch(/hipogluc/i);
  });
});
