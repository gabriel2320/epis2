/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SessionExpiredPage } from './SessionExpiredPage.js';

const navigate = vi.fn();

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigate,
}));

describe('SessionExpiredPage', () => {
  it('muestra mensaje de sesión expirada y enlace a login', async () => {
    const user = userEvent.setup();
    render(
      <Epis2ThemeProvider disablePreferences>
        <SessionExpiredPage />
      </Epis2ThemeProvider>,
    );

    expect(screen.getByTestId('epis2-session-expired')).toBeInTheDocument();
    expect(screen.getByText(copy.errors.sessionExpiredTitle)).toBeInTheDocument();
    expect(screen.getByText(copy.errors.sessionExpiredMessage)).toBeInTheDocument();

    await user.click(screen.getByTestId('epis2-session-expired-action'));
    expect(navigate).toHaveBeenCalledWith({ to: '/login' });
  });
});
