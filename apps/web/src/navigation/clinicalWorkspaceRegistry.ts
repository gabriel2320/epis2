import type {
  EpisClinicalWorkspaceDefinition,
  EpisClinicalWorkspaceId,
} from '@epis2/epis2-ui';
import {
  CLINICAL_WORKSPACE_ORDER,
  defaultWorkspaceForRole,
  roleMayUseWorkspace,
} from './clinicalRoleCareMatrix.js';

/** Registry canónico de espacios de trabajo — un árbol de navegación por contexto. */
export const CLINICAL_WORKSPACE_DEFINITIONS: Record<
  EpisClinicalWorkspaceId,
  EpisClinicalWorkspaceDefinition
> = {
  command: {
    id: 'command',
    labelKey: 'workspaces.command.label',
    descriptionKey: 'workspaces.command.description',
    railItems: [],
    primaryFabKey: 'workspaces.command.fab',
  },
  reception: {
    id: 'reception',
    labelKey: 'workspaces.reception.label',
    descriptionKey: 'workspaces.reception.description',
    railItems: [
      { id: 'reception-board', labelKey: 'workspaces.reception.rail.board', route: '/epis2/dashboard?tab=reception' },
      { id: 'reception-agenda', labelKey: 'workspaces.reception.rail.agenda', route: '/epis2/dashboard?tab=reception' },
      { id: 'reception-call', labelKey: 'workspaces.reception.rail.callPanel', route: '/epis2/dashboard?tab=reception' },
    ],
    primaryFabKey: 'workspaces.reception.fab',
    allowedRoles: ['admin', 'nurse', 'physician'],
  },
  ambulatory: {
    id: 'ambulatory',
    labelKey: 'workspaces.ambulatory.label',
    descriptionKey: 'workspaces.ambulatory.description',
    railItems: [
      { id: 'daily-agenda', labelKey: 'workspaces.ambulatory.rail.dailyAgenda', route: '/epis2/dashboard?tab=work' },
      { id: 'patients', labelKey: 'workspaces.ambulatory.rail.patients', route: '/espacio/buscar-paciente' },
      { id: 'outpatient', labelKey: 'workspaces.ambulatory.tabs.encounter', route: '/espacio/ambulatorio' },
      { id: 'aps-board', labelKey: 'workspaces.ambulatory.rail.apsBoard', route: '/epis2/dashboard?tab=aps' },
      { id: 'specialty-board', labelKey: 'workspaces.ambulatory.rail.specialtyBoard', route: '/epis2/dashboard?tab=specialty' },
    ],
    patientTabIds: ['summary', 'encounter', 'orders', 'results', 'certificates'],
    primaryFabKey: 'workspaces.ambulatory.fab',
    allowedRoles: ['physician', 'nurse', 'kinesiologist', 'admin'],
  },
  inpatient_ward: {
    id: 'inpatient_ward',
    labelKey: 'workspaces.inpatientWard.label',
    descriptionKey: 'workspaces.inpatientWard.description',
    railItems: [
      { id: 'ward-census', labelKey: 'workspaces.inpatientWard.rail.census', route: '/epis2/dashboard?tab=service' },
      { id: 'ward-admissions', labelKey: 'workspaces.inpatientWard.rail.admissions', route: '/espacio/ingreso' },
      { id: 'ward-rounds', labelKey: 'workspaces.inpatientWard.rail.rounds', route: '/espacio/evolucion' },
      { id: 'ward-discharge', labelKey: 'workspaces.inpatientWard.rail.discharge', route: '/espacio/epicrisis' },
    ],
    patientTabIds: ['summary', 'encounter', 'orders', 'results'],
    primaryFabKey: 'workspaces.inpatientWard.fab',
    allowedRoles: ['physician', 'nurse', 'kinesiologist'],
  },
  intermediate_care: {
    id: 'intermediate_care',
    labelKey: 'workspaces.intermediateCare.label',
    descriptionKey: 'workspaces.intermediateCare.description',
    railItems: [
      { id: 'intermediate-census', labelKey: 'workspaces.intermediateCare.rail.census', route: '/epis2/dashboard?tab=nursing' },
      { id: 'intermediate-monitoring', labelKey: 'workspaces.intermediateCare.rail.monitoring', route: '/epis2/dashboard?tab=nursing' },
      { id: 'intermediate-nursing', labelKey: 'workspaces.intermediateCare.rail.nursing', route: '/espacio/enfermeria' },
    ],
    patientTabIds: ['summary', 'encounter', 'orders'],
    primaryFabKey: 'workspaces.intermediateCare.fab',
    allowedRoles: ['physician', 'nurse', 'kinesiologist'],
  },
  emergency: {
    id: 'emergency',
    labelKey: 'workspaces.emergency.label',
    descriptionKey: 'workspaces.emergency.description',
    railItems: [
      { id: 'emergency-triage', labelKey: 'workspaces.emergency.rail.triage', route: '/epis2/dashboard?tab=emergency' },
      { id: 'emergency-observation', labelKey: 'workspaces.emergency.rail.observation', route: '/epis2/dashboard?tab=emergency' },
    ],
    primaryFabKey: 'workspaces.emergency.fab',
    allowedRoles: ['physician', 'nurse', 'paramedic', 'admin'],
  },
  icu: {
    id: 'icu',
    labelKey: 'workspaces.icu.label',
    descriptionKey: 'workspaces.icu.description',
    railItems: [
      { id: 'bed-map', labelKey: 'workspaces.icu.rail.bedMap', route: '/epis2/dashboard?tab=icu' },
      { id: 'monitoring', labelKey: 'workspaces.icu.rail.monitoring', route: '/epis2/dashboard?tab=icu' },
      { id: 'handover', labelKey: 'workspaces.icu.rail.handover', route: '/espacio/enfermeria' },
    ],
    patientTabIds: ['flowsheet', 'evolution', 'nursing', 'iv_therapy', 'labs'],
    primaryFabKey: 'workspaces.icu.fab',
    allowedRoles: ['physician', 'nurse', 'admin'],
  },
  or: {
    id: 'or',
    labelKey: 'workspaces.or.label',
    descriptionKey: 'workspaces.or.description',
    railItems: [
      { id: 'or-schedule', labelKey: 'workspaces.or.rail.schedule', route: '/epis2/dashboard?tab=or' },
      { id: 'or-rooms', labelKey: 'workspaces.or.rail.rooms', route: '/epis2/dashboard?tab=or' },
    ],
    primaryFabKey: 'workspaces.or.fab',
    allowedRoles: ['physician', 'nurse', 'admin'],
  },
  pharmacy_clinical: {
    id: 'pharmacy_clinical',
    labelKey: 'workspaces.pharmacyClinical.label',
    descriptionKey: 'workspaces.pharmacyClinical.description',
    railItems: [
      { id: 'pharmacy-validation', labelKey: 'workspaces.pharmacyClinical.rail.validation', route: '/espacio/farmacia' },
      { id: 'pharmacy-reconciliation', labelKey: 'workspaces.pharmacyClinical.rail.reconciliation', route: '/espacio/conciliacion' },
      { id: 'pharmacy-antimicrobials', labelKey: 'workspaces.pharmacyClinical.rail.antimicrobials', route: '/epis2/dashboard?tab=pharmacy' },
      { id: 'pharmacy-dashboard', labelKey: 'workspaces.pharmacyClinical.rail.dashboard', route: '/epis2/dashboard?tab=pharmacy' },
    ],
    patientTabIds: ['summary', 'orders'],
    primaryFabKey: 'workspaces.pharmacyClinical.fab',
    allowedRoles: ['pharmacist', 'physician'],
  },
  quality_iaas: {
    id: 'quality_iaas',
    labelKey: 'workspaces.qualityIaas.label',
    descriptionKey: 'workspaces.qualityIaas.description',
    railItems: [
      { id: 'quality-kpi', labelKey: 'workspaces.qualityIaas.rail.quality', route: '/epis2/dashboard?tab=quality' },
      { id: 'epi', labelKey: 'workspaces.qualityIaas.rail.epi', route: '/epis2/dashboard?tab=quality', disabled: true },
      { id: 'iaas', labelKey: 'workspaces.qualityIaas.rail.iaas', route: '/epis2/dashboard?tab=quality', disabled: true },
      { id: 'bed-mgmt', labelKey: 'workspaces.qualityIaas.rail.beds', route: '/epis2/dashboard?tab=service' },
    ],
    patientTabIds: [],
    primaryFabKey: 'workspaces.qualityIaas.fab',
    allowedRoles: ['admin', 'auditor', 'physician'],
  },
  admin_system: {
    id: 'admin_system',
    labelKey: 'workspaces.adminSystem.label',
    descriptionKey: 'workspaces.adminSystem.description',
    railItems: [
      { id: 'emr-config', labelKey: 'workspaces.adminSystem.rail.emr', route: '/espacio/admin?tab=ops' },
      { id: 'roles', labelKey: 'workspaces.adminSystem.rail.roles', route: '/espacio/admin?tab=users' },
      { id: 'hardware', labelKey: 'workspaces.adminSystem.rail.hardware', route: '/espacio/admin?tab=ops', disabled: true },
      { id: 'interop', labelKey: 'workspaces.adminSystem.rail.interop', route: '/espacio/admin?tab=ops', disabled: true },
      { id: 'forms-studio', labelKey: 'workspaces.adminSystem.rail.forms', route: '/espacio/admin?tab=forms' },
    ],
    primaryFabKey: 'workspaces.adminSystem.fab',
    allowedRoles: ['admin', 'auditor'],
  },
};

export { CLINICAL_WORKSPACE_ORDER };

export function getClinicalWorkspaceDefinition(
  id: EpisClinicalWorkspaceId,
): EpisClinicalWorkspaceDefinition {
  return CLINICAL_WORKSPACE_DEFINITIONS[id];
}

export function resolveWorkspaceForRole(role: string): EpisClinicalWorkspaceId {
  return defaultWorkspaceForRole(role);
}

export function canRoleAccessWorkspace(role: string, workspaceId: EpisClinicalWorkspaceId): boolean {
  return roleMayUseWorkspace(role, workspaceId);
}

export type WorkspaceRouteTarget = {
  to: string;
  search?: Record<string, string>;
};

/** Parsea rutas del registry (`/ruta?tab=x`) a destino TanStack Router. */
export function parseClinicalRoute(route: string): WorkspaceRouteTarget {
  const [pathname = route, query = ''] = route.split('?');
  if (!query) return { to: pathname };
  const search = Object.fromEntries(new URLSearchParams(query));
  return { to: pathname, search };
}

export function getWorkspaceDefaultRoute(id: EpisClinicalWorkspaceId): WorkspaceRouteTarget {
  if (id === 'command') return { to: '/comando' };
  if (id === 'reception') return { to: '/epis2/dashboard', search: { tab: 'reception' } };
  if (id === 'emergency') return { to: '/epis2/dashboard', search: { tab: 'emergency' } };
  if (id === 'icu') return { to: '/epis2/dashboard', search: { tab: 'icu' } };
  if (id === 'or') return { to: '/epis2/dashboard', search: { tab: 'or' } };
  if (id === 'inpatient_ward') return { to: '/epis2/dashboard', search: { tab: 'service' } };
  if (id === 'intermediate_care') return { to: '/epis2/dashboard', search: { tab: 'nursing' } };
  if (id === 'pharmacy_clinical') return { to: '/espacio/farmacia' };
  const def = CLINICAL_WORKSPACE_DEFINITIONS[id];
  const firstEnabled = def.railItems.find((item) => !item.disabled) ?? def.railItems[0];
  if (!firstEnabled) return { to: '/comando' };
  return parseClinicalRoute(firstEnabled.route);
}

export function routeMatchesPath(
  pathname: string,
  searchStr: string,
  route: string,
): boolean {
  const target = parseClinicalRoute(route);
  if (!pathname.startsWith(target.to)) return false;
  if (!target.search) return true;
  const current = new URLSearchParams(searchStr.startsWith('?') ? searchStr.slice(1) : searchStr);
  return Object.entries(target.search).every(([key, value]) => current.get(key) === value);
}
