/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LoginPage } from './LoginPage.js';

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock('../auth/AuthContext.js', () => ({
  useAuth: () => ({
    login: vi.fn(),
  }),
}));

describe('LoginPage teclado M3', () => {
  it('renderiza gateway y formulario demo', () => {
    render(
      <Epis2ThemeProvider disablePreferences>
        <LoginPage />
      </Epis2ThemeProvider>,
    );

    expect(screen.getByTestId('epis2-login-gateway')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-login-form')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-login-submit')).toHaveTextContent(copy.login.submit);
  });

  it('permite tabular usuario → clave → acción principal', async () => {
    const user = userEvent.setup();
    render(
      <Epis2ThemeProvider disablePreferences>
        <LoginPage />
      </Epis2ThemeProvider>,
    );

    await user.tab();
    expect(document.activeElement?.getAttribute('role')).toBe('combobox');

    await user.tab();
    expect(document.activeElement).toHaveAttribute('type', 'password');

    await user.tab();
    expect(document.activeElement).toHaveTextContent(copy.login.submit);
  });
});
