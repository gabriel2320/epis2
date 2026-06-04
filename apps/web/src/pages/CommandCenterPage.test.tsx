/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { Epis2ThemeProvider } from '../Epis2ThemeProvider.js';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ActivePatientProvider } from '../clinical/ActivePatientContext.js';
import { CommandCenterPage } from './CommandCenterPage.js';

function renderCommandCenter() {
  return render(
    <Epis2ThemeProvider>
      <ActivePatientProvider>
        <CommandCenterPage />
      </ActivePatientProvider>
    </Epis2ThemeProvider>,
  );
}

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock('../api/commandApi.js', () => ({
  resolveCommand: vi.fn(),
}));

vi.mock('../auth/AuthContext.js', () => ({
  useAuth: () => ({
    session: {
      user: {
        id: 'usr-physician-01',
        username: 'medico.demo',
        displayName: 'Dra. Ana Demo',
        role: 'physician',
      },
      permissions: ['command.execute', 'draft.approve'],
      expiresAt: new Date().toISOString(),
    },
    logout: vi.fn(),
    isAuthenticated: true,
    isLoading: false,
    login: vi.fn(),
    refreshSession: vi.fn(),
    hasPermission: (p: string) => p === 'command.execute',
  }),
}));

afterEach(() => cleanup());

describe('CommandCenterPage', () => {
  it('muestra la pregunta principal en español', () => {
    renderCommandCenter();
    expect(screen.getByTestId('epis2-command-prompt')).toHaveTextContent(
      copy.commandCenter.title,
    );
    expect(screen.getByTestId('epis2-power-bar')).toBeInTheDocument();
  });

  it('exige instrucción antes de continuar', async () => {
    const user = userEvent.setup();
    renderCommandCenter();
    const powerBar = screen.getByTestId('epis2-power-bar');
    await user.click(
      within(powerBar).getByRole('button', { name: copy.commandCenter.submit }),
    );
    expect(screen.getByText(copy.commandCenter.emptyCommand)).toBeInTheDocument();
  });
});
