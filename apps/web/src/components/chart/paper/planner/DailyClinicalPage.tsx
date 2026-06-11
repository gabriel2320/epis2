import { copy } from '@epis2/design-system';
import {
  Box,
  epis2PaperChartTokens,
  epis2PaperDocumentSx,
  epis2PaperFieldLabelSx,
  epis2PaperFieldValueSx,
  epis2PaperSectionTitleSx,
  epis2PaperSubSectionTitleSx,
} from '@epis2/epis2-ui';
import type { PaperPlannerEvent, PaperPlannerPendingItem } from './types.js';
import {
  DEMO_PLANNER_DATE,
  DEMO_PLANNER_EVENTS,
  DEMO_PLANNER_PENDING,
  PLANNER_DAY_HOURS,
} from './demoAgendaData.js';

export type DailyClinicalPageProps = {
  date?: string;
  events?: readonly PaperPlannerEvent[];
  pending?: readonly PaperPlannerPendingItem[];
  clinicianName?: string | undefined;
  serviceUnit?: string | undefined;
  testId?: string | undefined;
};

function eventForHour(hour: string, events: readonly PaperPlannerEvent[]): PaperPlannerEvent[] {
  const h = Number.parseInt(hour.slice(0, 2), 10);
  return events.filter((e) => {
    const eh = Number.parseInt(e.time.slice(0, 2), 10);
    return eh === h;
  });
}

/** Hoja agenda día — timeline + pendientes (MF-PAPER-PLANNER-00). */
export function DailyClinicalPage({
  date = DEMO_PLANNER_DATE,
  events = DEMO_PLANNER_EVENTS,
  pending = DEMO_PLANNER_PENDING,
  clinicianName,
  serviceUnit,
  testId = 'epis2-paper-planner-day',
}: DailyClinicalPageProps) {
  const t = epis2PaperChartTokens;
  const formattedDate = new Date(`${date}T12:00:00`).toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Box
      className="epis2-paper-page epis2-paper-planner-day"
      data-testid={testId}
      sx={{
        ...epis2PaperDocumentSx('letter'),
        mx: 'auto',
        my: 0,
      }}
    >
      <Box sx={{ px: { xs: 2, md: 3.5 }, py: 2 }}>
        <Box sx={epis2PaperSectionTitleSx()}>{copy.chartModes.paperPlanner.dayTitle}</Box>
        <Box sx={{ ...epis2PaperFieldLabelSx(), mt: 1 }}>{formattedDate}</Box>
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
        <Box
          sx={{ ...epis2PaperFieldLabelSx(), mt: 1, fontStyle: 'italic', color: t.paperInkMid }}
          data-testid="epis2-paper-planner-demo-notice"
        >
          {copy.chartModes.paperPlanner.demoDataNotice}
        </Box>
      </Box>

      <Box sx={{ px: { xs: 2, md: 3.5 }, pb: 2 }}>
        <Box sx={{ ...epis2PaperSubSectionTitleSx(), mb: 1 }}>
          {copy.chartModes.paperPlanner.pendingTitle}
        </Box>
        <Box
          component="ul"
          sx={{ m: 0, pl: 2.5, listStyle: 'square', ...epis2PaperFieldValueSx() }}
          data-testid="epis2-paper-planner-pending-list"
        >
          {pending.map((item) => (
            <Box component="li" key={item.id} sx={{ mb: 0.75 }}>
              {item.priority === 'urgent' ? '▸ ' : '· '}
              {item.label}
              {item.dueBy ? ` (${item.dueBy})` : ''}
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ px: { xs: 2, md: 3.5 }, pb: 3 }}>
        <Box sx={{ ...epis2PaperSubSectionTitleSx(), mb: 1 }}>
          {copy.chartModes.paperPlanner.timelineTitle}
        </Box>
        <Box
          data-testid="epis2-paper-planner-timeline"
          sx={{
            border: `1px solid ${t.ruledLine}`,
            borderRadius: 0,
          }}
        >
          {PLANNER_DAY_HOURS.map((hour) => {
            const hourEvents = eventForHour(hour, events);
            return (
              <Box
                key={hour}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '72px 1fr',
                  borderBottom: `1px solid ${t.ruledLine}`,
                  minHeight: 48,
                  '&:last-of-type': { borderBottom: 'none' },
                }}
              >
                <Box
                  sx={{
                    ...epis2PaperFieldLabelSx(),
                    px: 1,
                    py: 1,
                    borderRight: `1px solid ${t.ruledLine}`,
                    bgcolor: t.paperMuted,
                  }}
                >
                  {hour}
                </Box>
                <Box sx={{ px: 1.5, py: 0.75 }}>
                  {hourEvents.length === 0 ? (
                    <Box sx={{ ...epis2PaperFieldValueSx(), color: t.paperInkMid, minHeight: 24 }} />
                  ) : (
                    hourEvents.map((evt) => (
                      <Box
                        key={evt.id}
                        data-testid={`epis2-paper-planner-event-${evt.id}`}
                        sx={{
                          ...epis2PaperFieldValueSx(),
                          mb: 0.5,
                          borderLeft: `3px solid ${evt.pending ? t.sectionAccent : t.navyHeader}`,
                          pl: 1,
                        }}
                      >
                        <Box component="span" sx={{ fontWeight: 600 }}>
                          {evt.time}
                        </Box>{' '}
                        — {evt.title}
                        {evt.location ? ` · ${evt.location}` : ''}
                        {evt.pending ? ` · ${copy.chartModes.paperPlanner.pendingBadge}` : ''}
                      </Box>
                    ))
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
