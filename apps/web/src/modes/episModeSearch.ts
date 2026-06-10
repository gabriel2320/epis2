import type { DashboardSearch, DashboardTab } from '../routes/clinicalNavigate.js';
import type { EpisMode } from './episModes.js';
import { resolveModeRoute } from './episModeGuards.js';

export type EpisModeSearchRecord = {
  mode?: string;
  view?: string;
  tab?: string;
  returnTo?: string;
};

export function parseModeSearchRecord(
  search: EpisModeSearchRecord | URLSearchParams,
): EpisModeSearchRecord {
  if (search instanceof URLSearchParams) {
    return {
      ...(search.get('mode') ? { mode: search.get('mode')! } : {}),
      ...(search.get('view') ? { view: search.get('view')! } : {}),
      ...(search.get('tab') ? { tab: search.get('tab')! } : {}),
      ...(search.get('returnTo') ? { returnTo: search.get('returnTo')! } : {}),
    };
  }
  return search;
}

export function withModeSearch<
  T extends Record<string, unknown>,
  M extends Extract<EpisMode, 'classic' | 'dashboard'>,
>(search: T, mode: M, enabled = true): T & { mode?: M } {
  if (!enabled) return search;
  return { ...search, mode };
}

export function classicModeSearch<T extends Record<string, unknown>>(
  search: T,
  enabled: boolean,
): T & { mode?: 'classic' } {
  if (!enabled) return search;
  return { ...search, mode: 'classic' };
}

export function dashboardModeSearch<T extends Record<string, unknown>>(
  search: T,
  enabled: boolean,
): T & { mode?: 'dashboard' } {
  if (!enabled) return search;
  return { ...search, mode: 'dashboard' };
}

export function buildDashboardTabSearch(
  tab: DashboardTab,
  options: { patientId?: string; md3?: boolean } = {},
): DashboardSearch {
  const base: DashboardSearch = {
    tab,
    ...(options.patientId ? { patientId: options.patientId } : {}),
  };
  if (options.md3 ?? true) {
    return { ...base, mode: 'dashboard' };
  }
  return base;
}

export function buildClassicPatientSearch(patientId?: string, returnTo?: 'dashboard') {
  return resolveModeRoute('classic', {
    ...(patientId ? { patientId } : {}),
    ...(returnTo === 'dashboard' ? { returnTo: 'dashboard' } : {}),
  }).search;
}

export const EPIS_SELECT_PATIENT_FOR_CLASSIC = {
  intent: 'selectPatient',
  nextMode: 'classic',
} as const;
