import type { DashboardTab } from '../routes/clinicalNavigate.js';
import { EPIS_MODE_DEFINITIONS, type EpisMode } from './episModes.js';

export type EpisSessionContextSnapshot = {
  role: string;
  permissions: readonly string[];
  activePatientId?: string | undefined;
  activeDashboardTab?: DashboardTab | undefined;
  modePreference?: EpisMode | undefined;
};

export type ModeRouteOptions = {
  patientId?: string | undefined;
  encounterId?: string | undefined;
  dashboardTab?: DashboardTab | undefined;
  serviceId?: string | undefined;
  unitId?: string | undefined;
  returnTo?: EpisMode | 'dashboard' | 'classic' | 'command' | undefined;
  focusPatientId?: string | undefined;
  intent?: string | undefined;
  context?: string | undefined;
  replace?: boolean | undefined;
};

export function canOpenMode(mode: EpisMode, ctx: EpisSessionContextSnapshot): boolean {
  const def = EPIS_MODE_DEFINITIONS[mode];
  if (!def.allowedRoles.includes(ctx.role)) return false;
  if (def.requiresPatient && !ctx.activePatientId) return false;
  return true;
}

export function requiresPatientSelection(mode: EpisMode): boolean {
  return EPIS_MODE_DEFINITIONS[mode].requiresPatient;
}

export function getDefaultModeAfterLogin(_ctx: EpisSessionContextSnapshot): EpisMode {
  return 'command';
}

export function getDefaultRouteAfterLogin(_ctx: EpisSessionContextSnapshot): string {
  return EPIS_MODE_DEFINITIONS.command.canonicalRoute;
}

export function getSafeFallbackRoute(mode: EpisMode, _ctx: EpisSessionContextSnapshot): string {
  if (mode === 'classic') {
    return '/comando?intent=selectPatient&nextMode=classic';
  }
  if (mode === 'dashboard') {
    return '/comando?error=dashboardPermission';
  }
  return EPIS_MODE_DEFINITIONS.command.canonicalRoute;
}

export function resolveModeRoute(mode: EpisMode, options: ModeRouteOptions = {}): {
  to: '/comando' | '/espacio/ficha' | '/epis2/dashboard';
  search: Record<string, string | undefined>;
  replace?: boolean;
} {
  switch (mode) {
    case 'command':
      return {
        to: '/comando',
        search: {
          ...(options.patientId ? { patientId: options.patientId } : {}),
          ...(options.intent ? { intent: options.intent } : {}),
          ...(options.context ? { context: options.context } : {}),
          ...(options.dashboardTab ? { tab: options.dashboardTab } : {}),
        },
        ...(options.replace ? { replace: true } : {}),
      };
    case 'classic':
      return {
        to: '/espacio/ficha',
        search: {
          mode: 'classic',
          ...(options.patientId ? { patientId: options.patientId } : {}),
          ...(options.returnTo === 'dashboard'
            ? { returnTo: 'dashboard', ...(options.dashboardTab ? { tab: options.dashboardTab } : {}) }
            : {}),
        },
        ...(options.replace ? { replace: true } : {}),
      };
    case 'dashboard':
      return {
        to: '/epis2/dashboard',
        search: {
          mode: 'dashboard',
          tab: options.dashboardTab ?? 'work',
          ...(options.focusPatientId ?? options.patientId
            ? { patientId: options.focusPatientId ?? options.patientId }
            : {}),
          ...(options.returnTo ? { returnTo: options.returnTo } : {}),
        },
        ...(options.replace ? { replace: true } : {}),
      };
    default:
      return resolveModeRoute('command', options);
  }
}

export function preserveReturnToRoute(fromMode: EpisMode, toMode: EpisMode): EpisMode | undefined {
  if (fromMode === toMode) return undefined;
  if (toMode === 'command') return fromMode;
  return fromMode;
}
