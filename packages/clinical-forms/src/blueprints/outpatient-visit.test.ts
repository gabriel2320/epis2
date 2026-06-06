import { describe, expect, it } from 'vitest';
import { outpatientVisitBlueprint } from './outpatient-visit.js';

describe('outpatientVisitBlueprint', () => {
  it('expone secciones scrollspy Ola 2 con lazy loading', () => {
    const collapsed = outpatientVisitBlueprint.sections.filter(
      (s) => s.initialVisibility === 'collapsed',
    );
    expect(collapsed.map((s) => s.id)).toEqual([
      'vitals',
      'physical-general',
      'physical-segment',
      'closure',
    ]);
  });

  it('incluye cierre de episodio e ICD-10 demo', () => {
    const fieldIds = outpatientVisitBlueprint.fields.map((f) => f.id);
    expect(fieldIds).toContain('icd10Code');
    expect(fieldIds).toContain('closeEncounter');
    expect(fieldIds).toContain('patientSummaryForPatient');
  });
});
