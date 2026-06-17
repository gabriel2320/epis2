import type { CicaScreenBlueprint } from '@epis2/epis2-ui';

export const PATIENT_SUMMARY_BLUEPRINT: CicaScreenBlueprint = {
  screenId: 'patient-summary',
  hideActionBar: false,
  sections: [{ id: 'summary', span: 12 }],
};

export const PATIENT_ORDERS_BLUEPRINT: CicaScreenBlueprint = {
  screenId: 'patient-orders',
  hideActionBar: false,
  sections: [{ id: 'orders', span: 12 }],
};

export const PATIENT_EXAMS_BLUEPRINT: CicaScreenBlueprint = {
  screenId: 'patient-exams',
  hideActionBar: false,
  sections: [{ id: 'exams', span: 12 }],
};
