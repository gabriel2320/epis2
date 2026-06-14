import type { SilentSuggestionVariant } from '@epis2/clinical-domain';
import { copy } from '@epis2/design-system';
import { Alert, AlertTitle, Chip, Stack, Typography } from '@epis2/epis2-ui';

export type ClinicalCdsCardVariant = SilentSuggestionVariant;

export type ClinicalCdsCardProps = {
  variant: ClinicalCdsCardVariant;
  label: string;
  detail?: string | undefined;
  onAction?: (() => void) | undefined;
  actionLabel?: string | undefined;
  source?: 'cds' | 'cdr' | undefined;
  testId?: string | undefined;
};

function alertSeverity(variant: SilentSuggestionVariant): 'info' | 'warning' {
  return variant === 'warning' ? 'warning' : 'info';
}

function variantChipLabel(variant: SilentSuggestionVariant): string {
  const labels = copy.cdsCard;
  if (variant === 'warning') return labels.variantWarning;
  if (variant === 'suggestion') return labels.variantSuggestion;
  return labels.variantInfo;
}

/** MF-CU-01 — tarjeta CDS Hooks compacta (info / sugerencia / advertencia). */
export function ClinicalCdsCard({
  variant,
  label,
  detail,
  onAction,
  actionLabel,
  source,
  testId,
}: ClinicalCdsCardProps) {
  const isSuggestion = variant === 'suggestion';

  return (
    <Alert
      severity={alertSeverity(variant)}
      variant={isSuggestion ? 'standard' : 'outlined'}
      data-testid={testId}
      sx={{
        py: 0.75,
        '& .MuiAlert-message': { width: '100%', py: 0.25 },
        ...(isSuggestion ? { bgcolor: 'action.hover' } : undefined),
      }}
    >
      <AlertTitle
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 0.75,
          mb: detail || onAction ? 0.5 : 0,
          fontSize: '0.875rem',
          fontWeight: 600,
        }}
      >
        {onAction ? (
          <Typography
            component="button"
            type="button"
            variant="inherit"
            onClick={onAction}
            sx={{
              m: 0,
              p: 0,
              border: 0,
              bgcolor: 'transparent',
              color: 'inherit',
              font: 'inherit',
              textAlign: 'left',
              cursor: 'pointer',
              textDecoration: isSuggestion ? 'underline' : 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {label}
          </Typography>
        ) : (
          <span>{label}</span>
        )}
        <Stack direction="row" spacing={0.5} sx={{ ml: 'auto' }}>
          <Chip size="small" label={variantChipLabel(variant)} variant="outlined" />
          {source ? (
            <Chip
              size="small"
              label={
                source === 'cdr'
                  ? copy.commandCenter.alertSourceCdr
                  : copy.commandCenter.alertSourceCds
              }
              color={source === 'cdr' ? 'secondary' : 'default'}
            />
          ) : null}
        </Stack>
      </AlertTitle>
      {detail ? (
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.45 }}>
          {detail}
        </Typography>
      ) : null}
      {onAction && actionLabel ? (
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
          {actionLabel}
        </Typography>
      ) : null}
    </Alert>
  );
}
