import { copy } from '@epis2/design-system';
import { EPIS2_CLINICAL_HOME } from '../routes/home.js';

/** Modos canónicos EPIS2 — una sesión, un contexto, cero routers paralelos. */
export type EpisMode = 'command' | 'classic' | 'dashboard';

export type EpisModeDefinition = {
  id: EpisMode;
  label: string;
  canonicalRoute: string;
  requiresPatient: boolean;
  requiresEncounter?: boolean;
  allowedRoles: readonly string[];
  description: string;
  isHome?: boolean;
};

const ALL_CLINICAL_ROLES = ['physician', 'nurse', 'pharmacist', 'admin', 'auditor'] as const;

export const EPIS_MODE_DEFINITIONS: Record<EpisMode, EpisModeDefinition> = {
  command: {
    id: 'command',
    label: copy.threeModes.commandLabel,
    canonicalRoute: EPIS2_CLINICAL_HOME,
    requiresPatient: false,
    allowedRoles: ALL_CLINICAL_ROLES,
    description: copy.threeModes.commandDescription,
    isHome: true,
  },
  classic: {
    id: 'classic',
    label: copy.threeModes.classicLabel,
    canonicalRoute: '/espacio/ficha?mode=classic',
    requiresPatient: true,
    allowedRoles: ALL_CLINICAL_ROLES,
    description: copy.threeModes.classicDescription,
  },
  dashboard: {
    id: 'dashboard',
    label: copy.threeModes.dashboardLabel,
    canonicalRoute: '/epis2/dashboard?mode=dashboard',
    requiresPatient: false,
    allowedRoles: ALL_CLINICAL_ROLES,
    description: copy.threeModes.dashboardDescription,
  },
};

export const EPIS_MODES: readonly EpisMode[] = ['command', 'classic', 'dashboard'];

export function getModeDefinition(mode: EpisMode): EpisModeDefinition {
  return EPIS_MODE_DEFINITIONS[mode];
}

export function resolveActiveMode(
  pathname: string,
  search: { mode?: string | undefined; view?: string | undefined },
): EpisMode {
  if (
    pathname === '/comando' ||
    pathname.startsWith('/comando') ||
    pathname.startsWith('/espacio/buscar-paciente') ||
    pathname.startsWith('/app/buscar')
  ) {
    return 'command';
  }
  if (pathname.startsWith('/epis2/dashboard')) {
    return search.mode === 'dashboard' ? 'dashboard' : 'command';
  }
  if (search.mode === 'classic' || search.view === 'classic') return 'classic';
  return 'command';
}
