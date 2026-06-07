/**
 * @vitest-environment jsdom
 * MF-OLA2-001 — Gate M3-UI consulta ambulatoria (IDC 31–40).
 */
import { getBlueprintById } from '@epis2/clinical-forms';
import { copy } from '@epis2/design-system';
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
    available: false,
    ollama: 'down',
    localAi: 'down',
    message: '',
  }),
  requestDraftAssist: vi.fn(),
}));

vi.mock('../api/clinicalApi.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api/clinicalApi.js')>();
  return {
    ...actual,
    listPatients: vi.fn().mockResolvedValue({ patients: [] }),
    fetchPatientDetail: vi.fn().mockResolvedValue({
      patient: {
        id: '00000000-0000-4000-8000-000000000099',
        displayName: 'Paciente Demo — Ambulatorio',
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
    fetchPatientLongitudinal: vi.fn().mockResolvedValue({
      patientId: '00000000-0000-4000-8000-000000000099',
      readOnly: false,
      problems: [],
      allergies: [],
      medications: [],
      observations: [],
      documents: [],
      encounters: [],
      timeline: [],
    }),
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

const outpatientBlueprint = getBlueprintById('outpatient_visit');
const certificateBlueprint = getBlueprintById('medical_certificate');

if (!outpatientBlueprint || !certificateBlueprint) {
  throw new Error('Ola 2 blueprints missing');
}

function renderForm(blueprint: NonNullable<typeof outpatientBlueprint>) {
  return renderWithQuery(
    <ActivePatientProvider>
      <GeneratedClinicalFormPage blueprint={blueprint} />
    </ActivePatientProvider>,
  );
}

describe('GeneratedClinicalFormPage — Ola 2 M3-UI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('consulta ambulatoria usa scrollspy, app bar y FAB de cierre', async () => {
    renderForm(outpatientBlueprint);

    expect(screen.getByTestId('epis2-generated-clinical-page')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-form-outpatient_visit')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-clinical-scrollspy-layout')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-scrollspy-anamnesis')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-scrollspy-physical-general')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-scrollspy-physical-segment')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-scrollspy-diagnosis')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-scrollspy-closure')).toBeInTheDocument();
    expect(screen.getByText(/Diagnóstico CIE-10/i)).toBeInTheDocument();
    expect(screen.getByTestId('epis2-draft-status-chip')).toBeInTheDocument();
    expect(screen.queryByTestId('epis2-clinical-context-toggle')).not.toBeInTheDocument();
    expect(screen.getByTestId('epis2-clinical-form-action-bar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: copy.forms.save })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: copy.forms.sign })).toBeInTheDocument();
  });

  it('valida campos obligatorios de consulta ambulatoria', async () => {
    const user = userEvent.setup();
    renderForm(outpatientBlueprint);

    await user.click(screen.getByRole('button', { name: copy.forms.save }));
    await waitFor(() => {
      expect(screen.getByTestId('epis2-form-status')).toBeInTheDocument();
    });
  });

  it('certificado médico renderiza formulario y guardar borrador', async () => {
    renderForm(certificateBlueprint);

    expect(screen.getByTestId('epis2-form-medical_certificate')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-print-preview-medical_certificate')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: copy.forms.save })).toBeInTheDocument();
  });
});
