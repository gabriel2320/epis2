import { describe, expect, it } from 'vitest';
import { clinicalRoles } from './clinical-roles.js';
import { createEpis2Theme } from './create-epis2-theme.js';

describe('createEpis2Theme contrast (THEME-05)', () => {
  it('alto contraste refuerza cuerpo sin alterar roles clínicos', () => {
    const standard = createEpis2Theme({ mode: 'light', contrast: 'standard' });
    const high = createEpis2Theme({ mode: 'light', contrast: 'high' });

    expect(high.typography?.body1?.fontWeight).toBe(500);
    expect(standard.typography?.body1?.fontWeight).toBe(400);
    expect(high.epis2.clinical).toEqual(clinicalRoles);
  });

  it('dark + alto contraste + MTB mantiene palette oscura', () => {
    const theme = createEpis2Theme({
      mode: 'dark',
      contrast: 'high',
      accent: 'tealBlue',
    });

    expect(theme.palette.mode).toBe('dark');
    expect(theme.epis2.themeId).toBe('calm-teal');
    expect(theme.palette.text?.primary).toBeTruthy();
    expect(theme.epis2.clinical.critical.main).toBe(clinicalRoles.critical.main);
  });
});
