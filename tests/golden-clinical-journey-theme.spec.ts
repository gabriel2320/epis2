/**
 * Golden journey — capa tema (THEME-06).
 * El flujo clínico no depende de decoración; preferencias no alteran seguridad.
 * @see docs/quality/GOLDEN_CLINICAL_JOURNEY.md
 */
import { describe, expect, it } from 'vitest';
import { resolveCommand } from '@epis2/command-registry';
import { clinicalRoles } from '../packages/epis2-ui/src/theme/clinical-roles.js';
import { createEpis2Theme } from '../packages/epis2-ui/src/theme/create-epis2-theme.js';
import { resolveEffectiveThemeMode } from '../packages/epis2-ui/src/theme/theme-mode.js';
import { buildEpis2Shadows } from '../packages/epis2-ui/src/theme/visual-identity.js';

const JOURNEY_THEME_PREFS = [
  { mode: 'light' as const, contrast: 'standard' as const, accent: 'clinicalBlue' as const },
  { mode: 'dark' as const, contrast: 'standard' as const, accent: 'tealBlue' as const },
  { mode: 'system' as const, contrast: 'high' as const, accent: 'clinicalBlue' as const },
];

describe('Golden Clinical Journey — tema (THEME-06)', () => {
  it('preferencias de journey no alteran roles clínicos protegidos', () => {
    for (const pref of JOURNEY_THEME_PREFS) {
      const resolvedMode =
        pref.mode === 'system' ? resolveEffectiveThemeMode('system', false) : pref.mode;
      const theme = createEpis2Theme({
        mode: resolvedMode,
        accent: pref.accent,
        contrast: pref.contrast,
      });
      expect(theme.epis2.clinical).toEqual(clinicalRoles);
    }
  });

  it('elevación tonal — sin sombras en escala MUI del tema', () => {
    const theme = createEpis2Theme({ mode: 'dark', accent: 'clinicalBlue' });
    expect(theme.shadows.every((s) => s === 'none')).toBe(true);
    expect(buildEpis2Shadows('light').every((s) => s === 'none')).toBe(true);
  });

  it('comando evolución resuelve igual con tema sistema simulado', () => {
    resolveEffectiveThemeMode('system', true);
    const result = resolveCommand({
      text: 'evolucionar nota de hoy',
      role: 'physician',
      patientId: 'a0000001-0000-4000-8000-000000000001',
    });
    expect(result.status).toBe('resolved');
    if (result.status === 'resolved') {
      expect(result.routePath).toBe('/espacio/evolucion');
    }
  });

  it('modo tablero accesible con cualquier preferencia de acento MTB', () => {
    for (const accent of ['clinicalBlue', 'tealBlue'] as const) {
      const theme = createEpis2Theme({ mode: 'light', accent });
      expect(theme.epis2.themeId).toMatch(
        /clinical-blue|calm-teal|slate-professional|sage-clinical|ocean-depth|warm-linen/,
      );
      const tablero = resolveCommand({ text: 'abre el tablero', role: 'physician' });
      expect(tablero.status).toBe('resolved');
    }
  });
});
