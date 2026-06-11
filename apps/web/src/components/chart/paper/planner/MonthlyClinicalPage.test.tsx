/**
 * @vitest-environment jsdom
 */
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MonthlyClinicalPage } from './MonthlyClinicalPage.js';

afterEach(() => cleanup());

describe('MonthlyClinicalPage', () => {
  it('renderiza calendario mensual con markers', () => {
    render(<MonthlyClinicalPage />);

    expect(screen.getByTestId('epis2-paper-planner-month')).toBeTruthy();
    expect(screen.getByTestId('epis2-paper-planner-month-grid')).toBeTruthy();
    expect(screen.getByTestId('epis2-paper-planner-month-markers-2026-06-11')).toBeTruthy();
  });

  it('muestra celdas atenuadas fuera del mes', () => {
    render(<MonthlyClinicalPage events={[]} />);
    const outside = screen.getAllByTestId(/^epis2-paper-planner-month-cell-/).filter(
      (el) => el.getAttribute('data-in-month') === 'false',
    );
    expect(outside.length).toBeGreaterThan(0);
  });
});
