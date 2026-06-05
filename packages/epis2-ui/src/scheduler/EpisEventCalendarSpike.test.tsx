/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Epis2ThemeProvider } from '../providers/Epis2ThemeProvider.js';
import { EpisEventCalendarSpike } from './EpisEventCalendarSpike.js';

vi.mock('@mui/x-scheduler/event-calendar', () => ({
  EventCalendar: (props: { 'data-testid'?: string; events?: { title: string }[] }) => (
    <div data-testid="mock-event-calendar">
      {(props.events ?? []).map((event) => (
        <span key={event.title}>{event.title}</span>
      ))}
    </div>
  ),
}));

describe('EpisEventCalendarSpike', () => {
  it('renderiza calendario demo con citas sintéticas', () => {
    render(
      <Epis2ThemeProvider>
        <EpisEventCalendarSpike data-testid="epis2-scheduler-spike" />
      </Epis2ThemeProvider>,
    );
    expect(screen.getByTestId('epis2-scheduler-spike')).toBeInTheDocument();
    expect(screen.getByTestId('mock-event-calendar')).toBeInTheDocument();
    expect(screen.getByText('Control HTA')).toBeInTheDocument();
  });
});
