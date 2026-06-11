import { copy } from '@epis2/design-system';
import { Box, epis2PaperNavTabSx } from '@epis2/epis2-ui';
import type { PaperPlannerSurface } from './types.js';
import { PAPER_PLANNER_SURFACES } from './types.js';

export type PaperPlannerSurfaceTabsProps = {
  activeSurface: PaperPlannerSurface;
  onSurfaceChange: (surface: PaperPlannerSurface) => void;
  testId?: string | undefined;
};

const SURFACE_LABEL: Record<PaperPlannerSurface, keyof typeof copy.chartModes.paperPlanner> = {
  document: 'surfaceDocument',
  planner: 'surfaceAgenda',
};

/** Pestañas Documento | Agenda — fuera del área imprimible del documento I–XIV. */
export function PaperPlannerSurfaceTabs({
  activeSurface,
  onSurfaceChange,
  testId = 'epis2-paper-surface-tabs',
}: PaperPlannerSurfaceTabsProps) {
  return (
    <Box
      className="epis2-paper-surface-tabs epis2-no-print"
      data-testid={testId}
      sx={{
        display: 'flex',
        gap: 0.5,
        px: 2,
        py: 0.75,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        flexShrink: 0,
      }}
    >
      {PAPER_PLANNER_SURFACES.map((surface) => {
        const active = surface === activeSurface;
        return (
          <Box
            key={surface}
            component="button"
            type="button"
            data-testid={`epis2-paper-surface-${surface}`}
            onClick={() => onSurfaceChange(surface)}
            sx={{
              ...epis2PaperNavTabSx(active),
              cursor: 'pointer',
              border: 'none',
              font: 'inherit',
            }}
          >
            {copy.chartModes.paperPlanner[SURFACE_LABEL[surface]]}
          </Box>
        );
      })}
    </Box>
  );
}
