import {
  EpisButton,
  EpisM3Text,
  Stack,
  epis2CalmIslandSx,
  epis2IslandPaddingSx,
  epis2IslandSx,
  epis2ShapeProfiles,
} from '@epis2/epis2-ui';
import type { ReactNode } from 'react';

export type ClinicalSummarySurface = 'calm' | 'traditional';

export type EpisClinicalSummaryCardProps = {
  title: string;
  children?: ReactNode;
  /** calm = UX-AESTHETIC P3 · traditional = forma cuadrada EMR (E3). */
  surface?: ClinicalSummarySurface | undefined;
  meta?: string | undefined;
  /** Valor destacado (p. ej. labs MF-CLINICAL-SUMMARY-B). */
  highlightValue?: string | undefined;
  highlightMeta?: string | undefined;
  actionLabel?: string | undefined;
  onAction?: (() => void) | undefined;
  severity?: 'default' | 'warning' | 'critical' | undefined;
  testId?: string | undefined;
};

/** Tarjeta MD3 de resumen clínico — dato + timestamp + CTA (Fase A EHR). */
export function EpisClinicalSummaryCard({
  title,
  children,
  meta,
  highlightValue,
  highlightMeta,
  actionLabel,
  onAction,
  severity = 'default',
  surface = 'calm',
  testId,
}: EpisClinicalSummaryCardProps) {
  const isCalm = surface === 'calm';
  const profile = isCalm ? epis2ShapeProfiles.calm : epis2ShapeProfiles.traditional;
  const borderColor =
    severity === 'critical'
      ? 'error.main'
      : severity === 'warning'
        ? 'warning.main'
        : isCalm
          ? 'outlineVariant'
          : 'divider';

  return (
    <Stack
      data-testid={testId}
      spacing={1}
      sx={{
        ...(isCalm ? epis2CalmIslandSx : epis2IslandSx),
        ...epis2IslandPaddingSx,
        p: 2,
        height: '100%',
        borderRadius: `${profile.island}px`,
        border: 1,
        borderColor,
        bgcolor: severity === 'critical' ? 'errorContainer' : 'background.paper',
        boxShadow: 'none',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
        <EpisM3Text role="titleMedium" component="h3" sx={{ m: 0 }}>
          {title}
        </EpisM3Text>
        {meta ? (
          <EpisM3Text role="labelMedium" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
            {meta}
          </EpisM3Text>
        ) : null}
      </Stack>
      {highlightValue ? (
        <Stack spacing={0.5} sx={{ flex: 1 }}>
          <EpisM3Text role="titleLarge" component="p" sx={{ m: 0, fontVariantNumeric: 'tabular-nums' }}>
            {highlightValue}
          </EpisM3Text>
          {highlightMeta ? (
            <EpisM3Text role="labelMedium" color="text.secondary">
              {highlightMeta}
            </EpisM3Text>
          ) : null}
          {children ? (
            <EpisM3Text role="bodyMedium" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
              {children}
            </EpisM3Text>
          ) : null}
        </Stack>
      ) : (
        <EpisM3Text role="bodyMedium" component="div" sx={{ flex: 1, whiteSpace: 'pre-wrap' }}>
          {children}
        </EpisM3Text>
      )}
      {actionLabel && onAction ? (
        <EpisButton appearance="text" size="small" onClick={onAction} sx={{ alignSelf: 'flex-start', px: 0 }}>
          {actionLabel}
        </EpisButton>
      ) : null}
    </Stack>
  );
}
