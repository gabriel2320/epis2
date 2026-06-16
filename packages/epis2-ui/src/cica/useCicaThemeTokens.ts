import { useTheme } from '@mui/material/styles';
import { useMemo } from 'react';
import { useEpis2ThemePreferences } from '../providers/EpisThemePreferences.js';
import { resolveEffectiveThemeMode } from '../theme/theme-mode.js';
import { cicaTokens as cicaLayoutTokens } from './cicaTokens.js';

/** Colores semánticos CICA resueltos desde el tema MUI activo. */
export type CicaSemanticColors = {
  backgroundDefault: string;
  backgroundPaper: string;
  divider: string;
  textPrimary: string;
  textSecondary: string;
  primary: string;
  primaryContrast: string;
  actionHover: string;
};

/** Layout estático + colores semánticos + modo efectivo. */
export type CicaThemeTokens = typeof cicaLayoutTokens & {
  colors: CicaSemanticColors;
  mode: 'light' | 'dark';
  isDark: boolean;
};

/** Mapea tema EPIS2 (modo + acento MTB) a tokens semánticos CICA. */
export function useCicaThemeTokens(): CicaThemeTokens {
  const theme = useTheme();
  const { preferences } = useEpis2ThemePreferences();
  const mode = resolveEffectiveThemeMode(preferences.mode);

  return useMemo(
    () => ({
      ...cicaLayoutTokens,
      mode,
      isDark: mode === 'dark',
      colors: {
        backgroundDefault: theme.palette.background.default,
        backgroundPaper: theme.palette.background.paper,
        divider: theme.palette.divider,
        textPrimary: theme.palette.text.primary,
        textSecondary: theme.palette.text.secondary,
        primary: theme.palette.primary.main,
        primaryContrast: theme.palette.primary.contrastText,
        actionHover: theme.palette.action.hover,
      },
    }),
    [theme, mode],
  );
}
