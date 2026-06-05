import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  createEpis2Theme,
  type CreateEpis2ThemeOptions,
  type Epis2Accent,
} from '../theme/create-epis2-theme.js';
import type { Epis2MotionScheme } from '../theme/motion.js';
import type { Epis2ThemeContrast, Epis2ThemeDensity } from '../theme/create-epis2-theme.js';
import {
  resolveEffectiveThemeMode,
  subscribeColorScheme,
  type Epis2ThemeModePreference,
} from '../theme/theme-mode.js';

const STORAGE_KEY = 'epis2-theme-preferences-v2';

export type Epis2ThemePreferences = {
  mode: Epis2ThemeModePreference;
  accent: Epis2Accent;
  density: Epis2ThemeDensity;
  contrast: Epis2ThemeContrast;
  motion: Epis2MotionScheme;
};

const defaultPreferences: Epis2ThemePreferences = {
  mode: 'light',
  accent: 'clinicalBlue',
  density: 'comfortable',
  contrast: 'standard',
  motion: 'standard',
};

function loadPreferences(): Epis2ThemePreferences {
  if (typeof window === 'undefined') return defaultPreferences;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPreferences;
    const parsed = JSON.parse(raw) as Partial<Epis2ThemePreferences>;
    return { ...defaultPreferences, ...parsed };
  } catch {
    return defaultPreferences;
  }
}

type Epis2ThemePreferencesContextValue = {
  preferences: Epis2ThemePreferences;
  setPreferences: (next: Partial<Epis2ThemePreferences>) => void;
  themeOptions: CreateEpis2ThemeOptions;
};

const Epis2ThemePreferencesContext = createContext<Epis2ThemePreferencesContextValue | null>(null);

export function Epis2ThemePreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferencesState] = useState<Epis2ThemePreferences>(() => loadPreferences());
  const [systemRevision, setSystemRevision] = useState(0);

  useEffect(() => {
    if (preferences.mode !== 'system') return;
    return subscribeColorScheme(() => setSystemRevision((n) => n + 1));
  }, [preferences.mode]);

  const setPreferences = (next: Partial<Epis2ThemePreferences>) => {
    setPreferencesState((prev) => {
      const merged = { ...prev, ...next };
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      }
      return merged;
    });
  };

  const themeOptions = useMemo<CreateEpis2ThemeOptions>(
    () => ({
      mode: resolveEffectiveThemeMode(preferences.mode),
      accent: preferences.accent,
      density: preferences.density,
      contrast: preferences.contrast,
      motion: preferences.motion,
    }),
    [preferences, systemRevision],
  );

  return (
    <Epis2ThemePreferencesContext.Provider value={{ preferences, setPreferences, themeOptions }}>
      {children}
    </Epis2ThemePreferencesContext.Provider>
  );
}

export function useEpis2ThemePreferences() {
  const ctx = useContext(Epis2ThemePreferencesContext);
  if (!ctx) {
    return {
      preferences: defaultPreferences,
      setPreferences: () => {},
      themeOptions: defaultPreferences as CreateEpis2ThemeOptions,
    };
  }
  return ctx;
}

export function useEpis2ThemeFromPreferences() {
  const { themeOptions } = useEpis2ThemePreferences();
  return useMemo(() => createEpis2Theme(themeOptions), [themeOptions]);
}
