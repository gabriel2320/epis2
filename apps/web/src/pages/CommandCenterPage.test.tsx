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
  };
});

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
    await user.click(screen.getByRole('button', { name: copy.activePatient.pickPatient }));
    await user.click(screen.getByRole('button', { name: 'DEMO-005' }));

    expect(await screen.findByTestId('epis2-clinical-alerts')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-clinical-alert-beta-lactam-cross-reactivity')).toBeInTheDocument();
    expect(fetchPatientClinicalAlerts).toHaveBeenCalledWith(
      patientId,
      expect.objectContaining({}),
    );
  });
});
