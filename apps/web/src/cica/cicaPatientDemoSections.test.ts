import { describe, expect, it } from 'vitest';
import {
  getCicaPatientDemoSectionConfig,
  listCicaPatientDemoSectionScreenIds,
} from './cicaPatientDemoSections.js';

describe('cicaPatientDemoSections', () => {
  it('expone config para alta, interconsultas y procedimientos', () => {
    expect(listCicaPatientDemoSectionScreenIds()).toEqual([
      'patient-discharge',
      'patient-interconsultas',
      'patient-procedures',
    ]);
  });

  it('resuelve blueprint y slot por screenId', () => {
    const config = getCicaPatientDemoSectionConfig('patient-discharge');
    expect(config?.blueprint.screenId).toBe('patient-discharge');
    expect(config?.demoSectionId).toBe('navEpicrisis');
    expect(config?.slotId).toBe('discharge');
    expect(config?.testId).toBe('cica-patient-discharge-screen');
  });
});
