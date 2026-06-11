import { copy } from '@epis2/design-system';
import { Box, EpisM3Text, Typography, epis2TraditionalChartTokens } from '@epis2/epis2-ui';
import type { ReactNode } from 'react';
import { TRADITIONAL_SECTION_IDS, type TraditionalSectionId } from './TraditionalSectionNav.js';

export type TraditionalClinicalPanelProps = {
  activeSection?: TraditionalSectionId | undefined;
  children?: ReactNode | undefined;
  testId?: string | undefined;
};

/** Área central densa tabular — sección activa de la ficha electrónica. */
export function TraditionalClinicalPanel({
  activeSection = 'navSummary',
  children,
  testId = 'epis2-traditional-clinical-panel',
}: TraditionalClinicalPanelProps) {
  const t = epis2TraditionalChartTokens;
  const sectionLabel = copy.chartModes[activeSection];

  return (
    <Box
      data-testid={testId}
      sx={{
        flex: 1,
        minWidth: 0,
        overflow: 'auto',
        p: t.sectionGap,
        bgcolor: t.surface,
      }}
    >
      <EpisM3Text
        role="titleMedium"
        component="h2"
        sx={{ mb: 1.5, pb: 1, borderBottom: t.borderSubtle, borderColor: t.borderColor }}
      >
        {sectionLabel}
      </EpisM3Text>
      {children ?? (
        <Typography variant="body2" color="text.secondary">
          {copy.chartModes.sectionEmpty}
        </Typography>
      )}
    </Box>
  );
}

export { TRADITIONAL_SECTION_IDS };
