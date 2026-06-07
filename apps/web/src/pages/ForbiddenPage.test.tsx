/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ForbiddenPage } from './ForbiddenPage.js';

const navigate = vi.fn();

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigate,
}));

describe('ForbiddenPage', () => {
  it('muestra mensaje por defecto y vuelve al Centro de Comando', async () => {
    const user = userEvent.setup();
    render(
      <Epis2ThemeProvider disablePreferences>
        <ForbiddenPage />
      </Epis2ThemeProvider>,
    );

    expect(screen.getByTestId('epis2-forbidden')).toBeInTheDocument();
    expect(screen.getByText(copy.errors.forbiddenTitle)).toBeInTheDocument();
    expect(screen.getByText(copy.errors.forbiddenMessage)).toBeInTheDocument();

    await user.click(screen.getByTestId('epis2-forbidden-action'));
    expect(navigate).toHaveBeenCalledWith({ to: '/comando' });
  });

  it('acepta detalle personalizado', () => {
    render(
      <Epis2ThemeProvider disablePreferences>
        <ForbiddenPage detail="Rol enfermería sin receta" />
      </Epis2ThemeProvider>,
    );

    expect(screen.getByText('Rol enfermería sin receta')).toBeInTheDocument();
  });
});
