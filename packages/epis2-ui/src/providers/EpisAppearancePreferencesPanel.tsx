import type { ReactNode } from 'react';
import { copy } from '@epis2/design-system';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { Epis2Accent } from '../theme/create-epis2-theme.js';
import { EpisFilterChip } from '../primitives/EpisM3Chips.js';
import { EpisM3Text } from '../primitives/EpisM3Text.js';
import { useEpis2ThemePreferences } from './EpisThemePreferences.js';

const MTB_ACCENTS = ['clinicalBlue', 'tealBlue'] as const satisfies readonly Epis2Accent[];

const LEGACY_ACCENTS = ['calmGreen', 'soberViolet', 'neutral'] as const satisfies readonly Epis2Accent[];

export type EpisAppearancePreferencesPanelProps = {
  /** Dev/catálogo: incluye acentos legacy no MTB. */
  showLegacyAccents?: boolean;
  'data-testid'?: string;
};

function PreferenceRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Stack spacing={0.75}>
      <EpisM3Text role="labelLarge" color="text.secondary">
        {label}
      </EpisM3Text>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {children}
      </Stack>
    </Stack>
  );
}

/** Selector M3-08 / THEME-03 — temas MTB, modo, densidad, contraste y movimiento. */
export function EpisAppearancePreferencesPanel({
  showLegacyAccents = false,
  'data-testid': testId = 'epis2-appearance-preferences',
}: EpisAppearancePreferencesPanelProps) {
  const { preferences, setPreferences } = useEpis2ThemePreferences();

  const accentLabels: Record<Epis2Accent, string> = {
    clinicalBlue: copy.themePreferences.accentClinicalBlue,
    tealBlue: copy.themePreferences.accentTeal,
    calmGreen: copy.themePreferences.accentGreen,
    soberViolet: copy.themePreferences.accentViolet,
    neutral: copy.themePreferences.accentNeutral,
  };

  const accentOptions: Epis2Accent[] = showLegacyAccents
    ? [...MTB_ACCENTS, ...LEGACY_ACCENTS]
    : [...MTB_ACCENTS];

  return (
    <Stack spacing={2.5} data-testid={testId}>
      <PreferenceRow label={copy.themePreferences.accent}>
        {accentOptions.map((accent) => (
          <EpisFilterChip
            key={accent}
            label={accentLabels[accent]}
            active={preferences.accent === accent}
            clickable
            onClick={() => setPreferences({ accent })}
            data-testid={`epis2-accent-${accent}`}
          />
        ))}
      </PreferenceRow>

      <PreferenceRow label={copy.themePreferences.mode}>
        <EpisFilterChip
          label={copy.themePreferences.modeLight}
          active={preferences.mode === 'light'}
          clickable
          onClick={() => setPreferences({ mode: 'light' })}
          data-testid="epis2-mode-light"
        />
        <EpisFilterChip
          label={copy.themePreferences.modeDark}
          active={preferences.mode === 'dark'}
          clickable
          onClick={() => setPreferences({ mode: 'dark' })}
          data-testid="epis2-mode-dark"
        />
      </PreferenceRow>

      <PreferenceRow label={copy.themePreferences.density}>
        <EpisFilterChip
          label={copy.themePreferences.densityComfortable}
          active={preferences.density === 'comfortable'}
          clickable
          onClick={() => setPreferences({ density: 'comfortable' })}
          data-testid="epis2-density-comfortable"
        />
        <EpisFilterChip
          label={copy.themePreferences.densityCompact}
          active={preferences.density === 'compact'}
          clickable
          onClick={() => setPreferences({ density: 'compact' })}
          data-testid="epis2-density-compact"
        />
      </PreferenceRow>

      <PreferenceRow label={copy.themePreferences.contrast}>
        <EpisFilterChip
          label={copy.themePreferences.contrastStandard}
          active={preferences.contrast === 'standard'}
          clickable
          onClick={() => setPreferences({ contrast: 'standard' })}
          data-testid="epis2-contrast-standard"
        />
        <EpisFilterChip
          label={copy.themePreferences.contrastHigh}
          active={preferences.contrast === 'high'}
          clickable
          onClick={() => setPreferences({ contrast: 'high' })}
          data-testid="epis2-contrast-high"
        />
      </PreferenceRow>

      <PreferenceRow label={copy.themePreferences.motion}>
        <EpisFilterChip
          label={copy.themePreferences.motionStandard}
          active={preferences.motion === 'standard'}
          clickable
          onClick={() => setPreferences({ motion: 'standard' })}
          data-testid="epis2-motion-standard"
        />
        <EpisFilterChip
          label={copy.themePreferences.motionReduced}
          active={preferences.motion === 'reduced'}
          clickable
          onClick={() => setPreferences({ motion: 'reduced' })}
          data-testid="epis2-motion-reduced"
        />
      </PreferenceRow>

      <Typography variant="body2" color="text.secondary">
        {copy.themePreferences.safetyNote}
      </Typography>
    </Stack>
  );
}
