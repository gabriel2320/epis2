import type { CommandActiveContext, CommandWorkspace } from '@epis2/command-registry';
import { useSearch } from '@tanstack/react-router';
import { useActivePatient } from './ActivePatientContext.js';
import { usePatientClinicalAlerts } from './usePatientClinicalAlerts.js';
import { useDraftsQuery } from '../query/hooks/useDraftsQuery.js';
import { parseChartModeSearch } from '../routes/chartModeSearch.js';

export type CommandResolveContextOptions = {
  chartMode?: 'traditional' | 'paper' | undefined;
  traditionalSection?: CommandActiveContext['traditionalSection'];
  assistBlueprintId?: string | undefined;
};

export const EHR_SECTION_SEARCH_KEY = 'ehrSection';

const TRADITIONAL_SECTION_NAV_IDS = new Set<string>([
  'navSummary',
  'navAdmin',
  'navAnamnesis',
  'navAntecedents',
  'navAllergies',
  'navPhysicalExam',
  'navDiagnoses',
  'navOrders',
  'navMeds',
  'navEvolution',
  'navLabs',
  'navImaging',
  'navConsults',
  'navDocuments',
  'navEpicrisis',
  'navProcedures',
  'navAudit',
]);

/** Parsea sección nav tradicional desde search params (MF-CM-04). */
export function parseEhrSectionSearch(
  search: Record<string, unknown>,
): CommandActiveContext['traditionalSection'] | undefined {
  const raw = search[EHR_SECTION_SEARCH_KEY];
  if (typeof raw !== 'string' || !TRADITIONAL_SECTION_NAV_IDS.has(raw)) return undefined;
  return raw as CommandActiveContext['traditionalSection'];
}

/** Construye contexto CE-1 incluyendo chartMode, sección y blueprint cuando aplica. */
export function buildCommandResolveContext(
  workspace: CommandWorkspace,
  opts: {
    pendingDraftCount: number;
    activeAlertCount: number;
    chartMode?: 'traditional' | 'paper' | undefined;
    paperSurface?: CommandActiveContext['paperSurface'];
    plannerView?: CommandActiveContext['plannerView'];
    traditionalSection?: CommandActiveContext['traditionalSection'];
    assistBlueprintId?: string | undefined;
  },
): CommandActiveContext {
  const context: CommandActiveContext = { workspace };
  if (opts.pendingDraftCount > 0) {
    context.pendingDraftCount = opts.pendingDraftCount;
  }
  if (opts.activeAlertCount > 0) {
    context.activeAlertCount = opts.activeAlertCount;
  }
  if (workspace === 'patient_chart') {
    if (opts.chartMode) {
      context.chartMode = opts.chartMode;
    }
    if (opts.chartMode === 'paper') {
      if (opts.paperSurface) context.paperSurface = opts.paperSurface;
      if (opts.plannerView) context.plannerView = opts.plannerView;
    } else if (opts.traditionalSection) {
      context.traditionalSection = opts.traditionalSection;
    }
  }
  if (opts.assistBlueprintId) {
    context.assistBlueprintId = opts.assistBlueprintId;
  }
  return context;
}

/** Contexto operativo para ranking CE-1 (borradores, alertas, workspace, chartMode, sección). */
export function useCommandResolveContext(
  workspace: CommandWorkspace,
  options?: CommandResolveContextOptions,
): CommandActiveContext {
  const { patient } = useActivePatient();
  const patientScoped = Boolean(patient?.id) || workspace === 'command_center';
  const rawSearch = useSearch({ strict: false }) as Record<string, unknown>;
  const chartSearch =
    workspace === 'patient_chart' ? parseChartModeSearch(rawSearch) : undefined;
  const chartMode = options?.chartMode ?? chartSearch?.chartMode;
  const paperSurface = chartSearch?.paperSurface;
  const plannerView = chartSearch?.plannerView;
  const traditionalSection =
    options?.traditionalSection ??
    (chartMode !== 'paper' ? parseEhrSectionSearch(rawSearch) : undefined);
  const assistBlueprintId =
    options?.assistBlueprintId ??
    (typeof rawSearch.assistBlueprintId === 'string' ? rawSearch.assistBlueprintId : undefined);

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
    paperSurface,
    plannerView,
    traditionalSection,
    assistBlueprintId,
  });
}
