/** @vitest-environment jsdom */
import { copy } from '@epis2/design-system';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Epis2ThemeProvider } from '../providers/Epis2ThemeProvider.js';
import { EpisCommandCenterHero } from './EpisCommandCenterHero.js';

function renderHero(onSelect = vi.fn()) {
  return render(
    <Epis2ThemeProvider disablePreferences>
      <EpisCommandCenterHero
        role="physician"
        permissions={['command.execute', 'dashboard.read']}
        onSelect={onSelect}
        contextSlot={<span data-testid="ctx">ctx</span>}
      />
    </Epis2ThemeProvider>,
  );
}

afterEach(() => cleanup());

describe('EpisCommandCenterHero', () => {
  it('renderiza título y chips compactos sin tarjetas', () => {
    renderHero();
    expect(screen.getByTestId('epis2-command-prompt')).toHaveTextContent(copy.commandCenter.title);
    expect(screen.getByTestId('epis2-command-quick-chips')).toBeInTheDocument();
    expect(screen.queryByTestId('epis2-command-suggestion-cards')).not.toBeInTheDocument();
    expect(screen.queryByTestId('epis2-command-safety-note')).not.toBeInTheDocument();
    expect(screen.getByTestId('ctx')).toBeInTheDocument();
  });

  it('propaga selección al handler', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderHero(onSelect);
    await user.click(screen.getAllByRole('button')[0]!);
    expect(onSelect).toHaveBeenCalled();
  });
});
