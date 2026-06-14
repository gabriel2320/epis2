/**
 * @vitest-environment jsdom
 */
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ClinicalSilentSuggestionsPanel } from './ClinicalSilentSuggestionsPanel.js';

afterEach(() => cleanup());

describe('ClinicalSilentSuggestionsPanel (MF-DI-06)', () => {
  it('no renderiza sin sugerencias', () => {
    render(
      <Epis2ThemeProvider>
        <ClinicalSilentSuggestionsPanel suggestions={[]} />
      </Epis2ThemeProvider>,
    );
    expect(screen.queryByTestId('epis2-clinical-silent-suggestions')).not.toBeInTheDocument();
  });

  it('muestra máximo 3 y expande el resto', async () => {
    const user = userEvent.setup();
    const onSelectCommand = vi.fn();
    const suggestions = [
      { id: 'a', variant: 'info' as const, labelEs: 'Uno', priority: 1 },
      { id: 'b', variant: 'info' as const, labelEs: 'Dos', priority: 2 },
      { id: 'c', variant: 'info' as const, labelEs: 'Tres', priority: 3 },
      {
        id: 'd',
        variant: 'suggestion' as const,
        labelEs: 'Cuatro',
        commandSample: 'lab',
        priority: 4,
      },
    ];

    render(
      <Epis2ThemeProvider>
        <ClinicalSilentSuggestionsPanel
          suggestions={suggestions}
          onSelectCommand={onSelectCommand}
        />
      </Epis2ThemeProvider>,
    );

    expect(screen.getByTestId('epis2-clinical-silent-suggestions-chip-a')).toBeInTheDocument();
    expect(
      screen.queryByTestId('epis2-clinical-silent-suggestions-chip-d'),
    ).not.toBeInTheDocument();

    await user.click(screen.getByTestId('epis2-clinical-silent-suggestions-toggle'));
    expect(screen.getByTestId('epis2-clinical-silent-suggestions-chip-d')).toBeInTheDocument();

    await user.click(screen.getByText('Cuatro'));
    expect(onSelectCommand).toHaveBeenCalledWith('lab');
  });
});
