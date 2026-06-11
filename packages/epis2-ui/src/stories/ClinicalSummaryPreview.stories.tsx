import type { Meta, StoryObj } from '@storybook/react';
import { Box, Chip, Stack } from '../mui/index.js';
import { EpisButton } from '../primitives/EpisButton.js';
import { EpisM3Text } from '../primitives/EpisM3Text.js';
import {
  epis2IslandPaddingSx,
  epis2IslandSx,
  epis2Shape,
  epis2TraditionalChartShellSx,
} from '../theme/theme.js';

type SummaryCardProps = {
  title: string;
  body: string;
  meta?: string;
  highlightValue?: string;
  highlightMeta?: string;
  severity?: 'default' | 'warning' | 'critical';
  actionLabel?: string;
};

function SummaryCard({
  title,
  body,
  meta,
  highlightValue,
  highlightMeta,
  severity = 'default',
  actionLabel,
}: SummaryCardProps) {
  const borderColor =
    severity === 'critical' ? 'error.main' : severity === 'warning' ? 'warning.main' : 'divider';

  return (
    <Stack
      spacing={1}
      sx={{
        ...epis2IslandSx,
        ...epis2IslandPaddingSx,
        p: 2,
        height: '100%',
        border: 1,
        borderColor,
        bgcolor: 'background.paper',
        borderRadius: `${epis2Shape.small}px`,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
        <EpisM3Text role="titleMedium" component="h3" sx={{ m: 0 }}>
          {title}
        </EpisM3Text>
        {meta ? (
          <EpisM3Text role="labelMedium" color="text.secondary">
            {meta}
          </EpisM3Text>
        ) : null}
      </Stack>
      {highlightValue ? (
        <Stack spacing={0.5}>
          <EpisM3Text role="titleLarge" sx={{ m: 0, fontVariantNumeric: 'tabular-nums' }}>
            {highlightValue}
          </EpisM3Text>
          {highlightMeta ? (
            <EpisM3Text role="labelMedium" color="text.secondary">
              {highlightMeta}
            </EpisM3Text>
          ) : null}
        </Stack>
      ) : (
        <EpisM3Text role="bodyMedium" sx={{ whiteSpace: 'pre-wrap' }}>
          {body}
        </EpisM3Text>
      )}
      {actionLabel ? (
        <EpisButton appearance="text" size="small" sx={{ alignSelf: 'flex-start', px: 0 }}>
          {actionLabel}
        </EpisButton>
      ) : null}
    </Stack>
  );
}

function ClinicalSummaryScaffold() {
  return (
    <Box sx={{ ...epis2TraditionalChartShellSx(), p: 2, minHeight: 480 }}>
      <Stack spacing={2}>
        <Stack
          direction="row"
          flexWrap="wrap"
          gap={0.75}
          sx={{
            p: 1.5,
            border: 1,
            borderColor: 'outlineVariant',
            borderRadius: `${epis2Shape.small}px`,
            bgcolor: 'surfaceContainerHigh',
          }}
        >
          <Chip size="small" color="error" variant="outlined" label="Alerta crítica demo" />
          <Chip size="small" color="warning" variant="outlined" label="Penicilina · severe" />
        </Stack>
        <EpisM3Text role="titleMedium" component="h2">
          Ahora
        </EpisM3Text>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          }}
        >
          <SummaryCard title="Eventos recientes" body="Consulta hace 2 h (demo)" />
          <SummaryCard
            title="Alergias"
            body="Penicilina · moderate"
            severity="warning"
            actionLabel="Gestionar alergias"
          />
        </Box>
        <EpisM3Text role="titleMedium" component="h2">
          Contexto
        </EpisM3Text>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          }}
        >
          <SummaryCard title="Medicación activa" body="Warfarina 5 mg · VO" />
          <SummaryCard title="PRN / rescate" body="Morfina 2 mg · IV" />
          <SummaryCard
            title="Creatinina"
            body=""
            meta="Resultado reciente"
            highlightValue="1.8 mg/dL"
            highlightMeta="01-06-2026, 10:00"
            actionLabel="Abrir resultados"
          />
        </Box>
      </Stack>
    </Box>
  );
}

const meta = {
  title: 'Ficha/Resumen clínico MD3',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

/** Scaffold C-2.4 / MF-CLINICAL-SUMMARY-B — forma cuadrada + zonas medicación + labs destacados. */
export const GridScaffold: StoryObj = {
  render: () => <ClinicalSummaryScaffold />,
};
