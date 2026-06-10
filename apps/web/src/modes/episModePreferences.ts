/** Preferencias visuales de modo — persistencia local permitida por canon. */
export type ClassicPatientViewMode = 'modern' | 'classic';
export type DashboardViewMode = 'legacy' | 'dashboard';

export type EpisModeUserPreferences = {
  defaultPatientView: ClassicPatientViewMode;
  defaultDashboardView?: DashboardViewMode | undefined;
};

/** @deprecated Usar EpisModeUserPreferences */
export type EpisClassicUserPreferences = EpisModeUserPreferences;

const STORAGE_KEY = 'epis2-user-preferences';

const DEFAULTS: EpisModeUserPreferences = {
  defaultPatientView: 'modern',
};

const DEFAULTS_SNAPSHOT: EpisModeUserPreferences = { ...DEFAULTS };

export function loadEpisModePreferences(): EpisModeUserPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS_SNAPSHOT;
    const parsed = JSON.parse(raw) as Partial<EpisModeUserPreferences>;
    const defaultPatientView =
      parsed.defaultPatientView === 'classic' ? 'classic' : DEFAULTS.defaultPatientView;
    const defaultDashboardView =
      parsed.defaultDashboardView === 'dashboard' ? 'dashboard' : undefined;
    return { defaultPatientView, defaultDashboardView };
  } catch {
    return DEFAULTS_SNAPSHOT;
  }
}

export function saveEpisModePreferences(next: EpisModeUserPreferences): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function subscribeEpisModePreferences(onStoreChange: () => void): () => void {
  const handler = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      onStoreChange();
    }
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}

export function setDefaultPatientView(mode: ClassicPatientViewMode): void {
  saveEpisModePreferences({ ...loadEpisModePreferences(), defaultPatientView: mode });
}

export function setDefaultDashboardView(mode: DashboardViewMode | undefined): void {
  const prefs = loadEpisModePreferences();
  saveEpisModePreferences({
    ...prefs,
    ...(mode === 'dashboard' ? { defaultDashboardView: 'dashboard' } : {}),
  });
}

/** @deprecated Usar loadEpisModePreferences */
export const loadClassicUserPreferences = loadEpisModePreferences;

/** @deprecated Usar saveEpisModePreferences */
export const saveClassicUserPreferences = saveEpisModePreferences;
