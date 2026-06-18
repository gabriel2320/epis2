import { copy } from '@epis2/design-system';
import {
  CicaBlueprintBody,
  CicaPatientScreenFrame,
  type ClinicalLayoutAction,
  type CicaScreenBlueprint,
} from '@epis2/epis2-ui';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { ErrorState } from '../components/ErrorState.js';
import { useClinicalNavigate } from '../routes/clinicalNavigate.js';
import { buildCicaBlueprintActions } from './buildCicaBlueprintActions.js';
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
  const { patientId, detailQuery, presentation, goPath, go } = page;
  const clinicalNavigate = useClinicalNavigate();

  const resolvedActions = useMemo((): readonly ClinicalLayoutAction[] => {
    if (actions.length > 0) return actions;
    if (!patientId) return [];
    return buildCicaBlueprintActions(blueprint, {
      patientId,
      go,
      goLegacy: (path, search) => {
        if (path === '/espacio/admin') {
          clinicalNavigate({
            to: '/espacio/admin',
            search: search as { tab?: 'audit' },
          });
        }
      },
    });
  }, [actions, blueprint, patientId, go, clinicalNavigate]);

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
      actions={resolvedActions}
      hideActionBar={blueprint.hideActionBar ?? resolvedActions.length === 0}
      testId={testId ?? `cica-screen-${blueprint.screenId}`}
    >
      <CicaBlueprintBody blueprint={blueprint} slots={slots} />
    </CicaPatientScreenFrame>
  );
}
