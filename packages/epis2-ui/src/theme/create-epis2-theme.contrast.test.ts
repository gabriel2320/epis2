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

  it('alto contraste sube outline/onSurfaceVariant un nivel hacia onSurface (3.6)', () => {
    const standard = createEpis2Theme({ mode: 'light', contrast: 'standard' });
    const high = createEpis2Theme({ mode: 'light', contrast: 'high' });

    expect(high.epis2.surfaces.onSurfaceVariant).toBe(standard.epis2.surfaces.onSurface);
    expect(high.epis2.surfaces.outline).toBe(standard.epis2.surfaces.onSurfaceVariant);
    expect(high.epis2.surfaces.outlineVariant).toBe(standard.epis2.surfaces.outline);
    // Palette MUI sigue a las superficies reforzadas.
    expect(high.palette.text.secondary).toBe(high.epis2.surfaces.onSurfaceVariant);
    expect(high.palette.divider).toBe(high.epis2.surfaces.outlineVariant);
    // Superficies base no cambian — solo jerarquía secundaria.
    expect(high.epis2.surfaces.surface).toBe(standard.epis2.surfaces.surface);
    expect(high.epis2.surfaces.onSurface).toBe(standard.epis2.surfaces.onSurface);
  });

  it('indicador de foco universal: 2px estándar, 3px alto contraste (WCAG 2.4.7)', () => {
    const high = createEpis2Theme({ mode: 'light', contrast: 'high' });
    const standard = createEpis2Theme({ mode: 'light', contrast: 'standard' });

    const resolveBaseline = (theme: ReturnType<typeof createEpis2Theme>) => {
      const styles = theme.components?.MuiCssBaseline?.styleOverrides;
      return typeof styles === 'function'
        ? (styles(theme) as Record<string, unknown>)
        : (styles as Record<string, unknown>);
    };

    const focusRule = (theme: ReturnType<typeof createEpis2Theme>) =>
      resolveBaseline(theme)['*:focus-visible'] as
        | { outline?: string; outlineOffset?: string }
        | undefined;

    expect(focusRule(high)?.outline).toContain('3px solid');
    expect(focusRule(standard)?.outline).toContain('2px solid');
    expect(focusRule(standard)?.outlineOffset).toBe('2px');
  });

  it('state layers M3: hover 8% / focus 10% / pressed 10% (states spec)', () => {
    const theme = createEpis2Theme({ mode: 'light' });

    expect(theme.palette.action.hoverOpacity).toBe(0.08);
    expect(theme.palette.action.focusOpacity).toBe(0.1);
    expect(theme.palette.action.activatedOpacity).toBe(0.1);
    expect(theme.palette.action.selectedOpacity).toBe(0.08);
    // El color del layer proviene de onSurface (color del contenido, no negro fijo).
    expect(theme.palette.action.hover).toContain('rgba(');
  });

  it('expone roles tone-based completos: surfaceDim/Bright, inverse*, scrim', () => {
    const mtb = createEpis2Theme({ mode: 'light', accent: 'clinicalBlue' });
    const legacy = createEpis2Theme({ mode: 'dark', accent: 'neutral' });

    for (const theme of [mtb, legacy]) {
      expect(theme.epis2.surfaces.surfaceDim).toBeTruthy();
      expect(theme.epis2.surfaces.surfaceBright).toBeTruthy();
      expect(theme.epis2.surfaces.inverseSurface).toBeTruthy();
      expect(theme.epis2.surfaces.inverseOnSurface).toBeTruthy();
      expect(theme.epis2.surfaces.scrim).toBeTruthy();
    }
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
