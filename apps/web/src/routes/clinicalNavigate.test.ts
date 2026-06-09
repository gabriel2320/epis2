import { describe, expect, it } from 'vitest';
import {
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
});
