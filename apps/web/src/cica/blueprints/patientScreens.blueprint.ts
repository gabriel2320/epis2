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
  sections: [
    {
      id: 'summary',
      span: 12,
      title: 'Situacion clinica',
      subtitle: 'Resumen longitudinal, pendientes y accesos a evidencia del episodio.',
    },
  ],
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

export const PATIENT_ORDERS_BLUEPRINT = withRegistryLayout('patient-orders', {
  sections: [
    {
      id: 'orders',
      span: 12,
      title: 'Indicaciones activas',
      subtitle: 'Tratamientos y ordenes relevantes para continuidad clinica.',
    },
  ],
});
export const PATIENT_EXAMS_BLUEPRINT = withRegistryLayout('patient-exams', {
  sections: [
    {
      id: 'exams',
      span: 12,
      title: 'Examenes y tendencias',
      subtitle: 'Resultados recientes con foco en cambios clinicamente significativos.',
    },
  ],
});
export const PATIENT_DOCUMENTS_BLUEPRINT = withRegistryLayout('patient-documents', {
  sections: [
    {
      id: 'documents',
      span: 12,
      title: 'Documentos clinicos',
      subtitle: 'Certificados, epicrisis y antecedentes emitidos durante el episodio.',
    },
  ],
});
export const PATIENT_EVOLUTIONS_BLUEPRINT = withRegistryLayout('patient-evolutions', {
  sections: [
    {
      id: 'evolutions',
      span: 12,
      title: 'Historia evolutiva',
      subtitle: 'Lectura cronologica de notas y eventos narrativos.',
    },
  ],
});
export const PATIENT_TIMELINE_BLUEPRINT = withRegistryLayout('patient-timeline');

export const PATIENT_MEDICATIONS_BLUEPRINT = withRegistryLayout('patient-medications', {
  sections: [
    {
      id: 'medications',
      span: 12,
      title: 'Medicamentos',
      subtitle: 'Farmacos activos, PRN y suspendidos para revision segura.',
    },
  ],
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
  sections: [
    {
      id: 'audit',
      span: 12,
      title: 'Auditoria del episodio',
      subtitle: 'Trazas de acceso, documentos y acciones relevantes.',
    },
  ],
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
  sections: [
    {
      id: 'discharge',
      span: 12,
      title: 'Alta y epicrisis',
      subtitle: 'Vista demo promovida para preparar continuidad y cierre del episodio.',
    },
  ],
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
    {
      id: 'anamnesis',
      span: 12,
      title: 'Motivo de ingreso',
      subtitle: 'Narrativa inicial y antecedentes que orientan el episodio.',
    },
    {
      id: 'admin',
      span: 12,
      title: 'Datos administrativos',
      subtitle: 'Ubicacion, ingreso y datos de contexto operacional.',
    },
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
  sections: [
    {
      id: 'interconsultas',
      span: 12,
      title: 'Interconsultas',
      subtitle: 'Solicitudes y respuestas demo visibles sin crear un modulo nuevo.',
    },
  ],
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
  sections: [
    {
      id: 'procedures',
      span: 12,
      title: 'Procedimientos',
      subtitle: 'Procedimientos y pabellon demo ordenados como pantalla CICA.',
    },
  ],
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
