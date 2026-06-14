/**
 * @vitest-environment jsdom
 */
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PaperPlannerCommandHints } from './PaperPlannerCommandHints.js';

afterEach(() => cleanup());

describe('PaperPlannerCommandHints MF-PA-07', () => {
  it('renderiza chips y ejecuta frase al click', () => {
    const run = vi.fn();
    render(
      <PaperPlannerCommandHints
        phrases={['imprimir agenda', 'resumir agenda del dia']}
        onRunPhrase={run}
      />,
    );

    expect(screen.getByTestId('epis2-paper-planner-command-hints')).toBeTruthy();
    fireEvent.click(screen.getByTestId('epis2-paper-planner-cmd-imprimir-agenda'));
    expect(run).toHaveBeenCalledWith('imprimir agenda');
  });

  it('oculta hints cuando disabled', () => {
    render(
      <PaperPlannerCommandHints
        phrases={['imprimir agenda']}
        onRunPhrase={vi.fn()}
        enabled={false}
      />,
    );
    expect(screen.queryByTestId('epis2-paper-planner-command-hints')).toBeNull();
  });
});
