/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ActivePatientProvider } from '../clinical/ActivePatientContext.js';
import { DashboardModePage } from './DashboardModePage.js';

const { fetchDashboardWork } = vi.hoisted(() => ({
  fetchDashboardWork: vi.fn(),
}));

vi.mock('@tanstack/react-router', () => ({
  useSearch: () => ({ tab: 'work' }),
  useRouterState: ({ select }: { select: (s: { location: { pathname: string } }) => unknown }) =>
    select({ location: { pathname: '/epis2/dashboard' } }),
}));

vi.mock('../routes/clinicalNavigate.js', () => ({
  useClinicalNavigate: () => vi.fn(),
}));

vi.mock('../api/dashboardApi.js', () => ({
  fetchDashboardWork,
}));

vi.mock('../auth/AuthContext.js', () => ({
  useAuth: () => ({
    session: null,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    refreshSession: vi.fn(),
    hasPermission: () => false,
  }),
}));

afterEach(() => cleanup());

describe('DashboardModePage', () => {
  it('muestra Mi trabajo y volver al Centro de Comando', async () => {
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

    render(
      <Epis2ThemeProvider>
        <ActivePatientProvider>
          <DashboardModePage />
        </ActivePatientProvider>
      </Epis2ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('epis2-dashboard-mode')).toBeInTheDocument();
    });
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
