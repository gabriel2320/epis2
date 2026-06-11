/**
 * @vitest-environment jsdom
 */
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { DailyClinicalPage } from './DailyClinicalPage.js';
import { DEMO_PLANNER_EVENTS, DEMO_PLANNER_PENDING } from './demoAgendaData.js';

afterEach(() => cleanup());

describe('DailyClinicalPage', () => {
  it('renderiza timeline y pendientes demo', () => {
    render(<DailyClinicalPage />);

    expect(screen.getByTestId('epis2-paper-planner-day')).toBeTruthy();
    expect(screen.getByTestId('epis2-paper-planner-timeline')).toBeTruthy();
    expect(screen.getByTestId('epis2-paper-planner-pending-list')).toBeTruthy();
    expect(screen.getByTestId('epis2-paper-planner-demo-notice')).toBeTruthy();
  });

  it('lista eventos demo en timeline', () => {
    render(<DailyClinicalPage events={DEMO_PLANNER_EVENTS} pending={DEMO_PLANNER_PENDING} />);

    for (const evt of DEMO_PLANNER_EVENTS) {
      expect(screen.getByTestId(`epis2-paper-planner-event-${evt.id}`)).toBeTruthy();
    }
    expect(screen.getByText(/Confirmar alergias/)).toBeTruthy();
  });
});
