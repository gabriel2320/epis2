import { copy } from '@epis2/design-system';
import { Box, epis2PaperNavTabSx } from '@epis2/epis2-ui';
import type { TraditionalSectionId } from './TraditionalSectionNav.js';

export type ClassicChartSubNavProps = {
  sections: readonly TraditionalSectionId[];
  activeSection: TraditionalSectionId;
  onSectionChange: (section: TraditionalSectionId) => void;
  testId?: string | undefined;
};

/** Sub-navegación dentro de un tab cuando hay más de una sección visible. */
export function ClassicChartSubNav({
  sections,
  activeSection,
  onSectionChange,
  testId = 'classic-chart-subnav',
}: ClassicChartSubNavProps) {
  if (sections.length <= 1) return null;

  return (
    <Box
      data-testid={testId}
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 0.5,
        px: 2,
        py: 0.75,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.default',
        flexShrink: 0,
      }}
    >
      {sections.map((sectionId) => {
        const active = sectionId === activeSection;
        return (
          <Box
            key={sectionId}
            component="button"
            type="button"
            data-testid={`classic-chart-subnav-${sectionId}`}
            onClick={() => onSectionChange(sectionId)}
            sx={{
              ...epis2PaperNavTabSx(active),
              cursor: 'pointer',
              border: 'none',
              font: 'inherit',
              fontSize: '0.8125rem',
            }}
          >
            {copy.chartModes[sectionId]}
          </Box>
        );
      })}
    </Box>
  );
}
