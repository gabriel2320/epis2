import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import MuiIconButton from '@mui/material/IconButton';
import { copy } from '@epis2/design-system';

export type EpisAppearancePreferencesLinkProps = {
  href?: string;
  'data-testid'?: string;
};

/** Acceso rápido a preferencias de apariencia (THEME-03). */
export function EpisAppearancePreferencesLink({
  href = '/preferencias-apariencia',
  'data-testid': testId = 'epis2-appearance-preferences-link',
}: EpisAppearancePreferencesLinkProps) {
  return (
    <MuiIconButton
      component="a"
      href={href}
      size="small"
      aria-label={copy.themePreferences.openLink}
      title={copy.themePreferences.openLink}
      data-testid={testId}
    >
      <PaletteOutlinedIcon fontSize="small" />
    </MuiIconButton>
  );
}
