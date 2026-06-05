/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { SchedulerSpikePage } from './SchedulerSpikePage.js';

vi.mock('@epis2/epis2-ui/scheduler', () => ({
  EpisEventCalendarSpike: () => <div data-testid="epis2-scheduler-spike-calendar-mock">Calendario mock</div>,
}));

describe('SchedulerSpikePage', () => {
  it('muestra banner de evaluación y enlace al comando', async () => {
    render(
      <Epis2ThemeProvider>
        <SchedulerSpikePage />
      </Epis2ThemeProvider>,
    );
    expect(screen.getByTestId('epis2-scheduler-spike-page')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-scheduler-spike-eval-banner')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /volver al centro de comando/i })).toHaveAttribute(
      'href',
      '/comando',
    );
  });
});
