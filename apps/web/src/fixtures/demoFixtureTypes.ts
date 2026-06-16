import type { ClinicalIntent } from '@epis2/command-registry';

export type DemoChartSectionRow = {
  label: string;
  value: string;
};

export type DemoChartPrioritySectionId =
  | 'navAllergies'
  | 'navMeds'
  | 'navOrders'
  | 'navLabs'
  | 'navEvolution';

export type DemoChartDemoSectionId = string;

export type DemoNarrativeEpisode = {
  id: 'iam' | 'ic-cardiology' | 'severe-pneumonia' | 'diabetic-foot' | 'bacteremia';
  demoCaseCode: string;
  titleEs: string;
  oneLinerEs: string;
  settingEs: string;
  suggestedCommandEs: string;
  intent: ClinicalIntent;
};

export type DemoClinicalCaseRef = {
  patientId: string;
  demoCaseCode: string;
  displayName: string;
  birthDate: string;
  scenario: string;
  sex: 'F' | 'M';
};
