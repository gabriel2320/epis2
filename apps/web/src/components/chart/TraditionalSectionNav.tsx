import { copy } from '@epis2/design-system';
import { Box, Stack, Typography, epis2TraditionalChartTokens } from '@epis2/epis2-ui';

/** 17 secciones clínicas del canon visual §6 (MF-DUAL-CHART-05). */
export const TRADITIONAL_SECTION_IDS = [
  'navSummary',
  'navAdmin',
  'navAnamnesis',
  'navAntecedents',
  'navAllergies',
  'navPhysicalExam',
  'navDiagnoses',
  'navOrders',
  'navMeds',
  'navEvolution',
  'navLabs',
  'navImaging',
  'navConsults',
  'navDocuments',
  'navEpicrisis',
  'navProcedures',
  'navAudit',
] as const;

export type TraditionalSectionId = (typeof TRADITIONAL_SECTION_IDS)[number];

export type TraditionalSectionNavProps = {
  activeSection?: TraditionalSectionId | undefined;
  onSectionChange?: ((section: TraditionalSectionId) => void) | undefined;
  testId?: string | undefined;
};

/** Índice lateral clínico — 17 secciones, denso, sin wizard. */
export function TraditionalSectionNav({
  activeSection = 'navSummary',
  onSectionChange,
  testId = 'epis2-traditional-section-nav',
}: TraditionalSectionNavProps) {
  const t = epis2TraditionalChartTokens;

  return (
    <Box
      component="nav"
      aria-label="Secciones clínicas"
      data-testid={testId}
      sx={{
        width: t.navWidth,
        flexShrink: 0,
        borderRight: t.borderSubtle,
        borderColor: t.borderColor,
        bgcolor: 'background.paper',
        py: 2,
        px: 1,
        display: { xs: 'none', md: 'block' },
      }}
    >
      <Stack spacing={0.25}>
        {TRADITIONAL_SECTION_IDS.map((key) => {
          const active = key === activeSection;
          return (
            <Typography
              key={key}
              component="button"
              type="button"
              variant="body2"
              onClick={() => onSectionChange?.(key)}
              sx={{
                textAlign: 'left',
                width: '100%',
                border: 'none',
                background: 'none',
                font: 'inherit',
                px: 1.5,
                py: 0.75,
                borderRadius: 1,
                cursor: onSectionChange ? 'pointer' : 'default',
                fontWeight: active ? 600 : 400,
                bgcolor: active ? 'action.selected' : 'transparent',
                color: active ? 'primary.main' : 'text.primary',
                '&:hover': onSectionChange ? { bgcolor: 'action.hover' } : undefined,
              }}
              data-testid={`${testId}-${key}`}
            >
              {copy.chartModes[key]}
            </Typography>
          );
        })}
      </Stack>
    </Box>
  );
}
