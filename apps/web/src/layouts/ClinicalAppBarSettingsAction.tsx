import { copy } from '@epis2/design-system';
import { EpisButton, SettingsIcon } from '@epis2/epis2-ui';
import { Link } from '@tanstack/react-router';

/** Acceso directo a preferencias — visible en barra global (UX descubribilidad). */
export function ClinicalAppBarSettingsAction() {
  return (
    <EpisButton
      component={Link}
      to="/preferencias-apariencia"
      appearance="text"
      size="small"
      aria-label={copy.themePreferences.openLink}
      title={copy.themePreferences.openLink}
      data-testid="epis2-nav-ajustes"
      sx={{ minWidth: 40, px: 1 }}
    >
      <SettingsIcon fontSize="small" />
    </EpisButton>
  );
}
