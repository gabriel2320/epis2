import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from '../auth/AuthContext.js';
import { useActivePatient } from '../clinical/ActivePatientContext.js';
import {
  DASHBOARD_TAB_SET,
  type CommandSearch,
  type DashboardTab,
} from '../routes/clinicalNavigate.js';
import { useClinicalNavigate } from '../routes/clinicalNavigate.js';
import {
  canOpenMode,
  getDefaultModeAfterLogin,
  type EpisSessionContextSnapshot,
} from '../modes/episModeGuards.js';
import {
  useEpisActiveMode,
  useEpisModePreferences,
} from '../modes/index.js';
import { EPIS_SELECT_PATIENT_FOR_CLASSIC } from '../modes/episModeSearch.js';
import { EPIS_MODE_DEFINITIONS, type EpisMode } from '../modes/episModes.js';
import {
  transitionClassicToCommand,
  transitionClassicToDashboard,
  transitionCommandToClassic,
  transitionCommandToDashboard,
  transitionDashboardToClassic,
  transitionDashboardToCommand,
} from '../modes/modeTransitions.js';

const LAST_DASHBOARD_TAB_KEY = 'epis2-last-dashboard-tab';

type EpisSessionContextValue = {
  userId?: string;
  userName?: string;
  role: string;
  permissions: readonly string[];
  environment: string;
  activeMode: EpisMode;
  previousMode: EpisMode | null;
  activePatientId?: string;
  modePreference?: EpisMode;
  lastDashboardTab: DashboardTab;
  canOpenClassic: boolean;
  canOpenDashboard: boolean;
  setActiveMode: (mode: EpisMode) => void;
  setLastDashboardTab: (tab: DashboardTab) => void;
  openCommandCenter: (patientId?: string) => void;
  openClassicMode: (patientId?: string, fromDashboardTab?: DashboardTab) => void;
  openDashboardMode: (tab?: DashboardTab) => void;
  returnToPreviousMode: () => void;
};

const EpisSessionContext = createContext<EpisSessionContextValue | null>(null);

function readLastDashboardTab(): DashboardTab {
  try {
    const raw = sessionStorage.getItem(LAST_DASHBOARD_TAB_KEY);
    if (raw && DASHBOARD_TAB_SET.has(raw)) {
      return raw as DashboardTab;
    }
  } catch {
    /* ignore */
  }
  return 'work';
}

function selectPatientSearch(): CommandSearch {
  return { ...EPIS_SELECT_PATIENT_FOR_CLASSIC };
}

export function EpisSessionProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const { patient } = useActivePatient();
  const navigate = useClinicalNavigate();
  const activeMode = useEpisActiveMode();
  const prefs = useEpisModePreferences();

  const [previousMode, setPreviousMode] = useState<EpisMode | null>(null);
  const [lastDashboardTab, setLastDashboardTabState] = useState<DashboardTab>(readLastDashboardTab);

  const modePreference: EpisMode | undefined =
    prefs.defaultDashboardView === 'dashboard'
      ? 'dashboard'
      : prefs.defaultPatientView === 'classic'
        ? 'classic'
        : undefined;

  const role = session?.user.role ?? 'physician';
  const permissions = session?.permissions ?? [];
  const snapshot: EpisSessionContextSnapshot = useMemo(
    () => ({
      role,
      permissions,
      activePatientId: patient?.id,
      activeDashboardTab: lastDashboardTab,
      ...(modePreference ? { modePreference } : {}),
    }),
    [role, permissions, patient?.id, lastDashboardTab, modePreference],
  );

  const canOpenClassic = canOpenMode('classic', {
    ...snapshot,
    activePatientId: patient?.id,
  });
  const canOpenDashboard = canOpenMode('dashboard', snapshot);

  const setLastDashboardTab = useCallback((tab: DashboardTab) => {
    setLastDashboardTabState(tab);
    sessionStorage.setItem(LAST_DASHBOARD_TAB_KEY, tab);
  }, []);

  const openCommandCenter = useCallback(
    (patientId?: string) => {
      setPreviousMode(activeMode);
      if (activeMode === 'dashboard') {
        transitionDashboardToCommand(navigate, lastDashboardTab);
        return;
      }
      transitionClassicToCommand(navigate, patientId ?? patient?.id);
    },
    [activeMode, lastDashboardTab, navigate, patient?.id],
  );

  const openClassicMode = useCallback(
    (patientId?: string, fromDashboardTab?: DashboardTab) => {
      const pid = patientId ?? patient?.id;
      if (!pid) {
        void navigate({
          to: '/comando',
          search: selectPatientSearch(),
        });
        return;
      }
      setPreviousMode(activeMode);
      if (activeMode === 'dashboard') {
        transitionDashboardToClassic(
          navigate,
          pid,
          fromDashboardTab ?? lastDashboardTab,
        );
        return;
      }
      transitionCommandToClassic(navigate, { patientId: pid });
    },
    [activeMode, lastDashboardTab, navigate, patient?.id],
  );

  const openDashboardMode = useCallback(
    (tab?: DashboardTab) => {
      setPreviousMode(activeMode);
      const nextTab = tab ?? lastDashboardTab;
      setLastDashboardTab(nextTab);
      if (activeMode === 'classic' && patient?.id) {
        transitionClassicToDashboard(navigate, {
          patientId: patient.id,
          dashboardTab: nextTab,
        });
        return;
      }
      transitionCommandToDashboard(navigate, { dashboardTab: nextTab });
    },
    [activeMode, lastDashboardTab, navigate, patient?.id, setLastDashboardTab],
  );

  const setActiveMode = useCallback(
    (mode: EpisMode) => {
      if (mode === activeMode) return;
      setPreviousMode(activeMode);
      if (mode === 'command') {
        if (activeMode === 'dashboard') {
          transitionDashboardToCommand(navigate, lastDashboardTab);
        } else {
          transitionClassicToCommand(navigate, patient?.id);
        }
        return;
      }
      if (mode === 'classic') {
        openClassicMode();
        return;
      }
      openDashboardMode();
    },
    [activeMode, lastDashboardTab, navigate, openClassicMode, openDashboardMode, patient?.id],
  );

  const returnToPreviousMode = useCallback(() => {
    if (!previousMode || previousMode === activeMode) {
      openCommandCenter();
      return;
    }
    if (previousMode === 'classic') openClassicMode();
    else if (previousMode === 'dashboard') openDashboardMode();
    else openCommandCenter();
  }, [activeMode, openClassicMode, openCommandCenter, openDashboardMode, previousMode]);

  const value = useMemo(
    (): EpisSessionContextValue => ({
      userId: session?.user.id,
      userName: session?.user.displayName,
      role,
      permissions,
      environment: 'demo',
      activeMode,
      previousMode,
      activePatientId: patient?.id,
      ...(modePreference ? { modePreference } : {}),
      lastDashboardTab,
      canOpenClassic: Boolean(patient?.id) && canOpenClassic,
      canOpenDashboard,
      setActiveMode,
      setLastDashboardTab,
      openCommandCenter,
      openClassicMode,
      openDashboardMode,
      returnToPreviousMode,
    }),
    [
      session?.user.id,
      session?.user.displayName,
      role,
      permissions,
      activeMode,
      previousMode,
      patient?.id,
      modePreference,
      lastDashboardTab,
      canOpenClassic,
      canOpenDashboard,
      setActiveMode,
      setLastDashboardTab,
      openCommandCenter,
      openClassicMode,
      openDashboardMode,
      returnToPreviousMode,
    ],
  );

  return <EpisSessionContext.Provider value={value}>{children}</EpisSessionContext.Provider>;
}

export function useEpisSession(): EpisSessionContextValue {
  const ctx = useContext(EpisSessionContext);
  if (!ctx) throw new Error('useEpisSession debe usarse dentro de EpisSessionProvider');
  return ctx;
}

export { getDefaultModeAfterLogin, EPIS_MODE_DEFINITIONS };
