/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ActivePatientProvider } from '../clinical/ActivePatientContext.js';
import { renderWithQuery } from '../test/renderWithQuery.js';
import { ClinicalGlobalTopBar } from './ClinicalGlobalTopBar.js';

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, ...rest }: { children?: unknown; to: string }) => (
    <a href={to} {...rest}>
      {children as string}
    </a>
  ),
  useRouterState: ({ select }: { select: (s: { location: { pathname: string } }) => unknown }) =>
    select({ location: { pathname: '/espacio/ficha' } }),
}));

vi.mock('../auth/AuthContext.js', () => ({
  useAuth: () => ({
    session: {
      user: {
        id: 'usr-physician-01',
        displayName: 'Dra. Ana Demo',
        role: 'physician',
      },
      permissions: ['command.execute'],
      expiresAt: new Date().toISOString(),
    },
    logout: vi.fn(),
  }),
}));

vi.mock('../routes/clinicalNavigate.js', () => ({
  useClinicalNavigate: () => vi.fn(),
}));

vi.mock('../api/clinicalApi.js', () => ({
  fetchPatientClinicalAlerts: vi.fn().mockResolvedValue({ alerts: [], readOnly: true }),
}));

afterEach(() => cleanup());

describe('ClinicalGlobalTopBar', () => {
  it('expone solo Buscar · Comando · Paciente · Alertas · Usuario', () => {
    renderWithQuery(
      <ActivePatientProvider>
        <ClinicalGlobalTopBar active="clinical" />
      </ActivePatientProvider>,
    );

    expect(screen.getByTestId('epis2-global-top-bar')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-nav-buscar')).toHaveTextContent(copy.layout.navSearch);
    expect(screen.getByTestId('epis2-nav-comando')).toHaveTextContent(copy.layout.commandShort);
    expect(screen.getByTestId('epis2-nav-paciente')).toHaveTextContent(copy.layout.navPatient);
    expect(screen.getByTestId('epis2-nav-alertas')).toHaveTextContent(copy.layout.navAlerts);
    expect(screen.getByTestId('epis2-nav-usuario')).toHaveTextContent(copy.layout.navUser);

    expect(screen.queryByTestId('epis2-nav-tablero')).not.toBeInTheDocument();
    expect(screen.queryByTestId('epis2-dashboard-theme-toggle')).not.toBeInTheDocument();
    expect(screen.queryByTestId('epis2-demo-badge-global')).not.toBeInTheDocument();
  });
});
