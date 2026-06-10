import { copy } from '@epis2/design-system';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { usePatientClinicalAlerts } from '../../clinical/usePatientClinicalAlerts.js';
import { useClinicalCommandSubmit } from '../../clinical/useClinicalCommandSubmit.js';
import { useCommandResolveContext } from '../../clinical/useCommandResolveContext.js';
import { CommandConfirmationDialog } from '../CommandConfirmationDialog.js';
import { usePatientDetailQuery } from '../../query/hooks/usePatientDetailQuery.js';
import { usePatientLongitudinalQuery } from '../../query/hooks/usePatientLongitudinalQuery.js';
import { classicCommandSuggestionLabels } from '../../classic-md3/commandSuggestions.js';
import { ClassicMd3WorkspaceLayout } from './ClassicMd3WorkspaceLayout.js';

export type ClassicMd3ClinicalPageShellProps = {
  patientId: string;
  mainContent: ReactNode;
  supportingContent?: ReactNode;
  draftStatusLabel?: string;
  commandContext?: 'patient_chart' | 'clinical_form';
};

/** Orquestación modo clásico para formularios clínicos — reutiliza command-registry. */
export function ClassicMd3ClinicalPageShell({
  patientId,
  mainContent,
  supportingContent,
  draftStatusLabel,
  commandContext = 'clinical_form',
}: ClassicMd3ClinicalPageShellProps) {
  const [supportingOpen, setSupportingOpen] = useState(true);
  const resolveContext = useCommandResolveContext(commandContext);
  const classicCommand = useClinicalCommandSubmit({
    patientId,
    commandContext: resolveContext,
    onResolved: () => undefined,
  });

  const detailQuery = usePatientDetailQuery(patientId);
  const longitudinalQuery = usePatientLongitudinalQuery(patientId, true);
  const { alerts: clinicalAlerts } = usePatientClinicalAlerts({ patientId });

  const allergyLabels = longitudinalQuery.data?.allergies.map((a) => a.substance) ?? [];
  const alertLabels = clinicalAlerts.filter((a) => a.severity === 'critical').map((a) => a.message);
  const metaLine = [
    detailQuery.data?.patient.demoCaseCode,
    detailQuery.data?.clinicalContext.openEncounterId ? copy.classicMd3.episodeOpen : undefined,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <>
      <ClassicMd3WorkspaceLayout
        patientId={patientId}
        metaLine={metaLine}
        allergyLabels={allergyLabels}
        alertLabels={alertLabels}
        supportingOpen={supportingOpen}
        onSupportingToggle={() => setSupportingOpen((v) => !v)}
        mainContent={mainContent}
        supportingContent={supportingContent}
        commandQuery={classicCommand.query}
        onCommandQueryChange={classicCommand.setQuery}
        onCommandSubmit={() => void classicCommand.submit()}
        commandSuggestions={classicCommandSuggestionLabels(classicCommand.lastResult)}
        onCommandSuggestion={(label) => void classicCommand.submit(label)}
        draftStatusLabel={draftStatusLabel}
      />
      <CommandConfirmationDialog
        pending={classicCommand.pendingConfirmation}
        onConfirm={classicCommand.confirmPending}
        onCancel={classicCommand.cancelPending}
      />
    </>
  );
}
