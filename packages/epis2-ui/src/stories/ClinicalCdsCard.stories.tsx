import { copy } from '@epis2/design-system';
import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertTitle, Chip, Stack, Typography } from '../mui/index.js';
import { Epis2ThemeProvider } from '../providers/Epis2ThemeProvider.js';

type PreviewVariant = 'info' | 'suggestion' | 'warning';

type CdsCardPreviewProps = {
  variant: PreviewVariant;
  label: string;
  detail?: string;
  source?: 'cds' | 'cdr';
  actionable?: boolean;
};

function alertSeverity(variant: PreviewVariant): 'info' | 'warning' {
  return variant === 'warning' ? 'warning' : 'info';
}

function variantChipLabel(variant: PreviewVariant): string {
  const labels = copy.cdsCard;
  if (variant === 'warning') return labels.variantWarning;
  if (variant === 'suggestion') return labels.variantSuggestion;
  return labels.variantInfo;
}

/** Espejo visual de `apps/web/src/components/cds/ClinicalCdsCard.tsx` (MF-CU-01). */
function CdsCardPreview({ variant, label, detail, source, actionable }: CdsCardPreviewProps) {
  const isSuggestion = variant === 'suggestion';

  return (
    <Alert
      severity={alertSeverity(variant)}
      variant={isSuggestion ? 'standard' : 'outlined'}
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
          mb: detail ? 0.5 : 0,
          fontSize: '0.875rem',
          fontWeight: 600,
        }}
      >
        <Typography
          component={actionable ? 'button' : 'span'}
          variant="inherit"
          sx={{
            m: 0,
            p: 0,
            border: 0,
            bgcolor: 'transparent',
            color: 'inherit',
            font: 'inherit',
            textAlign: 'left',
            cursor: actionable ? 'pointer' : 'default',
            textDecoration: actionable && isSuggestion ? 'underline' : 'none',
          }}
        >
          {label}
        </Typography>
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
    </Alert>
  );
}

const meta = {
  title: 'Clínico/ClinicalCdsCard',
  component: CdsCardPreview,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Epis2ThemeProvider disablePreferences>
        <Stack spacing={1.5} sx={{ maxWidth: 420, p: 2 }}>
          <Story />
        </Stack>
      </Epis2ThemeProvider>
    ),
  ],
} satisfies Meta<typeof CdsCardPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    variant: 'info',
    label: 'Alergia documentada: Penicilina',
    detail: copy.cdsCard.nonBlockingHint,
  },
};

export const Suggestion: Story = {
  args: {
    variant: 'suggestion',
    label: 'Solicitar hemograma completo',
    detail: 'Último control hace más de 6 meses (demo).',
    actionable: true,
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    label: 'Posible reacción cruzada beta-lactámico',
    detail: 'Revisar conciliación medicamentosa antes de prescribir.',
    source: 'cds',
  },
};

export const AllVariants: Story = {
  render: () => (
    <Stack spacing={1.5}>
      <CdsCardPreview
        variant="info"
        label="Gap de control HbA1c"
        detail={copy.cdsCard.nonBlockingHint}
      />
      <CdsCardPreview
        variant="suggestion"
        label="Abrir resultados de laboratorio"
        detail="Creatinina elevada en último panel."
        actionable
      />
      <CdsCardPreview
        variant="warning"
        label="Interacción warfarina — AINE"
        detail="Evaluar riesgo hemorrágico."
        source="cdr"
      />
    </Stack>
  ),
};
