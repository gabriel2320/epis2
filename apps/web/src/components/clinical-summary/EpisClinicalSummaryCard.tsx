import { EpisButton, EpisM3Text, Stack, epis2IslandPaddingSx, epis2IslandSx } from '@epis2/epis2-ui';
import type { ReactNode } from 'react';

export type EpisClinicalSummaryCardProps = {
  title: string;
  children?: ReactNode;
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
  testId,
}: EpisClinicalSummaryCardProps) {
  const borderColor =
    severity === 'critical'
      ? 'error.main'
      : severity === 'warning'
        ? 'warning.main'
        : 'divider';

  return (
    <Stack
      data-testid={testId}
      spacing={1}
      sx={{
        ...epis2IslandSx,
        ...epis2IslandPaddingSx,
        p: 2,
        height: '100%',
        border: 1,
        borderColor,
        bgcolor: 'background.paper',
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
