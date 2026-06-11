import { copy } from '@epis2/design-system';
import { Box, epis2PaperNavTabSx } from '@epis2/epis2-ui';
import type { PaperPlannerView } from './types.js';
import { PAPER_PLANNER_VIEWS } from './types.js';
import { DailyClinicalPage } from './DailyClinicalPage.js';
import { WeeklyClinicalPage } from './WeeklyClinicalPage.js';

export type PaperPlannerShellProps = {
  activeView: PaperPlannerView;
  onViewChange: (view: PaperPlannerView) => void;
  clinicianName?: string | undefined;
  serviceUnit?: string | undefined;
  testId?: string | undefined;
};

const VIEW_LABEL: Record<PaperPlannerView, keyof typeof copy.chartModes.paperPlanner> = {
  day: 'viewDay',
  week: 'viewWeek',
  month: 'viewMonth',
};

/** Contenedor agenda papel — tabs día/semana/mes + vista activa. */
export function PaperPlannerShell({
  activeView,
  onViewChange,
  clinicianName,
  serviceUnit,
  testId = 'epis2-paper-planner-shell',
}: PaperPlannerShellProps) {
  return (
    <Box data-testid={testId} sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <Box
        className="epis2-paper-planner-view-tabs epis2-no-print"
        data-testid="epis2-paper-planner-view-tabs"
        sx={{
          display: 'flex',
          gap: 0.5,
          px: 2,
          py: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
          flexShrink: 0,
        }}
      >
        {PAPER_PLANNER_VIEWS.map((view) => {
          const active = view === activeView;
          return (
            <Box
              key={view}
              component="button"
              type="button"
              data-testid={`epis2-paper-planner-view-${view}`}
              onClick={() => onViewChange(view)}
              sx={{
                ...epis2PaperNavTabSx(active),
                cursor: 'pointer',
                border: 'none',
                font: 'inherit',
              }}
            >
              {copy.chartModes.paperPlanner[VIEW_LABEL[view]]}
            </Box>
          );
        })}
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        {activeView === 'day' ? (
          <DailyClinicalPage clinicianName={clinicianName} serviceUnit={serviceUnit} />
        ) : activeView === 'week' ? (
          <WeeklyClinicalPage clinicianName={clinicianName} serviceUnit={serviceUnit} />
        ) : (
          <Box
            className="epis2-paper-page"
            data-testid={`epis2-paper-planner-placeholder-${activeView}`}
            sx={{ p: 4, textAlign: 'center', fontFamily: 'var(--epis2-paper-font-body)' }}
          >
            {copy.chartModes.paperPlanner.monthPlaceholder}
          </Box>
        )}
      </Box>
    </Box>
  );
}
