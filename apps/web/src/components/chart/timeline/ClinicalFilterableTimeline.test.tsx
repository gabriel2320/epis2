/**
 * @vitest-environment jsdom
 */
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { ClinicalFilterableTimeline } from './ClinicalFilterableTimeline.js';

describe('ClinicalFilterableTimeline (MF-DI-08)', () => {
  afterEach(() => cleanup());

  const timeline = [
    {
      id: 'obs-1',
      kind: 'observation' as const,
      at: new Date().toISOString(),
      title: 'HbA1c',
      detail: '7.1 %',
    },
    {
      id: 'note-1',
      kind: 'note' as const,
      at: new Date(Date.now() - 3_600_000).toISOString(),
      title: 'Evolución',
      detail: 'evolution_note',
    },
  ];

  it('renderiza filtros y agrupación temporal', () => {
    render(<ClinicalFilterableTimeline timeline={timeline} />);
    expect(screen.getByTestId('epis2-clinical-filterable-timeline')).toBeInTheDocument();
    expect(
      screen.getByTestId('epis2-clinical-filterable-timeline-filter-labs'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('epis2-clinical-filterable-timeline-period-today'),
    ).toBeInTheDocument();
  });

  it('filtra laboratorio', async () => {
    const user = userEvent.setup();
    render(<ClinicalFilterableTimeline timeline={timeline} />);
    await user.click(screen.getByTestId('epis2-clinical-filterable-timeline-filter-labs'));
    expect(
      screen.getByTestId('epis2-clinical-filterable-timeline-event-obs-1'),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('epis2-clinical-filterable-timeline-event-note-1')).toBeNull();
  });
});
