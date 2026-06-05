import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { copy } from '@epis2/design-system';
import { EpisIconButton } from '../primitives/EpisIconButton.js';
import { useEpis2ThemePreferences } from './EpisThemePreferences.js';

export type EpisThemeModeToggleProps = {
  'data-testid'?: string;
};

/** Alterna modo claro/oscuro M3 (M3-08). Persiste en localStorage. */
export function EpisThemeModeToggle({
  'data-testid': testId = 'epis2-theme-mode-toggle',
}: EpisThemeModeToggleProps) {
  const { preferences, setPreferences } = useEpis2ThemePreferences();
  const isDark = preferences.mode === 'dark';
  const nextMode = isDark ? 'light' : 'dark';
  const label = isDark ? copy.themePreferences.modeLight : copy.themePreferences.modeDark;

  return (
    <EpisIconButton
      aria-label={label}
      title={label}
      size="small"
      onClick={() => setPreferences({ mode: nextMode })}
      data-testid={testId}
    >
      {isDark ? <LightModeOutlinedIcon fontSize="small" /> : <DarkModeOutlinedIcon fontSize="small" />}
    </EpisIconButton>
  );
}
