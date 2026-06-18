import { copy } from '@epis2/design-system';
import {
  CicaBlueprintBody,
  CicaPatientScreenFrame,
  type ClinicalLayoutAction,
  type CicaScreenBlueprint,
} from '@epis2/epis2-ui';
import type { ReactNode } from 'react';
import { ErrorState } from '../components/ErrorState.js';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';

export type CicaPatientBlueprintPageProps = {
  blueprint: CicaScreenBlueprint;
  slots: Partial<Record<string, ReactNode>>;
  actions?: readonly ClinicalLayoutAction[];
  testId?: string;
};

/** Ficha CICA — shell paciente + grilla blueprint (layout automatizado). */
export function CicaPatientBlueprintPage({
  blueprint,
  slots,
  actions = [],
  testId,
}: CicaPatientBlueprintPageProps) {
  const page = useCicaPatientPage();
  const { patientId, detailQuery, presentation, goPath } = page;

  if (!patientId || !presentation) return null;

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
      screenId={blueprint.screenId}
      patientId={patientId}
      activeTabId={page.activeTabId}
      onNavigate={goPath}
      identity={presentation.identity}
      contextItems={presentation.contextItems}
      actions={actions}
      hideActionBar={blueprint.hideActionBar ?? actions.length === 0}
      testId={testId ?? `cica-screen-${blueprint.screenId}`}
    >
      <CicaBlueprintBody blueprint={blueprint} slots={slots} />
    </CicaPatientScreenFrame>
  );
}
