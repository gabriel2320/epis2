import type { ClinicalNavigateFn } from '../routes/clinicalNavigate.js';
import type { EpisMode } from './episModes.js';
import { resolveModeRoute, type ModeRouteOptions } from './episModeGuards.js';

export type ModeTransitionInput = ModeRouteOptions;

export function navigateToMode(
  navigate: ClinicalNavigateFn,
  mode: EpisMode,
  options: ModeRouteOptions = {},
): void {
  void navigate(resolveModeRoute(mode, options));
}

export function transitionCommandToClassic(
  navigate: ClinicalNavigateFn,
  input: ModeTransitionInput,
): void {
  navigateToMode(navigate, 'classic', input);
}

export function transitionCommandToDashboard(
  navigate: ClinicalNavigateFn,
  input: ModeTransitionInput = {},
): void {
  navigateToMode(navigate, 'dashboard', {
    dashboardTab: input.dashboardTab ?? 'work',
    serviceId: input.serviceId,
    unitId: input.unitId,
  });
}

export function transitionDashboardToClassic(
  navigate: ClinicalNavigateFn,
  patientId: string,
  dashboardTab?: ModeRouteOptions['dashboardTab'],
): void {
  navigateToMode(navigate, 'classic', {
    patientId,
    returnTo: 'dashboard',
    dashboardTab,
  });
}

export function transitionClassicToDashboard(
  navigate: ClinicalNavigateFn,
  input: ModeTransitionInput = {},
): void {
  navigateToMode(navigate, 'dashboard', {
    dashboardTab: input.dashboardTab ?? 'work',
    focusPatientId: input.patientId ?? input.focusPatientId,
  });
}

export function transitionClassicToCommand(navigate: ClinicalNavigateFn, patientId?: string): void {
  navigateToMode(navigate, 'command', {
    ...(patientId ? { patientId } : {}),
    context: 'classic',
  });
}

export function transitionDashboardToCommand(
  navigate: ClinicalNavigateFn,
  dashboardTab?: ModeRouteOptions['dashboardTab'],
): void {
  navigateToMode(navigate, 'command', {
    context: 'dashboard',
    dashboardTab,
  });
}

export { preserveReturnToRoute, resolveModeRoute } from './episModeGuards.js';
