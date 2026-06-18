import type { CicaScreenBlueprint, CicaScreenId } from '@epis2/epis2-ui';
import type { DemoChartDemoSectionId } from '../fixtures/devFixturesBridge.js';
import {
  PATIENT_DISCHARGE_BLUEPRINT,
  PATIENT_INTERCONSULTAS_BLUEPRINT,
  PATIENT_PROCEDURES_BLUEPRINT,
} from './blueprints/patientScreens.blueprint.js';

/** Config demo tradicional — SoT para rutas ficha sin page dedicada (MF-PONY-03). */
export type CicaPatientDemoSectionConfig = {
  blueprint: CicaScreenBlueprint;
  demoSectionId: DemoChartDemoSectionId;
  slotId: string;
  testId: string;
  listTestId: string;
};

const CICA_PATIENT_DEMO_SECTIONS: Partial<Record<CicaScreenId, CicaPatientDemoSectionConfig>> = {
  'patient-discharge': {
    blueprint: PATIENT_DISCHARGE_BLUEPRINT,
    demoSectionId: 'navEpicrisis',
    slotId: 'discharge',
    testId: 'cica-patient-discharge-screen',
    listTestId: 'cica-discharge-summary',
  },
  'patient-interconsultas': {
    blueprint: PATIENT_INTERCONSULTAS_BLUEPRINT,
    demoSectionId: 'navConsults',
    slotId: 'interconsultas',
    testId: 'cica-patient-interconsultas-screen',
    listTestId: 'cica-interconsultas-list',
  },
  'patient-procedures': {
    blueprint: PATIENT_PROCEDURES_BLUEPRINT,
    demoSectionId: 'navProcedures',
    slotId: 'procedures',
    testId: 'cica-patient-procedures-screen',
    listTestId: 'cica-procedures-list',
  },
};

export function getCicaPatientDemoSectionConfig(
  screenId: CicaScreenId,
): CicaPatientDemoSectionConfig | undefined {
  return CICA_PATIENT_DEMO_SECTIONS[screenId];
}

export function listCicaPatientDemoSectionScreenIds(): CicaScreenId[] {
  return Object.keys(CICA_PATIENT_DEMO_SECTIONS) as CicaScreenId[];
}
