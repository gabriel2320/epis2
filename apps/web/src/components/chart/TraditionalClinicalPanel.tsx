import { copy } from '@epis2/design-system';
import {
  Box,
  EpisM3Text,
  Typography,
  epis2ChartContentTransitionSx,
  epis2ClassicChartContentSx,
} from '@epis2/epis2-ui';
import type { ReactNode } from 'react';
import { TRADITIONAL_SECTION_IDS, type TraditionalSectionId } from './TraditionalSectionNav.js';

export type TraditionalClinicalPanelProps = {
  activeSection?: TraditionalSectionId | undefined;
  children?: ReactNode | undefined;
  /** Oculta título duplicado cuando tabs clínicas ya indican sección. */
  hideSectionTitle?: boolean | undefined;
  testId?: string | undefined;
};

/** Área central ficha clásica — scroll único, contenido tabular. */
export function TraditionalClinicalPanel({
  activeSection = 'navSummary',
  children,
  hideSectionTitle = false,
  testId = 'epis2-traditional-clinical-panel',
}: TraditionalClinicalPanelProps) {
  const sectionLabel = copy.chartModes[activeSection];

  return (
    <Box
      data-testid={testId}
      data-epis2-chart-scroll="main"
      sx={epis2ClassicChartContentSx()}
    >
      {!hideSectionTitle ? (
        <EpisM3Text
          role="titleMedium"
          component="h2"
          sx={{ mb: 2, color: 'text.primary', fontWeight: 600 }}
        >
          {sectionLabel}
        </EpisM3Text>
      ) : null}
      <Box key={activeSection} sx={epis2ChartContentTransitionSx()}>
        {children ?? (
          <Typography variant="body2" color="text.secondary">
            {copy.chartModes.sectionEmpty}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export { TRADITIONAL_SECTION_IDS };
