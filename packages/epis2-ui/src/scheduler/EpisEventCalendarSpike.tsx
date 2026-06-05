import Box from '@mui/material/Box';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { esES } from '@mui/x-scheduler/locales';
import type { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models';
import { useMemo, useState } from 'react';

const DEMO_RESOURCES: SchedulerResource[] = [
  { id: 'box-1', title: 'Box 1 — Consultas', eventColor: 'teal' },
  { id: 'box-2', title: 'Box 2 — Procedimientos', eventColor: 'blue' },
  { id: 'box-3', title: 'Sala ecografía', eventColor: 'purple' },
];

function buildDemoEvents(anchorDate: Date): SchedulerEvent[] {
  const y = anchorDate.getFullYear();
  const m = String(anchorDate.getMonth() + 1).padStart(2, '0');
  const d = String(anchorDate.getDate()).padStart(2, '0');
  const day = `${y}-${m}-${d}`;

  return [
    {
      id: 'apt-1',
      title: 'Control HTA',
      start: `${day}T09:00:00`,
      end: `${day}T09:30:00`,
      resource: 'box-1',
      color: 'teal',
    },
    {
      id: 'apt-2',
      title: 'Ecografía abdominal',
      start: `${day}T10:00:00`,
      end: `${day}T10:45:00`,
      resource: 'box-3',
      color: 'purple',
    },
    {
      id: 'apt-3',
      title: 'Curación herida',
      start: `${day}T11:30:00`,
      end: `${day}T12:00:00`,
      resource: 'box-2',
      color: 'blue',
    },
  ];
}

export type EpisEventCalendarSpikeProps = {
  readOnly?: boolean;
  'data-testid'?: string;
};

/** Spike MUI-10 (LIC-007 EVALUATE): Event Calendar Community, solo `/dev/scheduler-spike`. */
export function EpisEventCalendarSpike({
  readOnly,
  'data-testid': testId,
}: EpisEventCalendarSpikeProps) {
  const anchorDate = useMemo(() => new Date(), []);
  const [events, setEvents] = useState(() => buildDemoEvents(anchorDate));

  return (
    <Box data-testid={testId} sx={{ height: 640, width: '100%' }}>
      <EventCalendar
        events={events}
        onEventsChange={setEvents}
        resources={DEMO_RESOURCES}
        defaultView="week"
        views={['day', 'week', 'agenda']}
        defaultVisibleDate={anchorDate}
        localeText={esES.components.MuiEventCalendar.defaultProps.localeText}
        {...(readOnly ? { readOnly: true, areEventsDraggable: false, areEventsResizable: false } : {})}
      />
    </Box>
  );
}
