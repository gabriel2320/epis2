import type { ClinicalAlert, PatientLongitudinalResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import {
  Box,
  EpisM3Text,
  Stack,
  Typography,
  epis2TraditionalChartShellSx,
  epis2TraditionalChartTokens,
} from '@epis2/epis2-ui';
import type { ReactNode } from 'react';
import { PatientClinicalSummaryGrid } from '../clinical-summary/PatientClinicalSummaryGrid.js';

const NAV_ITEMS = [
  'navSummary',
  'navProblems',
  'navMeds',
  'navLabs',
  'navEvolution',
  'navOrders',
  'navDocuments',
] as const;

export type TraditionalEhrModeProps = {
  summaryFields?: Record<string, string> | undefined;
  longitudinal?: PatientLongitudinalResponse | null | undefined;
  alerts?: readonly ClinicalAlert[] | undefined;
  onRegisterAllergy?: (() => void) | undefined;
  onRegisterProblem?: (() => void) | undefined;
  onOpenResults?: (() => void) | undefined;
  onOpenDraft?: ((draftId: string) => void) | undefined;
  onViewFullTimeline?: (() => void) | undefined;
  onOpenEvolution?: (() => void) | undefined;
  mainContent?: ReactNode | undefined;
  contextPane?: ReactNode | undefined;
  contextOpen?: boolean | undefined;
  testId?: string | undefined;
};

/** Ficha electrónica tradicional — nav lateral + central + contexto (ADR-002). */
export function TraditionalEhrMode({
  summaryFields,
  longitudinal,
  alerts,
  onRegisterAllergy,
  onRegisterProblem,
  onOpenResults,
  onOpenDraft,
  onViewFullTimeline,
  onOpenEvolution,
  mainContent,
  contextPane,
  contextOpen = true,
  testId = 'epis2-traditional-ehr-mode',
}: TraditionalEhrModeProps) {
  const t = epis2TraditionalChartTokens;

  const resolvedMain =
    mainContent ??
    (summaryFields ? (
      <PatientClinicalSummaryGrid
        summaryFields={summaryFields}
        longitudinal={longitudinal}
        alerts={alerts}
        onRegisterAllergy={onRegisterAllergy}
        onRegisterProblem={onRegisterProblem}
        onOpenResults={onOpenResults}
        onOpenDraft={onOpenDraft}
        onViewFullTimeline={onViewFullTimeline}
        onOpenEvolution={onOpenEvolution}
      />
    ) : null);

  return (
    <Box
      data-testid={testId}
      sx={{
        ...epis2TraditionalChartShellSx(),
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <Box
        component="nav"
        aria-label="Secciones clínicas"
        data-testid="epis2-traditional-ehr-nav"
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
        <Stack spacing={0.5}>
          {NAV_ITEMS.map((key) => (
            <Typography
              key={key}
              variant="body2"
              sx={{
                px: 1.5,
                py: 1,
                borderRadius: 1,
                cursor: 'default',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              {copy.chartModes[key]}
            </Typography>
          ))}
        </Stack>
      </Box>

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          overflow: 'auto',
          p: t.sectionGap,
        }}
        data-testid="epis2-traditional-ehr-main"
      >
        {resolvedMain}
      </Box>

      {contextPane && contextOpen ? (
        <Box
          data-testid="epis2-traditional-ehr-context"
          sx={{
            width: t.contextPaneWidth,
            flexShrink: 0,
            borderLeft: t.borderSubtle,
            borderColor: t.borderColor,
            bgcolor: 'background.paper',
            overflow: 'auto',
            p: 2,
            display: { xs: 'none', lg: 'block' },
          }}
        >
          <EpisM3Text role="titleMedium" component="h2" sx={{ mb: 1.5 }}>
            {copy.chartModes.contextPaneTitle}
          </EpisM3Text>
          {contextPane}
        </Box>
      ) : null}
    </Box>
  );
}
