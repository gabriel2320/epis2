import { copy } from '@epis2/design-system';
import { EpisButton, Stack, Typography } from '@epis2/epis2-ui';
import { useState } from 'react';

export type EpisClassicMd3StatusBarProps = {
  draftStatusLabel?: string | undefined;
  lastSavedLabel?: string | undefined;
  userLabel?: string | undefined;
  roleLabel?: string | undefined;
  aiStatusLabel?: string | undefined;
  dbStatusLabel?: string | undefined;
  environmentLabel?: string | undefined;
  lastAuditLabel?: string | undefined;
  testId?: string | undefined;
  /** Dentro del bottom dock — sin borde superior duplicado. */
  embedded?: boolean | undefined;
};

/** Barra de estado compacta — detalle expandible (UX P2). */
export function EpisClassicMd3StatusBar({
  draftStatusLabel,
  lastSavedLabel,
  userLabel,
  roleLabel,
  aiStatusLabel,
  dbStatusLabel,
  environmentLabel,
  lastAuditLabel,
  testId = 'epis2-classic-md3-status-bar',
  embedded = false,
}: EpisClassicMd3StatusBarProps) {
  const [expanded, setExpanded] = useState(false);

  const headline = [draftStatusLabel, userLabel].filter(Boolean);
  const detail = [
    copy.classicMd3.modeLabel,
    lastSavedLabel,
    roleLabel,
    aiStatusLabel,
    dbStatusLabel,
    environmentLabel,
    lastAuditLabel,
  ].filter(Boolean);

  return (
    <Stack
      direction="row"
      spacing={1}
      flexWrap="wrap"
      useFlexGap
      alignItems="center"
      data-testid={testId}
      sx={{
        minHeight: 28,
        px: { xs: 1.5, md: 2 },
        py: 0.5,
        ...(embedded ? {} : { borderTop: 1, borderColor: 'divider' }),
        bgcolor: embedded ? 'transparent' : 'background.default',
      }}
    >
      {headline.map((part) => (
        <Typography key={part} variant="caption" color="text.primary" fontWeight={600}>
          {part}
        </Typography>
      ))}
      {expanded
        ? detail.map((part) => (
            <Typography key={part} variant="caption" color="text.secondary">
              {part}
            </Typography>
          ))
        : null}
      {detail.length > 0 ? (
        <EpisButton
          appearance="text"
          size="small"
          onClick={() => setExpanded((v) => !v)}
          data-testid={`${testId}-toggle`}
          sx={{ minWidth: 0, px: 0.75, ml: 'auto' }}
        >
          {expanded ? copy.layout.statusShowLess : copy.layout.statusShowMore}
        </EpisButton>
      ) : null}
    </Stack>
  );
}
