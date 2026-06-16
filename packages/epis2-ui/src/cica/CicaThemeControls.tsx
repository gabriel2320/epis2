import { copy } from '@epis2/design-system';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import type { Epis2Accent } from '../theme/create-epis2-theme.js';
import { EpisIconButton } from '../primitives/EpisIconButton.js';
import { EpisAppearancePreferencesLink } from '../providers/EpisAppearancePreferencesLink.js';
import { EpisThemeModeToggle } from '../providers/EpisThemeModeToggle.js';
import { useEpis2ThemePreferences } from '../providers/EpisThemePreferences.js';

const QUICK_ACCENTS = [
  'clinicalBlue',
  'clinicalCalm',
  'tealBlue',
  'sageClinical',
] as const satisfies readonly Epis2Accent[];

const QUICK_ACCENT_COLORS: Record<(typeof QUICK_ACCENTS)[number], string> = {
  clinicalBlue: '#1873DC',
  clinicalCalm: '#0B5C66',
  tealBlue: '#0D7377',
  sageClinical: '#28644A',
};

const accentLabels: Record<(typeof QUICK_ACCENTS)[number], string> = {
  clinicalBlue: copy.themePreferences.accentClinicalBlue,
  clinicalCalm: copy.themePreferences.accentClinicalCalm,
  tealBlue: copy.themePreferences.accentTeal,
  sageClinical: copy.themePreferences.accentSage,
};

export type CicaThemeControlsProps = {
  appearanceHref?: string;
  showAccentQuickSelect?: boolean;
  'data-testid'?: string;
};

/** Controles compactos de tema para CicaTopBar — modo, acentos rápidos y enlace a preferencias. */
export function CicaThemeControls({
  appearanceHref = '/preferencias-apariencia',
  showAccentQuickSelect = true,
  'data-testid': testId = 'cica-theme-controls',
}: CicaThemeControlsProps) {
  const { preferences, setPreferences } = useEpis2ThemePreferences();

  return (
    <Box
      data-testid={testId}
      sx={{ display: 'flex', alignItems: 'center', gap: 0.25, flexShrink: 0 }}
    >
      <EpisThemeModeToggle data-testid="cica-theme-mode-toggle" />
      {showAccentQuickSelect
        ? QUICK_ACCENTS.map((accent) => {
            const active = preferences.accent === accent;
            const swatch = QUICK_ACCENT_COLORS[accent];
            return (
              <Tooltip key={accent} title={accentLabels[accent]}>
                <span>
                  <EpisIconButton
                    aria-label={accentLabels[accent]}
                    size="small"
                    onClick={() => setPreferences({ accent })}
                    data-testid={`cica-accent-${accent}`}
                    sx={{
                      p: 0.5,
                      border: 1,
                      borderColor: active ? 'primary.main' : 'transparent',
                    }}
                  >
                    <Box
                      aria-hidden
                      sx={{
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        bgcolor: swatch,
                        boxShadow: active ? 2 : 0,
                      }}
                    />
                  </EpisIconButton>
                </span>
              </Tooltip>
            );
          })
        : null}
      <EpisAppearancePreferencesLink
        href={appearanceHref}
        data-testid="cica-appearance-preferences-link"
      />
    </Box>
  );
}
