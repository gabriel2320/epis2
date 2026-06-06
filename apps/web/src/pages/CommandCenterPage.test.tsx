/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ActivePatientProvider } from '../clinical/ActivePatientContext.js';
import { CommandCenterPage } from './CommandCenterPage.js';

function renderCommandCenter() {
  return render(
    <Epis2ThemeProvider disablePreferences>
      <ActivePatientProvider>
        <CommandCenterPage />
      </ActivePatientProvider>
    </Epis2ThemeProvider>,
  );
}

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
  useRouterState: ({ select }: { select: (s: { location: { pathname: string } }) => unknown }) =>
    select({ location: { pathname: '/comando' } }),
}));

vi.mock('../api/commandApi.js', () => ({
  resolveCommand: vi.fn(),
}));

const { fetchPatientClinicalAlerts } = vi.hoisted(() => ({
  fetchPatientClinicalAlerts: vi.fn(),
}));

vi.mock('../api/clinicalApi.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api/clinicalApi.js')>();
  return {
    ...actual,
    listPatients: vi.fn().mockResolvedValue({
      patients: [
        {
          id: 'a0000001-0000-4000-8000-000000000005',
          displayName: 'Paciente Demo — Penicilina',
          demoCaseCode: 'DEMO-005',
        },
      ],
    }),
    fetchPatientClinicalAlerts,
    listDrafts: vi.fn().mockResolvedValue({ drafts: [] }),
  };
});

vi.mock('../api/aiApi.js', () => ({
  fetchAiStatus: vi.fn().mockResolvedValue({ available: false, ollama: 'down', localAi: 'down', message: '' }),
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
      permissions: ['command.execute', 'draft.approve', 'ai.read', 'dashboard.read'],
      expiresAt: new Date().toISOString(),
    },
    logout: vi.fn(),
    isAuthenticated: true,
    isLoading: false,
    login: vi.fn(),
    refreshSession: vi.fn(),
    hasPermission: (p: string) =>
      ['command.execute', 'draft.approve', 'ai.read', 'dashboard.read'].includes(p),
  }),
}));

afterEach(() => {
  cleanup();
  fetchPatientClinicalAlerts.mockReset();
});

describe('CommandCenterPage', () => {
  it('muestra la pregunta principal en español', () => {
    renderCommandCenter();
    expect(screen.getByTestId('epis2-command-prompt')).toHaveTextContent(
      copy.commandCenter.title,
    );
    expect(screen.getByTestId('epis2-power-bar')).toBeInTheDocument();
    expect(screen.queryByTestId('epis2-active-patient-panel')).not.toBeInTheDocument();
  });

  it('prueba 3s: Power Bar visible antes que contexto paciente', () => {
    renderCommandCenter();
    const prompt = screen.getByTestId('epis2-command-prompt');
    const powerBar = screen.getByTestId('epis2-power-bar');
    const toggle = screen.getByTestId('epis2-toggle-patient-panel');
    expect(prompt.compareDocumentPosition(powerBar) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(powerBar.compareDocumentPosition(toggle) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
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

  it('muestra chips de sugerencias según rol médico', () => {
    renderCommandCenter();
    expect(screen.getByTestId('epis2-command-chips')).toBeInTheDocument();
    expect(screen.getByText(copy.commandCenter.suggestionsRoleTitle)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /evoluciona al paciente/i })).toBeInTheDocument();
  });

  it('integra estado IA en la barra de comando', async () => {
    renderCommandCenter();
    expect(await screen.findByTestId('epis2-command-ai-status')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-command-role-chip')).toBeInTheDocument();
  });

  it('muestra alertas CDS/CDR cuando hay paciente activo', async () => {
    const patientId = 'a0000001-0000-4000-8000-000000000005';
    fetchPatientClinicalAlerts.mockResolvedValue({
      patientId,
      readOnly: true,
      evaluatedAt: new Date().toISOString(),
      alerts: [
        {
          ruleId: 'beta-lactam-cross-reactivity',
          severity: 'critical',
          message: 'Cruce beta-lactámicos',
          detail: 'Detalle demo',
          source: 'cds',
        },
      ],
    });

    const user = userEvent.setup();
    renderCommandCenter();
    await user.click(screen.getByRole('button', { name: copy.commandCenter.showPatientContext }));
    await user.click(screen.getByRole('button', { name: copy.forms.searchPatients }));
    await user.click(screen.getByRole('button', { name: 'DEMO-005' }));

    expect(await screen.findByTestId('epis2-clinical-alerts')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-clinical-alert-beta-lactam-cross-reactivity')).toBeInTheDocument();
    expect(fetchPatientClinicalAlerts).toHaveBeenCalledWith(
      patientId,
      expect.objectContaining({}),
    );
    expect(await screen.findByTestId('epis2-command-widget-panel')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-widget-patient-context')).toBeInTheDocument();
  });
});
