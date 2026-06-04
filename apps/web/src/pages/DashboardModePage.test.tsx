/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { Epis2ThemeProvider } from '../Epis2ThemeProvider.js';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ActivePatientProvider } from '../clinical/ActivePatientContext.js';
import { DashboardModePage } from './DashboardModePage.js';

const { fetchDashboardWork } = vi.hoisted(() => ({
  fetchDashboardWork: vi.fn(),
}));

vi.mock('@tanstack/react-router', () => ({
  useSearch: () => ({ tab: 'work' }),
}));

vi.mock('../routes/clinicalNavigate.js', () => ({
  useClinicalNavigate: () => vi.fn(),
}));

vi.mock('../api/dashboardApi.js', () => ({
  fetchDashboardWork,
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
    expect(screen.getByText('Evolución journey')).toBeInTheDocument();
  });
});
