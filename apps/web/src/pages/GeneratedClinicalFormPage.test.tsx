/**
 * @vitest-environment jsdom
 */
import { getBlueprintById } from '@epis2/clinical-forms';
import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ActivePatientProvider } from '../clinical/ActivePatientContext.js';
import { renderWithQuery } from '../test/renderWithQuery.js';
import { GeneratedClinicalFormPage } from './GeneratedClinicalFormPage.js';

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
  useSearch: () => ({ patientId: '00000000-0000-4000-8000-000000000099' }),
  Link: ({ children }: { children: React.ReactNode }) => <a href="/">{children}</a>,
}));

vi.mock('../api/client.js', () => ({
  apiFetch: vi.fn(),
  ApiError: class ApiError extends Error {
    status = 500;
  },
}));

vi.mock('../api/aiApi.js', () => ({
  fetchAiStatus: vi.fn().mockResolvedValue({
    available: true,
    ollama: 'up',
    localAi: 'up',
    message: '',
  }),
  requestDraftAssist: vi.fn(),
}));

const { fetchPatientLongitudinal } = vi.hoisted(() => ({
  fetchPatientLongitudinal: vi.fn(),
}));

vi.mock('../api/clinicalApi.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api/clinicalApi.js')>();
  return {
    ...actual,
    listPatients: vi.fn().mockResolvedValue({ patients: [] }),
    fetchPatientDetail: vi.fn().mockResolvedValue({
      patient: {
        id: '00000000-0000-4000-8000-000000000099',
        displayName: 'Paciente Demo — Test',
        isSynthetic: true,
        demoLabel: 'DEMO/SINTÉTICO',
        demoCaseCode: 'DEMO-099',
      },
      clinicalContext: { summaryFields: {}, problems: [], observations: [] },
      notes: [],
    }),
    fetchPatientClinicalAlerts: vi.fn().mockResolvedValue({
      patientId: '00000000-0000-4000-8000-000000000099',
      readOnly: true,
      evaluatedAt: new Date().toISOString(),
      alerts: [],
    }),
    fetchPatientLongitudinal,
  };
});

vi.mock('@mui/material/useMediaQuery', () => ({
  default: () => true,
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
      permissions: ['draft.write', 'command.execute'],
      expiresAt: new Date().toISOString(),
    },
  }),
}));

afterEach(() => cleanup());

beforeEach(() => {
  fetchPatientLongitudinal.mockResolvedValue({
    patientId: '00000000-0000-4000-8000-000000000099',
    readOnly: true,
    problems: [],
    allergies: [],
    medications: [],
    observations: [],
    documents: [],
    encounters: [],
    timeline: [
      {
        id: 'tl-1',
        kind: 'note',
        at: '2026-05-01T12:00:00.000Z',
        title: 'Nota previa demo',
        detail: 'Continuar antibiótico',
      },
    ],
  });
});

const evolutionBlueprint = getBlueprintById('evolution_note');
if (!evolutionBlueprint) {
  throw new Error('evolution_note blueprint missing');
}

function renderForm(blueprint = evolutionBlueprint) {
  return renderWithQuery(
    <ActivePatientProvider>
      <GeneratedClinicalFormPage blueprint={blueprint} />
    </ActivePatientProvider>,
  );
}

describe('GeneratedClinicalFormPage (sin IA)', () => {
  it('renderiza evolución y valida borrador local sin fetch de IA', async () => {
    const user = userEvent.setup();
    renderForm();

    expect(screen.getByTestId('epis2-form-evolution_note')).toBeInTheDocument();
    await user.click(screen.getByTestId('epis2-form-more-actions'));
    expect(screen.getByTestId('epis2-ai-suggest')).toBeInTheDocument();
    await user.keyboard('{Escape}');

    await user.click(screen.getByTestId('epis2-form-save'));

    expect(screen.getByTestId('epis2-form-status')).toHaveTextContent(/obligatorios|válido/i);
  });

  it('acepta evolución completa y muestra mensaje de éxito local o remoto', async () => {
    const user = userEvent.setup();
    const { apiFetch } = await import('../api/client.js');
    vi.mocked(apiFetch).mockRejectedValueOnce(new Error('offline'));

    renderForm();

    await user.click(screen.getByTestId('epis2-scrollspy-soap'));
    await user.type(screen.getByRole('textbox', { name: /objetivo/i }), 'Signos estables (demo)');
    await user.type(screen.getByRole('textbox', { name: /análisis/i }), 'Evolución favorable');
    await user.type(screen.getByRole('textbox', { name: /^plan/i }), 'Continuar tratamiento');

    await user.click(screen.getByTestId('epis2-form-save'));

    expect(screen.getByTestId('epis2-form-status')).toBeInTheDocument();
  });

  it('abre panel de historial en layout two-pane', async () => {
    const user = userEvent.setup();
    renderForm();

    expect(screen.getByTestId('epis2-clinical-two-pane')).toBeInTheDocument();
    expect(screen.queryByTestId('epis2-clinical-context-pane')).not.toBeInTheDocument();

    await user.click(screen.getByTestId('epis2-clinical-context-toggle'));

    await waitFor(() => {
      expect(screen.getByTestId('epis2-context-timeline-list')).toBeInTheDocument();
    });
    expect(screen.getByText('Nota previa demo')).toBeInTheDocument();
  });

  it('muestra chips SOAP cuando IA está disponible y faltan campos', async () => {
    renderForm();

    await waitFor(() => {
      expect(screen.getByTestId('epis2-soap-gap-hints')).toBeInTheDocument();
    });
    expect(screen.getByTestId('epis2-soap-hint-subjective')).toBeInTheDocument();
  });
});
