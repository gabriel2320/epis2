import { copy } from '@epis2/design-system';
import type { CicaScreenBlueprint } from '@epis2/epis2-ui';

export const PATIENT_SUMMARY_BLUEPRINT: CicaScreenBlueprint = {
  screenId: 'patient-summary',
  hideActionBar: false,
  sections: [{ id: 'summary', span: 12 }],
  actions: [
    {
      id: 'new-evolution',
      label: copy.clinicalSummary.registerEvolution,
      kind: 'primary',
      targetScreenId: 'new-evolution',
    },
    {
      id: 'new-epicrisis',
      label: copy.inpatient.prepareDischarge,
      kind: 'secondary',
      targetScreenId: 'new-epicrisis',
      testId: 'cica-summary-prepare-epicrisis',
    },
  ],
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
  actions: [
    {
      id: 'new-prescription',
      kind: 'primary',
      targetScreenId: 'new-prescription',
      useRegistryPrimary: true,
      testId: 'cica-medications-new-prescription',
    },
    {
      id: 'open-paper',
      label: copy.chartModes.paper,
      kind: 'secondary',
      targetScreenId: 'paper-book',
      testId: 'cica-medications-open-paper',
    },
  ],
};

export const PATIENT_AUDIT_BLUEPRINT: CicaScreenBlueprint = {
  screenId: 'patient-audit',
  hideActionBar: false,
  sections: [{ id: 'audit', span: 12 }],
  actions: [
    {
      id: 'audit-console',
      label: copy.adminConsole.tabAudit,
      kind: 'primary',
      legacyPath: '/espacio/admin',
      legacySearch: { tab: 'audit' },
      testId: 'cica-audit-open-console',
    },
    {
      id: 'open-paper',
      label: copy.chartModes.paper,
      kind: 'secondary',
      targetScreenId: 'paper-book',
      testId: 'cica-audit-open-paper',
    },
  ],
};

export const PATIENT_DISCHARGE_BLUEPRINT: CicaScreenBlueprint = {
  screenId: 'patient-discharge',
  hideActionBar: false,
  sections: [{ id: 'discharge', span: 12 }],
  actions: [
    {
      id: 'new-epicrisis',
      kind: 'primary',
      targetScreenId: 'new-epicrisis',
      useRegistryPrimary: true,
      testId: 'cica-discharge-new-epicrisis',
    },
  ],
};

export const PATIENT_ADMISSION_BLUEPRINT: CicaScreenBlueprint = {
  screenId: 'patient-admission',
  hideActionBar: false,
  sections: [
    { id: 'anamnesis', span: 12, title: 'Motivo de ingreso' },
    { id: 'admin', span: 12, title: 'Datos administrativos' },
  ],
  actions: [
    {
      id: 'back-to-summary',
      kind: 'primary',
      targetScreenId: 'patient-summary',
      useRegistryPrimary: true,
      testId: 'cica-admission-primary',
    },
  ],
};

export const PATIENT_INTERCONSULTAS_BLUEPRINT: CicaScreenBlueprint = {
  screenId: 'patient-interconsultas',
  hideActionBar: false,
  sections: [{ id: 'interconsultas', span: 12 }],
  actions: [
    {
      id: 'request-consult',
      kind: 'primary',
      targetScreenId: 'patient-summary',
      useRegistryPrimary: true,
      testId: 'cica-interconsultas-primary',
    },
  ],
};

export const PATIENT_PROCEDURES_BLUEPRINT: CicaScreenBlueprint = {
  screenId: 'patient-procedures',
  hideActionBar: false,
  sections: [{ id: 'procedures', span: 12 }],
  actions: [
    {
      id: 'register-procedure',
      kind: 'primary',
      targetScreenId: 'patient-summary',
      useRegistryPrimary: true,
      testId: 'cica-procedures-primary',
    },
  ],
};
