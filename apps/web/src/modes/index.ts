/**
 * EPIS2 — árbol canónico de modos (MF-THREE-MODES-ORCHESTRATION).
 *
 * command ──openClassicMode──► classic (requiere patientId)
 *    │                              │
 *    └──openDashboardMode──► dashboard
 *         ◄──returnTo───────────────┘
 *
 * Home: command. Sin router paralelo.
 */

export {
  EPIS_MODES,
  EPIS_MODE_DEFINITIONS,
  getModeDefinition,
  resolveActiveMode,
  type EpisMode,
  type EpisModeDefinition,
} from './episModes.js';

export {
  canOpenMode,
  getDefaultModeAfterLogin,
  getDefaultRouteAfterLogin,
  getSafeFallbackRoute,
  preserveReturnToRoute,
  requiresPatientSelection,
  resolveModeRoute,
  type EpisSessionContextSnapshot,
  type ModeRouteOptions,
} from './episModeGuards.js';

export {
  navigateToMode,
  transitionClassicToCommand,
  transitionClassicToDashboard,
  transitionCommandToClassic,
  transitionCommandToDashboard,
  transitionDashboardToClassic,
  transitionDashboardToCommand,
} from './modeTransitions.js';

export {
  buildClassicPatientSearch,
  buildDashboardTabSearch,
  classicModeSearch,
  dashboardModeSearch,
  EPIS_SELECT_PATIENT_FOR_CLASSIC,
  parseModeSearchRecord,
  withModeSearch,
  type EpisModeSearchRecord,
} from './episModeSearch.js';

export {
  isClassicModeActive,
  isDashboardModeActive,
  useClassicMd3Mode,
  useDashboardMd3Mode,
  useEpisActiveMode,
  useEpisModePreferences,
  useEpisModeSearchRecord,
} from './episModeRuntime.js';

export {
  loadEpisModePreferences,
  saveEpisModePreferences,
  setDefaultDashboardView,
  setDefaultPatientView,
  subscribeEpisModePreferences,
  type EpisModeUserPreferences,
  type ClassicPatientViewMode,
  type DashboardViewMode,
  loadClassicUserPreferences,
  saveClassicUserPreferences,
  type EpisClassicUserPreferences,
} from './episModePreferences.js';

export { hasUnsavedClinicalWork, registerUnsavedWorkProbe } from './modeTransitionSafety.js';

export { EpisModeGuard } from './EpisModeGuard.js';
