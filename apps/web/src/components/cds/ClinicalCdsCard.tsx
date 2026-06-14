import type { SilentSuggestionVariant } from '@epis2/clinical-domain';
import { EpisChip, Stack, Typography } from '@epis2/epis2-ui';

export type ClinicalCdsCardProps = {
  variant: SilentSuggestionVariant;
  label: string;
  detail?: string | undefined;
  onAction?: (() => void) | undefined;
  testId?: string | undefined;
};

function variantColor(variant: SilentSuggestionVariant): 'default' | 'warning' | 'info' {
  if (variant === 'warning') return 'warning';
  if (variant === 'info') return 'info';
  return 'default';
}

/** MF-DI-06 / MF-CU-01 — tarjeta CDS compacta (info / sugerencia / advertencia). */
export function ClinicalCdsCard({
  variant,
  label,
  detail,
  onAction,
  testId,
}: ClinicalCdsCardProps) {
  const clickable = Boolean(onAction);

  return (
    <Stack
      spacing={0.25}
      data-testid={testId}
      sx={{
        py: 0.75,
        px: 1,
        borderRadius: 1,
        border: 1,
        borderColor: variant === 'warning' ? 'warning.light' : 'outlineVariant',
        bgcolor: variant === 'warning' ? 'warning.light' : 'surfaceContainerLow',
      }}
    >
      <EpisChip
        label={label}
        size="small"
        color={variantColor(variant)}
        variant={variant === 'suggestion' ? 'outlined' : 'filled'}
        onClick={clickable ? onAction : undefined}
        sx={{
          alignSelf: 'flex-start',
          maxWidth: '100%',
          height: 'auto',
          '& .MuiChip-label': { whiteSpace: 'normal' },
        }}
      />
      {detail ? (
        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.45 }}>
          {detail}
        </Typography>
      ) : null}
    </Stack>
  );
}
