import { describe, expect, it } from 'vitest';
import { buildClinicalAssistantPreamble } from './clinicalPromptPolicy.js';
import { listDraftPromptSpecs } from './draftPromptCatalog.js';
import { buildDraftAssistPrompt } from './prompt.js';

describe('EPIS prompt policy (local-ai)', () => {
  it('preamble incluye reglas de borrador', () => {
    const preamble = buildClinicalAssistantPreamble();
    expect(preamble).toContain('BORRADOR');
    expect(preamble).toContain('NO firmas');
    expect(preamble).toContain('prescribo');
  });

  it('catálogo cubre blueprints MVP y V3', () => {
    expect(listDraftPromptSpecs().map((s) => s.blueprintId)).toEqual([
      'evolution_note',
      'discharge_summary',
      'prescription',
      'lab_request',
      'nursing_note',
      'medication_administration',
      'admission_note',
      'allergy_entry',
      'clinical_problem_entry',
      'pharmacy_validation',
      'medication_reconciliation',
    ]);
  });

  it('prompt de evolución incluye tarea SOAP y JSON', () => {
    const prompt = buildDraftAssistPrompt({
      blueprintId: 'evolution_note',
      fieldIds: ['subjective', 'objective', 'assessment', 'plan'],
      context: { activeProblems: 'HTA (demo)' },
    });
    expect(prompt).toContain('Evolución médica');
    expect(prompt).toContain('suggestedFields');
    expect(prompt).toContain('activeProblems');
  });
});
