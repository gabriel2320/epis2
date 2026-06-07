import { EPIS2_FORM_BLUEPRINTS } from '@epis2/clinical-forms';
import type { EpisClinicalShellLevel, EpisClinicalWorkspaceId } from '@epis2/epis2-ui';
import { PATIENT_CHART_TABS, type PatientChartTabId } from '../clinical/patientChartNavigation.js';

/** Estado de conciliación del árbol EPIS2. */
export type EpisNavigationSurfaceStatus = 'complete' | 'partial' | 'missing' | 'disabled' | 'deferred';

export type EpisNavigationSurfaceKind =
  | 'auth'
  | 'command_home'
  | 'dashboard_tab'
  | 'patient_hub'
  | 'clinical_form'
  | 'results_inbox'
  | 'admin'
  | 'draft'
  | 'preferences'
  | 'dev';

/** Nodo reconciliado — une workspace MD3, ruta, blueprint e IDC. */
export type EpisNavigationSurface = {
  id: string;
  labelEs: string;
  route: string;
  kind: EpisNavigationSurfaceKind;
  workspace: EpisClinicalWorkspaceId | 'global' | 'reception_deferred';
  md3Level: EpisClinicalShellLevel;
  status: EpisNavigationSurfaceStatus;
  blueprintId?: string;
  patientChartTab?: PatientChartTabId;
  idcRefs?: readonly number[];
  ola?: string;
  notes?: string;
};

/** Tabs del modo tablero — mapeo a workspaces. */
export const EPIS2_DASHBOARD_TAB_SURFACES: readonly EpisNavigationSurface[] = [
  {
    id: 'dashboard-work',
    labelEs: 'Mi trabajo',
    route: '/epis2/dashboard?tab=work',
    kind: 'dashboard_tab',
    workspace: 'ambulatory',
    md3Level: 0,
    status: 'complete',
    idcRefs: [3],
    ola: '2',
  },
  {
    id: 'dashboard-patient',
    labelEs: 'Paciente activo',
    route: '/epis2/dashboard?tab=patient',
    kind: 'dashboard_tab',
    workspace: 'ambulatory',
    md3Level: 1,
    status: 'partial',
    idcRefs: [21],
    ola: '1',
  },
  {
    id: 'dashboard-service',
    labelEs: 'Servicio / camas',
    route: '/epis2/dashboard?tab=service',
    kind: 'dashboard_tab',
    workspace: 'quality_iaas',
    md3Level: 0,
    status: 'partial',
    idcRefs: [81],
    ola: '8',
  },
  {
    id: 'dashboard-nursing',
    labelEs: 'Enfermería',
    route: '/epis2/dashboard?tab=nursing',
    kind: 'dashboard_tab',
    workspace: 'icu',
    md3Level: 0,
    status: 'partial',
    idcRefs: [111],
    ola: '11',
  },
  {
    id: 'dashboard-pharmacy',
    labelEs: 'Farmacia',
    route: '/epis2/dashboard?tab=pharmacy',
    kind: 'dashboard_tab',
    workspace: 'ambulatory',
    md3Level: 0,
    status: 'partial',
    idcRefs: [54],
    ola: '1',
  },
  {
    id: 'dashboard-quality',
    labelEs: 'Calidad e IAAS',
    route: '/epis2/dashboard?tab=quality',
    kind: 'dashboard_tab',
    workspace: 'quality_iaas',
    md3Level: 2,
    status: 'partial',
    idcRefs: [71, 72],
    ola: '7',
  },
  {
    id: 'dashboard-reception',
    labelEs: 'Recepción',
    route: '/epis2/dashboard?tab=reception',
    kind: 'dashboard_tab',
    workspace: 'reception',
    md3Level: 0,
    status: 'complete',
    idcRefs: [2, 3, 4, 5, 7, 8, 9, 10],
    ola: '4',
    notes: 'MF-TRAMO-B-002 — never home',
  },
  {
    id: 'dashboard-emergency',
    labelEs: 'Urgencias',
    route: '/epis2/dashboard?tab=emergency',
    kind: 'dashboard_tab',
    workspace: 'emergency',
    md3Level: 0,
    status: 'partial',
    idcRefs: [101, 102, 103, 105],
    ola: '10',
    notes: 'MF-TRAMO-C-002 workspace emergency',
  },
];

const BLUEPRINT_IDC_MAP: Record<string, { idc: readonly number[]; status: EpisNavigationSurfaceStatus; workspace: EpisClinicalWorkspaceId; tab?: PatientChartTabId; ola?: string; notes?: string }> = {
  patient_search: { idc: [21], status: 'complete', workspace: 'ambulatory', tab: 'summary', ola: '0' },
  patient_summary: { idc: [21, 26], status: 'partial', workspace: 'ambulatory', tab: 'summary', ola: '1' },
  evolution_note: { idc: [37], status: 'complete', workspace: 'ambulatory', tab: 'encounter', ola: '0' },
  outpatient_visit: { idc: [31, 32, 33, 34, 35, 36, 39], status: 'complete', workspace: 'ambulatory', tab: 'encounter', ola: '2' },
  medical_certificate: { idc: [39, 40], status: 'complete', workspace: 'ambulatory', tab: 'orders', ola: '2' },
  discharge_summary: { idc: [63, 110], status: 'complete', workspace: 'ambulatory', tab: 'encounter', ola: '6' },
  prescription: { idc: [52], status: 'complete', workspace: 'ambulatory', tab: 'orders', ola: '0' },
  lab_request: { idc: [55], status: 'partial', workspace: 'ambulatory', tab: 'results', ola: '0' },
  imaging_request: { idc: [56], status: 'partial', workspace: 'ambulatory', tab: 'results', ola: '0' },
  referral: { idc: [64], status: 'complete', workspace: 'ambulatory', tab: 'orders', ola: '0' },
  referral_report: { idc: [64], status: 'complete', workspace: 'ambulatory', tab: 'orders', ola: '6' },
  nursing_note: { idc: [111], status: 'complete', workspace: 'icu', tab: 'encounter', ola: '11' },
  medication_administration: { idc: [53], status: 'partial', workspace: 'ambulatory', tab: 'orders', ola: '1' },
  pharmacy_validation: { idc: [54], status: 'partial', workspace: 'ambulatory', tab: 'orders', ola: '1' },
  admission_note: { idc: [41], status: 'complete', workspace: 'icu', tab: 'encounter', ola: '13', notes: 'Ingreso clínico — no confundir con IDC 41 dashboard UCI (ver EPIS2_IDC_GLOSSARY.md)' },
  allergy_entry: { idc: [27, 28], status: 'complete', workspace: 'ambulatory', tab: 'summary', ola: '3' },
  clinical_problem_entry: { idc: [29, 30], status: 'complete', workspace: 'ambulatory', tab: 'summary', ola: '3' },
  medication_reconciliation: { idc: [165], status: 'complete', workspace: 'ambulatory', tab: 'orders', ola: '10' },
  transfer_note: { idc: [42], status: 'complete', workspace: 'icu', tab: 'encounter', ola: '13' },
};

function blueprintSurfaces(): EpisNavigationSurface[] {
  return EPIS2_FORM_BLUEPRINTS.map((bp) => {
    const meta = BLUEPRINT_IDC_MAP[bp.blueprintId] ?? {
      idc: [],
      status: 'partial' as const,
      workspace: 'ambulatory' as const,
    };
    return {
      id: `form-${bp.blueprintId}`,
      labelEs: bp.label,
      route: bp.routePath,
      kind: 'clinical_form' as const,
      workspace: meta.workspace,
      md3Level: 3 as const,
      status: meta.status,
      blueprintId: bp.blueprintId,
      ...(meta.tab ? { patientChartTab: meta.tab } : {}),
      idcRefs: meta.idc,
      ...(meta.ola ? { ola: meta.ola } : {}),
    };
  });
}

/** Árbol reconciliado canónico — fuente única apps/web para docs y gates. */
export const EPIS2_NAVIGATION_TREE: readonly EpisNavigationSurface[] = [
  {
    id: 'auth-login',
    labelEs: 'Iniciar sesión',
    route: '/login',
    kind: 'auth',
    workspace: 'global',
    md3Level: 0,
    status: 'complete',
    idcRefs: [1],
    ola: '0',
  },
  {
    id: 'auth-forbidden',
    labelEs: 'Sin acceso',
    route: '/sin-acceso',
    kind: 'auth',
    workspace: 'global',
    md3Level: 0,
    status: 'partial',
    ola: '9',
  },
  {
    id: 'preferences',
    labelEs: 'Preferencias de apariencia',
    route: '/preferencias-apariencia',
    kind: 'preferences',
    workspace: 'global',
    md3Level: 0,
    status: 'complete',
    ola: '0',
  },
  {
    id: 'command-home',
    labelEs: 'Centro de Comando',
    route: '/comando',
    kind: 'command_home',
    workspace: 'command',
    md3Level: 0,
    status: 'complete',
    notes: 'Home canónica — nunca dashboard',
  },
  ...EPIS2_DASHBOARD_TAB_SURFACES,
  {
    id: 'patient-chart-hub',
    labelEs: 'Ficha paciente (5 tabs M3)',
    route: '/espacio/ficha',
    kind: 'patient_hub',
    workspace: 'ambulatory',
    md3Level: 2,
    status: 'complete',
    patientChartTab: 'summary',
    idcRefs: [21],
    ola: '1',
    notes: `Tabs: ${PATIENT_CHART_TABS.map((t) => t.id).join(', ')}`,
  },
  {
    id: 'results-inbox',
    labelEs: 'Bandeja de resultados',
    route: '/espacio/resultados',
    kind: 'results_inbox',
    workspace: 'ambulatory',
    md3Level: 2,
    status: 'partial',
    patientChartTab: 'results',
    idcRefs: [58],
    ola: '1',
  },
  {
    id: 'draft-review',
    labelEs: 'Revisión de borrador',
    route: '/espacio/borrador/$draftId',
    kind: 'draft',
    workspace: 'ambulatory',
    md3Level: 3,
    status: 'complete',
    notes: 'Aprobación humana obligatoria',
  },
  {
    id: 'admin-console',
    labelEs: 'Consola administración',
    route: '/espacio/admin',
    kind: 'admin',
    workspace: 'admin_system',
    md3Level: 3,
    status: 'partial',
    idcRefs: [81, 91, 93],
    ola: '8',
    notes: 'tabs: users | catalogs | audit | ops | forms',
  },
  ...blueprintSurfaces(),
];

/** Superficies planificadas — no en router aún (Ola 10+). */
export const EPIS2_PLANNED_SURFACES: readonly EpisNavigationSurface[] = [
  {
    id: 'emergency-triage-planned',
    labelEs: 'Triaje urgencias (planificado)',
    route: '/espacio/urgencias/triaje',
    kind: 'clinical_form',
    workspace: 'global',
    md3Level: 3,
    status: 'deferred',
    idcRefs: [101, 102],
    ola: '10',
    notes: 'Workspace emergency Ola 10 — rail planificado',
  },
];

export const EPIS2_NAVIGATION_TREE_BY_ROUTE = new Map(
  EPIS2_NAVIGATION_TREE.map((node) => [node.route.split('?')[0], node]),
);

export function getNavigationSurfacesForWorkspace(
  workspace: EpisClinicalWorkspaceId,
): EpisNavigationSurface[] {
  return EPIS2_NAVIGATION_TREE.filter(
    (node) => node.workspace === workspace || (workspace === 'command' && node.workspace === 'global'),
  );
}

export function assertNavigationTreeInvariants(): string[] {
  const errors: string[] = [];
  const routes = new Set<string>();

  for (const node of EPIS2_NAVIGATION_TREE) {
    if (routes.has(node.route)) {
      errors.push(`ruta duplicada en árbol: ${node.route} (${node.id})`);
    }
    routes.add(node.route);
  }

  for (const bp of EPIS2_FORM_BLUEPRINTS) {
    const inTree = EPIS2_NAVIGATION_TREE.some((n) => n.blueprintId === bp.blueprintId);
    if (!inTree) {
      errors.push(`blueprint ${bp.blueprintId} ausente del árbol reconciliado`);
    }
  }

  const treeBlueprintIds = new Set(
    EPIS2_NAVIGATION_TREE.filter((n) => n.blueprintId).map((n) => n.blueprintId),
  );
  if (treeBlueprintIds.size !== EPIS2_FORM_BLUEPRINTS.length) {
    errors.push(
      `conteo blueprint: árbol=${treeBlueprintIds.size} registry=${EPIS2_FORM_BLUEPRINTS.length}`,
    );
  }

  return errors;
}
