import { useSearch } from '@tanstack/react-router';
import { useRouterState } from '@tanstack/react-router';
import { classicCommandSuggestionLabels } from '../../classic-md3/commandSuggestions.js';
import { useClinicalCommandSubmit } from '../../clinical/useClinicalCommandSubmit.js';
import { useCommandResolveContext } from '../../clinical/useCommandResolveContext.js';
import { useActivePatient } from '../../clinical/ActivePatientContext.js';
import { isDualChartModesEnabled } from '../../dev/dualChartModesEnv.js';
import { CommandConfirmationDialog } from '../CommandConfirmationDialog.js';
import { EpisUniversalCommandBar } from '../command/EpisUniversalCommandBar.js';

export type ClinicalTransversalCommandDockProps = {
  /** Override cuando el paciente viene de URL y aún no está en ActivePatient. */
  patientId?: string | undefined;
  /** Forzar superficie censo vs ficha. */
  workspace?: 'command_center' | 'patient_chart' | undefined;
  testId?: string | undefined;
};

/**
 * Barra de comando NL transversal — obligatoria en todo /espacio/* clínico (ADR-002 · Screen Map §0).
 * Excepciones: legacy ficha sin dual-chart (PatientWorkspaceCommandPanel en página).
 */
export function ClinicalTransversalCommandDock({
  patientId: patientIdOverride,
  workspace: workspaceOverride,
  testId,
}: ClinicalTransversalCommandDockProps = {}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const rawSearch = useSearch({ strict: false }) as { patientId?: string };
  const { patient } = useActivePatient();

  const isCensus = pathname.startsWith('/espacio/buscar-paciente');
  const isPaperStandalone = pathname.startsWith('/espacio/ficha/papel');
  const isLegacyEmbeddedFicha = pathname === '/espacio/ficha' && !isDualChartModesEnabled();

  /** Papel monta su propia barra (StandalonePaperChartPage) — evitar duplicado con scaffold. */
  if (isPaperStandalone || isLegacyEmbeddedFicha) {
    return null;
  }

  const patientId = patientIdOverride ?? patient?.id ?? rawSearch.patientId;
  const workspace = workspaceOverride ?? (isCensus ? 'command_center' : 'patient_chart');

  if (!isCensus && !patientId) {
    return null;
  }

  return (
    <ClinicalTransversalCommandDockInner
      patientId={patientId}
      workspace={workspace}
      isCensus={isCensus}
      isPaperStandalone={isPaperStandalone}
      testId={testId}
    />
  );
}

type InnerProps = {
  patientId?: string | undefined;
  workspace: 'command_center' | 'patient_chart';
  isCensus: boolean;
  isPaperStandalone: boolean;
  testId?: string | undefined;
};

function ClinicalTransversalCommandDockInner({
  patientId,
  workspace,
  isCensus,
  isPaperStandalone,
  testId,
}: InnerProps) {
  const commandContext = useCommandResolveContext(workspace);
  const command = useClinicalCommandSubmit({
    ...(patientId ? { patientId } : {}),
    commandContext,
  });
  const { query, setQuery, submit, pendingConfirmation, confirmPending, cancelPending } = command;

  const resolvedTestId =
    testId ??
    (isCensus
      ? 'epis2-census-command-bar'
      : isPaperStandalone
        ? 'epis2-paper-command-bar'
        : 'epis2-espacio-chart-command-bar');

  return (
    <>
      <EpisUniversalCommandBar
        variant={isCensus ? 'census-search' : 'clinical-chart'}
        embedded
        query={query}
        onQueryChange={setQuery}
        onSubmit={() => void submit()}
        suggestions={classicCommandSuggestionLabels(command.lastResult)}
        onSuggestionSelect={(label) => void submit(label)}
        testId={resolvedTestId}
      />
      <CommandConfirmationDialog
        pending={pendingConfirmation}
        onConfirm={() => void confirmPending()}
        onCancel={cancelPending}
      />
    </>
  );
}
