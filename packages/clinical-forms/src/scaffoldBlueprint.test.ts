import { describe, expect, it } from 'vitest';
import { scaffoldBlueprintModule } from './scaffoldBlueprint.js';

describe('scaffoldBlueprintModule', () => {
  it('genera blueprint con ruta y registry hooks', () => {
    const code = scaffoldBlueprintModule({
      blueprintId: 'admission_note',
      routeSegment: 'ingreso',
      label: 'Nota de ingreso',
      purpose: 'Documentar ingreso hospitalario',
      intentId: 'admit_patient_hospital',
      roles: ['physician'],
    });

    expect(code).toContain("blueprintId: 'admission_note'");
    expect(code).toContain("routePath: '/espacio/ingreso'");
    expect(code).toContain("intentIds: ['admit_patient_hospital']");
    expect(code).toContain('export const admissionNoteBlueprint');
  });
});
