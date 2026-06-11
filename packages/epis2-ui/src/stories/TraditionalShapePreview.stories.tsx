import type { Meta, StoryObj } from '@storybook/react';
import { Box, Chip, Stack } from '../mui/index.js';
import { Epis2ThemeProvider } from '../providers/Epis2ThemeProvider.js';
import { EpisM3Text } from '../primitives/EpisM3Text.js';
import { epis2Shape, epis2ShapeProfiles } from '../theme/shape.js';
import { epis2TraditionalChartShellSx } from '../theme/theme.js';

type ShapeDemoProps = {
  mode: 'light' | 'dark';
  accent: 'clinicalBlue' | 'clinicalCalm';
  label: string;
};

function ShapeDemo({ mode, accent, label }: ShapeDemoProps) {
  const profile = epis2ShapeProfiles.traditional;
  return (
    <Epis2ThemeProvider disablePreferences themeOptions={{ mode, accent }}>
      <Box sx={{ ...epis2TraditionalChartShellSx(), p: 2, minHeight: 360 }}>
        <EpisM3Text role="titleMedium" component="h2" sx={{ mb: 2 }}>
          {label} — forma cuadrada (max {profile.max}px)
        </EpisM3Text>
        <Stack direction="row" flexWrap="wrap" gap={1.5} sx={{ mb: 2 }}>
          <Chip label={`island ${epis2Shape.island}px`} sx={{ borderRadius: `${epis2Shape.island}px` }} />
          <Chip label={`chip ${epis2Shape.small}px`} sx={{ borderRadius: `${epis2Shape.small}px` }} />
          <Chip label={`field ${profile.field}px`} sx={{ borderRadius: `${profile.field}px` }} />
        </Stack>
        <Box
          sx={{
            borderRadius: `${epis2Shape.island}px`,
            border: 1,
            borderColor: 'outlineVariant',
            bgcolor: 'background.paper',
            p: 2,
            maxWidth: 480,
          }}
        >
          <EpisM3Text role="bodyMedium">
            Isla EMR traditional — sin sombra · borde outlineVariant · radio ≤ 10px.
          </EpisM3Text>
        </Box>
      </Box>
    </Epis2ThemeProvider>
  );
}

const meta = {
  title: 'Ficha/Forma traditional E3.5',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const LightClinicalBlue: StoryObj = {
  render: () => <ShapeDemo mode="light" accent="clinicalBlue" label="Light · clinical-blue" />,
};

export const DarkClinicalBlue: StoryObj = {
  render: () => <ShapeDemo mode="dark" accent="clinicalBlue" label="Dark · clinical-blue" />,
};

export const LightClinicalCalm: StoryObj = {
  render: () => <ShapeDemo mode="light" accent="clinicalCalm" label="Light · clinical-calm" />,
};

export const DarkClinicalCalm: StoryObj = {
  render: () => <ShapeDemo mode="dark" accent="clinicalCalm" label="Dark · clinical-calm" />,
};
