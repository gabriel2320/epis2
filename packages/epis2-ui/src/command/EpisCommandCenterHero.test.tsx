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
  it('renderiza título, chips y tarjetas del registry', () => {
    renderHero();
    expect(screen.getByTestId('epis2-command-prompt')).toHaveTextContent(copy.commandCenter.title);
    expect(screen.getByTestId('epis2-command-quick-chips')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-command-suggestion-cards')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-command-safety-note')).toBeInTheDocument();
    expect(screen.getByTestId('ctx')).toBeInTheDocument();
  });

  it('propaga selección al handler', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderHero(onSelect);
    const cards = screen.getAllByRole('button');
    const suggestionCard = cards.find((el) => el.getAttribute('data-testid')?.startsWith('epis2-suggestion-card-'));
    expect(suggestionCard).toBeTruthy();
    await user.click(suggestionCard!);
    expect(onSelect).toHaveBeenCalled();
  });
});
