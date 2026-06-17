import { copy } from '@epis2/design-system';
import {
  CicaPatientScreenFrame,
  CicaStructuredSection,
  EpisM3Text,
  findCicaScreenById,
  type ClinicalLayoutAction,
  type CicaScreenId,
} from '@epis2/epis2-ui';
import type { ReactNode } from 'react';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';
import { ErrorState } from '../components/ErrorState.js';

export type CicaPatientSectionPageProps = {
  screenId: CicaScreenId;
  placeholder?: string;
  actions?: readonly ClinicalLayoutAction[];
  blockContent?: Partial<Record<string, ReactNode>>;
};

/** Sección ficha — bloques epis2g + frame CICA. */
export function CicaPatientSectionPage({
  screenId,
  placeholder = copy.forms.needsPatient,
  actions = [],
  blockContent,
}: CicaPatientSectionPageProps) {
  const page = useCicaPatientPage();
  const { patientId, detailQuery, presentation, goPath } = page;
  const screen = findCicaScreenById(screenId);

  if (!patientId || !presentation || !screen) return null;

  if (detailQuery.isError) {
    return (
      <ErrorState
        title={copy.errors.genericTitle}
        message={copy.errors.genericMessage}
        onRetry={() => detailQuery.refetch()}
      />
    );
  }

  if (!detailQuery.data) return null;

  return (
    <CicaPatientScreenFrame
      screenId={screenId}
      patientId={patientId}
      activeTabId={page.activeTabId}
      onNavigate={goPath}
      identity={presentation.identity}
      contextItems={presentation.contextItems}
      actions={actions}
      hideActionBar={actions.length === 0}
      testId={`cica-screen-${screenId}`}
    >
      <CicaStructuredSection
        screenId={screenId}
        blocks={blockContent ?? {}}
        placeholder={
          <EpisM3Text role="bodyMedium" color="text.secondary">
            {placeholder}
          </EpisM3Text>
        }
      />
    </CicaPatientScreenFrame>
  );
}

export function CicaPatientAdmissionPage() {
  return (
    <CicaPatientSectionPage
      screenId="patient-admission"
      placeholder="Complete anamnesis, antecedentes y plan inicial de ingreso."
    />
  );
}

export function CicaPatientMedicationsPage() {
  return (
    <CicaPatientSectionPage
      screenId="patient-medications"
      placeholder="Prescripciones activas y receta del episodio."
    />
  );
}

export function CicaPatientInterconsultasPage() {
  return (
    <CicaPatientSectionPage
      screenId="patient-interconsultas"
      placeholder="Solicitudes y respuestas de interconsulta."
    />
  );
}

export function CicaPatientProceduresPage() {
  return (
    <CicaPatientSectionPage
      screenId="patient-procedures"
      placeholder="Registro operatorio y procedimientos del episodio."
    />
  );
}

export function CicaPatientDischargePage() {
  const { patientId, go } = useCicaPatientPage();
  const actions: ClinicalLayoutAction[] =
    patientId != null
      ? [
          {
            id: 'new-epicrisis',
            label: 'Nueva epicrisis',
            kind: 'primary',
            onClick: () => go('new-epicrisis', { patientId }),
          },
        ]
      : [];

  return (
    <CicaPatientSectionPage
      screenId="patient-discharge"
      placeholder="Redacte epicrisis y resumen de cierre del episodio."
      actions={actions}
    />
  );
}

export function CicaPatientTimelinePage() {
  return (
    <CicaPatientSectionPage
      screenId="patient-timeline"
      placeholder="Eventos clínicos agrupados por periodo."
    />
  );
}

export function CicaPatientAuditPage() {
  return (
    <CicaPatientSectionPage
      screenId="patient-audit"
      placeholder="Trazas de acceso, firmas y cumplimiento."
    />
  );
}
