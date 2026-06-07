import type {
  EpisClinicalWorkspaceDefinition,
  EpisClinicalWorkspaceId,
} from '@epis2/epis2-ui';

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
      { id: 'waiting-room', labelKey: 'workspaces.ambulatory.rail.waitingRoom', route: '/epis2/dashboard?tab=service', disabled: true },
      { id: 'honorarios', labelKey: 'workspaces.ambulatory.rail.honorarios', route: '/epis2/dashboard?tab=work', disabled: true },
      { id: 'patients', labelKey: 'workspaces.ambulatory.rail.patients', route: '/espacio/buscar-paciente' },
      { id: 'aps-board', labelKey: 'workspaces.ambulatory.rail.apsBoard', route: '/epis2/dashboard?tab=aps' },
      { id: 'specialty-board', labelKey: 'workspaces.ambulatory.rail.specialtyBoard', route: '/epis2/dashboard?tab=specialty' },
      { id: 'pharmacy-board', labelKey: 'workspaces.ambulatory.rail.pharmacyBoard', route: '/epis2/dashboard?tab=pharmacy' },
    ],
    patientTabIds: ['summary', 'encounter', 'orders', 'results', 'certificates'],
    primaryFabKey: 'workspaces.ambulatory.fab',
    allowedRoles: ['physician', 'nurse', 'admin'],
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
    allowedRoles: ['physician', 'nurse', 'admin'],
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

export const CLINICAL_WORKSPACE_ORDER: readonly EpisClinicalWorkspaceId[] = [
  'command',
  'reception',
  'ambulatory',
  'emergency',
  'icu',
  'or',
  'quality_iaas',
  'admin_system',
];

export function getClinicalWorkspaceDefinition(
  id: EpisClinicalWorkspaceId,
): EpisClinicalWorkspaceDefinition {
  return CLINICAL_WORKSPACE_DEFINITIONS[id];
}

export function resolveWorkspaceForRole(
  role: string,
): EpisClinicalWorkspaceId {
  if (role === 'admin' || role === 'auditor') return 'quality_iaas';
  if (role === 'nurse') return 'ambulatory';
  if (role === 'pharmacist') return 'ambulatory';
  return 'ambulatory';
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
