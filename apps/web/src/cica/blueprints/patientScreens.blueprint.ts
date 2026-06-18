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

export const PATIENT_DOCUMENTS_BLUEPRINT: CicaScreenBlueprint = {
  screenId: 'patient-documents',
  hideActionBar: false,
  sections: [{ id: 'documents', span: 12 }],
};

export const PATIENT_EVOLUTIONS_BLUEPRINT: CicaScreenBlueprint = {
  screenId: 'patient-evolutions',
  hideActionBar: false,
  sections: [{ id: 'evolutions', span: 12 }],
};

export const PATIENT_TIMELINE_BLUEPRINT: CicaScreenBlueprint = {
  screenId: 'patient-timeline',
  hideActionBar: true,
  sections: [{ id: 'timeline', span: 12 }],
};

export const PATIENT_MEDICATIONS_BLUEPRINT: CicaScreenBlueprint = {
  screenId: 'patient-medications',
  hideActionBar: false,
  sections: [{ id: 'medications', span: 12 }],
};

export const PATIENT_AUDIT_BLUEPRINT: CicaScreenBlueprint = {
  screenId: 'patient-audit',
  hideActionBar: false,
  sections: [{ id: 'audit', span: 12 }],
};
