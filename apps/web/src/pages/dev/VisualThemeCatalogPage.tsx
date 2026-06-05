import type { ReactNode } from 'react';
import { copy } from '@epis2/design-system';
import {
  Box,
  clinicalRoles,
  Divider,
  EpisAppearancePreferencesPanel,
  EpisButton,
  EpisCard,
  EpisM3Text,
  Stack,
  Typography,
  useTheme,
} from '@epis2/epis2-ui';

function ColorSwatch({ name, hex }: { name: string; hex: string }) {
  return (
    <Stack alignItems="center" spacing={0.5} sx={{ minWidth: 88 }}>
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: 2,
          bgcolor: hex,
          border: 1,
          borderColor: 'divider',
          boxShadow: 'none',
        }}
      />
      <Typography variant="caption" fontWeight={600}>
        {name}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {hex}
      </Typography>
    </Stack>
  );
}

function CatalogSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <EpisCard sx={{ p: 3, boxShadow: 'none', border: 1, borderColor: 'divider' }}>
      <EpisM3Text role="titleMedium" gutterBottom>
        {title}
      </EpisM3Text>
      <Divider sx={{ mb: 2 }} />
      {children}
    </EpisCard>
  );
}

const CLINICAL_ROLE_KEYS = Object.keys(clinicalRoles) as (keyof typeof clinicalRoles)[];

const TYPOGRAPHY_ROLES = [
  ['displayLarge', 'Display'],
  ['headlineLarge', 'Headline'],
  ['titleMedium', 'Title'],
  ['bodyLarge', 'Body'],
  ['labelLarge', 'Label'],
] as const;

export function VisualThemeCatalogPage() {
  const theme = useTheme();
  const palette = theme.palette;
  const epis2 = theme.epis2;

  const paletteSwatches = [
    { name: 'primary', hex: palette.primary?.main ?? '' },
    { name: 'surface', hex: palette.background?.default ?? '' },
    { name: 'paper', hex: palette.background?.paper ?? '' },
    { name: 'onSurface', hex: palette.text?.primary ?? '' },
    { name: 'outline', hex: palette.divider ?? '' },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4, px: 2 }}>
      <Stack spacing={3} sx={{ maxWidth: 720, mx: 'auto' }} data-testid="epis2-visual-theme-catalog">
        <Stack spacing={1}>
          <EpisM3Text role="headlineLarge" color="primary.main">
            {copy.visualThemeCatalog.title}
          </EpisM3Text>
          <EpisM3Text role="bodyMedium" color="text.secondary">
            {copy.visualThemeCatalog.subtitle}
          </EpisM3Text>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            <EpisButton href="/comando" component="a" appearance="text" size="small">
              {copy.visualThemeCatalog.backToCommand}
            </EpisButton>
            <EpisButton href="/preferencias-apariencia" component="a" appearance="text" size="small">
              {copy.visualThemeCatalog.openPreferences}
            </EpisButton>
          </Stack>
          <EpisM3Text role="labelMedium" color="text.secondary">
            themeId: {epis2?.themeId ?? '—'} · accent: {epis2?.accent ?? '—'} · modo: {palette.mode}
          </EpisM3Text>
        </Stack>

        <CatalogSection title={copy.themePreferences.title}>
          <EpisAppearancePreferencesPanel />
        </CatalogSection>

        <CatalogSection title={copy.visualThemeCatalog.paletteSection}>
          <Stack direction="row" flexWrap="wrap" gap={2}>
            {paletteSwatches.map((s) => (
              <ColorSwatch key={s.name} name={s.name} hex={s.hex} />
            ))}
          </Stack>
        </CatalogSection>

        <CatalogSection title={copy.visualThemeCatalog.clinicalRolesSection}>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {CLINICAL_ROLE_KEYS.map((key) => (
              <Box
                key={key}
                sx={{
                  px: 1.5,
                  py: 0.75,
                  borderRadius: 1,
                  bgcolor: clinicalRoles[key].container,
                  color: clinicalRoles[key].onContainer,
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                }}
              >
                {key}
              </Box>
            ))}
          </Stack>
        </CatalogSection>

        <CatalogSection title={copy.visualThemeCatalog.typographySection}>
          <Stack spacing={1.5}>
            {TYPOGRAPHY_ROLES.map(([role, label]) => (
              <EpisM3Text key={role} role={role}>
                {label} — muestra tipográfica M3
              </EpisM3Text>
            ))}
          </Stack>
        </CatalogSection>

        <CatalogSection title={copy.visualThemeCatalog.elevationSection}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Box
              sx={{
                flex: 1,
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                boxShadow: 'none',
              }}
            >
              <EpisM3Text role="labelLarge">Tonal ✓</EpisM3Text>
            </Box>
            <Box
              sx={{
                flex: 1,
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.default',
              }}
            >
              <EpisM3Text role="labelLarge" color="text.secondary">
                Fondo plano (sin borde)
              </EpisM3Text>
            </Box>
          </Stack>
        </CatalogSection>

        <CatalogSection title={copy.visualThemeCatalog.proseSection}>
          <EpisM3Text role="bodyLarge" sx={{ maxWidth: '65ch', lineHeight: 1.5, textAlign: 'left' }}>
            {copy.visualThemeCatalog.proseSample}
          </EpisM3Text>
        </CatalogSection>

        <CatalogSection title={copy.visualThemeCatalog.numericSection}>
          <EpisM3Text
            role="bodyLarge"
            sx={{ fontVariantNumeric: 'tabular-nums', textAlign: 'right', maxWidth: 120, ml: 'auto' }}
          >
            1 234,50
          </EpisM3Text>
          <EpisM3Text
            role="bodyLarge"
            sx={{ fontVariantNumeric: 'tabular-nums', textAlign: 'right', maxWidth: 120, ml: 'auto' }}
          >
            98,70
          </EpisM3Text>
        </CatalogSection>

        <CatalogSection title={copy.visualThemeCatalog.docsSection}>
          <Stack spacing={0.5}>
            <EpisM3Text role="bodyMedium">{copy.visualThemeCatalog.docsRules}</EpisM3Text>
            <EpisM3Text role="bodyMedium">{copy.visualThemeCatalog.docsAntiPatterns}</EpisM3Text>
          </Stack>
        </CatalogSection>
      </Stack>
    </Box>
  );
}
