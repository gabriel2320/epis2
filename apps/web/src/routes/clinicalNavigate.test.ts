import { describe, expect, it } from 'vitest';
import {
  classicModeToDualChartSearch,
  parseClinicalPatientSearch,
  parseCommandSearch,
} from './clinicalNavigate.js';

describe('parseCommandSearch', () => {
  it('parsea intent selectPatient y nextMode classic', () => {
    expect(
      parseCommandSearch({
        intent: 'selectPatient',
        nextMode: 'classic',
        patientId: 'p-1',
      }),
    ).toEqual({
      intent: 'selectPatient',
      nextMode: 'classic',
      patientId: 'p-1',
    });
  });

  it('parsea contexto de retorno y error de permiso dashboard', () => {
    expect(parseCommandSearch({ context: 'dashboard', tab: 'work' })).toEqual({
      context: 'dashboard',
      tab: 'work',
    });
    expect(parseCommandSearch({ error: 'dashboardPermission' })).toEqual({
      error: 'dashboardPermission',
    });
  });
});

describe('parseClinicalPatientSearch', () => {
  it('parsea mode classic y returnTo dashboard', () => {
    expect(
      parseClinicalPatientSearch({
        patientId: 'p-2',
        mode: 'classic',
        returnTo: 'dashboard',
      }),
    ).toEqual({
      patientId: 'p-2',
      mode: 'classic',
      returnTo: 'dashboard',
    });
  });

  it('classicModeToDualChartSearch mapea a chartMode traditional', () => {
    expect(classicModeToDualChartSearch('p-1')).toEqual({
      patientId: 'p-1',
      chartMode: 'traditional',
    });
    expect(classicModeToDualChartSearch('p-2', { section: 'cover' })).toEqual({
      patientId: 'p-2',
      chartMode: 'traditional',
      section: 'cover',
    });
  });

  it('parsea chartMode dual ficha', () => {
    expect(
      parseClinicalPatientSearch({
        patientId: 'p-3',
        chartMode: 'paper',
        section: 'anamnesis',
      }),
    ).toEqual({
      patientId: 'p-3',
      chartMode: 'paper',
      section: 'anamnesis',
    });
  });
});
