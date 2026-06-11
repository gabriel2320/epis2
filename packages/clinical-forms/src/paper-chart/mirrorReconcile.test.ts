import { describe, expect, it } from 'vitest';
import { emptyPaperChartDraft } from './schema.js';
import {
  buildMirrorVariablesFromSummaryFields,
  isPaperDraftEmpty,
  reconcilePaperDraftFromSummaryFields,
  seedPaperDraftFromMirrorVariables,
} from './mirrorReconcile.js';

describe('mirrorReconcile (MF-PA-05)', () => {
  it('construye variables desde summaryFields', () => {
    const vars = buildMirrorVariablesFromSummaryFields({
      activeProblems: 'HTA (demo)',
      activeMedications: 'Losartán 50 mg',
    });
    expect(vars['summary.active_problems']).toBe('HTA (demo)');
    expect(vars['summary.active_medications']).toBe('Losartán 50 mg');
  });

  it('siembra secciones vacías sin sobrescribir', () => {
    const draft = emptyPaperChartDraft();
    draft.cover = { value: 'Contenido humano', source: 'human', confirmed: true };
    const seeded = seedPaperDraftFromMirrorVariables(draft, {
      'summary.active_medications': 'Losartán 50 mg',
    });
    expect(seeded.cover.value).toBe('Contenido humano');
    expect(seeded.orders.value).toContain('Losartán');
  });

  it('reconcile desde summary solo si borrador vacío', () => {
    const empty = reconcilePaperDraftFromSummaryFields({
      relevantLabs: 'Creatinina 1.0',
    });
    expect(isPaperDraftEmpty(emptyPaperChartDraft())).toBe(true);
    expect(empty.labs.value).toContain('Creatinina');
    const prefilled = emptyPaperChartDraft();
    prefilled.anamnesis = { value: 'Ya escrito', source: 'human', confirmed: true };
    const kept = reconcilePaperDraftFromSummaryFields({ relevantLabs: 'X' }, prefilled);
    expect(kept.anamnesis.value).toBe('Ya escrito');
  });
});
