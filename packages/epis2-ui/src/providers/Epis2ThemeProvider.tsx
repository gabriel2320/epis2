import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useMemo, type ReactNode } from 'react';
import './../pickers/configureDayjs.js';
import { createEpis2Theme, type CreateEpis2ThemeOptions } from '../theme/create-epis2-theme.js';
import { epis2Theme } from '../theme/theme.js';
import {
  Epis2ThemePreferencesProvider,
  useEpis2ThemeFromPreferences,
} from './EpisThemePreferences.js';

export type Epis2ThemeProviderProps = {
  children: ReactNode;
  /** Override puntual (tests); producción usa preferencias M3-08. */
  themeOptions?: CreateEpis2ThemeOptions;
  /** Desactiva persistencia de preferencias (tests). */
  disablePreferences?: boolean;
};

function Epis2ThemeProviderInner({
  children,
  themeOptions,
}: {
  children: ReactNode;
  themeOptions?: CreateEpis2ThemeOptions;
}) {
  const preferredTheme = useEpis2ThemeFromPreferences();
  const theme = useMemo(
    () => (themeOptions ? createEpis2Theme(themeOptions) : preferredTheme),
    [themeOptions, preferredTheme],
  );

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
        <CssBaseline />
        {children}
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export function Epis2ThemeProvider({
  children,
  themeOptions,
  disablePreferences = false,
}: Epis2ThemeProviderProps) {
  if (disablePreferences || themeOptions) {
    const theme = themeOptions ? createEpis2Theme(themeOptions) : epis2Theme;
    return (
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <CssBaseline />
          {children}
        </LocalizationProvider>
      </ThemeProvider>
    );
  }

  return (
    <Epis2ThemePreferencesProvider>
      <Epis2ThemeProviderInner>{children}</Epis2ThemeProviderInner>
    </Epis2ThemePreferencesProvider>
  );
}

export { useEpis2ThemePreferences } from './EpisThemePreferences.js';
export { EpisThemeModeToggle, type EpisThemeModeToggleProps } from './EpisThemeModeToggle.js';
export {
  EpisAppearancePreferencesPanel,
  type EpisAppearancePreferencesPanelProps,
} from './EpisAppearancePreferencesPanel.js';
export {
  EpisAppearancePreferencesLink,
  type EpisAppearancePreferencesLinkProps,
} from './EpisAppearancePreferencesLink.js';
