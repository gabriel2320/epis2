import { copy } from '@epis2/design-system';
import {
  resolveTrivialCicaBlueprintFromRegistry,
  type CicaScreenBlueprint,
  type CicaScreenId,
} from '@epis2/epis2-ui';

function withRegistryLayout(
  screenId: CicaScreenId,
  overrides: Partial<CicaScreenBlueprint> = {},
): CicaScreenBlueprint {
  const base = resolveTrivialCicaBlueprintFromRegistry(screenId);
  if (!base) {
    throw new Error(`registry falta blueprintSectionId: ${screenId}`);
  }
  return { ...base, ...overrides };
}

export const PATIENT_SUMMARY_BLUEPRINT = withRegistryLayout('patient-summary', {
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
});

export const PATIENT_ORDERS_BLUEPRINT = withRegistryLayout('patient-orders');
export const PATIENT_EXAMS_BLUEPRINT = withRegistryLayout('patient-exams');
export const PATIENT_DOCUMENTS_BLUEPRINT = withRegistryLayout('patient-documents');
export const PATIENT_EVOLUTIONS_BLUEPRINT = withRegistryLayout('patient-evolutions');
export const PATIENT_TIMELINE_BLUEPRINT = withRegistryLayout('patient-timeline');

export const PATIENT_MEDICATIONS_BLUEPRINT = withRegistryLayout('patient-medications', {
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
});

export const PATIENT_AUDIT_BLUEPRINT = withRegistryLayout('patient-audit', {
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
});

export const PATIENT_DISCHARGE_BLUEPRINT = withRegistryLayout('patient-discharge', {
  actions: [
    {
      id: 'new-epicrisis',
      kind: 'primary',
      targetScreenId: 'new-epicrisis',
      useRegistryPrimary: true,
      testId: 'cica-discharge-new-epicrisis',
    },
  ],
});

/** Multi-sección — layout rico, no derivable del registry trivial. */
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

export const PATIENT_INTERCONSULTAS_BLUEPRINT = withRegistryLayout('patient-interconsultas', {
  actions: [
    {
      id: 'request-consult',
      kind: 'primary',
      targetScreenId: 'patient-summary',
      useRegistryPrimary: true,
      testId: 'cica-interconsultas-primary',
    },
  ],
});

export const PATIENT_PROCEDURES_BLUEPRINT = withRegistryLayout('patient-procedures', {
  actions: [
    {
      id: 'register-procedure',
      kind: 'primary',
      targetScreenId: 'patient-summary',
      useRegistryPrimary: true,
      testId: 'cica-procedures-primary',
    },
  ],
});
