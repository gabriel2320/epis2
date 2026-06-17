import { copy } from '@epis2/design-system';
import type { CicaPatientIdentityBandProps } from '@epis2/epis2-ui';
import type { DemoClinicalCaseRef } from '../fixtures/demoFixtureTypes.js';
import { getPrimaryNarrativeForDemoCode } from '../clinical/demoNarrativePresentation.js';

export function ageFromBirthDate(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDelta = today.getMonth() - birth.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age;
}

export function sexLabelFromDemo(demoCase: DemoClinicalCaseRef | undefined): string | undefined {
  if (demoCase?.sex === 'F') return copy.chartModes.sexFemale;
  if (demoCase?.sex === 'M') return copy.chartModes.sexMale;
  return undefined;
}

export function demoNationalId(demoCaseCode: string | undefined): string | undefined {
  if (!demoCaseCode) return undefined;
  return `${demoCaseCode} · ${copy.chartModes.identitySyntheticId}`;
}

export type CicaPatientPresentation = {
  identity: CicaPatientIdentityBandProps;
  contextItems: readonly { label: string; value: string }[];
};

/** Props visuales identidad + contexto — reutilizable en cualquier ficha CICA. */
export function buildCicaPatientPresentation(
  displayName: string,
  demoCase: DemoClinicalCaseRef | undefined,
): CicaPatientPresentation {
  const narrative = demoCase?.demoCaseCode
    ? getPrimaryNarrativeForDemoCode(demoCase.demoCaseCode)
    : undefined;

  return {
    identity: {
      displayName,
      ageYears: demoCase ? ageFromBirthDate(demoCase.birthDate) : undefined,
      sexLabel: sexLabelFromDemo(demoCase),
      serviceUnit: narrative?.settingEs ?? demoCase?.scenario,
      documentStatus: 'draft',
    },
    contextItems: [
      { label: 'IA', value: copy.ai.statusOff },
      { label: copy.demoBadge, value: demoCase?.demoCaseCode ?? '—' },
    ],
  };
}
