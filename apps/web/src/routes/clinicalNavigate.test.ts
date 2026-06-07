import { describe, expect, it } from 'vitest';
import { formSearchFromCommandSlots } from '../clinical/commandFormSearch.js';
import { DASHBOARD_TABS, parseClinicalFormSearch, parseDashboardSearch } from './clinicalNavigate.js';

describe('parseClinicalFormSearch (CE-3b)', () => {
  it('parsea patientId y slots opcionales', () => {
    expect(
      parseClinicalFormSearch({
        patientId: 'pid-1',
        studyHint: ' hemograma ',
        urgencyHint: 'urgent',
        medicationHint: 'amoxicilina',
      }),
    ).toEqual({
      patientId: 'pid-1',
      studyHint: 'hemograma',
      urgencyHint: 'urgent',
      medicationHint: 'amoxicilina',
    });
  });

  it('ignora urgencyHint inválido', () => {
    expect(parseClinicalFormSearch({ urgencyHint: 'ya' })).toEqual({});
  });
});

describe('formSearchFromCommandSlots', () => {
  it('serializa slots útiles para navegación', () => {
    expect(
      formSearchFromCommandSlots('pid-1', {
        specialtyHint: 'cardiologia',
      }),
    ).toEqual({
      patientId: 'pid-1',
      specialtyHint: 'cardiologia',
    });
  });
});

describe('parseDashboardSearch', () => {
  it('acepta los 12 tabs dashboard (UX-G04b)', () => {
    for (const tab of DASHBOARD_TABS) {
      expect(parseDashboardSearch({ tab }).tab).toBe(tab);
    }
  });

  it('fallback a work cuando tab inválido', () => {
    expect(parseDashboardSearch({ tab: 'invalid' }).tab).toBe('work');
  });

  it('preserva patientId', () => {
    expect(parseDashboardSearch({ tab: 'icu', patientId: 'pid-1' }).patientId).toBe('pid-1');
  });
});
