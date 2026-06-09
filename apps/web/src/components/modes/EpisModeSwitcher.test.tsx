/**
 * @vitest-environment jsdom
 */
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { EpisModeSwitcher } from './EpisModeSwitcher.js';

const mockSession = {
  activeMode: 'command' as const,
  canOpenClassic: false,
  canOpenDashboard: true,
  setActiveMode: vi.fn(),
};

vi.mock('../../session/EpisSessionContext.js', () => ({
  useEpisSession: () => mockSession,
}));

describe('EpisModeSwitcher', () => {
  afterEach(() => {
    cleanup();
    mockSession.setActiveMode.mockClear();
  });

  it('renderiza tres modos', () => {
    render(
      <Epis2ThemeProvider disablePreferences>
        <EpisModeSwitcher />
      </Epis2ThemeProvider>,
    );
    expect(screen.getByTestId('epis2-mode-switcher-command')).toBeTruthy();
    expect(screen.getByTestId('epis2-mode-switcher-classic')).toBeTruthy();
    expect(screen.getByTestId('epis2-mode-switcher-dashboard')).toBeTruthy();
  });

  it('deshabilita classic sin paciente', () => {
    render(
      <Epis2ThemeProvider disablePreferences>
        <EpisModeSwitcher />
      </Epis2ThemeProvider>,
    );
    expect(screen.getByTestId('epis2-mode-switcher-classic')).toBeDisabled();
  });

  it('permite cambiar a dashboard', async () => {
    const user = userEvent.setup();
    render(
      <Epis2ThemeProvider disablePreferences>
        <EpisModeSwitcher />
      </Epis2ThemeProvider>,
    );
    await user.click(screen.getByTestId('epis2-mode-switcher-dashboard'));
    expect(mockSession.setActiveMode).toHaveBeenCalledWith('dashboard');
  });
});
