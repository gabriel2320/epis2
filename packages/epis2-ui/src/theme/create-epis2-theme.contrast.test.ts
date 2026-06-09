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

  it('alto contraste agrega indicador de foco universal en CssBaseline', () => {
    const high = createEpis2Theme({ mode: 'light', contrast: 'high' });
    const standard = createEpis2Theme({ mode: 'light', contrast: 'standard' });

    const resolveBaseline = (theme: ReturnType<typeof createEpis2Theme>) => {
      const styles = theme.components?.MuiCssBaseline?.styleOverrides;
      return typeof styles === 'function'
        ? (styles(theme) as Record<string, unknown>)
        : (styles as Record<string, unknown>);
    };

    const highRule = resolveBaseline(high)['*:focus-visible'] as
      | { outline?: string; outlineOffset?: string }
      | undefined;
    expect(highRule?.outline).toContain('3px solid');
    expect(highRule?.outlineOffset).toBe('2px');
    expect(resolveBaseline(standard)['*:focus-visible']).toBeUndefined();
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
