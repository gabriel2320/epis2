import { useRouterState } from '@tanstack/react-router';
import { useMemo, useSyncExternalStore } from 'react';
import {
  loadEpisModePreferences,
  subscribeEpisModePreferences,
  type EpisModeUserPreferences,
} from './episModePreferences.js';
import { parseModeSearchRecord, type EpisModeSearchRecord } from './episModeSearch.js';
import { resolveActiveMode, type EpisMode } from './episModes.js';

const SSR_DEFAULT_PREFS: EpisModeUserPreferences = { defaultPatientView: 'modern' };

export function isClassicModeActive(
  search: EpisModeSearchRecord,
  prefs: EpisModeUserPreferences,
): boolean {
  if (search.mode === 'classic' || search.view === 'classic') return true;
  return prefs.defaultPatientView === 'classic';
}

export function isDashboardModeActive(
  search: EpisModeSearchRecord,
  prefs: EpisModeUserPreferences,
): boolean {
  if (search.view === 'classic') return false;
  if (search.mode === 'dashboard') return true;
  return prefs.defaultDashboardView === 'dashboard';
}

export function useEpisModeSearchRecord(): EpisModeSearchRecord {
  const searchStr = useRouterState({ select: (s) => s.location.searchStr ?? '' });
  return useMemo(
    () => parseModeSearchRecord(new URLSearchParams(searchStr)),
    [searchStr],
  );
}

export function useEpisModePreferences(): EpisModeUserPreferences {
  return useSyncExternalStore(
    subscribeEpisModePreferences,
    loadEpisModePreferences,
    () => SSR_DEFAULT_PREFS,
  );
}

export function useEpisActiveMode(): EpisMode {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const search = useEpisModeSearchRecord();
  return useMemo(() => resolveActiveMode(pathname, search), [pathname, search]);
}

export function useClassicMd3Mode(): boolean {
  const search = useEpisModeSearchRecord();
  const prefs = useEpisModePreferences();
  return useMemo(() => isClassicModeActive(search, prefs), [prefs, search]);
}

export function useDashboardMd3Mode(): boolean {
  const search = useEpisModeSearchRecord();
  const prefs = useEpisModePreferences();
  return useMemo(() => isDashboardModeActive(search, prefs), [prefs, search]);
}
