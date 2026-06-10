/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { cleanup, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithEpisApp } from '../test/renderWithEpisApp.js';
import { DashboardModePage } from './DashboardModePage.js';
// Precarga el módulo lazy: evita que la transformación en caliente agote el testTimeout.
import '../dashboard/DashboardModeContent.js';

const { fetchDashboardWork } = vi.hoisted(() => ({
  fetchDashboardWork: vi.fn(),
}));

vi.mock('@tanstack/react-router', () => ({
  useSearch: () => ({ tab: 'work' }),
  useRouterState: ({
    select,
  }: {
    select: (s: { location: { pathname: string; searchStr?: string } }) => unknown;
  }) => select({ location: { pathname: '/epis2/dashboard', searchStr: '?tab=work' } }),
  Link: ({ children, to, ...rest }: { children?: unknown; to: string }) => (
    <a href={to} {...rest}>
      {children as string}
    </a>
  ),
}));

vi.mock('../routes/clinicalNavigate.js', () => ({
  useClinicalNavigate: () => vi.fn(),
}));

vi.mock('../api/dashboardApi.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api/dashboardApi.js')>();
  return {
    ...actual,
    fetchDashboardWork,
  };
});

vi.mock('../api/clinicalApi.js', () => ({
  fetchPatientClinicalAlerts: vi.fn().mockResolvedValue({ alerts: [], readOnly: true }),
}));

vi.mock('../auth/AuthContext.js', () => ({
  useAuth: () => ({
    session: {
      user: {
        id: 'usr-physician-01',
        displayName: 'Dra. Ana Demo',
        role: 'physician',
      },
      permissions: ['command.execute', 'dashboard.read', 'draft.approve'],
      expiresAt: new Date().toISOString(),
    },
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    refreshSession: vi.fn(),
    hasPermission: () => true,
  }),
}));

afterEach(() => cleanup());

describe('DashboardModePage', () => {
  it('muestra Mi trabajo y volver al Centro de Comando', { timeout: 20000 }, async () => {
    fetchDashboardWork.mockResolvedValue({
      readOnly: true,
      myOpenDrafts: [
        {
          id: 'd1',
          patientId: 'a0000001-0000-4000-8000-000000000001',
          patientDisplayName: 'Paciente Demo',
          draftType: 'evolution_note',
          status: 'draft',
          title: 'Evolución journey',
          updatedAt: new Date().toISOString(),
        },
      ],
      pendingReview: [],
      demoTasks: [{ id: 't1', label: 'Tarea demo', commandSample: 'evoluciona' }],
    });

    renderWithEpisApp(<DashboardModePage />);

    // Lazy import del contenido — timeout extendido (flaky con 1s por defecto).
    await waitFor(
      () => {
        expect(screen.getByTestId('epis2-dashboard-mode')).toBeInTheDocument();
      },
      { timeout: 8000 },
    );
    expect(screen.getByText(copy.dashboard.title)).toBeInTheDocument();
    expect(screen.getByTestId('epis2-back-to-command')).toBeInTheDocument();
    await waitFor(
      () => {
        expect(screen.getByText('Evolución journey')).toBeInTheDocument();
      },
      { timeout: 8000 },
    );
  });
});
