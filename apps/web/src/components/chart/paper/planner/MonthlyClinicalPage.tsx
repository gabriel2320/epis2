import { copy } from '@epis2/design-system';
import {
  Box,
  epis2PaperChartTokens,
  epis2PaperDocumentSx,
  epis2PaperFieldLabelSx,
  epis2PaperFieldValueSx,
  epis2PaperSectionTitleSx,
} from '@epis2/epis2-ui';
import type { PaperPlannerMonthEvent } from './monthLayout.js';
import { layoutMonthGrid, yearMonthFromDate } from './monthLayout.js';
import { DEMO_MONTH_EVENTS, DEMO_MONTH_YEAR_MONTH } from './demoMonthData.js';
import { DEMO_PLANNER_DATE } from './demoAgendaData.js';

const KIND_MARKER: Record<string, string> = {
  encounter: 'C',
  evolution: 'E',
  lab: 'L',
  imaging: 'I',
  procedure: 'P',
  admin: 'A',
};

export type MonthlyClinicalPageProps = {
  anchorDate?: string;
  yearMonth?: string;
  events?: readonly PaperPlannerMonthEvent[];
  clinicianName?: string | undefined;
  serviceUnit?: string | undefined;
  testId?: string | undefined;
};

/** Hoja agenda mensual — grid calendario + markers (MF-PAPER-PLANNER-02). */
export function MonthlyClinicalPage({
  anchorDate = DEMO_PLANNER_DATE,
  yearMonth = DEMO_MONTH_YEAR_MONTH,
  events = DEMO_MONTH_EVENTS,
  clinicianName,
  serviceUnit,
  testId = 'epis2-paper-planner-month',
}: MonthlyClinicalPageProps) {
  const t = epis2PaperChartTokens;
  const resolvedMonth = yearMonth || yearMonthFromDate(anchorDate);
  const grid = layoutMonthGrid(resolvedMonth, events);

  return (
    <Box
      className="epis2-paper-page epis2-paper-planner-month"
      data-testid={testId}
      sx={{
        ...epis2PaperDocumentSx('letter'),
        mx: 'auto',
        my: 0,
      }}
    >
      <Box sx={{ px: { xs: 1.5, md: 3 }, py: 2 }}>
        <Box sx={epis2PaperSectionTitleSx()}>{copy.chartModes.paperPlanner.monthTitle}</Box>
        <Box sx={{ ...epis2PaperFieldLabelSx(), mt: 1, textTransform: 'capitalize' }}>
          {grid.monthLabel}
        </Box>
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
        data-testid="epis2-paper-planner-month-grid"
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
          border: `1px solid ${t.ruledLine}`,
          mx: { xs: 0.5, md: 2 },
          mb: 3,
        }}
      >
        {grid.weekdayHeaders.map((label) => (
          <Box
            key={label}
            sx={{
              borderBottom: `1px solid ${t.ruledLine}`,
              borderRight: `1px solid ${t.ruledLine}`,
              px: 0.5,
              py: 0.75,
              textAlign: 'center',
              fontSize: '10px',
              fontWeight: 600,
              textTransform: 'uppercase',
              '&:nth-of-type(7n)': { borderRight: 'none' },
            }}
          >
            {label}
          </Box>
        ))}

        {grid.weeks.flat().map((cell) => (
          <Box
            key={cell.date}
            data-testid={`epis2-paper-planner-month-cell-${cell.date}`}
            data-in-month={cell.inCurrentMonth ? 'true' : 'false'}
            data-events={cell.totalEvents}
            sx={{
              minHeight: 72,
              borderBottom: `1px solid ${t.ruledLine}`,
              borderRight: `1px solid ${t.ruledLine}`,
              p: 0.5,
              opacity: cell.inCurrentMonth ? 1 : 0.45,
              '&:nth-of-type(7n)': { borderRight: 'none' },
            }}
          >
            <Box sx={{ fontSize: '11px', fontWeight: cell.inCurrentMonth ? 600 : 400 }}>
              {cell.day}
            </Box>
            {cell.markers.length > 0 ? (
              <Box
                data-testid={`epis2-paper-planner-month-markers-${cell.date}`}
                sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.25, mt: 0.25 }}
              >
                {cell.markers.slice(0, 3).map((marker) => (
                  <Box
                    key={`${cell.date}-${marker.kind}`}
                    component="span"
                    sx={{
                      fontSize: '9px',
                      lineHeight: 1.2,
                      px: 0.25,
                      border: `1px solid ${t.ruledLine}`,
                    }}
                  >
                    {KIND_MARKER[marker.kind] ?? '?'}
                    {marker.count > 1 ? marker.count : ''}
                  </Box>
                ))}
              </Box>
            ) : null}
            {cell.pendingCount > 0 ? (
              <Box sx={{ fontSize: '8px', color: t.paperMuted, mt: 0.25 }}>
                {cell.pendingCount} {copy.chartModes.paperPlanner.pendingBadge}
              </Box>
            ) : null}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
