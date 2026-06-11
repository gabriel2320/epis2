import type { CommandActiveContext, CommandWorkspace } from '@epis2/command-registry';
import { useSearch } from '@tanstack/react-router';
import { useActivePatient } from './ActivePatientContext.js';
import { usePatientClinicalAlerts } from './usePatientClinicalAlerts.js';
import { useDraftsQuery } from '../query/hooks/useDraftsQuery.js';
import { parseChartModeSearch } from '../routes/chartModeSearch.js';

export type CommandResolveContextOptions = {
  chartMode?: 'traditional' | 'paper' | undefined;
};

/** Construye contexto CE-1 incluyendo chartMode papel cuando aplica. */
export function buildCommandResolveContext(
  workspace: CommandWorkspace,
  opts: {
    pendingDraftCount: number;
    activeAlertCount: number;
    chartMode?: 'traditional' | 'paper' | undefined;
  },
): CommandActiveContext {
  const context: CommandActiveContext = { workspace };
  if (opts.pendingDraftCount > 0) {
    context.pendingDraftCount = opts.pendingDraftCount;
  }
  if (opts.activeAlertCount > 0) {
    context.activeAlertCount = opts.activeAlertCount;
  }
  if (workspace === 'patient_chart' && opts.chartMode) {
    context.chartMode = opts.chartMode;
  }
  return context;
}

/** Contexto operativo para ranking CE-1 (borradores, alertas, workspace, chartMode). */
export function useCommandResolveContext(
  workspace: CommandWorkspace,
  options?: CommandResolveContextOptions,
): CommandActiveContext {
  const { patient } = useActivePatient();
  const patientScoped = Boolean(patient?.id) || workspace === 'command_center';
  const rawSearch = useSearch({ strict: false }) as Record<string, unknown>;
  const urlChartMode =
    workspace === 'patient_chart' ? parseChartModeSearch(rawSearch).chartMode : undefined;
  const chartMode = options?.chartMode ?? urlChartMode;

  const draftsQuery = useDraftsQuery(
    patient?.id ? { patientId: patient.id } : undefined,
    patientScoped,
  );

  const { alerts } = usePatientClinicalAlerts({
    patientId: patient?.id,
  });

  return buildCommandResolveContext(workspace, {
    pendingDraftCount: (draftsQuery.data ?? []).length,
    activeAlertCount: patient ? alerts.length : 0,
    chartMode,
  });
}
