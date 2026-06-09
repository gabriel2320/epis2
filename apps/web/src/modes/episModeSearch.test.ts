/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest';
import {
  buildClassicPatientSearch,
  buildDashboardTabSearch,
  classicModeSearch,
  dashboardModeSearch,
  parseModeSearchRecord,
} from './episModeSearch.js';
import { isClassicModeActive, isDashboardModeActive } from './episModeRuntime.js';

describe('episModeSearch', () => {
  it('parseModeSearchRecord desde URLSearchParams', () => {
    const params = new URLSearchParams('mode=classic&tab=work&returnTo=dashboard');
    expect(parseModeSearchRecord(params)).toEqual({
      mode: 'classic',
      tab: 'work',
      returnTo: 'dashboard',
    });
  });

  it('classicModeSearch y dashboardModeSearch respetan enabled', () => {
    expect(classicModeSearch({ patientId: 'p1' }, true)).toEqual({
      patientId: 'p1',
      mode: 'classic',
    });
    expect(classicModeSearch({ patientId: 'p1' }, false)).toEqual({ patientId: 'p1' });
    expect(dashboardModeSearch({ tab: 'work' }, true)).toEqual({
      tab: 'work',
      mode: 'dashboard',
    });
  });

  it('buildDashboardTabSearch incluye mode cuando md3', () => {
    expect(buildDashboardTabSearch('pharmacy', { md3: true })).toEqual({
      tab: 'pharmacy',
      mode: 'dashboard',
    });
    expect(buildDashboardTabSearch('work', { md3: false })).toEqual({ tab: 'work' });
  });

  it('buildClassicPatientSearch incluye returnTo dashboard', () => {
    expect(buildClassicPatientSearch('p1', 'dashboard')).toEqual({
      mode: 'classic',
      patientId: 'p1',
      returnTo: 'dashboard',
    });
  });
});

describe('episModeRuntime helpers', () => {
  const classicPrefs = { defaultPatientView: 'classic' as const };
  const modernPrefs = { defaultPatientView: 'modern' as const };
  const dashboardPrefs = {
    defaultPatientView: 'modern' as const,
    defaultDashboardView: 'dashboard' as const,
  };

  it('isClassicModeActive prioriza search sobre prefs', () => {
    expect(isClassicModeActive({ mode: 'classic' }, modernPrefs)).toBe(true);
    expect(isClassicModeActive({}, classicPrefs)).toBe(true);
    expect(isClassicModeActive({}, modernPrefs)).toBe(false);
  });

  it('isDashboardModeActive excluye view=classic', () => {
    expect(isDashboardModeActive({ mode: 'dashboard' }, modernPrefs)).toBe(true);
    expect(isDashboardModeActive({ view: 'classic' }, dashboardPrefs)).toBe(false);
    expect(isDashboardModeActive({}, dashboardPrefs)).toBe(true);
  });
});
