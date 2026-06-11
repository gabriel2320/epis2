/**
 * @vitest-environment jsdom
 */
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { WeeklyClinicalPage } from './WeeklyClinicalPage.js';
import { DEMO_WEEK_EVENTS } from './demoWeekData.js';

afterEach(() => cleanup());

describe('WeeklyClinicalPage', () => {
  it('renderiza grid semanal de 7 columnas', () => {
    render(<WeeklyClinicalPage />);

    expect(screen.getByTestId('epis2-paper-planner-week')).toBeTruthy();
    expect(screen.getByTestId('epis2-paper-planner-week-grid')).toBeTruthy();
    expect(screen.getAllByTestId(/^epis2-paper-planner-week-col-/)).toHaveLength(7);
  });

  it('muestra overflow cuando un día supera 4 ítems', () => {
    render(<WeeklyClinicalPage events={DEMO_WEEK_EVENTS} />);

    expect(screen.getByTestId('epis2-paper-planner-week-overflow-2026-06-11')).toBeTruthy();
    expect(screen.getByText(/\+2 más/)).toBeTruthy();
  });
});
