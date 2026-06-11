import { copy } from '@epis2/design-system';
import {
  Box,
  epis2PaperChartTokens,
  epis2PaperDocumentSx,
  epis2PaperFieldLabelSx,
  epis2PaperFieldValueSx,
  epis2PaperSectionTitleSx,
  epis2PaperTableBodyCellSx,
  epis2PaperTableHeaderCellSx,
} from '@epis2/epis2-ui';
import type { PaperPlannerWeekEvent } from './weekLayout.js';
import { layoutWeekGrid, startOfWeek } from './weekLayout.js';
import { DEMO_PLANNER_DATE } from './demoAgendaData.js';
import { DEMO_WEEK_EVENTS } from './demoWeekData.js';

export type WeeklyClinicalPageProps = {
  anchorDate?: string;
  events?: readonly PaperPlannerWeekEvent[];
  clinicianName?: string | undefined;
  serviceUnit?: string | undefined;
  testId?: string | undefined;
};

/** Hoja agenda semanal — grid 7 cols, máx 4 ítems/día (MF-PAPER-PLANNER-01). */
export function WeeklyClinicalPage({
  anchorDate = DEMO_PLANNER_DATE,
  events = DEMO_WEEK_EVENTS,
  clinicianName,
  serviceUnit,
  testId = 'epis2-paper-planner-week',
}: WeeklyClinicalPageProps) {
  const t = epis2PaperChartTokens;
  const weekStart = startOfWeek(anchorDate);
  const columns = layoutWeekGrid(weekStart, events);
  const weekRangeLabel = `${columns[0]?.dayLabel ?? ''} — ${columns[6]?.dayLabel ?? ''}`;

  return (
    <Box
      className="epis2-paper-page epis2-paper-planner-week"
      data-testid={testId}
      sx={{
        ...epis2PaperDocumentSx('letter'),
        mx: 'auto',
        my: 0,
      }}
    >
      <Box sx={{ px: { xs: 1.5, md: 3 }, py: 2 }}>
        <Box sx={epis2PaperSectionTitleSx()}>{copy.chartModes.paperPlanner.weekTitle}</Box>
        <Box sx={{ ...epis2PaperFieldLabelSx(), mt: 1 }}>{weekRangeLabel}</Box>
        {clinicianName ? (
          <Box sx={{ ...epis2PaperFieldValueSx(), mt: 0.5 }}>
            {copy.chartModes.paperPlanner.clinician}: {clinicianName}
          </Box>
        ) : null}
        {serviceUnit ? (
          <Box sx={{ ...epis2PaperFieldValueSx(), mt: 0.25 }}>
            {copy.chartModes.paperPlanner.service}: {serviceUnit}
          </Box>
        ) : null}
      </Box>

      <Box
        data-testid="epis2-paper-planner-week-grid"
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
          border: `1px solid ${t.ruledLine}`,
          mx: { xs: 0.5, md: 2 },
          mb: 3,
        }}
      >
        {columns.map((col) => (
          <Box
            key={col.date}
            data-testid={`epis2-paper-planner-week-col-${col.date}`}
            sx={{
              borderRight: `1px solid ${t.ruledLine}`,
              minHeight: 160,
              '&:last-of-type': { borderRight: 'none' },
            }}
          >
            <Box
              sx={{
                ...epis2PaperTableHeaderCellSx(),
                textAlign: 'center',
                py: 0.75,
                borderBottom: `1px solid ${t.ruledLine}`,
              }}
            >
              <Box component="span" sx={{ display: 'block', textTransform: 'capitalize' }}>
                {col.weekdayLabel}
              </Box>
              <Box component="span" sx={{ fontSize: '0.85em' }}>
                {col.dayLabel}
              </Box>
            </Box>

            <Box sx={{ p: 0.75 }}>
              {col.items.map((item) => (
                <Box
                  key={item.id}
                  data-testid={`epis2-paper-planner-week-item-${item.id}`}
                  sx={{
                    ...epis2PaperTableBodyCellSx(),
                    fontSize: '0.72rem',
                    lineHeight: 1.35,
                    mb: 0.75,
                    borderLeft: `2px solid ${item.pending ? t.sectionAccent : t.navyLight}`,
                    pl: 0.75,
                  }}
                >
                  {item.title}
                  {item.pending ? ` · ${copy.chartModes.paperPlanner.pendingBadge}` : ''}
                </Box>
              ))}
              {col.overflowCount > 0 ? (
                <Box
                  data-testid={`epis2-paper-planner-week-overflow-${col.date}`}
                  sx={{
                    ...epis2PaperFieldLabelSx(),
                    fontSize: '0.7rem',
                    fontStyle: 'italic',
                    color: t.paperInkMid,
                  }}
                >
                  {`+${col.overflowCount} ${copy.chartModes.paperPlanner.overflowSuffix}`}
                </Box>
              ) : null}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
